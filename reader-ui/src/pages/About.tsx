import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-content">
          <h1 className="about-title">关于我们</h1>
          <div className="about-description">
            <p>
              这是一个使用 React 和 TypeScript 构建的现代化 Web 应用程序示例。
              项目采用了当前最佳的开发实践和工具链。
            </p>
            <p>
              我们的技术栈包括：
            </p>
            <ul className="tech-list">
              <li>React 18 - 现代化的用户界面库</li>
              <li>TypeScript - 类型安全的 JavaScript 超集</li>
              <li>React Router - 声明式路由</li>
              <li>CSS3 - 现代化的样式和布局</li>
              <li>Create React App - 零配置的构建工具</li>
            </ul>
            <p>
              这个项目展示了如何构建一个可扩展、可维护的 React 应用程序，
              包含了组件化架构、路由管理、样式组织等核心概念。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;