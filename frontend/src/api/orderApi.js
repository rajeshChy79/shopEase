import API from './axios';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await API.post('/api/order/create', orderData);
    return response.data;
  },

  getMyOrders: async () => {
  const response = await API.get("/api/order/my-orders");
  return response.data;
}
,

  verifyPayment: async (paymentData) => {
    const response = await API.post('/api/order/verify', paymentData);
    return response.data;
  },
};