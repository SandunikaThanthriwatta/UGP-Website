import notificationSlice from "../slices/notificationSlice";
import authSlice from "../slices/authSlice";
import userSlice from '../slices/userSclice';

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { serverUrl } from "utils/serveUrl";

export const userLogin = (userInput) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.post(`${serverUrl}auth/login`, {
        password: userInput.password,
        userId: userInput.userId,
      });
      console.log(response);
      if (response.status != 200) {
        throw new Error("User Login failed");
      }
      console.log(response.data);
      return response.data;
    };
    try {
      const userResponse = await sendRequest();
      console.log(userResponse);

      dispatch(authSlice.actions.login(userResponse));
      dispatch(userSlice.actions.getUserData(userResponse));
    //   dispatch(
    //     userSlice.actions.updateUserType(userResponse.userData.userType)
    //   );
      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "User Logged Successfuly!",
        })
      );
    } catch (err) {
      console.log(err);
        dispatch(
          notificationSlice.actions.showNotification({
            status: "error",
            title: "Error...",
            message: "Invalid username or password",
          })
        );
    }
  };
};


export const getUserData = (userInput) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.post(`${serverUrl}auth/login`, {
        password: userInput.password,
        userId: userInput.userId,
      });
      console.log(response);
      if (response.status != 200) {
        throw new Error("User Login failed");
      }
      console.log(response.data);
      return response.data;
    };
    try {
      const userResponse = await sendRequest();
      console.log(userResponse);

      dispatch(authSlice.actions.login(userResponse));
    //   dispatch(userSlice.actions.userDetails(userResponse.userData));
    //   dispatch(
    //     userSlice.actions.updateUserType(userResponse.userData.userType)
    //   );
      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "User Logged Successfuly!",
        })
      );
    } catch (err) {
      console.log(err);
      //   dispatch(
      //     notificationSlice.actions.showNotification({
      //       status: "error",
      //       title: "Error...",
      //       message: "Invalid username or password",
      //     })
      //   );
    }
  };
};