import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";

import routes from "routes.js";

const Auth = () => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div ref={mainContent} style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left side — image with gradient overlay */}
      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('/electrical 3.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 70%, rgba(248,249,250,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              backdropFilter: "blur(4px)",
              borderRadius: "12px",
              padding: "2rem 2.5rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "2rem", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>
              Undergraduate FYP Portal
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "1rem" }}>
              Final Year Project Management System
            </p>
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div
        style={{
          width: "480px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          padding: "2rem",
        }}
      >
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Auth;
