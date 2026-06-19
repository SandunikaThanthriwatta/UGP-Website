import { Link } from "react-router-dom";
import { clearPersistedStore } from "index";
import { useSelector } from "react-redux";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const AdminNavbar = (props) => {
  const user = useSelector((state) => state.user.userData);

  const onClickLogout = () => {
    clearPersistedStore();
    window.location.reload();
  };

  return (
    <div
      style={{
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e9ecef",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Left — page title */}
      <div style={{ fontWeight: 600, fontSize: "1rem", color: "#32325d" }}>
        {props.brandText || "Dashboard"}
      </div>

      {/* Right — user */}
      <UncontrolledDropdown>
        <DropdownToggle
          tag="div"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#5e72e4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              flexShrink: 0,
            }}
          >
            {user?.userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#32325d" }}>
              {user?.userName || "User"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8898aa" }}>
              {user?.userId || ""}
            </div>
          </div>
          <i className="ni ni-bold-down" style={{ fontSize: "0.65rem", color: "#8898aa", marginLeft: "4px" }} />
        </DropdownToggle>
        <DropdownMenu right style={{ minWidth: "160px", marginTop: "8px", borderRadius: "8px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          <DropdownItem header style={{ fontSize: "0.75rem", color: "#8898aa", fontWeight: 600 }}>
            Welcome, {user?.userName}!
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={onClickLogout} style={{ fontSize: "0.875rem", color: "#f5365c" }}>
            <i className="ni ni-user-run mr-2" />
            Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default AdminNavbar;
