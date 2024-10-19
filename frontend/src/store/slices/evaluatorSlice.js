import { createSlice } from "@reduxjs/toolkit";

const initialEvaluatorState = { evaluators: [], evaluator: {} };

const evaluatorSlice = createSlice({
  name: "authentication",
  initialState: initialEvaluatorState,
  reducers: {
    getAllEvaluators(state, action) {
      state.evaluators = action.payload.evaluators;
    },
    getEvaluator(state, action) {
        state.evaluators = action.payload.evaluators;
    },
  },
});


export default evaluatorSlice;
