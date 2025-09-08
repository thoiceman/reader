import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types/auth';

// 认证上下文接口
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<{ success: boolean; message: string }>;
  logoutAllDevices: () => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = AuthService.getToken();
        const storedUser = AuthService.getCurrentUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        // 清除可能损坏的认证信息
        await AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登录方法
  const login = (newToken: string, newUser: User) => {
    setIsLoginLoading(true);
    try {
      setToken(newToken);
      setUser(newUser);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 登出方法
  const logout = async (): Promise<{ success: boolean; message: string }> => {
    const result = await AuthService.logout();
    setToken(null);
    setUser(null);
    return result;
  };

  // 全局登出方法
  const logoutAllDevices = async (): Promise<{ success: boolean; message: string }> => {
    const result = await AuthService.logoutAllDevices();
    setToken(null);
    setUser(null);
    return result;
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isLoginLoading,
    login,
    logout,
    logoutAllDevices,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};