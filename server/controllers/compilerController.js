import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Language configuration
const languageConfig = {
  cpp: {
    ext: 'cpp',
    compile: (codeFile, exeFile) => `g++ ${codeFile} -o ${exeFile}`,
    execute: (exeFile, inputFile) => `${exeFile} < ${inputFile}`,
    needsCompile: true
  },
  java: {
    ext: 'java',
    compile: (codeFile) => `javac ${codeFile}`,
    execute: (dir, inputFile) => `java -cp ${dir} Main < ${inputFile}`,
    needsCompile: true
  },
  python: {
    ext: 'py',
    compile: () => '', // No compile step for Python
    execute: (codeFile, inputFile) => `python3 ${codeFile} < ${inputFile}`,
    needsCompile: false
  }
};

// Common execution handler
async function executeCodeHandler({ code, input, language = 'cpp' }) {
  const config = languageConfig[language];
  if (!config) return { output: '', error: 'Unsupported language' };

  const jobID = Date.now() + Math.floor(Math.random() * 1000);
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // File paths
  const codeFile = path.join(tempDir, language === 'java' ? 'Main.java' : `${jobID}.${config.ext}`);
  const inputFile = path.join(tempDir, `${jobID}_input.txt`);
  const exeFile = path.join(tempDir, `${jobID}.out`);

  try {
    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input || '');

    // Compile if needed
    if (config.needsCompile) {
      try {
        if (language === 'cpp') {
          execSync(config.compile(codeFile, exeFile), { timeout: 5000 });
        } else if (language === 'java') {
          execSync(config.compile(codeFile), { cwd: tempDir, timeout: 5000 });
        }
      } catch (err) {
        cleanupFiles();
        return {
          output: '',
          error: err.stderr?.toString() || err.message || 'Compilation error'
        };
      }
    }

    // Run the code
    let runCmd;
    if (language === 'cpp') {
      runCmd = config.execute(exeFile, inputFile);
    } else if (language === 'java') {
      runCmd = config.execute(tempDir, inputFile);
    } else if (language === 'python') {
      runCmd = config.execute(codeFile, inputFile);
    }

    const output = execSync(runCmd, { cwd: tempDir, timeout: 5000 }).toString().trim();
    cleanupFiles();
    return { output, error: '' };
  } catch (error) {
    cleanupFiles();
    return {
      output: '',
      error: error.stderr?.toString() || error.message || 'Runtime error'
    };
  }

  // Cleanup helper
  function cleanupFiles() {
    [codeFile, inputFile].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    if (language === 'cpp' && fs.existsSync(exeFile)) {
      fs.unlinkSync(exeFile);
    }
    if (language === 'java') {
      const classFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.class'));
      classFiles.forEach(f => fs.unlinkSync(path.join(tempDir, f)));
    }
  }
}

// Run code with custom input
export const executeCode = async (req, res) => {
  try {
    const { code, input, language = 'cpp' } = req.body;
    const { output, error } = await executeCodeHandler({ code, input, language });
    if (error) return res.status(500).json({ error });
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit code for all test cases
export const submitCode = async (req, res) => {
  const { code, problemId, language = 'cpp' } = req.body;
  const userId = req.userId;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ verdict: 'Problem not found' });

    let verdict = 'Accepted';
    let errorMsg = '';
    const hiddenTestCases = problem.testCases.filter(tc => !tc.isSample);

    for (const testCase of hiddenTestCases) {
      const { output, error } = await executeCodeHandler({
        code,
        input: testCase.input,
        language
      });

      if (error) {
        verdict = error.includes('Compilation') ? 'Compilation Error' : 'Runtime Error';
        errorMsg = error;
        break;
      }

      if (output.trim() !== testCase.output.trim()) {
        verdict = 'Wrong Answer';
        errorMsg = `Input:\n${testCase.input}\nExpected:\n${testCase.output}\nReceived:\n${output}`;
        break;
      }
    }

    // Save submission
    await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict,
      error: errorMsg
    });

    res.json({ verdict, error: errorMsg });

  } catch (err) {
    res.status(500).json({
      verdict: 'Server Error',
      error: err.message
    });
  }
};

// Get submission history (unchanged)
export const getSubmissions = async (req, res) => {
  const userId = req.userId;
  const { problemId } = req.query;

  try {
    const query = { user: userId };
    if (problemId) query.problem = problemId;

    const submissions = await Submission.find(query)
      .sort({ timestamp: -1 })
      .populate('problem', 'title')
      .select('-__v');

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
