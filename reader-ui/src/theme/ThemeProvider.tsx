import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { customTheme, darkTheme, compactTheme } from './index';
import type { ThemeConfig } from 'antd';

// 主题类型定义
export type ThemeType = 'default' | 'dark' | 'compact';

// 主题上下文类型
interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeConfig: ThemeConfig;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题映射
const themeMap: Record<ThemeType, ThemeConfig> = {
  default: customTheme,
  dark: darkTheme,
  compact: compactTheme,
};

// 主题提供器属性
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeType;
}

// 主题提供器组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(defaultTheme);
  
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    // 可以在这里添加本地存储逻辑
    localStorage.setItem('antd-theme', theme);
  };
  
  const themeConfig = themeMap[currentTheme];
  
  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    themeConfig,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider 
        theme={themeConfig}
        locale={zhCN}
        componentSize="middle"
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// 使用主题的 Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;