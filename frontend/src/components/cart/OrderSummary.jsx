import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { PromoCodeInput } from './PromoCodeInput';

export const OrderSummary = ({ showCheckoutBtn = true }) => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.subtotal || 0;
  const discount = cart.discount_amount || 0;
  const shipping = subtotal - discount >= 50 || subtotal === 0 ? 0 : 10;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="bg-surface p-8 border border-outline-variant rounded-DEFAULT whisper-shadow sticky top-32">
      <h2 className="font-headline-sm text-headline-sm mb-6 border-b border-outline-variant pb-4">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-medium text-on-surface">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-primary">
            <span>Promo Discount</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-on-surface-variant">
          <span>Estimated Shipping</span>
          <span className="font-medium text-on-surface">
            {shipping === 0 ? (subtotal === 0 ? '$0.00' : 'FREE') : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-center text-on-surface-variant">
          <span>Taxes</span>
          <span className="font-medium text-on-surface">$0.00</span>
        </div>
      </div>

      <div className="border-t border-outline-variant pt-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="font-headline-sm text-headline-sm">Total</span>
          <span className="font-headline-sm text-headline-sm">${total.toFixed(2)}</span>
        </div>
      </div>

      <PromoCodeInput />

      {showCheckoutBtn && (
        <button 
          onClick={() => navigate('/checkout')}
          disabled={cart.items.length === 0}
          className="w-full bg-on-surface text-surface py-4 font-label-caps text-label-caps hover:bg-inverse-surface transition-colors rounded-DEFAULT disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
        >
          PROCEED TO CHECKOUT
        </button>
      )}
    </div>
  );
};
