import React, { ReactNode } from 'react';
import { Layout as AntLayout } from 'antd';
import Sidebar from '/Users/xuthomas/Desktop/reader/reader-ui/src/components/Layout/Sidebar';
import Navbar from '/Users/xuthomas/Desktop/reader/reader-ui/src/components/Layout/Navbar';
import Content from '/Users/xuthomas/Desktop/reader/reader-ui/src/components/Layout/Content';

const { Sider, Header, Content: AntContent } = AntLayout;

export interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface UserInfo {
  name: string;
  avatar?: string;
  email?: string;
}

export interface NavbarAction {
  key: string;
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'text' | 'link';
}

export interface LayoutProps {
  // 侧边栏配置
  sidebarProps?: {
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    menuItems?: MenuItem[];
    logo?: ReactNode;
    width?: number;
    collapsedWidth?: number;
    theme?: 'light' | 'dark';
  };
  
  // 导航栏配置
  navbarProps?: {
    title?: ReactNode;
    actions?: NavbarAction[];
    userInfo?: UserInfo;
    showThemeToggle?: boolean;
    height?: number;
    // 侧边栏控制按钮
    showSidebarToggle?: boolean;
  };
  
  // 内容区域配置
  contentProps?: {
    padding?: number | string;
    background?: string;
    minHeight?: number | string;
  };
  
  // 子组件
  children: ReactNode;
  
  // 布局配置
  hasSider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({
  sidebarProps,
  navbarProps,
  contentProps,
  children,
  hasSider = true,
  className,
  style
}) => {

  return (
    <AntLayout className={className} style={{ minHeight: '100vh', ...style }}>
      {hasSider && sidebarProps && (
        <Sider
          collapsed={sidebarProps.collapsed}
          onCollapse={sidebarProps.onCollapse}
          width={sidebarProps.width || 256}
          collapsedWidth={sidebarProps.collapsedWidth || 80}
          theme={sidebarProps.theme === 'light' ? 'light' : 'dark'}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Sidebar {...sidebarProps} />
        </Sider>
      )}
      
      <AntLayout
        style={{
          marginLeft: hasSider && sidebarProps ? 
            (sidebarProps.collapsed ? (sidebarProps.collapsedWidth || 80) : (sidebarProps.width || 256)) : 0
        }}
      >
        {navbarProps && (
          <Header style={{ padding: 0, height: navbarProps.height || 64 }}>
            <Navbar 
              {...navbarProps}
              sidebarCollapsed={sidebarProps?.collapsed}
              onSidebarToggle={() => sidebarProps?.onCollapse?.(!sidebarProps?.collapsed)}
            />
          </Header>
        )}
        
        <AntContent>
          <Content {...contentProps}>
            {children}
          </Content>
        </AntContent>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
export { Sidebar, Navbar, Content };