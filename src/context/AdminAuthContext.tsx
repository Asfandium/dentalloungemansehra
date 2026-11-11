import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi, type AdminUser } from '../services/adminApi';

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isHelper: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dl_admin_user');
    const token = localStorage.getItem('dl_admin_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // bad json
      }
      // Re-verify in background
      adminApi.getMe()
        .then((fresh) => {
          setUser(fresh);
          localStorage.setItem('dl_admin_user', JSON.stringify(fresh));
        })
        .catch(() => {
          // handled by request 401
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await adminApi.login(email, pass);
    setUser(res.user);
  };

  const logout = () => {
    adminApi.logout();
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isAdmin = user?.role === 'Admin' || isSuperAdmin;
  const isHelper = user?.role === 'Helper';

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isSuperAdmin,
        isAdmin,
        isHelper,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
