import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onUpdateChampions?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onUpdateChampions }) => {
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
                LoL Skin Tracker <span className="text-xs font-normal text-league-text-secondary">v1.0</span>
              </h1>
              <div className="text-xs text-league-text-secondary" id="debug-info">
                Loading...
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <button
            onClick={onUpdateChampions}
            className="
              px-2 py-1 text-xs font-medium rounded
              bg-league-bg-secondary text-league-text-primary
              border border-league-gold/30 hover:border-league-gold
              hover:bg-league-gold/10 transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-league-gold/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Update champion data from CommunityDragon"
            disabled={!onUpdateChampions}
          >
            Update
          </button>
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