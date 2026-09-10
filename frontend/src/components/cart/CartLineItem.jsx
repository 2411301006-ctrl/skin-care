import React from 'react';
import { useCart } from '../../hooks/useCart';

export const CartLineItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product_id, item.quantity - 1, item.variant_id);
    } else {
      removeFromCart(item.product_id, item.variant_id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.product_id, item.quantity + 1, item.variant_id);
  };

  const handleRemove = () => {
    removeFromCart(item.product_id, item.variant_id);
  };

  const image = item.image || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg';

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-low rounded-DEFAULT items-start sm:items-center">
      <img 
        src={image} 
        alt={item.name} 
        className="w-24 h-32 object-cover object-center bg-surface-container-highest shrink-0"
      />
      <div className="flex-grow flex flex-col gap-2 w-full">
        <div className="flex justify-between items-start w-full">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h3>
            {item.variant_label && (
              <p className="text-on-surface-variant mt-1 text-sm">{item.variant_label}</p>
            )}
            {item.brand_name && (
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">{item.brand_name}</p>
            )}
          </div>
          <p className="font-body-lg text-body-lg font-medium">
            ${(item.current_price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between items-center w-full mt-4">
          <div className="flex items-center border border-outline-variant rounded-DEFAULT overflow-hidden h-10 w-28">
            <button 
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="flex-1 flex items-center justify-center hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="flex-1 text-center font-label-caps text-label-caps">{item.quantity}</span>
            <button 
              onClick={handleIncrease}
              aria-label="Increase quantity"
              className="flex-1 flex items-center justify-center hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          <button 
            onClick={handleRemove}
            className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 group"
          >
            <span className="font-label-caps text-label-caps opacity-0 group-hover:opacity-100 transition-opacity">Remove</span>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
