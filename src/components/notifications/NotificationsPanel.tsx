import React from 'react';
import { X, Check, Bell, BellOff } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
          <Check className="h-5 w-5 text-green-600" />
        </div>;
      case 'warning':
        return <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
          <Bell className="h-5 w-5 text-yellow-600" />
        </div>;
      case 'error':
        return <div className="flex-shrink-0 bg-red-100 rounded-full p-1">
          <BellOff className="h-5 w-5 text-red-600" />
        </div>;
      case 'info':
      default:
        return <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
          <Bell className="h-5 w-5 text-blue-600" />
        </div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Marquer tout comme lu</span>
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Fermer</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {notifications.length > 0 ? (
        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <div 
                  className={`px-4 py-4 sm:px-6 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    {getNotificationIcon(notification.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Supprimer</span>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <div className="mt-2 flex">
                        {notification.link && (
                          <Link
                            to={notification.link}
                            onClick={() => {
                              markAsRead(notification.id);
                              onClose();
                            }}
                            className="text-sm text-[#0F4C81] hover:text-[#0D3F6C]"
                          >
                            Voir les détails
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">Pas de notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas de notifications non lues pour le moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;