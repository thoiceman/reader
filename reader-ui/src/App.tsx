import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from './contexts/ThemeContext';
import { useThemeManager } from './hooks/useThemeManager';
import { getAntdThemeConfig } from './config/theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Shelves from './pages/Shelves';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

// 应用主体组件
const AppContent: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/*" element={<Library />} />
          <Route path="/shelves" element={<Shelves />} />
          <Route path="/shelves/*" element={<Shelves />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
};

// 主题包装组件
const AppWithTheme: React.FC = () => {
  const themeManager = useThemeManager();
  
  // 获取 Ant Design 主题配置
  const antdThemeConfig = getAntdThemeConfig(themeManager.themeVars);
  
  // 根据主题模式设置算法
  const themeAlgorithm = themeManager.isDark 
    ? [theme.darkAlgorithm] 
    : [theme.defaultAlgorithm];

  return (
    <ThemeProvider value={themeManager}>
      <ConfigProvider 
        locale={zhCN}
        theme={{
          ...antdThemeConfig,
          algorithm: themeAlgorithm,
        }}
      >
        <AppContent />
      </ConfigProvider>
    </ThemeProvider>
  );
};

// 根应用组件
function App() {
  return <AppWithTheme />;
}

export default App;
