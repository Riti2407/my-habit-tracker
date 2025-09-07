// src/components/NotificationSettings.js - Improved version with better error handling
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import notificationManager from "./NotificationManager";
import "./NotificationSettings.css";

const NotificationSettings = ({ habitList, darkMode }) => {
  const { t, ready } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState('default');
  const [habitSettings, setHabitSettings] = useState({});
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  useEffect(() => {
    // Load notification settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setHabitSettings(JSON.parse(savedSettings));
    }

    // Update permission status
    const currentPermission = notificationManager.getPermission();
    setPermission(currentPermission);
    setScheduledNotifications(notificationManager.getScheduledNotifications());

    // Show help if permission is denied/blocked
    if (currentPermission === 'denied') {
      setShowPermissionHelp(true);
    }
  }, []);

  const handlePermissionRequest = async () => {
    try {
      const granted = await notificationManager.requestPermission();
      const newPermission = granted ? 'granted' : 'denied';
      setPermission(newPermission);
      
      if (!granted) {
        setShowPermissionHelp(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setShowPermissionHelp(true);
    }
  };

  const saveSettings = (newSettings) => {
    setHabitSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const toggleHabitNotification = (habitKey, habitLabel) => {
    if (permission !== 'granted') {
      setShowPermissionHelp(true);
      return;
    }

    const currentSetting = habitSettings[habitKey];
    const newSettings = { ...habitSettings };

    if (currentSetting?.enabled) {
      // Disable notification
      notificationManager.clearNotification(habitKey);
      newSettings[habitKey] = { ...currentSetting, enabled: false };
    } else {
      // Enable notification with default time
      const defaultTime = currentSetting?.time || "09:00";
      notificationManager.scheduleNotification(habitKey, habitLabel, defaultTime);
      newSettings[habitKey] = { 
        enabled: true, 
        time: defaultTime,
        habitLabel 
      };
    }

    saveSettings(newSettings);
    setScheduledNotifications(notificationManager.getScheduledNotifications());
  };

  const updateNotificationTime = (habitKey, newTime) => {
    const currentSetting = habitSettings[habitKey];
    if (!currentSetting || permission !== 'granted') return;

    const newSettings = {
      ...habitSettings,
      [habitKey]: { ...currentSetting, time: newTime }
    };

    saveSettings(newSettings);

    // Reschedule if enabled
    if (currentSetting.enabled) {
      notificationManager.scheduleNotification(
        habitKey, 
        currentSetting.habitLabel, 
        newTime
      );
      setScheduledNotifications(notificationManager.getScheduledNotifications());
    }
  };

  const testNotification = () => {
    if (permission !== 'granted') {
      setShowPermissionHelp(true);
      return;
    }
    
    notificationManager.sendNotification("Test Notification", {
      body: "This is a test notification from your Habit Tracker!",
      tag: "test"
    });
  };

  const clearAllNotifications = () => {
    notificationManager.clearAllNotifications();
    const newSettings = Object.keys(habitSettings).reduce((acc, key) => {
      acc[key] = { ...habitSettings[key], enabled: false };
      return acc;
    }, {});
    saveSettings(newSettings);
    setScheduledNotifications([]);
  };

  // Helper function to detect if notifications are blocked
  const isBlocked = permission === 'denied';
  const isSupported = notificationManager.isSupported();

  if (!ready) return null;

  return (
    <>
      {/* Notification Bell Button */}
      <button
        className={`notification-toggle ${isOpen ? 'active' : ''} ${isBlocked ? 'blocked' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isBlocked ? "Notifications Blocked - Click for help" : "Notification Settings"}
        style={{
          position: 'fixed',
          top: '14px',
          right: '233px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isBlocked 
            ? '#ef4444' 
            : (darkMode ? '#374151' : '#f3f4f6'),
          color: darkMode ? '#f9fafb' : '#111827',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        {isBlocked ? '🔔❌' : '🔔'}
      </button>

      {/* Notification Settings Panel */}
      {isOpen && (
        <div 
          className="notification-settings-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="notification-settings-panel"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              color: darkMode ? '#f9fafb' : '#111827',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Notification Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: darkMode ? '#f9fafb' : '#111827',
                }}
              >
                ✕
              </button>
            </div>

            {/* Browser Support Check */}
            {!isSupported && (
              <div style={{ 
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
                marginBottom: '1.5rem',
                border: '1px solid #ef4444'
              }}>
                <strong>❌ Not Supported</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                  Your browser doesn't support notifications. Try using Chrome, Firefox, or Edge.
                </p>
              </div>
            )}

            {/* Permission Status */}
            {isSupported && (
              <div style={{ 
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: permission === 'granted' 
                  ? (darkMode ? '#065f46' : '#d1fae5') 
                  : (darkMode ? '#7f1d1d' : '#fee2e2'),
                marginBottom: '1.5rem',
                border: `1px solid ${permission === 'granted' ? '#10b981' : '#ef4444'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    Browser Notifications: 
                    <strong> {permission === 'granted' ? '✅ Enabled' : '❌ Blocked/Disabled'}</strong>
                  </span>
                  {permission !== 'granted' && (
                    <button
                      onClick={handlePermissionRequest}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Enable
                    </button>
                  )}
                </div>

                {/* Permission Help Instructions */}
                {(showPermissionHelp || isBlocked) && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: darkMode ? '#991b1b' : '#fecaca',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    <strong>🔧 How to Fix Blocked Notifications:</strong>
                    <ol style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                      <li>Click the <strong>lock icon</strong> or <strong>tune icon</strong> next to your URL</li>
                      <li>Find "Notifications" in the dropdown</li>
                      <li>Change from "Block" to "Allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                    <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                      Alternative: Go to browser settings → Site permissions → Notifications
                    </p>
                  </div>
                )}
              </div>
            )}

            {permission === 'granted' && (
              <>
                {/* Test & Clear Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={testNotification}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Test Notification
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Clear All
                  </button>
                </div>

                {/* Habit Notifications List */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Habit Reminders</h3>
                  {habitList.map((habit) => {
                    const setting = habitSettings[habit.key] || {};
                    const isEnabled = setting.enabled || false;
                    const time = setting.time || "09:00";

                    return (
                      <div
                        key={habit.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          backgroundColor: darkMode ? '#374151' : '#f9fafb',
                          border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: '500' }}>{habit.label}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {isEnabled && (
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => updateNotificationTime(habit.key, e.target.value)}
                              style={{
                                padding: '0.25rem',
                                borderRadius: '0.25rem',
                                border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
                                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                color: darkMode ? '#f9fafb' : '#111827',
                                fontSize: '0.875rem'
                              }}
                            />
                          )}
                          
                          <button
                            onClick={() => toggleHabitNotification(habit.key, habit.label)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: '0.25rem',
                              border: 'none',
                              backgroundColor: isEnabled ? '#ef4444' : '#10b981',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              minWidth: '60px'
                            }}
                          >
                            {isEnabled ? 'OFF' : 'ON'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Notifications Info */}
                {scheduledNotifications.length > 0 && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: darkMode ? '#065f46' : '#ecfdf5',
                    border: `1px solid ${darkMode ? '#047857' : '#10b981'}`
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                      Active Notifications ({scheduledNotifications.length})
                    </h4>
                    {scheduledNotifications.map((notification) => (
                      <div key={notification.habitKey} style={{ fontSize: '0.875rem' }}>
                        {notification.habitName} at {notification.time}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Fallback Alternatives for Blocked Notifications */}
            {(permission === 'denied' || !isSupported) && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
                border: `1px solid ${darkMode ? '#3b82f6' : '#60a5fa'}`
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                  💡 Alternative Reminder Options
                </h4>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                  <li>Set phone alarms for your habit times</li>
                  <li>Use your phone's built-in reminder apps</li>
                  <li>Create calendar events for each habit</li>
                  <li>Try accessing this app on your phone browser</li>
                </ul>
              </div>
            )}

            {/* Instructions */}
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
              fontSize: '0.875rem',
              lineHeight: '1.4'
            }}>
              <strong>📋 How Browser Notifications Work:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                <li>Enable notifications for each habit individually</li>
                <li>Set custom reminder times for each habit</li>
                <li>Notifications work even when the app tab is closed</li>
                <li>Requires browser permission (not blocked)</li>
                <li>Works best on desktop browsers</li>
              </ul>
              
              {permission === 'denied' && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
                  borderRadius: '0.5rem',
                  border: '1px solid #ef4444'
                }}>
                  <strong>⚠️ Permission Required:</strong> Please follow the steps above to unblock notifications in your browser settings.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSettings;