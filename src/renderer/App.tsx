import React, { useState, useEffect } from 'react';
import ChampionList from './components/ChampionList';
import Header from './components/Header';
import BulkEditPanel from './components/BulkEditPanel';
import FilterPanel from './components/FilterPanel';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import NotificationBanner, { Notification } from './components/NotificationBanner';
import ConfirmationDialog from './components/ConfirmationDialog';

import { Champion } from '../main/database';

const App: React.FC = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'missing-skin' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard'>('all');
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedChampions, setSelectedChampions] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    detail?: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });


  useEffect(() => {
    loadChampions();
  }, []);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotification(newNotification);
  };

  const showConfirmation = (
    title: string,
    message: string,
    detail: string,
    onConfirm: () => void,
    type: 'danger' | 'warning' | 'info' = 'info'
  ) => {
    setConfirmationDialog({
      isOpen: true,
      title,
      message,
      detail,
      onConfirm,
      type
    });
  };

  const loadChampions = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getChampions();
      setChampions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load champions');
      console.error(err);
      showNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load champions',
        detail: 'Please check your internet connection and try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChampionUpdate = async (championId: string, hasSkin: boolean, hasShard: boolean) => {
    try {
      await window.electronAPI.updateChampionStatus(championId, hasSkin, hasShard);
      setChampions(prev => 
        prev.map(champ => 
          champ.id === championId 
            ? { ...champ, hasSkin, hasShard }
            : champ
        )
      );
    } catch (err) {
      console.error('Failed to update champion:', err);
    }
  };

  const handleBulkUpdate = async (hasSkin: boolean, hasShard: boolean) => {
    try {
      const championIds = Array.from(selectedChampions);
      await window.electronAPI.bulkUpdateChampions(championIds, hasSkin, hasShard);
      
      setChampions(prev => 
        prev.map(champ => 
          selectedChampions.has(champ.id)
            ? { ...champ, hasSkin, hasShard }
            : champ
        )
      );
      
      setSelectedChampions(new Set<string>());
      setBulkEditMode(false);
    } catch (err) {
      console.error('Failed to bulk update champions:', err);
    }
  };

  const handleRefreshChampions = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.refreshChampions();
      setChampions(data);
      setError(null);
      showNotification({
        type: 'success',
        title: 'Refresh Complete',
        message: 'Champions refreshed successfully!',
        detail: `Updated ${data.length} champions from the latest patch.`,
        duration: 4000
      });
    } catch (err) {
      setError('Failed to refresh champions');
      console.error(err);
      showNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh champions',
        detail: 'Please check your internet connection and try again.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const result = await window.electronAPI.exportData();
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Export Successful',
          message: 'Data exported successfully!',
          detail: `File saved to: ${result.path}`,
          duration: 4000
        });
      }
    } catch (err) {
      console.error('Failed to export data:', err);
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data',
        detail: 'Please try again.',
        duration: 5000
      });
    }
  };

  const handleImportData = async () => {
    try {
      const result = await window.electronAPI.importData();
      if (result.success) {
        // Reload champions to show imported data
        await loadChampions();
        
        showNotification({
          type: 'success',
          title: 'Import Successful',
          message: 'Data imported successfully!',
          detail: `${result.count} champions imported from: ${result.path}`,
          duration: 4000
        });
      } else if (result.error) {
        showNotification({
          type: 'error',
          title: 'Import Failed',
          message: 'Failed to import data',
          detail: result.error,
          duration: 5000
        });
      }
    } catch (err) {
      console.error('Failed to import data:', err);
      showNotification({
        type: 'error',
        title: 'Import Failed',
        message: 'Failed to import data',
        detail: 'Please try again.',
        duration: 5000
      });
    }
  };

  const handleResetAll = async () => {
    showConfirmation(
      'Reset All Data',
      'Are you sure you want to reset all champion data?',
      'This will clear all skin and shard statuses for all champions.',
      async () => {
        try {
          // Reset all champions to have no skins or shards
          const championIds = champions.map(champ => champ.id);
          await window.electronAPI.bulkUpdateChampions(championIds, false, false);
          
          setChampions(prev => 
            prev.map(champ => ({ ...champ, hasSkin: false, hasShard: false }))
          );
          
          showNotification({
            type: 'success',
            title: 'Reset Complete',
            message: 'All champion data has been reset!',
            detail: 'All skin and shard statuses have been cleared.',
            duration: 4000
          });
        } catch (err) {
          console.error('Failed to reset champions:', err);
          showNotification({
            type: 'error',
            title: 'Reset Failed',
            message: 'Failed to reset champions',
            detail: 'Please try again.',
            duration: 5000
          });
        }
      },
      'danger'
    );
  };

  const handleQuickFill = async (type: 'skin' | 'shard') => {
    const action = type === 'skin' ? 'mark as having skins' : 'mark as having shards';
    showConfirmation(
      'Quick Fill',
      `Quick fill: ${action} for all filtered champions?`,
      `This will ${action} for ${filteredChampions.length} champions.`,
      async () => {
        try {
          const championIds = filteredChampions.map(champ => champ.id);
          const hasSkin = type === 'skin';
          const hasShard = type === 'shard';
          
          await window.electronAPI.bulkUpdateChampions(championIds, hasSkin, hasShard);
          
          setChampions(prev => 
            prev.map(champ => 
              filteredChampions.some(fc => fc.id === champ.id)
                ? { ...champ, hasSkin, hasShard }
                : champ
            )
          );
          
          showNotification({
            type: 'success',
            title: 'Quick Fill Complete',
            message: `All filtered champions have been ${action}!`,
            detail: `${filteredChampions.length} champions updated.`,
            duration: 4000
          });
        } catch (err) {
          console.error(`Failed to quick fill ${type}:`, err);
          showNotification({
            type: 'error',
            title: 'Quick Fill Failed',
            message: `Failed to quick fill ${type}`,
            detail: 'Please try again.',
            duration: 5000
          });
        }
      },
      'warning'
    );
  };

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'missing-skin':
        return !champion.hasSkin;
      case 'has-shard':
        return champion.hasShard && !champion.hasSkin;
      default:
        return true;
    }
  });

  const handleChampionSelect = (championId: string) => {
    setSelectedChampions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(championId)) {
        newSet.delete(championId);
      } else {
        newSet.add(championId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedChampions(new Set(filteredChampions.map(champ => champ.id)));
  };

  const handleDeselectAll = () => {
    setSelectedChampions(new Set<string>());
  };



  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading champions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadChampions}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
             <Header 
         onRefresh={handleRefreshChampions}
         onExport={handleExportData}
         onImport={handleImportData}

         onBulkEditToggle={() => setBulkEditMode(!bulkEditMode)}
         onReset={handleResetAll}
         onShowHelp={() => {
           // This will be handled by the KeyboardShortcuts component
           // We'll trigger it by simulating Ctrl+H
           const event = new KeyboardEvent('keydown', {
             key: 'h',
             ctrlKey: true,
             bubbles: true
           });
           window.dispatchEvent(event);
         }}
         bulkEditMode={bulkEditMode}
       />
      
      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        championCount={filteredChampions.length}
        totalCount={champions.length}
        onQuickFillSkin={() => handleQuickFill('skin')}
        onQuickFillShard={() => handleQuickFill('shard')}
      />
      
      {bulkEditMode && (
        <BulkEditPanel
          selectedCount={selectedChampions.size}
          totalCount={filteredChampions.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkUpdate={handleBulkUpdate}
          onCancel={() => {
            setBulkEditMode(false);
            setSelectedChampions(new Set<string>());
          }}
        />
      )}
      
      <div className="view-controls">
        <button 
          className={`btn btn-secondary ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Grid View"
        >
          📱 Grid
        </button>
        <button 
          className={`btn btn-secondary ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="List View"
        >
          📋 List
        </button>
      </div>
      
             <ChampionList
         champions={champions}
         onChampionUpdate={handleChampionUpdate}
         bulkEditMode={bulkEditMode}
         selectedChampions={selectedChampions}
         onChampionSelect={handleChampionSelect}
         viewMode={viewMode}
         searchTerm={searchTerm}
         filterType={filterType}
       />
      
             <KeyboardShortcuts
         onToggleBulkEdit={() => setBulkEditMode(!bulkEditMode)}
         onQuickFillSkin={() => handleQuickFill('skin')}
         onQuickFillShard={() => handleQuickFill('shard')}
         onReset={handleResetAll}
       />
       
       <NotificationBanner
         notification={notification}
         onDismiss={() => setNotification(null)}
       />
       
       <ConfirmationDialog
         isOpen={confirmationDialog.isOpen}
         title={confirmationDialog.title}
         message={confirmationDialog.message}
         detail={confirmationDialog.detail}
         onConfirm={() => {
           confirmationDialog.onConfirm();
           setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
         }}
         onCancel={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
         type={confirmationDialog.type}
       />
       

     </div>
   );
 };

export default App; 