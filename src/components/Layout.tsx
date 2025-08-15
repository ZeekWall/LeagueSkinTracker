import React from 'react';
import { analytics } from '../services/analytics';

interface LayoutProps {
  children: React.ReactNode;
  onUpdateChampions?: () => void;
  isUpdating?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onUpdateChampions, isUpdating = false }) => {
  const handleKoFiClick = () => {
    analytics.trackDonateClick();
    window.open('https://ko-fi.com/zeekwall', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-screen bg-league-bg-primary text-league-text-primary overflow-hidden">
      {/* Compact App Header */}
      <header className="bg-gradient-to-r from-league-bg-secondary to-league-bg-primary border-b border-league-gold/20 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* App Icon/Logo */}
            <div className="w-6 h-6 bg-gradient-to-br from-league-gold to-league-gold-dark rounded flex items-center justify-center">
              <span className="text-league-bg-primary font-bold text-xs">LoL</span>
            </div>
            
            {/* App Title */}
            <div>
              <h1 className="text-sm font-bold text-league-text-primary">
                LoL Skin Tracker <span className="text-xs font-normal text-league-text-secondary">v3.0</span>
              </h1>
              <div className="text-xs text-league-text-secondary" id="debug-info">
                Loading...
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Update Button */}
            <button
              onClick={onUpdateChampions}
              className="
                px-2 py-1 text-xs font-medium rounded flex items-center gap-1
                bg-league-bg-secondary text-league-text-primary
                border border-league-gold/30 hover:border-league-gold
                hover:bg-league-gold/10 transition-all duration-200
                focus:outline-none focus:ring-1 focus:ring-league-gold/20
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Update champion data from DataDragon API"
              disabled={!onUpdateChampions || isUpdating}
            >
              <div className="w-3 h-3 flex items-center justify-center">
                {isUpdating ? (
                  <div className="w-3 h-3 border border-league-gold/60 border-t-league-gold rounded-full animate-spin"></div>
                ) : (
                  <span className="hidden sm:block">🔄</span>
                )}
              </div>
              <span className="hidden sm:inline">{isUpdating ? 'Updating...' : 'Update Champs'}</span>
            </button>

            {/* Ko-Fi Support Button */}
            <button
              onClick={handleKoFiClick}
              className="
                px-2 py-1 text-xs font-medium rounded flex items-center gap-1
                bg-league-bg-secondary text-league-text-primary
                border border-league-gold/30 hover:border-league-gold
                hover:bg-league-gold/10 transition-all duration-200
                focus:outline-none focus:ring-1 focus:ring-league-gold/20
              "
              title="Support the developer on Ko-Fi"
            >
              <span className="w-3 h-3 flex items-center justify-center text-xs">☕</span>
              <span className="hidden sm:inline">Support</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-45px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;