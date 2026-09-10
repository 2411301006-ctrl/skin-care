import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';

export const PromoCodeInput = () => {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { applyPromoCode, cart } = useCart();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    try {
      await applyPromoCode(code.trim());
      setCode('');
    } catch {
      // Error handled by Toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2 uppercase tracking-wider" htmlFor="promo">
        Promo Code
      </label>
      <form onSubmit={handleApply} className="flex gap-2">
        <input 
          id="promo"
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. GLOW10 or WELCOME20"
          className="flex-grow bg-transparent border-0 border-b border-outline-variant focus:border-on-surface focus:ring-0 px-0 py-2 font-body-md text-body-md text-on-surface placeholder-outline transition-colors uppercase"
        />
        <button 
          type="submit" 
          disabled={submitting}
          className="font-label-caps text-label-caps text-on-surface hover:opacity-70 transition-opacity border-b border-on-surface pb-1 self-end disabled:opacity-50"
        >
          {submitting ? 'Applying...' : 'Apply'}
        </button>
      </form>
      {cart.promo_code && (
        <p className="text-xs text-primary font-label-caps mt-2">
          Applied Code: <span className="font-bold">{cart.promo_code}</span> (${cart.discount_amount.toFixed(2)} off)
        </p>
      )}
    </div>
  );
};
