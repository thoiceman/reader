import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useThemeManager } from './hooks/useThemeManager';
import { getAntdThemeConfig } from './config/theme';
import { store } from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Library from './pages/Library';
import Shelves from './pages/Shelves';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

// 应用主体组件
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 认证相关路由 - 不需要认证 */}
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        
        {/* 主应用路由 - 需要认证 */}
        <Route path="/*" element={
          <ProtectedRoute requireAuth={true}>
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
          </ProtectedRoute>
        } />
      </Routes>
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
        <AntdApp>
          <AppContent />
        </AntdApp>
      </ConfigProvider>
    </ThemeProvider>
  );
};

// 根应用组件
function App() {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <AppWithTheme />
      </AuthProvider>
    </ReduxProvider>
  );
}

export default App;
