import mongoose from "mongoose";

const schema = new mongoose.Schema({
  groupId: String,
  evaluationYear: String,
  evaluationFinalized: {
    type: Boolean,
    default: false,
  },
  groupMembers: [
    {
      studentId: String,
      studentFinalMarks: {
        type: Number,
        default: 0,
      },
      evaluationAreas: [
        {
          studentMarks: Number,
          criteria: String,
        },
      ],
    },
  ],

  mainSupervisor: {
    type: String,
  },
  projectName: String,
  projectDescription: String,
  projectImages: String,
  evaluator: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "evaluator",
    },
  ],
  finalMarks: {
    proposal: {
      type: String,
      default: "0",
    },
    progress: {
      type: String,
      default: "0",
    },
    final: {
      type: String,
      default: "0",
    },
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  projectEvaluationScore: {
    type: Object,
  },
});

export default mongoose.model("group", schema);
