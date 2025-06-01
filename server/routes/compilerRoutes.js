import { executeCode, submitCode, getSubmissions } from '../controllers/compilerController.js';
import userAuth from '../middleware/userAuth.js';
import express from 'express';


const router = express.Router();
router.post('/execute', executeCode);
router.post('/submit', userAuth, submitCode); // Protect submit
router.get('/submissions', userAuth, getSubmissions); // Protect history

export default router;
