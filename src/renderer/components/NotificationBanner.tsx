import React, { useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  detail?: string;
  duration?: number; // Auto-dismiss after this many milliseconds
}

interface NotificationBannerProps {
  notification: Notification | null;
  onDismiss: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification?.duration) {
      const timer = setTimeout(() => {
        onDismiss();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getBannerClass = () => {
    switch (notification.type) {
      case 'success':
        return 'notification-banner success';
      case 'error':
        return 'notification-banner error';
      case 'warning':
        return 'notification-banner warning';
      case 'info':
        return 'notification-banner info';
      default:
        return 'notification-banner info';
    }
  };

  return (
    <div className={getBannerClass()}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-text">
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
          {notification.detail && (
            <div className="notification-detail">{notification.detail}</div>
          )}
        </div>
      </div>
      <button className="notification-close" onClick={onDismiss}>
        ✕
      </button>
    </div>
  );
};

export default NotificationBanner; 