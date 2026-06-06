import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'user';

interface User {
  email: string;
  role: Role;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role, token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on initial load
    const storedUser = localStorage.getItem('canteenly_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: Role, token?: string) => {
    const newUser = { email, role, token };
    setUser(newUser);
    localStorage.setItem('canteenly_user', JSON.stringify(newUser));
    if (token) {
      localStorage.setItem('canteenly_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('canteenly_user');
    localStorage.removeItem('canteenly_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
