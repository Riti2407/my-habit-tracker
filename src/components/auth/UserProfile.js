import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

const UserProfile = () => {
  const { t } = useTranslation();
  const { currentUser, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
    setMessage("");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email,
      });

      setMessage("Profile updated successfully!");
      setIsEditing(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear message when user starts typing
    if (message) {
      setMessage("");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>👤 {t("profile.userProfile")}</h1>
          <p>{t("profile.manageAccount")}</p>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="profile-info">
          <div className="info-group">
            <label>{t("profile.fullName")}</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("profile.namePlaceholder")}
                disabled={isLoading}
              />
            ) : (
              <div className="info-value">{currentUser.name}</div>
            )}
          </div>

          <div className="info-group">
            <label>{t("profile.email")}</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("profile.emailPlaceholder")}
                disabled={isLoading}
              />
            ) : (
              <div className="info-value">{currentUser.email}</div>
            )}
          </div>

          <div className="info-group">
            <label>{t("profile.memberSince")}</label>
            <div className="info-value">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button
                className="profile-button primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "⏳" : t("profile.saveChanges")}
              </button>
              <button
                className="profile-button secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {t("profile.cancel")}
              </button>
            </>
          ) : (
            <>
              <button className="profile-button primary" onClick={handleEdit}>
                ✏️ {t("profile.editProfile")}
              </button>
              <button className="profile-button danger" onClick={handleLogout}>
                🚪 {t("profile.logout")}
              </button>
            </>
          )}
        </div>

        <div className="profile-footer">
          <p className="profile-note">💡 {t("profile.profileNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
