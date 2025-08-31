// src/components/NotificationManager.js - Fixed version
class NotificationManager {
  constructor() {
    this.scheduledNotifications = new Map();
    this.permission = 'default';
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      console.log('Permission result:', permission);
      return permission === 'granted';
    }
    return false;
  }

  // Send immediate notification
  sendNotification(title, options = {}) {
    console.log('Attempting to send notification:', title, this.permission);
    
    if (this.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body: options.body || 'Time to complete your habit!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: options.tag || 'habit-reminder',
          requireInteraction: false,
          silent: false,
          ...options
        });

        console.log('Notification created successfully:', notification);

        // Auto close after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);

        // Add click handler
        notification.onclick = () => {
          console.log('Notification clicked');
          window.focus(); // Focus the browser window
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    } else {
      console.warn('Cannot send notification. Permission:', this.permission);
    }
    return null;
  }

  // Convert 12-hour to 24-hour format
  convertTo24Hour(timeString) {
    // If already in 24-hour format (HH:MM), return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // Handle 12-hour format
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'AM' ? hours : String(parseInt(hours, 10) + 12);
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  // Schedule a single notification
  scheduleNotification(habitKey, habitName, time) {
    console.log(`=== Scheduling notification for ${habitName} ===`);
    
    // Clear existing notification for this habit first
    this.clearNotification(habitKey);

    // Convert time to 24-hour format
    const time24 = this.convertTo24Hour(time);
    const [hours, minutes] = time24.split(':').map(Number);
    
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    console.log('Current time:', now.toLocaleTimeString());
    console.log('Scheduled time:', scheduledTime.toLocaleTimeString());

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      console.log('Time passed today, scheduling for tomorrow:', scheduledTime.toLocaleTimeString());
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    const minutesUntil = Math.round(timeUntilNotification / (1000 * 60));
    
    console.log(`Time until notification: ${minutesUntil} minutes`);

    if (timeUntilNotification < 0) {
      console.error('Invalid time calculation');
      return;
    }

    const timeoutId = setTimeout(() => {
      console.log(`FIRING NOTIFICATION for ${habitName}`);
      this.sendNotification(`Time for: ${habitName}`, {
        body: `Don't break your streak! Complete your ${habitName} habit now.`,
        tag: habitKey,
        icon: '/favicon.ico'
      });

      // Reschedule for next day (24 hours later)
      setTimeout(() => {
        this.scheduleNotification(habitKey, habitName, time);
      }, 1000); // Small delay before rescheduling
      
    }, timeUntilNotification);

    this.scheduledNotifications.set(habitKey, {
      timeoutId,
      habitName,
      time: time24,
      scheduledFor: scheduledTime.toISOString(),
      minutesUntil
    });

    console.log(`Successfully scheduled ${habitName} for ${scheduledTime.toLocaleTimeString()}`);
  }

  // Clear a specific notification
  clearNotification(habitKey) {
    const notification = this.scheduledNotifications.get(habitKey);
    if (notification) {
      clearTimeout(notification.timeoutId);
      this.scheduledNotifications.delete(habitKey);
      console.log(`Cleared notification for ${habitKey}`);
    }
  }

  // Clear all notifications
  clearAllNotifications() {
    console.log('Clearing all notifications...');
    this.scheduledNotifications.forEach((notification, habitKey) => {
      clearTimeout(notification.timeoutId);
    });
    this.scheduledNotifications.clear();
    console.log('All notifications cleared');
  }

  // Get scheduled notifications with debug info
  getScheduledNotifications() {
    const notifications = Array.from(this.scheduledNotifications.entries()).map(([habitKey, data]) => ({
      habitKey,
      ...data,
      timeUntilFire: data.minutesUntil
    }));
    
    console.log('Current scheduled notifications:', notifications);
    return notifications;
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window;
  }

  // Get permission status
  getPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission;
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

export default notificationManager;