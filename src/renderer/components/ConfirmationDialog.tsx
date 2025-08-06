import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  detail,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getDialogClass = () => {
    switch (type) {
      case 'danger':
        return 'confirmation-dialog danger';
      case 'warning':
        return 'confirmation-dialog warning';
      case 'info':
        return 'confirmation-dialog info';
      default:
        return 'confirmation-dialog info';
    }
  };

  return (
    <div className="dialog-overlay">
      <div className={getDialogClass()}>
        <div className="dialog-header">
          <div className="dialog-icon">
            {getIcon()}
          </div>
          <div className="dialog-title">{title}</div>
        </div>
        
        <div className="dialog-content">
          <div className="dialog-message">{message}</div>
          {detail && (
            <div className="dialog-detail">{detail}</div>
          )}
        </div>
        
        <div className="dialog-actions">
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog; 