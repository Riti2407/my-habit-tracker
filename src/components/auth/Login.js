import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";
import { toast } from "react-toastify";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.passwordMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
        await login(formData.email, formData.password, formData.rememberMe);
        navigate("/");
      
        if (formData.rememberMe) {
          toast.success("✅ You will stay logged in across sessions.");
        } else {
          toast.info("ℹ️ Session will end when you close the browser.");
        }
      } catch (error) {
        setErrors({ general: error.message });
        toast.error("❌ " + error.message);
      } finally {
        setIsLoading(false);
      }
      

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@example.com",
      password: "demo123",
      rememberMe: false,
    });

    setIsLoading(true);

    try {
      await login("demo@example.com", "demo123");
      navigate("/");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{t("auth.welcomeBack")}</h1>
          <p>{t("auth.loginSubtitle")}</p>
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t("auth.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder={t("auth.emailPlaceholder")}
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("auth.password")}</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder={t("auth.passwordPlaceholder")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>{t("auth.rememberMe")}</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              t("auth.login")
            )}
          </button>
        </form>

        <div className="demo-login">
          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            🚀 {t("auth.tryDemo")}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="auth-link">
              {t("auth.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
}
export default Login;
