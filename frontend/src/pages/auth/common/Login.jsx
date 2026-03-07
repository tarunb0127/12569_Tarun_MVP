import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/AuthContext";
import authService from "../../../services/auth/authService";
import { toast } from "sonner";
import "../../../styles/auth/Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (value.trim().length > 100) {
        newErrors.email = "Email must not exceed 100 characters";
      } else if (!validateEmail(value.trim())) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }
    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (value !== value.trim()) {
        newErrors.password = "Password cannot have leading or trailing spaces";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (value.length > 50) {
        newErrors.password = "Password must not exceed 50 characters";
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (formData.email.trim().length > 100) {
      newErrors.email = "Email must not exceed 100 characters";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password !== formData.password.trim()) {
      newErrors.password = "Password cannot have leading or trailing spaces";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 50) {
      newErrors.password = "Password must not exceed 50 characters";
    }
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
    if (touched[name]) validateField(name, newValue);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handlePasswordPaste = (e) => {
    e.preventDefault();
    toast.warning("Password pasting is disabled for security");
    return false;
  };
  const handlePasswordCopy = (e) => {
    e.preventDefault();
    toast.warning("Password copying is disabled for security");
    return false;
  };
  const handlePasswordCut = (e) => {
    e.preventDefault();
    toast.warning("Password cutting is disabled for security");
    return false;
  };

  const getDashboardRoute = (roleName) => {
    const normalizedRole = roleName?.toUpperCase().replace(/\s+/g, "");
    const routes = {
      ADMIN:          "/admin/dashboard",
      HR:             "/hr/dashboard",
      DEPARTMENTHEAD: "/department-head/dashboard",
      LEADERSHIP:     "/leadership/dashboard",
      MANAGER:        "/manager/dashboard",
      EMPLOYEE:       "/employee/dashboard",
    };
    return routes[normalizedRole] || "/employee/dashboard";
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError("");
    if (!validateForm()) {
      toast.error("Enter Valid Details!");
      return false;
    }
    toast.loading("Signing in...");
    performLogin();
    return false;
  };

  const performLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);

      if (!response.success || !response.data) {
        const errorMessage = response.message || "Unable to sign in. Please check your credentials.";
        setError(errorMessage);
        toast.dismiss();
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const data = response.data;

      if (data.requiresTwoFactor) {
        toast.dismiss();
        toast.info("Two-factor authentication required");
        localStorage.setItem("tempUser", JSON.stringify({ email: formData.email }));
        navigate("/verify-code", { replace: false });
        return;
      }

      if (data.requiresPasswordReset) {
        toast.dismiss();
        toast.info("Password reset required for first login");
        localStorage.setItem("tempUser", JSON.stringify({
          email: formData.email,
          isFirstLogin: true,
          requiresPasswordReset: true,
        }));
        navigate("/verify-first-login", {
          state: { email: formData.email, isFirstLogin: true },
          replace: false,
        });
        return;
      }

      const user = data.user;
      if (!user) {
        const errorMsg = "An unexpected error occurred. Please try again.";
        setError(errorMsg);
        toast.dismiss();
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const tokenClaims = authService.getClaims();
      const userData = {
        userId: user.userId,
        email: user.email,
        name:
          user.fullName ||
          user.name ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email?.split("@")[0] ||
          "User",
        fullName:       user.fullName,
        firstName:      user.firstName,
        lastName:       user.lastName,
        empId:          user.empId || user.employeeId || user.employeeCompanyId,
        empMasterId:    tokenClaims?.empMasterId,
        role:           user.roleName || user.role,
        roleName:       user.roleName,
        departmentId:   user.departmentId,
        departmentName: user.departmentName,
      };

      login(userData, data.accessToken);
      toast.dismiss();
      toast.success(`Welcome back, ${userData.name}!`);

      const dashboardRoute = getDashboardRoute(user.roleName);
      navigate(dashboardRoute, { replace: true });

    } catch (err) {
      let errorMessage = "Unable to sign in. Please try again.";
      if (err.response) {
        const status = err.response.status;
        const data   = err.response.data;
        if (status === 400)      errorMessage = data?.message || "Invalid request.";
        else if (status === 401) errorMessage = data?.message || "Invalid email or password.";
        else if (status === 403) errorMessage = data?.message || "Account locked. Contact support.";
        else if (status === 429) errorMessage = "Too many attempts. Please wait and try again.";
        else if (status >= 500)  errorMessage = "Server error. Please try again later.";
        else                     errorMessage = data?.message || `Error: ${status}`;
      } else if (err.message === "Network Error") {
        errorMessage = "No connection. Please check your internet.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pv-login-page">
      <div className="pv-login-inner">

        {/* ── Left Panel ── */}
        <div className="pv-login-left">
          <div className="pv-left-content">

            {/* Brand */}
            <div className="pv-brand">
              <div className="pv-brand-icon">
                <i className="bi bi-person-bounding-box"></i>
              </div>
              <span className="pv-brand-name">PhotoValidator</span>
            </div>

            {/* Center Body */}
            <div className="pv-left-body">
              <div className="pv-left-badge">
                <i className="bi bi-shield-check me-2"></i>
                AI‑Powered Validation
              </div>
              <h1 className="pv-left-title">
                Smart Profile<br />Photo Analysis
              </h1>
              <p className="pv-left-desc">
                Instantly validate your profile photo for brightness,
                clarity, face detection, and professional framing — all
                powered by AI.
              </p>
              <ul className="pv-features">
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Real‑time face detection & centering
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Brightness, contrast & clarity scoring
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Actionable improvement suggestions
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Professional compliance check
                </li>
              </ul>
            </div>

            {/* Footer */}
            <p className="pv-left-footer">
              <i className="bi bi-lock me-1"></i>
              © {new Date().getFullYear()} PhotoValidator — All rights reserved
            </p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="pv-login-right">
          <div className="pv-form-box">

            {/* Header */}
            <div className="pv-form-header">
              <div className="pv-form-icon">
                <i className="bi bi-person-bounding-box"></i>
              </div>
              <h2>Welcome back</h2>
              <p>Sign in to access your dashboard</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="pv-error-banner">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate autoComplete="off">

              {/* Email */}
              <div className="pv-field">
                <label htmlFor="email" className="pv-label">
                  Email Address
                </label>
                <div className={`pv-input-wrap ${errors.email && touched.email ? "pv-input-error" : ""} ${touched.email && !errors.email && formData.email ? "pv-input-valid" : ""}`}>
                  <i className="bi bi-envelope pv-input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="pv-input"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="username"
                    disabled={loading}
                    maxLength={100}
                  />
                  {touched.email && !errors.email && formData.email && (
                    <i className="bi bi-check-circle-fill pv-input-valid-icon"></i>
                  )}
                </div>
                {errors.email && touched.email && (
                  <span className="pv-field-error">
                    <i className="bi bi-info-circle me-1"></i>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="pv-field">
                <label htmlFor="password" className="pv-label">
                  Password
                </label>
                <div className={`pv-input-wrap ${errors.password && touched.password ? "pv-input-error" : ""}`}>
                  <i className="bi bi-lock pv-input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="pv-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePasswordPaste}
                    onCopy={handlePasswordCopy}
                    onCut={handlePasswordCut}
                    autoComplete="current-password"
                    disabled={loading}
                    maxLength={50}
                  />
                  <button
                    type="button"
                    className="pv-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                {errors.password && touched.password && (
                  <span className="pv-field-error">
                    <i className="bi bi-info-circle me-1"></i>
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Forgot */}
              <div className="pv-forgot-row">
                <a
                  href="/reset-password"
                  className="pv-forgot-link"
                  onClick={(e) => { e.preventDefault(); navigate("/reset-password"); }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="pv-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>

            </form>

            {/* Secure note */}
            <div className="pv-secure-note">
              <i className="bi bi-shield-lock me-1"></i>
              Your credentials are encrypted and secure
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
