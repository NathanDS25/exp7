import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, addToast };
};

export const ToastContainer = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertCircle;
        if (toast.type === 'warning') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={20} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
