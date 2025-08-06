import React, { useState, useEffect } from 'react';

interface KeyboardShortcutsProps {
  onQuickFillSkin: () => void;
  onQuickFillShard: () => void;
  onReset: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onQuickFillSkin,
  onQuickFillShard,
  onReset
}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onQuickFillSkin();
          }
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onQuickFillShard();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onReset();
          }
          break;
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onQuickFillSkin, onQuickFillShard, onReset]);

  if (!showShortcuts) {
    return null;
  }

  return (
    <div className="keyboard-shortcuts">
      <div className="shortcuts-header">
        <h3>Keyboard Shortcuts</h3>
        <button 
          className="close-btn"
          onClick={() => setShowShortcuts(false)}
        >
          ✕
        </button>
      </div>
      <div className="shortcuts-list">

        <div className="shortcut-item">
          <kbd>Ctrl/Cmd + S</kbd>
          <span>Quick Fill Skins (for filtered)</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl/Cmd + D</kbd>
          <span>Quick Fill Shards (for filtered)</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl/Cmd + R</kbd>
          <span>Reset All Data</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl/Cmd + H</kbd>
          <span>Show/Hide This Help</span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts; 