
import React, { useState } from 'react';
import { Layout, Menu, Button, Switch, Space, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import ResponsiveDemo from './components/ResponsiveDemo';
import './styles/global.css';

const { Header, Sider, Content } = Layout;

// 主题切换组件
const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'default');
  };
  
  return (
    <Space>
      <BulbOutlined />
      <Switch 
        checked={currentTheme === 'dark'}
        onChange={handleThemeChange}
        checkedChildren="暗色"
        unCheckedChildren="亮色"
      />
    </Space>
  );
};

// 主应用组件
const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentTheme } = useTheme();
  const {
    token: { colorBgContainer, borderRadiusLG, colorText },
  } = theme.useToken();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme={currentTheme === 'dark' ? 'dark' : 'light'}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentTheme === 'dark' ? 'white' : colorText,
          fontWeight: 'bold'
        }}>
          {collapsed ? 'R' : 'Reader'}
        </div>
        <Menu
          theme={currentTheme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: '用户管理',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: '内容管理',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: '文件上传',
            },
            {
              key: '4',
              icon: <SettingOutlined />,
              label: '系统设置',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 24,
          borderBottom: `1px solid ${currentTheme === 'dark' ? '#303030' : '#f0f0f0'}`
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: colorText
            }}
          />
          <ThemeToggle />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <ResponsiveDemo />
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
