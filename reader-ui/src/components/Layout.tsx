import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, theme } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  AppstoreOutlined,
  HeartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const { Content, Sider } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">主页</Link>,
    },
    {
      key: '/dashboard',
      icon: <UserOutlined />,
      label: <Link to="/dashboard">仪表台</Link>,
    },
    {
      key: '/library',
      icon: <BookOutlined />,
      label: <Link to="/library">图书馆</Link>,
      children: [
        {
          key: '/library/novels',
          label: <Link to="/library/novels">小说</Link>,
        },
        {
          key: '/library/technology',
          label: <Link to="/library/technology">技术</Link>,
        },
      ],
    },
    {
      key: '/shelves',
      icon: <AppstoreOutlined />,
      label: <Link to="/shelves">书架</Link>,
      children: [
        {
          key: '/shelves/favorites',
          icon: <HeartOutlined />,
          label: <Link to="/shelves/favorites">收藏</Link>,
        },
      ],
    },

  ];

  return (
    <AntLayout className="layout" style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: token.colorBgElevated,
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: `1px solid ${token.colorBorder}`
        }}>
          {!collapsed && (
            <div style={{
              color: token.colorPrimary,
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Reader
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 32,
              height: 32,
              color: token.colorTextBase
            }}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: '16px'
          }}
        />
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header />
        <Content
          className="main-content"
          style={{
            padding: '24px',
            background: token.colorBgLayout,
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;