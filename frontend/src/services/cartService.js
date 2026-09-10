import api from './api';

export const cartService = {
  async getCart() {
    const res = await api.get('/cart');
    return res.data;
  },

  async addToCart(productId, variantId = null, quantity = 1) {
    const res = await api.post('/cart/items', {
      product_id: productId,
      variant_id: variantId,
      quantity
    });
    return res.data;
  },

  async updateQuantity(productId, quantity, variantId = null) {
    const params = variantId ? { variant_id: variantId } : {};
    const res = await api.put(`/cart/items/${productId}`, { quantity }, { params });
    return res.data;
  },

  async removeFromCart(productId, variantId = null) {
    const params = variantId ? { variant_id: variantId } : {};
    const res = await api.delete(`/cart/items/${productId}`, { params });
    return res.data;
  },

  async applyPromoCode(code) {
    const res = await api.post('/cart/promo', { code });
    return res.data;
  }
};
