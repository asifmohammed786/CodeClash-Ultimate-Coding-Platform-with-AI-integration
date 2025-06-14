import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';
import userModel from "../models/user.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const EXECUTION_CONFIG = {
  TIME_LIMIT: 2000, // 2 seconds
  OUTPUT_LIMIT: 100 * 1024 // 100KB
};

const languageConfig = {
  cpp: {
    ext: 'cpp',
    compile: (codeFile, exeFile) => `g++ -std=c++20 ${codeFile} -o ${exeFile}`,
    execute: exeFile => exeFile,
    needsCompile: true
  },
  java: {
    ext: 'java',
    compile: (codeFile) => `javac --release 20 ${codeFile}`,
    execute: (dir) => `java -cp ${dir} Main`,
    needsCompile: true
  },
  python: {
    ext: 'py',
    execute: (codeFile) => `python3 ${codeFile}`,
    needsCompile: false
  }
};

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

    // Compilation for compiled languages
    if (config.needsCompile) {
      const compileResult = await runProcess(
        config.compile(codeFile, exeFile),
        { cwd: tempDir },
        'Compilation error'
      );
      if (compileResult.error) {
        cleanupFiles();
        return compileResult;
      }
    }

    // Execution with resource limits
    const executeCmd = config.needsCompile
      ? config.execute(exeFile)
      : config.execute(codeFile);

    const execResult = await runProcess(
      executeCmd,
      {
        cwd: tempDir,
        input: fs.readFileSync(inputFile),
        timeout: EXECUTION_CONFIG.TIME_LIMIT
      },
      'Runtime error'
    );

    cleanupFiles();
    return {
      output: execResult.output.slice(0, EXECUTION_CONFIG.OUTPUT_LIMIT),
      error: execResult.error
    };
  } catch (err) {
    cleanupFiles();
    return {
      output: '',
      error: err.message || 'Internal error'
    };
  }

  async function runProcess(command, options, errorType) {
    return new Promise(resolve => {
      // Use detached:true and negative PID for robust process killing
      const proc = spawn(command, [], {
        ...options,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: true
      });

      let output = '';
      let error = '';
      let timedOut = false;
      let outputExceeded = false;

      const timeout = setTimeout(() => {
        try {
          process.kill(-proc.pid, 'SIGKILL'); // kill process group
        } catch (e) {
          proc.kill('SIGKILL');
        }
        timedOut = true;
      }, EXECUTION_CONFIG.TIME_LIMIT);

      proc.stdout.on('data', data => {
        output += data.toString();
        if (output.length > EXECUTION_CONFIG.OUTPUT_LIMIT) {
          try {
            process.kill(-proc.pid, 'SIGKILL');
          } catch (e) {
            proc.kill('SIGKILL');
          }
          outputExceeded = true;
        }
      });

      proc.stderr.on('data', data => error += data.toString());

      proc.on('close', code => {
        clearTimeout(timeout);

        let finalError = '';
        if (timedOut) {
          finalError = 'Time Limit Exceeded';
        } else if (outputExceeded) {
          finalError = 'Output Limit Exceeded';
        } else if (code !== 0 && errorType) {
          finalError = error || errorType;
        }

        resolve({
          output: output.trim(),
          error: finalError
        });
      });

      if (options.input) {
        proc.stdin.write(options.input);
        proc.stdin.end();
      }
    });
  }

  function cleanupFiles() {
    [codeFile, inputFile].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
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
    res.status(200).json({
      success: !error,
      output: error ? '' : output,
      error: error || ''
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
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
    let failingTestCase = null;
    const hiddenTestCases = problem.testCases.filter(tc => !tc.isSample);

    for (const testCase of hiddenTestCases) {
      const { output, error } = await executeCodeHandler({
        code,
        input: testCase.input,
        language
      });

      if (error) {
        verdict = error.includes('Compilation') ? 'Compilation Error'
               : error.includes('Time Limit') ? 'Time Limit Exceeded'
               : error.includes('Output Limit') ? 'Output Limit Exceeded'
               : 'Runtime Error';
        errorMsg = error;
        failingTestCase = testCase;
        break;
      }

      if (output.trim() !== testCase.output.trim()) {
        verdict = 'Wrong Answer';
        errorMsg = `Input:\n${testCase.input}\nExpected:\n${testCase.output}\nReceived:\n${output}`;
        failingTestCase = testCase;
        break;
      }
    }

    // Save submission
    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict,
      error: errorMsg
    });

    // Update user stats if accepted
    if (verdict === 'Accepted') {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const difficulty = problem.difficulty.toLowerCase();

      await userModel.findByIdAndUpdate(userId, {
        $inc: {
          [`problemsSolved.${difficulty}`]: 1,
          [`submissionCalendar.${today}`]: 1
        },
        $addToSet: { languagesUsed: language },
        $push: { submissions: submission._id }
      });
    }

    res.json({ verdict, error: errorMsg, failingTestCase });

  } catch (err) {
    res.status(500).json({
      verdict: 'Server Error',
      error: err.message
    });
  }
};

// Get submission history
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
