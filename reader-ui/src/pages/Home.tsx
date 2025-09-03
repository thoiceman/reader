import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">欢迎来到 React 应用</h1>
          <p className="hero-subtitle">
            这是一个使用现代 React 开发最佳实践构建的示例应用
          </p>
          <div className="hero-features">
            <div className="feature-card">
              <h3>TypeScript 支持</h3>
              <p>完整的类型安全和开发体验</p>
            </div>
            <div className="feature-card">
              <h3>React Router</h3>
              <p>现代化的客户端路由解决方案</p>
            </div>
            <div className="feature-card">
              <h3>组件化架构</h3>
              <p>可复用的组件和清晰的项目结构</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;