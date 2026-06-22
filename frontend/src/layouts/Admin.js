import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

const Admin = (props) => {
  const user = useSelector((state) => state.user.userData);
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.style.backgroundColor = "#f4f6f9";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.layout === "/all") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else if (prop.layout === "/admin" && prop.path === "/index" && user?.userType !== 1) {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else if (user?.userType === 2 && prop.layout === "/admin") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else if (user?.userType === 0 && prop.layout === "/student") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else if (user?.userType === 1 && prop.layout === "/evaluator") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else if (user?.userType === 3 && prop.layout === "/hod") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      }
      return null;
    });

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Dashboard";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/LOGO_OF_RUHUNA.jpg"),
          imgAlt: "University of Ruhuna",
        }}
      />

      {/* Main content — offset by sidebar width */}
      <div
        ref={mainContent}
        style={{
          marginLeft: "250px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f4f6f9",
        }}
      >
        <AdminNavbar brandText={getBrandText()} />

        <div style={{ flex: 1, padding: "1.5rem" }}>
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
          </Routes>
        </div>

        <AdminFooter />
      </div>
    </div>
  );
};

export default Admin;
