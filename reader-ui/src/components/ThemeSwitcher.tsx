import React from 'react';
import { Button, Switch, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

// 主题切换器属性类型
interface ThemeSwitcherProps {
  type?: 'button' | 'switch' | 'icon';
  size?: 'small' | 'middle' | 'large';
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// 主题切换器组件
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  type = 'button',
  size = 'middle',
  showLabel = false,
  className,
  style,
}) => {
  const { toggleTheme, isDark } = useTheme();

  // 获取主题图标
  const getThemeIcon = () => {
    return isDark ? <SunOutlined /> : <MoonOutlined />;
  };

  // 获取主题标签
  const getThemeLabel = () => {
    return isDark ? '切换到白天模式' : '切换到夜间模式';
  };

  // 获取当前主题文本
  const getCurrentThemeText = () => {
    return isDark ? '夜间模式' : '白天模式';
  };

  // 渲染按钮类型
  if (type === 'button') {
    return (
      <Tooltip title={getThemeLabel()}>
        <Button
          type="text"
          size={size}
          icon={getThemeIcon()}
          onClick={toggleTheme}
          className={`theme-switcher-button theme-ripple-effect ${className || ''}`}
          style={style}
        >
          {showLabel && getCurrentThemeText()}
        </Button>
      </Tooltip>
    );
  }

  // 渲染开关类型
  if (type === 'switch') {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
        <SunOutlined style={{ color: isDark ? '#666' : '#faad14' }} />
        <Tooltip title={getThemeLabel()}>
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            size={size === 'large' ? 'default' : 'small'}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            className="theme-switcher-button"
          />
        </Tooltip>
        <MoonOutlined style={{ color: isDark ? '#1677ff' : '#666' }} />
        {showLabel && (
          <span style={{ marginLeft: '8px', fontSize: '14px' }}>
            {getCurrentThemeText()}
          </span>
        )}
      </div>
    );
  }

  // 渲染图标类型
  if (type === 'icon') {
    return (
      <Tooltip title={getThemeLabel()}>
        <Button
          type="text"
          size={size}
          icon={getThemeIcon()}
          onClick={toggleTheme}
          className={`theme-switcher-button theme-icon-rotate ${className || ''}`}
          style={{
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
            ...style,
          }}
        />
      </Tooltip>
    );
  }

  return null;
};

// 高级主题切换器组件（带更多选项）
export const AdvancedThemeSwitcher: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();

  const themeOptions = [
    {
      key: 'light',
      label: '白天模式',
      icon: <SunOutlined />,
      description: '明亮清晰的界面风格',
    },
    {
      key: 'dark',
      label: '夜间模式', 
      icon: <MoonOutlined />,
      description: '护眼的深色界面风格',
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {themeOptions.map((option) => (
        <Tooltip key={option.key} title={option.description}>
          <Button
            type={themeMode === option.key ? 'primary' : 'default'}
            icon={option.icon}
            onClick={() => setThemeMode(option.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {option.label}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

// 紧凑型主题切换器
export const CompactThemeSwitcher: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Tooltip title={isDark ? '切换到白天模式' : '切换到夜间模式'}>
      <Button
        type="text"
        size="small"
        onClick={toggleTheme}
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.3s ease',
        }}
      >
        {isDark ? (
          <SunOutlined style={{ fontSize: '16px', color: '#faad14' }} />
        ) : (
          <MoonOutlined style={{ fontSize: '16px', color: '#1677ff' }} />
        )}
      </Button>
    </Tooltip>
  );
};

export default ThemeSwitcher;