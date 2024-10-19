import mongoose from "mongoose";

const schema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  groupId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("student", schema);
