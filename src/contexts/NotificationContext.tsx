import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage or initialize with mock data
    const storedNotifications = localStorage.getItem('acadNotifications');
    
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Nouvelle mise à jour',
          message: 'Votre requête de relevé de notes a été mise à jour.',
          type: 'info',
          read: false,
          createdAt: new Date(2023, 5, 20).toISOString(),
          link: '/requests/1'
        },
        {
          id: '2',
          title: 'Requête approuvée',
          message: 'Votre demande de dispense a été approuvée par le chef de département.',
          type: 'success',
          read: true,
          createdAt: new Date(2023, 3, 20).toISOString(),
          link: '/requests/3'
        }
      ];
      
      setNotifications(mockNotifications);
      localStorage.setItem('acadNotifications', JSON.stringify(mockNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('acadNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (
    notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};