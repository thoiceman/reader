import React from 'react';
import { Layout, Button, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CompactThemeSwitcher } from './ThemeSwitcher';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { token } = theme.useToken();
  
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
        <Button type="text" icon={<UserOutlined />} />
        <Button type="text">设置</Button>
      </div>
    </AntHeader>
  );
};

export default Header;