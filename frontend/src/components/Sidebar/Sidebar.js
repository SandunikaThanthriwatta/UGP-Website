import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";

const SIDEBAR_BG = "#1a2035";
const ACCENT = "#5e72e4";
const TEXT_MUTED = "rgba(255,255,255,0.5)";
const TEXT_ACTIVE = "#fff";

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "250px",
    backgroundColor: SIDEBAR_BG,
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
    overflowY: "auto",
  },
  logoArea: {
    padding: "1.5rem 1.25rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoImg: {
    width: "42px",
    height: "42px",
    objectFit: "contain",
    borderRadius: "8px",
    background: "#fff",
    padding: "2px",
  },
  logoText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.95rem",
    lineHeight: 1.3,
    letterSpacing: "0.3px",
  },
  logoSub: {
    color: TEXT_MUTED,
    fontSize: "0.72rem",
    fontWeight: 400,
  },
  navSection: {
    padding: "1.25rem 0.75rem",
    flex: 1,
  },
  sectionLabel: {
    color: TEXT_MUTED,
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    padding: "0 0.75rem",
    marginBottom: "0.5rem",
    marginTop: "0.75rem",
  },
  navLink: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    marginBottom: "2px",
    color: active ? TEXT_ACTIVE : TEXT_MUTED,
    backgroundColor: active ? ACCENT : "transparent",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 400,
    transition: "all 0.18s ease",
  }),
  navIcon: {
    width: "20px",
    textAlign: "center",
    fontSize: "0.95rem",
    flexShrink: 0,
  },
};

const Sidebar = (props) => {
  const user = useSelector((state) => state.user.userData);
  const location = useLocation();
  const { routes, logo } = props;

  const isActive = (routePath, layout) =>
    location.pathname === layout + routePath;

  const createLinks = (routes) =>
    routes.map((prop, key) => {
      const show =
        (user?.userType === 2 && prop.layout === "/admin" && prop.name !== "Your Project") ||
        (user?.userType === 0 && prop.layout === "/student") ||
        (user?.userType === 1 && prop.layout === "/evaluator");

      if (!show) return null;

      const active = isActive(prop.path, prop.layout);

      return (
        <NavLinkRRD
          key={key}
          to={prop.layout + prop.path}
          style={styles.navLink(active)}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.color = TEXT_MUTED;
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={styles.navIcon}>
            <i className={prop.icon} style={{ color: "inherit" }} />
          </span>
          {prop.name}
        </NavLinkRRD>
      );
    });

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoArea}>
        {logo && (
          <img
            src={logo.imgSrc}
            alt={logo.imgAlt}
            style={styles.logoImg}
          />
        )}
        <div>
          <div style={styles.logoText}>UGP Portal</div>
          <div style={styles.logoSub}>University of Ruhuna</div>
        </div>
      </div>

      {/* Nav */}
      <div style={styles.navSection}>
        <div style={styles.sectionLabel}>Main Menu</div>
        {createLinks(routes)}
      </div>

      {/* Footer */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: TEXT_MUTED, fontSize: "0.72rem", textAlign: "center" }}>
          FYP Management System © 2026
        </div>
      </div>
    </div>
  );
};

Sidebar.defaultProps = { routes: [{}] };

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
