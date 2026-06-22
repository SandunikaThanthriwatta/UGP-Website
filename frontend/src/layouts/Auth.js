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

  const getRoutes = (routes) =>
    routes.map((prop, key) =>
      prop.layout === "/auth"
        ? <Route path={prop.path} element={prop.component} key={key} exact />
        : null
    );

  return (
    <div
      ref={mainContent}
      style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center" }}
    >
      {/* Background image */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url('/geralt-college-4126481_1920.jpg')`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0, transform: "scaleX(-1)" }} />
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(10, 18, 38, 0.48)", zIndex: 1 }} />

      {/* Logo + card — grouped in one column */}
      <div style={{ position: "relative", zIndex: 2, marginLeft: "7vw", width: "420px", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* University logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="8" fill="rgba(255,255,255,0.12)" />
            <rect x="8"  y="20" width="4" height="16" rx="1" fill="#fff" />
            <rect x="14" y="16" width="4" height="20" rx="1" fill="#fff" />
            <rect x="20" y="13" width="4" height="23" rx="1" fill="#fff" />
            <rect x="26" y="16" width="4" height="20" rx="1" fill="#fff" />
            <rect x="32" y="20" width="4" height="16" rx="1" fill="#fff" />
            <rect x="6"  y="36" width="32" height="2.5" rx="1.25" fill="#fff" opacity="0.85" />
            <path d="M8 20 Q22 6 36 20" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "3px", textTransform: "uppercase", lineHeight: 1 }}>CRESTWOOD</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 400, fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "3px" }}>UNIVERSITY</div>
          </div>
        </div>

        {/* Login card */}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Auth;
