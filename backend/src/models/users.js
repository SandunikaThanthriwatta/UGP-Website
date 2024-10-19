import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userType: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("user", schema);
