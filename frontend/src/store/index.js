import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./slices/authSlice";
import notificationSlice from "./slices/notificationSlice";
import projectSlice from "./slices/projectSlice";
import evaluatorSlice from "./slices/evaluatorSlice";
import userSlice from "./slices/userSclice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authSlice.reducer,
  notification: notificationSlice.reducer,
  project: projectSlice.reducer,
  evaluator: evaluatorSlice.reducer,
  user: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
