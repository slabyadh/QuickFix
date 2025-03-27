import React, { useState, useEffect } from 'react';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  onClose, 
  autoClose = true,
  duration = 5000 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (autoClose) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  // Styles pour les différents types d'alertes
  const styles = {
    container: {
      padding: '15px 20px',
      borderRadius: '8px',
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: type === 'error' ? '#FEE2E2' : 
                       type === 'success' ? '#DCFCE7' : 
                       type === 'info' ? '#DBEAFE' : '#FEF3C7',
      color: type === 'error' ? '#B91C1C' : 
             type === 'success' ? '#166534' : 
             type === 'info' ? '#1E40AF' : '#B45309',
      borderLeft: `6px solid ${
        type === 'error' ? '#DC2626' : 
        type === 'success' ? '#16A34A' : 
        type === 'info' ? '#2563EB' : '#D97706'
      }`
    },
    contentWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    icon: {
      fontSize: '18px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      opacity: '0.6',
      color: type === 'error' ? '#B91C1C' : 
             type === 'success' ? '#166534' : 
             type === 'info' ? '#1E40AF' : '#B45309'
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.contentWrapper as React.CSSProperties}>
        <span style={styles.icon as React.CSSProperties}>
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </span>
        <div>{message}</div>
      </div>
      <button 
        style={styles.closeButton as React.CSSProperties} 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;