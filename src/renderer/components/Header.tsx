import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  onImport: () => void;
  onBulkEditToggle: () => void;
  onReset: () => void;
  onShowHelp: () => void;

  bulkEditMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onExport, onImport, onBulkEditToggle, onReset, onShowHelp, bulkEditMode }) => {
  const [patchInfo, setPatchInfo] = useState<{ version: string; patchNotesUrl: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadPatchInfo();
  }, []);

  const loadPatchInfo = async () => {
    try {
      const info = await window.electronAPI.getPatchInfo();
      setPatchInfo(info);
    } catch (err) {
      console.error('Failed to load patch info:', err);
    }
  };

  const openPatchNotes = () => {
    if (patchInfo?.patchNotesUrl) {
      window.open(patchInfo.patchNotesUrl, '_blank');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>🏆 League Skin Tracker</h1>
          {patchInfo && (
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.25rem' }}>
              Patch {patchInfo.version}
              {patchInfo.patchNotesUrl && (
                <button
                  onClick={openPatchNotes}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginLeft: '0.5rem'
                  }}
                >
                  View Patch Notes
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onRefresh}>
            🔄 Refresh Champions
          </button>
          <button className="btn btn-secondary" onClick={onExport}>
            📤 Export Data
          </button>
          <button className="btn btn-secondary" onClick={onImport}>
            📥 Import Data
          </button>

          <button className="btn btn-danger" onClick={onReset}>
            🗑️ Reset All
          </button>
          <button 
            className={`btn ${bulkEditMode ? 'btn-danger' : 'btn-primary'}`}
            onClick={onBulkEditToggle}
          >
            {bulkEditMode ? '❌ Cancel Bulk Edit' : '✏️ Bulk Edit'}
          </button>
          <button className="btn btn-secondary" onClick={onShowHelp} title="Keyboard Shortcuts (Ctrl/Cmd + H)">
            ❓ Help
          </button>
          <button className="btn btn-secondary" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 