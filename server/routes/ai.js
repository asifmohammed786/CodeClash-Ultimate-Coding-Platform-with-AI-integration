import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Existing ask endpoint
router.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Code Review endpoint
router.post("/review", async (req, res) => {
  const { code, language, problem } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const reviewPrompt = `
You are a senior ${language} developer and code reviewer.
Review the following code for the problem "${problem?.title}".

- Check for correctness, efficiency, and code style.
- Suggest improvements, best practices, and point out any bugs.
- If possible, mention time/space complexity.

Here is the code:
\`\`\`${language}
${code}
\`\`\`
`;
    const result = await model.generateContent(reviewPrompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Bug Finder endpoint
router.post("/bug-finder", async (req, res) => {
  const { code, language, testCaseInput, testCaseOutput, errorOutput, problemTitle } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are an expert ${language} debugging assistant.
A user wrote code for the problem "${problemTitle}".

Here is the code:
\`\`\`${language}
${code}
\`\`\`

Here is a failing test case:
Input:
${testCaseInput}

Expected Output:
${testCaseOutput}

User's Output or Error:
${errorOutput}

Analyze the code and test case.
- Explain in simple terms why the code is failing.
- Point out the likely bug.
- Suggest how to fix it, and if possible, show the corrected code.
- Be concise and clear.
`;

    const result = await model.generateContent(prompt);
    res.json({ explanation: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Hint endpoint (NEW)
router.post("/hint", async (req, res) => {
  const { problem } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are an expert coding mentor.
Give a helpful, non-spoiler hint for the following problem (do not give away the solution):

Title: ${problem.title}
Description: ${problem.description}

- The hint should guide the user towards the right approach or algorithm.
- Do NOT reveal the answer or code.
- Be concise and encouraging.
`;
    const result = await model.generateContent(prompt);
    res.json({ hint: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
