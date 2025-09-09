
import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import LayoutDemo from './components/LayoutDemo';
import './styles/global.css';

// 主应用组件
const AppContent: React.FC = () => {
  return <LayoutDemo />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
