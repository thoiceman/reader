import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">React App</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">首页</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">关于</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">联系</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;