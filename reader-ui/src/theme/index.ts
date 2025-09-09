import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// 自定义主题配置
export const customTheme: ThemeConfig = {
  // 使用 Ant Design 5 的算法
  algorithm: theme.defaultAlgorithm,
  
  // 主题令牌配置
  token: {
    // 主色
    colorPrimary: '#1890ff',
    // 成功色
    colorSuccess: '#52c41a',
    // 警告色
    colorWarning: '#faad14',
    // 错误色
    colorError: '#ff4d4f',
    // 信息色
    colorInfo: '#1890ff',
    
    // 字体配置
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    
    // 圆角配置
    borderRadius: 6,
    
    // 间距配置
    sizeUnit: 4,
    sizeStep: 4,
    
    // 阴影配置
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  
  // 组件级别的主题配置
  components: {
    Button: {
      colorPrimary: '#1890ff',
      algorithm: true, // 启用算法
    },
    Layout: {
      headerBg: '#001529',
      siderBg: '#001529',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
  },
};

// 暗色主题配置
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...customTheme.token,
    colorBgContainer: '#141414',
  },
  components: {
    ...customTheme.components,
  },
};

// 紧凑主题配置
export const compactTheme: ThemeConfig = {
  algorithm: theme.compactAlgorithm,
  token: {
    ...customTheme.token,
  },
  components: {
    ...customTheme.components,
  },
};

export default customTheme;