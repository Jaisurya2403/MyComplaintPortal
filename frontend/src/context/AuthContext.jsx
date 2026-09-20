import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, usersApi, deptAdminApi } from '../api/apiClient';

const defaultAuthContext = {
  user: null,
  token: null,
  isAuthenticated: false,
  activeRole: 'CITIZEN',
  theme: 'light',
  login: async () => 'CITIZEN',
  logout: () => {},
  signup: async () => {},
  updateUser: async () => {},
  setTheme: () => {},
  toggleTheme: () => {},
  setActiveRole: () => {},
};

const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mcp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mcp_jwt') || null;
  });

  const [activeRole, setActiveRole] = useState(user?.role || 'CITIZEN');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mcp_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('mcp_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('mcp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mcp_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const data = await authApi.login(normalizedEmail, password);
    if (!data || !data.token) {
      throw new Error(data?.message || 'Invalid email or password. Access denied.');
    }
    const apiRole = data.role || 'CITIZEN';
    const newUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      profileImage: data.profileImageUrl,
      role: apiRole,
      emailVerified: data.emailVerified,
    };
    setUser(newUser);
    setToken(data.token);
    setActiveRole(apiRole);
    if (data.token) {
      localStorage.setItem('mcp_jwt', data.token);
    }
    return apiRole;
  };

  const signup = async (name, email, phone, password = 'mysecretpassword') => {
    const data = await authApi.signup(name, email, phone, password);
    const newUser = {
      id: data.userId,
      name: data.name || name,
      email: data.email || email,
      phone,
      location: 'Coimbatore, Tamil Nadu',
      role: data.role || 'CITIZEN',
    };
    setUser(newUser);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('mcp_jwt', data.token);
    }
    setActiveRole(newUser.role);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mcp_user');
    localStorage.removeItem('mcp_jwt');
    sessionStorage.removeItem('mcp_chat_history');
    if (user?.id) {
      sessionStorage.removeItem(`mcp_chat_history_${user.id}`);
    }
  };

  const updateUser = async (data) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('mcp_user', JSON.stringify(updatedUser));

    const identifier = user.id || user.userId || user.email;
    if (identifier) {
      try {
        await authApi.updateProfile(identifier, {
          name: updatedUser.name,
          phone: updatedUser.phone,
          location: updatedUser.location,
          profileImageUrl: updatedUser.profileImage || updatedUser.profileImageUrl,
        });
        await usersApi.update(identifier, {
          userId: identifier,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          location: updatedUser.location,
          profileImageUrl: updatedUser.profileImage || updatedUser.profileImageUrl,
        });
        if (updatedUser.role === 'SUPER_ADMIN' || updatedUser.role === 'DEPARTMENT_ADMIN' || updatedUser.role === 'ADMIN' || updatedUser.email === 'jaisurya7482@gmail.com') {
          await deptAdminApi.updateAdmin(identifier, {
            username: updatedUser.name,
            email: updatedUser.email,
            designation: updatedUser.designation,
            badgeId: updatedUser.badgeId,
            grantLevel: (updatedUser.role === 'SUPER_ADMIN' || updatedUser.email === 'jaisurya7482@gmail.com') ? 'Super Admin' : 'Department Admin',
          });
        }
      } catch (e) {
        console.warn('Backend user profile update note:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        updateUser,
        activeRole,
        setActiveRole,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
};
