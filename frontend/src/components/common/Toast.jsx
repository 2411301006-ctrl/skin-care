import React from 'react';
import { useCart } from '../../hooks/useCart';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 bg-on-surface text-surface font-label-caps text-label-caps tracking-widest px-6 py-4 shadow-2xl border border-outline/30 rounded-DEFAULT flex items-center gap-3 fade-in">
      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
      <span>{toastMessage}</span>
    </div>
  );
};
