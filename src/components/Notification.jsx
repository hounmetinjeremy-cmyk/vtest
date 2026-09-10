import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Notification = () => {
  const { notification } = useShop();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    warning: <Info className="w-5 h-5 text-warning" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-surface border border-border px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
        {icons[notification.type] || icons.success}
        <span className="text-sm font-bold text-white">{notification.message}</span>
      </div>
    </div>
  );
};
