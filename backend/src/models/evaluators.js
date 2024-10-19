import mongoose from "mongoose";

const schema = new mongoose.Schema({
  evaluatorName: String,
  evaluatorId: String,
  email: String,
  department: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

export default mongoose.model("evaluator", schema);
