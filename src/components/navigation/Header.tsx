import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface HeaderProps {
  toggleNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleNotifications }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  // Function to get page title based on current path
  const getPageTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Tableau de bord';
    if (path === '/requests') return 'Mes requêtes';
    if (path.startsWith('/requests/new')) return 'Nouvelle requête';
    if (path.startsWith('/requests/')) return 'Détails de la requête';
    if (path === '/profile') return 'Mon profil';
    if (path === '/settings') return 'Paramètres';
    if (path === '/admin') return 'Gestion des requêtes';
    if (path === '/admin/users') return 'Gestion des utilisateurs';
    
    return 'IUT Douala';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;