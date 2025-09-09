import React, { ReactNode } from 'react';
import { Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { MenuItem } from './index';
import { useTheme } from '../../theme/ThemeProvider';

type MenuItemType = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  menuItems?: MenuItem[];
  logo?: ReactNode;
  width?: number;
  collapsedWidth?: number;
  theme?: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  menuItems = [],
  logo,
  theme: sidebarTheme
}) => {
  const { token } = theme.useToken();
  const { currentTheme } = useTheme();
  
  // 如果没有指定侧边栏主题，则根据全局主题自动选择
  const effectiveTheme = sidebarTheme || (currentTheme === 'dark' ? 'dark' : 'light');

  const handleMenuClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  const renderMenuItems = (items: MenuItem[]): MenuItemType[] => {
    return items.map(item => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? renderMenuItems(item.children) : undefined,
      onClick: () => handleMenuClick(item)
    }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo区域 */}
      {logo && (
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            borderBottom: `1px solid ${effectiveTheme === 'dark' ? token.colorBorderSecondary : token.colorBorder}`,
            backgroundColor: effectiveTheme === 'dark' ? token.colorBgContainer : token.colorBgLayout,
            transition: 'all 0.2s'
          }}
        >
          {logo}
        </div>
      )}
      
      {/* 菜单区域 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          theme={effectiveTheme}
          mode="inline"
          inlineCollapsed={collapsed}
          items={renderMenuItems(menuItems)}
          style={{
            border: 'none',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;