import API from './axios';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await API.post('/api/order/create', orderData);
    console.log(response.data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await API.get("/api/order/my-orders");
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await API.post('/api/order/verify', paymentData);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await API.get('/api/order/all-orders');
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await API.patch('/api/order/update-status', { orderId, status });
    return response.data;
  },
};