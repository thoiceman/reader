import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeMode, CustomThemeVars } from '../config/theme';

// 主题上下文类型定义
interface ThemeContextType {
  themeMode: ThemeMode;
  themeVars: CustomThemeVars;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者属性类型
interface ThemeProviderProps {
  children: ReactNode;
  value: ThemeContextType;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, value }) => {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题上下文的 Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 导出上下文类型供其他组件使用
export type { ThemeContextType };