import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "problem" }],
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.contest || mongoose.model('contest', contestSchema);
