import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onImport: () => void;
  onExport: () => void;
  onResetAll: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onImport,
  onExport,
  onResetAll
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-brand">
            <h1>League Skin Tracker</h1>
            <div className="patch-info">
              <span>Patch: 15.15.1</span>
              <span className="separator"></span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={onImport} className="btn btn-secondary">
            Import
          </button>
          <button onClick={onExport} className="btn btn-secondary">
            Export
          </button>

          <button onClick={onResetAll} className="btn btn-danger">
            Delete All Data
          </button>
          <button onClick={toggleTheme} className="btn btn-secondary">
            {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 