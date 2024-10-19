import { createSlice } from "@reduxjs/toolkit";
import { ToastContainer, toast } from "react-toastify";
const initialAuthState = { notification: null };

const authSlice = createSlice({
  name: "notification",
  initialState: initialAuthState,
  reducers: {
    showNotification(state, action) {
      if (action.payload.status === "success") {
        toast.success(`${action.payload.message}`, {
          position: "top-right",
        });
      } else if (action.payload.status === "error") {
        toast.error(`${action.payload.message}`, {
          position: "top-right",
        });
      } else if (action.payload.status === "Under construction") {
        toast.warning(`${action.payload.message}`, {
          position: "top-right",
        });
      }

      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export default authSlice;
