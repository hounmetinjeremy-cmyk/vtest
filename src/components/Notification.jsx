import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Notification = () => {
  const { notification } = useShop();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    error: <AlertTriangle className="w-5 h-5 text-error" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface border border-border px-5 py-4 rounded-xl shadow-2xl animate-bounce">
      {icons[notification.type] || <Info className="w-5 h-5 text-primary" />}
      <span className="text-sm font-medium text-white">{notification.message}</span>
    </div>
  );
};
