import { useState } from "react";
import { userLogin } from "../../store/actions/authAction";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin(formData));
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "0.9rem",
    color: "#1e293b",
    outline: "none",
    background: "#f8fafc",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "2.75rem 2.5rem",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.2 }}>Sign In</h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "6px", marginBottom: 0 }}>
          Please enter your credentials to continue
        </p>
      </div>

      <form onSubmit={onSubmit}>
        {/* User ID */}
        <div style={{ marginBottom: "1.1rem" }}>
          <label style={labelStyle}>User ID</label>
          <input
            name="userId"
            type="text"
            placeholder="e.g. admin"
            value={formData.userId}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#5e72e4")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              style={{ ...inputStyle, paddingRight: "42px" }}
              onFocus={(e) => (e.target.style.borderColor = "#5e72e4")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, fontSize: "0.85rem" }}
            >
              <i className={showPassword ? "ni ni-glasses-2" : "ni ni-lock-circle-open"} />
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#5e72e4", fontWeight: 600, cursor: "pointer" }}>
            Forgot password?
          </span>
        </div>

        {/* Sign in button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#5e72e4",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            letterSpacing: "0.3px",
            boxShadow: "0 4px 14px rgba(94,114,228,0.35)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#4a5fd4")}
          onMouseLeave={(e) => (e.target.style.background = "#5e72e4")}
        >
          Sign In
        </button>
      </form>

      {/* Footer note */}
      <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#94a3b8", marginTop: "1.75rem", marginBottom: 0 }}>
        FYP Management System &mdash; Crestwood University &copy; 2026
      </p>
    </div>
  );
};

export default Login;
