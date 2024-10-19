import notificationSlice from "../slices/notificationSlice";
import projectSlice from "../slices/projectSlice";
// import userSlice from "../slices/userSlice";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "utils/serveUrl";

export const getAllProjects = (year) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await toast.promise(
        axios.get(`${serverUrl}admin/all-projects/${year}`, {}),
        {
          pending: "Searching",
          success: "Search Finished",
          error: "Search Failed",
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

      dispatch(projectSlice.actions.getAllProjects(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      //   dispatch(
      //     notificationSlice.actions.showNotification({
      //       status: "success",
      //       title: "Success!",
      //       message: "User Logged Successfuly!",
      //     })
      //   );
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

export const getProject = (id) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.get(
        `${serverUrl}admin/project/${id}`,
        {}
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

      dispatch(projectSlice.actions.getProject(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      //   dispatch(
      //     notificationSlice.actions.showNotification({
      //       status: "success",
      //       title: "Success!",
      //       message: "User Logged Successfuly!",
      //     })
      //   );
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

export const getProjectByEvaluator = (id, year) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await toast.promise(
        axios.get(`${serverUrl}student/evaluator-projects/${id}`, {
          headers: {
            acadamicYear: year,
          },
        }),
        {
          pending: "Searching",
          success: "Search Finished",
          error: "Search Failed",
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

      console.log(userResponse.projects);

      dispatch(projectSlice.actions.getAllProjects(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      //   dispatch(
      //     notificationSlice.actions.showNotification({
      //       status: "success",
      //       title: "Success!",
      //       message: "User Logged Successfuly!",
      //     })
      //   );
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

export const getProjectByStudent = (id) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    console.log(id);
    const sendRequest = async () => {
      const response = await axios.get(
        `${serverUrl}student/my-project/${id}`,
        {}
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

      dispatch(projectSlice.actions.getProject(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      //   dispatch(
      //     notificationSlice.actions.showNotification({
      //       status: "success",
      //       title: "Success!",
      //       message: "User Logged Successfuly!",
      //     })
      //   );
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
