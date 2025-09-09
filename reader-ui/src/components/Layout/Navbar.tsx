import React, { ReactNode, useState, useEffect } from 'react';
import { Button, Space, Avatar, Dropdown, theme } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { NavbarAction, UserInfo } from './index';
import { useTheme } from '../../theme/ThemeProvider';

interface NavbarProps {
  title?: ReactNode;
  actions?: NavbarAction[];
  userInfo?: UserInfo;
  showThemeToggle?: boolean;
  height?: number;
  // 侧边栏控制
  showSidebarToggle?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  actions = [],
  userInfo,
  showThemeToggle = true,
  height = 64,
  showSidebarToggle = false,
  sidebarCollapsed = false,
  onSidebarToggle
}) => {
  const { token } = theme.useToken();
  const { currentTheme, setTheme } = useTheme();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 响应式断点
  const isMobile = screenWidth < 768;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'default' : 'dark');
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const renderActions = () => {
    return actions.map(action => (
      <Button
        key={action.key}
        type={action.type || 'default'}
        icon={action.icon}
        onClick={action.onClick}
        size="middle"
      >
        {action.label}
      </Button>
    ));
  };

  return (
    <div
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 24px',
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        overflow: 'hidden'
      }}
    >
      {/* 左侧标题区域 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 侧边栏折叠按钮 */}
        {showSidebarToggle && (
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onSidebarToggle}
            style={{
              marginRight: title ? 16 : 0,
              fontSize: 16,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: token.borderRadius,
              transition: 'all 0.2s ease-in-out',
              color: token.colorText
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = token.colorBgTextHover;
              e.currentTarget.style.color = token.colorPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = token.colorText;
            }}
            title={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          />
        )}
        
        {title && (
          <div
            style={{
              fontSize: isMobile ? 16 : 18,
              fontWeight: 600,
              color: token.colorText,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: isMobile ? '120px' : 'none'
            }}
          >
            {title}
          </div>
        )}
      </div>

      {/* 右侧操作区域 */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: '0 0 auto' }}>
        <Space size={isMobile ? 'small' : 'middle'}>
          {/* 自定义操作按钮 - 移动端只显示重要按钮 */}
          {isMobile ? 
            actions.filter(action => action.type === 'primary').map(action => (
              <Button
                key={action.key}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
                size="small"
              />
            )) :
            renderActions()
          }
          
          {/* 主题切换按钮 */}
          {showThemeToggle && (
            <Button
              type="text"
              onClick={toggleTheme}
              icon={
                currentTheme === 'dark' ? (
                  <span>🌞</span>
                ) : (
                  <span>🌙</span>
                )
              }
              title={`切换到${currentTheme === 'dark' ? '浅色' : '深色'}主题`}
              size={isMobile ? 'small' : 'middle'}
            />
          )}
          
          {/* 用户信息 */}
          {userInfo && (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: isMobile ? '2px 4px' : '4px 8px',
                  borderRadius: token.borderRadius,
                  transition: 'background-color 0.2s'
                }}
              >
                <Avatar
                  size="small"
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  style={{ marginRight: isMobile ? 4 : 8 }}
                />
                {!isMobile && (
                  <span style={{ color: token.colorText }}>
                    {userInfo.name}
                  </span>
                )}
              </div>
            </Dropdown>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Navbar;