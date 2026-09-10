import api from './api';

export const userService = {
  async getMe() {
    const res = await api.get('/users/me');
    return res.data;
  },

  async updateMe(data) {
    const res = await api.put('/users/me', data);
    return res.data;
  },

  async getAddresses() {
    const res = await api.get('/users/me/addresses');
    return res.data;
  },

  async addAddress(address) {
    const res = await api.post('/users/me/addresses', address);
    return res.data;
  },

  async updateAddress(addressId, address) {
    const res = await api.put(`/users/me/addresses/${addressId}`, address);
    return res.data;
  },

  async deleteAddress(addressId) {
    const res = await api.delete(`/users/me/addresses/${addressId}`);
    return res.data;
  },

  async getWishlist() {
    const res = await api.get('/users/me/wishlist');
    return res.data;
  },

  async addToWishlist(productId) {
    const res = await api.post(`/users/me/wishlist/${productId}`);
    return res.data;
  },

  async removeFromWishlist(productId) {
    const res = await api.delete(`/users/me/wishlist/${productId}`);
    return res.data;
  }
};
