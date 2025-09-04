import React, { useState } from 'react';
import { Layout, Button, theme, App } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CompactThemeSwitcher } from './ThemeSwitcher';
import UserSettingsModal from './UserSettingsModal';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { user, logout } = useAuth();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleLogout = () => {
    modal.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 使用认证上下文清除用户认证信息
        logout();
        // 跳转到登录页面
        navigate('/login');
      },
    });
  };

  const handleSettingsClick = () => {
    setSettingsVisible(true);
  };

  const handleSettingsCancel = () => {
    setSettingsVisible(false);
  };
  


  
  return (
    <AntHeader 
      className="header" 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: token.colorBgContainer,
        padding: '0 24px',
        boxShadow: `0 1px 4px ${token.colorBorderSecondary}`,
        zIndex: 10,
        borderBottom: `1px solid ${token.colorBorder}`
      }}
    >
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '500',
        color: token.colorText
      }}>
        搜索书籍或作者...
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <CompactThemeSwitcher />
        <Button 
          type="text" 
          icon={<UserOutlined />} 
          onClick={handleSettingsClick}
          style={{ color: token.colorText }}
        >
          {user?.name || '用户'}
        </Button>
        <Button 
          type="text" 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ 
            color: token.colorError,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          退出登录
        </Button>
      </div>
      <UserSettingsModal 
        visible={settingsVisible}
        onCancel={handleSettingsCancel}
      />
    </AntHeader>
  );
};

export default Header;