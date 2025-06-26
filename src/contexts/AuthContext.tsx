import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
type UserRole = 'student' | 'teacher' | 'department_head' | 'academic_secretary' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  matricule?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('acadRequestUser');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock login - in a real app, this would be an API call
      // This is just for demonstration purposes
      let mockUser: User;
      
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
      } else if (email.includes('teacher')) {
        mockUser = {
          id: '2',
          name: 'Teacher User',
          email: email,
          role: 'teacher',
          department: 'Computer Science'
        };
      } else if (email.includes('head')) {
        mockUser = {
          id: '3',
          name: 'Department Head',
          email: email,
          role: 'department_head',
          department: 'Computer Science'
        };
      } else if (email.includes('secretary')) {
        mockUser = {
          id: '4',
          name: 'Academic Secretary',
          email: email,
          role: 'academic_secretary'
        };
      } else {
        mockUser = {
          id: '5',
          name: 'Student User',
          email: email,
          role: 'student',
          matricule: '19S2189',
          department: 'Computer Science'
        };
      }
      
      // Save user to localStorage
      localStorage.setItem('acadRequestUser', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('acadRequestUser');
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};