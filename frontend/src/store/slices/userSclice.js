import { createSlice } from "@reduxjs/toolkit";

const initialUserState = { userData: null };

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    getUserData(state, action) {
      state.userData = action.payload.userData;
    },
  },
});

export default userSlice;
