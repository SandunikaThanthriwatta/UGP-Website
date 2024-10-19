import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: false, token: null };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});



export default authSlice;
