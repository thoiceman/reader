import { useState, useEffect, useCallback } from 'react';
import { 
  ThemeMode, 
  CustomThemeVars, 
  themeConfigs, 
  DEFAULT_THEME_MODE, 
  THEME_STORAGE_KEY 
} from '../config/theme';
import { ThemeContextType } from '../contexts/ThemeContext';
import '../styles/theme-animations.css';

// 从本地存储获取主题模式
const getStoredThemeMode = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored as ThemeMode;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return DEFAULT_THEME_MODE;
};

// 保存主题模式到本地存储
const saveThemeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

// 检测系统主题偏好
const getSystemThemePreference = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return DEFAULT_THEME_MODE;
};

// 主题管理 Hook
export const useThemeManager = (): ThemeContextType => {
  // 初始化主题模式，优先使用本地存储，其次使用系统偏好
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = getStoredThemeMode();
    return stored !== DEFAULT_THEME_MODE ? stored : getSystemThemePreference();
  });

  // 获取当前主题变量
  const themeVars: CustomThemeVars = themeConfigs[themeMode];

  // 判断是否为暗色主题
  const isDark = themeMode === 'dark';

  // 设置主题模式
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemeMode(mode);
    
    // 更新 HTML 根元素的 data-theme 属性，便于 CSS 样式控制
    document.documentElement.setAttribute('data-theme', mode);
    
    // 更新 body 的背景色，提供更好的视觉体验
    document.body.style.backgroundColor = themeConfigs[mode].colorBgBase;
  }, []);

  // 切换主题模式
  const toggleTheme = useCallback(() => {
    // 添加过渡动画类
    document.documentElement.classList.add('theme-transition');
    
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    
    // 动画完成后移除过渡类
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }, [themeMode, setThemeMode]);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // 只有在没有用户手动设置时才跟随系统主题
        const storedTheme = getStoredThemeMode();
        if (storedTheme === DEFAULT_THEME_MODE) {
          const systemTheme = e.matches ? 'dark' : 'light';
          setThemeModeState(systemTheme);
          document.documentElement.setAttribute('data-theme', systemTheme);
          document.body.style.backgroundColor = themeConfigs[systemTheme].colorBgBase;
        }
      };

      // 添加监听器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      } else {
        // 兼容旧版浏览器
        mediaQuery.addListener(handleSystemThemeChange);
      }

      // 清理监听器
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
          mediaQuery.removeListener(handleSystemThemeChange);
        }
      };
    }
  }, []);

  // 初始化时设置 HTML 属性和 body 背景色
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.style.backgroundColor = themeVars.colorBgBase;
    
    // 添加过渡动画类
    document.documentElement.classList.add('theme-transition');
    
    return () => {
      document.documentElement.classList.remove('theme-transition');
    };
  }, [themeMode, themeVars.colorBgBase]);

  return {
    themeMode,
    themeVars,
    toggleTheme,
    setThemeMode,
    isDark,
  };
};