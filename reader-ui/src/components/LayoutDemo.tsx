import React, { useState } from 'react';
import { Card, Typography, Space, Button, Tag, theme } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  PlusOutlined,
  SearchOutlined,
  BellOutlined
} from '@ant-design/icons';
import Layout from './Layout';
import type { MenuItem, NavbarAction, UserInfo } from './Layout';
import { useTheme } from '../theme/ThemeProvider';

const { Title, Paragraph, Text } = Typography;

const LayoutDemo: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // 侧边栏菜单配置
  const menuItems: MenuItem[] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => console.log('点击首页')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'user-list',
          label: '用户列表',
          onClick: () => console.log('点击用户列表')
        },
        {
          key: 'user-roles',
          label: '角色管理',
          onClick: () => console.log('点击角色管理')
        }
      ]
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'articles',
          label: '文章管理',
          onClick: () => console.log('点击文章管理')
        },
        {
          key: 'categories',
          label: '分类管理',
          onClick: () => console.log('点击分类管理')
        }
      ]
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: '团队协作',
      onClick: () => console.log('点击团队协作')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => console.log('点击系统设置')
    }
  ];

  // 导航栏操作按钮配置
  const navbarActions: NavbarAction[] = [
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: '搜索',
      type: 'text',
      onClick: () => console.log('点击搜索')
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      type: 'text',
      onClick: () => console.log('点击通知')
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: '新建',
      type: 'primary',
      onClick: () => console.log('点击新建')
    }
  ];

  // 用户信息配置
  const userInfo: UserInfo = {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
  };

  // Logo组件
  const Logo = () => {
    const { token } = theme.useToken();
    const { currentTheme } = useTheme();
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        color: currentTheme === 'dark' ? token.colorTextLightSolid : token.colorText,
        fontSize: collapsed ? 14 : 16,
        fontWeight: 'bold'
      }}>
        {collapsed ? 'R' : 'Reader UI'}
      </div>
    );
  };

  return (
    <Layout
      sidebarProps={{
        collapsed,
        onCollapse: setCollapsed,
        menuItems,
        logo: <Logo />,
        width: 256,
        collapsedWidth: 80
      }}
      navbarProps={{
        title: 'Layout 组件示例',
        actions: navbarActions,
        userInfo,
        showThemeToggle: true,
        showSidebarToggle: true,
        height: 64
      }}
      contentProps={{
        padding: 24,
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      {/* 主要内容区域 */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>Layout 组件演示</Title>
          <Paragraph>
            这是一个完整的 Layout 组件示例，展示了如何使用侧边栏、导航栏和内容区域。
          </Paragraph>
        </Card>

        <Card title="组件特性" extra={<Tag color="blue">功能完整</Tag>}>
          <Space direction="vertical" size="middle">
            <div>
              <Text strong>🎯 侧边栏功能：</Text>
              <ul>
                <li>支持折叠/展开</li>
                <li>多级菜单导航</li>
                <li>自定义 Logo 区域</li>
                <li>明暗主题切换</li>
              </ul>
            </div>
            
            <div>
              <Text strong>🎯 导航栏功能：</Text>
              <ul>
                <li>自定义标题显示</li>
                <li>操作按钮组</li>
                <li>用户信息下拉菜单</li>
                <li>主题切换按钮</li>
              </ul>
            </div>
            
            <div>
              <Text strong>🎯 内容区域功能：</Text>
              <ul>
                <li>自适应布局</li>
                <li>可配置内边距</li>
                <li>响应式设计</li>
                <li>主题样式同步</li>
              </ul>
            </div>
          </Space>
        </Card>

        <Card title="使用方法">
          <Paragraph>
            <Text code>Layout</Text> 组件提供了灵活的配置选项，你可以根据需要自定义各个部分的行为和样式。
          </Paragraph>
          <Space wrap>
            <Button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '展开' : '折叠'}侧边栏
            </Button>
            <Button onClick={() => console.log('当前配置:', { collapsed, menuItems, navbarActions })}>
              查看配置
            </Button>
          </Space>
        </Card>
      </Space>
    </Layout>
  );
};

export default LayoutDemo;