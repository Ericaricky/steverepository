import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, ClipboardList, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const { hasRole } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="flex items-center justify-around py-2">
      <Link
        to="/dashboard"
        className={`flex flex-col items-center p-2 ${
          isActive('/dashboard') ? 'text-[#0F4C81]' : 'text-gray-500'
        }`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      
      <Link
        to="/requests"
        className={`flex flex-col items-center p-2 ${
          isActive('/requests') ? 'text-[#0F4C81]' : 'text-gray-500'
        }`}
      >
        <FileText size={20} />
        <span className="text-xs mt-1">Requêtes</span>
      </Link>
      
      {hasRole(['admin', 'academic_secretary', 'department_head']) && (
        <Link
          to="/admin"
          className={`flex flex-col items-center p-2 ${
            isActive('/admin') ? 'text-[#0F4C81]' : 'text-gray-500'
          }`}
        >
          <ClipboardList size={20} />
          <span className="text-xs mt-1">Admin</span>
        </Link>
      )}
      
      <Link
        to="/profile"
        className={`flex flex-col items-center p-2 ${
          isActive('/profile') ? 'text-[#0F4C81]' : 'text-gray-500'
        }`}
      >
        <User size={20} />
        <span className="text-xs mt-1">Profil</span>
      </Link>
      
      <Link
        to="/settings"
        className={`flex flex-col items-center p-2 ${
          isActive('/settings') ? 'text-[#0F4C81]' : 'text-gray-500'
        }`}
      >
        <Settings size={20} />
        <span className="text-xs mt-1">Réglages</span>
      </Link>
    </nav>
  );
};

export default MobileNav;