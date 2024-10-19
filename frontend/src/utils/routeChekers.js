import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Authenticated = ({ element }) => {
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!authToken) {
      navigate("/auth/login");
    } else {
      navigate("/");

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
