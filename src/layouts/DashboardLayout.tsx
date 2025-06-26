import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import MobileNav from '../components/navigation/MobileNav';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Menu, X } from 'lucide-react';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-30 border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4">
              <h1 className="text-lg font-semibold text-[#0F4C81]">IUT Douala</h1>
              <p className="text-xs text-gray-500">Système de Requêtes</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <Sidebar />
      </div>

      {/* Sidebar (Mobile) */}
      <div 
        className={`lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Notifications Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white z-50 transform transition-transform shadow-lg ${
          notificationsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <NotificationsPanel onClose={toggleNotifications} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <Header toggleNotifications={toggleNotifications} />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-30">
        <MobileNav />
      </div>
    </div>
  );
};

export default DashboardLayout;