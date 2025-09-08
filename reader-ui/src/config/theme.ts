import { ThemeConfig } from 'antd';

// 主题类型定义
export type ThemeMode = 'light' | 'dark';

// 自定义主题变量
export interface CustomThemeVars {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgBase: string;
  colorBgContainer: string;
  colorBgElevated: string;
  colorBorder: string;
  colorBorderSecondary: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorTextQuaternary: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  controlHeight: number;
  padding: number;
  margin: number;
}

// 白天主题配置
export const lightTheme: CustomThemeVars = {
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorBgBase: '#ffffff',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  colorText: '#000000d9',
  colorTextSecondary: '#00000073',
  colorTextTertiary: '#00000040',
  colorTextQuaternary: '#00000026',
  borderRadius: 6,
  fontSize: 14,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  lineHeight: 1.5714285714285714,
  controlHeight: 32,
  padding: 16,
  margin: 16,
};

// 黑夜主题配置
export const darkTheme: CustomThemeVars = {
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorBgBase: '#000000',
  colorBgContainer: '#141414',
  colorBgElevated: '#1f1f1f',
  colorBorder: '#424242',
  colorBorderSecondary: '#303030',
  colorText: '#ffffffd9',
  colorTextSecondary: '#ffffff73',
  colorTextTertiary: '#ffffff40',
  colorTextQuaternary: '#ffffff26',
  borderRadius: 6,
  fontSize: 14,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  lineHeight: 1.5714285714285714,
  controlHeight: 32,
  padding: 16,
  margin: 16,
};

// 将自定义主题变量转换为 Ant Design ThemeConfig
export const getAntdThemeConfig = (themeVars: CustomThemeVars): ThemeConfig => {
  return {
    token: {
      colorPrimary: themeVars.colorPrimary,
      colorSuccess: themeVars.colorSuccess,
      colorWarning: themeVars.colorWarning,
      colorError: themeVars.colorError,
      colorInfo: themeVars.colorInfo,
      colorBgBase: themeVars.colorBgBase,
      colorBgContainer: themeVars.colorBgContainer,
      colorBgElevated: themeVars.colorBgElevated,
      colorBorder: themeVars.colorBorder,
      colorBorderSecondary: themeVars.colorBorderSecondary,
      colorText: themeVars.colorText,
      colorTextSecondary: themeVars.colorTextSecondary,
      colorTextTertiary: themeVars.colorTextTertiary,
      colorTextQuaternary: themeVars.colorTextQuaternary,
      borderRadius: themeVars.borderRadius,
      fontSize: themeVars.fontSize,
      fontFamily: themeVars.fontFamily,
      lineHeight: themeVars.lineHeight,
      controlHeight: themeVars.controlHeight,
      padding: themeVars.padding,
      margin: themeVars.margin,
    },
    algorithm: undefined, // 将在 ThemeProvider 中根据主题模式设置
  };
};

// 主题配置映射
export const themeConfigs: Record<ThemeMode, CustomThemeVars> = {
  light: lightTheme,
  dark: darkTheme,
};

// 默认主题模式
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

// 本地存储键名
export const THEME_STORAGE_KEY = 'reader-theme-mode';