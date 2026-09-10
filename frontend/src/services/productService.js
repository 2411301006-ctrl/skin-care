import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductBySlug(slugOrId) {
    const res = await api.get(`/products/${slugOrId}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/categories');
    return res.data;
  },

  async getBrands() {
    const res = await api.get('/brands');
    return res.data;
  },

  async getReviews(productId) {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data;
  },

  async createReview(productId, reviewData) {
    const res = await api.post(`/products/${productId}/reviews`, reviewData);
    return res.data;
  }
};
