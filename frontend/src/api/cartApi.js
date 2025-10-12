import API from './axios';

export const cartApi = {
  addToCart: async (productData) => {
    const response = await API.post('/api/cart/add', productData);
    return response.data;
  },

  getCartCount: async () => {
    const response = await API.get('/api/cart/count');
    return response.data;
  },

  viewCart: async () => {
    const response = await API.get('/api/cart/view');
    console.log("viewCart response", response);
    return response.data;
  },

  updateCartItem: async (updateData) => {
    const response = await API.post('/api/cart/update', updateData);
    return response.data;
  },

  deleteCartItem: async (productId) => {
    const response = await API.post('/api/cart/delete', { productId });
    return response.data;
  },
};