
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { RequestProvider } from './contexts/RequestContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import NewRequest from './pages/NewRequest';
import RequestDetails from './pages/RequestDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import NotFound from './pages/NotFound';

// Guards
import PrivateRoute from './components/guards/PrivateRoute';
import RoleRoute from './components/guards/RoleRoute';
import CreateUser from './pages/admin/CreateUser';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
      <RequestProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Dashboard Routes */}
              <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/requests/new" element={<NewRequest />} />
                <Route path="/requests/:id" element={<RequestDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/AdminDashboard" 
                  element={
                    <RoleRoute roles={['admin', 'academic_secretary', 'department_head']}>
                      <AdminDashboard />
                    </RoleRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <RoleRoute roles={['admin']}>
                      <UserManagement />
                    </RoleRoute>
                  } 
                />

                <Route 
                  path="/admin/users/create" 
                  element={
                    <RoleRoute roles={['admin']}>
                      <CreateUser />
                    </RoleRoute>
                  } 
                />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </RequestProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
