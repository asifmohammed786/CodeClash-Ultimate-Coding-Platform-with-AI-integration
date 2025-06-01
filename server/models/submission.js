import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'problem', required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'cpp' },
  verdict: { type: String, required: true },
  error: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.submission || mongoose.model('submission', submissionSchema);
