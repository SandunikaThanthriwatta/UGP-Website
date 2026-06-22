import { createSlice } from "@reduxjs/toolkit";

const initialPrjectState = { projects: [], project: {} };

const projectSlice = createSlice({
  name: "project",
  initialState: initialPrjectState,
  reducers: {
    getAllProjects(state, action) {
      state.projects = action.payload.projects;
    },
    getProject(state, action) {
      state.project = action.payload.project;
    },
    addEvaluatorToProject(state, action) {
      const { projectId, evaluator } = action.payload;
      const project = state.projects.find((p) => p._id === projectId);
      if (project) {
        project.evaluator = [...(project.evaluator || []), evaluator];
      }
    },
  },
});

export default projectSlice;
