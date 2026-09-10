import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  async getOrders() {
    const res = await api.get('/orders');
    return res.data;
  },

  async getOrderById(orderId) {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  }
};
