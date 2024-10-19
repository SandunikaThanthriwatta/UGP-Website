import notificationSlice from "../slices/notificationSlice";
import authSlice from "../slices/authSlice";
// import userSlice from "../slices/userSlice";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import projectSlice from "../slices/projectSlice";
import { serverUrl } from "utils/serveUrl";

export const studentDetails = (userInput) => {
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

export const updateProject = (userInput) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    console.log(userInput);
    const sendRequest = async () => {
      const response = await axios.put(
        `${serverUrl}student/project-update/${userInput.id}`,
        {
          projectDescription: userInput.text,
          projectImages: userInput.projectImages[0],
        }
      );
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

      dispatch(projectSlice.actions.getProject(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "Project Updated!",
        })
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
      dispatch(
        notificationSlice.actions.showNotification({
          status: "error",
          title: "Error...",
          message: "Project Update failed",
        })
      );
    }
  };
};
