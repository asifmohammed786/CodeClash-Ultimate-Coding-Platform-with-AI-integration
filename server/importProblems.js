import fs from 'fs';
import mongoose from 'mongoose';
import Problem from './models/problem.js'; // Adjust path if needed

// Your admin user's ObjectId as a string
const ADMIN_USER_ID = '683aa3b49cd353da1bc6f5fe';

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://asifmohammed85113:asifmohammed85113@cluster0.2vz3hsg.mongodb.net/OJFINAL');

// Read and parse the JSON file
const data = fs.readFileSync('./problems.json', 'utf8');
const problems = JSON.parse(data);

async function importProblems() {
  try {
    for (const p of problems) {
      // Add createdBy field to each problem
      await Problem.create({ ...p, createdBy: ADMIN_USER_ID });
    }
    console.log('Problems imported successfully!');
  } catch (err) {
    console.error('Error importing problems:', err);
  } finally {
    mongoose.disconnect();
  }
}

importProblems();
