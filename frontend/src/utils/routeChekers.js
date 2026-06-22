import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HOME_BY_TYPE = {
  0: "/student/my-project",
  1: "/evaluator/index",
  2: "/admin/index",
  3: "/hod/all-projects",
};

export const Authenticated = ({ element }) => {
  const navigate   = useNavigate();
  const authToken  = useSelector((state) => state.auth.isAuthenticated);
  const userType   = useSelector((state) => state.user.userData?.userType);
  useEffect(() => {
    if (!authToken) {
      navigate("/auth/login");
    } else {
      navigate(HOME_BY_TYPE[userType] ?? "/admin/index");
    }
  }, [authToken, navigate]);

  return element;
};

export const LoignAuth = ({ element }) => {
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (!authToken) {
      navigate("/auth/login");
    }
  }, [authToken, navigate]);

  return element;
};
