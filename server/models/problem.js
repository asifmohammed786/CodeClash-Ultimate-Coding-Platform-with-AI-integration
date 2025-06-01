import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isSample: { 
    type: Boolean, 
    default: false  // false = hidden test case, true = sample test case
  }
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Easy' 
  },
  testCases: [testCaseSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.problem || mongoose.model('problem', problemSchema);
