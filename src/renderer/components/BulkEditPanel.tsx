import React from 'react';

interface BulkEditPanelProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkUpdate: (hasSkin: boolean, hasShard: boolean) => void;
  onCancel: () => void;
}

const BulkEditPanel: React.FC<BulkEditPanelProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkUpdate,
  onCancel
}) => {
  return (
    <div className="bulk-edit-panel">
      <div className="bulk-edit-info">
        <span>
          <strong>Bulk Edit Mode:</strong> {selectedCount} of {totalCount} champions selected
        </span>
        <div>
          <button className="btn btn-secondary" onClick={onSelectAll}>
            Select All
          </button>
          <button className="btn btn-secondary" onClick={onDeselectAll}>
            Deselect All
          </button>
        </div>
      </div>
      
      <div className="bulk-edit-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => onBulkUpdate(true, false)}
          disabled={selectedCount === 0}
        >
          ✅ Mark as Owned
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => onBulkUpdate(false, true)}
          disabled={selectedCount === 0}
        >
          🎁 Mark as Has Shard
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => onBulkUpdate(false, false)}
          disabled={selectedCount === 0}
        >
          ❌ Clear Status
        </button>
        <button className="btn btn-danger" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkEditPanel; 