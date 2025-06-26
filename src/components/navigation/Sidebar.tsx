import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Home, FileText, ClipboardList, User, Settings, Users, BarChart4, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <GraduationCap size={32} className="text-[#0F4C81]" />
          <div className="ml-2">
            <h1 className="text-lg font-semibold text-[#0F4C81]">IUT Douala</h1>
            <p className="text-xs text-gray-500">Système de Requêtes</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-[#0F4C81] text-white flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role.replace('_', ' ')}</p>
            {user?.department && <p className="text-xs text-gray-500">{user.department}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive('/dashboard')
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Home className="mr-3 h-5 w-5" />
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              to="/requests"
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive('/requests')
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <FileText className="mr-3 h-5 w-5" />
              Mes requêtes
            </Link>
          </li>
          {hasRole(['admin', 'academic_secretary', 'department_head']) && (
            <li>
              <Link
                to="/admin"
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive('/admin')
                    ? 'bg-[#0F4C81] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <ClipboardList className="mr-3 h-5 w-5" />
                Gestion des requêtes
              </Link>
            </li>
          )}
          {hasRole(['admin']) && (
            <li>
              <Link
                to="/admin/users"
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive('/admin/users')
                    ? 'bg-[#0F4C81] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Users className="mr-3 h-5 w-5" />
                Gestion des utilisateurs
              </Link>
            </li>
          )}
          {hasRole(['admin', 'department_head']) && (
            <li>
              <Link
                to="/admin/statistics"
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive('/admin/statistics')
                    ? 'bg-[#0F4C81] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <BarChart4 className="mr-3 h-5 w-5" />
                Statistiques
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/profile"
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive('/profile')
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <User className="mr-3 h-5 w-5" />
              Mon profil
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive('/settings')
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Settings className="mr-3 h-5 w-5" />
              Paramètres
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;