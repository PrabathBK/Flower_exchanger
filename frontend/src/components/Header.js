import React from 'react';
import './Header.css';
import { FaLeaf } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FaLeaf className="logo-icon" />
          <h1>Flower Exchange</h1>
        </div>
        <p className="tagline">High-Performance Trading System</p>
      </div>
      <div className="header-decoration">
        <div className="flower">🌸</div>
        <div className="flower">🌺</div>
        <div className="flower">🌷</div>
        <div className="flower">🌹</div>
        <div className="flower">🪷</div>
      </div>
    </header>
  );
}

export default Header;
