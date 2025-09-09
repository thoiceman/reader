import React, { ReactNode } from 'react';
import { theme } from 'antd';

interface ContentProps {
  children: ReactNode;
  padding?: number | string;
  background?: string;
  minHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const Content: React.FC<ContentProps> = ({
  children,
  padding = 24,
  background,
  minHeight = 'calc(100vh - 64px)',
  className,
  style
}) => {
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    background: background || token.colorBgLayout,
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    borderRadius: token.borderRadius,
    overflow: 'auto',
    ...style
  };

  return (
    <div className={className} style={contentStyle}>
      {children}
    </div>
  );
};

export default Content;