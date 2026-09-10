import React, { createContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0, discount_amount: 0, promo_code: null });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Cart load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, variantId = null, quantity = 1, productName = "Item") => {
    try {
      const updated = await cartService.addToCart(productId, variantId, quantity);
      setCart(updated);
      showToast(`Added "${productName}" to cart`);
      return updated;
    } catch (err) {
      showToast(err.message || "Failed to add to cart");
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity, variantId = null) => {
    try {
      const updated = await cartService.updateQuantity(productId, quantity, variantId);
      setCart(updated);
      return updated;
    } catch (err) {
      showToast(err.message || "Failed to update quantity");
      throw err;
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    try {
      const updated = await cartService.removeFromCart(productId, variantId);
      setCart(updated);
      showToast("Item removed from cart");
      return updated;
    } catch (err) {
      showToast(err.message || "Failed to remove item");
      throw err;
    }
  };

  const applyPromoCode = async (code) => {
    try {
      const updated = await cartService.applyPromoCode(code);
      setCart(updated);
      showToast(`Promo code "${code}" applied!`);
      return updated;
    } catch (err) {
      showToast(err.message || "Invalid promo code");
      throw err;
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyPromoCode,
      refreshCart: fetchCart,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};
