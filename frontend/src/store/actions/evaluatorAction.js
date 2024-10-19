import notificationSlice from "../slices/notificationSlice";
import evaluatorSlice from "../slices/evaluatorSlice";
// import userSlice from "../slices/userSlice";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import projectSlice from "../slices/projectSlice";
import { serverUrl } from "utils/serveUrl";

export const getAllEvaluators = () => {
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
        `${serverUrl}admin/all-evaluators`,
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

      dispatch(evaluatorSlice.actions.getAllEvaluators(userResponse));
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

export const createEvaluator = (userData) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.post(
        `${serverUrl}admin/new-evaluator`,
        {
          userData,
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

      dispatch(evaluatorSlice.actions.getAllEvaluators(userResponse));
      //   dispatch(userSlice.actions.userDetails(userResponse.userData));
      //   dispatch(
      //     userSlice.actions.updateUserType(userResponse.userData.userType)
      //   );
      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "New Evaluator Added",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        notificationSlice.actions.showNotification({
          status: "error",
          title: "Error...",
          message: "New Evaluator creatrion failed",
        })
      );
    }
  };
};

export const assignEvaluator = (userData) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.post(
        `${serverUrl}admin/assign-evaluator`,
        {
          userData,
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

      dispatch(evaluatorSlice.actions.getAllEvaluators(userResponse));
        // dispatch(userSlice.actions.userDetails(userResponse.userData));
        // dispatch(
        //   userSlice.actions.updateUserType(userResponse.userData.userType)
        // );
      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "New Evaluator Assigned",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        notificationSlice.actions.showNotification({
          status: "error",
          title: "Error...",
          message: "New Evaluator creatrion failed",
        })
      );
    }
  };
};

export const getProjectEvaluator = (id) => {
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
        `${serverUrl}student/project-evaluator/${id}`,
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
      console.log(userResponse.projects);
      dispatch(projectSlice.actions.getAllProjects(userResponse.projects));
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

export const submitStuentMarks = (userData) => {
  return async (dispatch) => {
    dispatch(
      notificationSlice.actions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending userData",
      })
    );
    const sendRequest = async () => {
      const response = await axios.post(
        `${serverUrl}student/individual-marks`,
        {
          userData,
        }
      );
      console.log(response);
      if (response.status != 200) {
        throw new Error("User Login failed");
      }
      return response.data;
    };
    try {
      const userResponse = await sendRequest();

      dispatch(
        notificationSlice.actions.showNotification({
          status: "success",
          title: "Success!",
          message: "Student Evaluated",
        })
      );
      // window.location.reload();
    } catch (err) {
      console.log(err);
      dispatch(
        notificationSlice.actions.showNotification({
          status: "error",
          title: "Error...",
          message: "Student Evaluation failed",
        })
      );
    }
  };
};
