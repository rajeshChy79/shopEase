import API from './axios';

export const productApi = {
  uploadProduct: async (productData) => {
    const response = await API.post('/api/product/upload', productData);
    return response.data;
  },

  getAllProducts: async () => {
    const response = await API.get('/api/product/all');
    return response.data;
  },

  updateProduct: async (productData) => {
    const response = await API.post('/api/product/update', productData);
    return response.data;
  },

  getCategories: async () => {
    const response = await API.get('/api/product/categories');
    return response.data;
  },

  getProductsByCategory: async (category) => {
    const response = await API.post('/api/product/by-category', { category });
    return response.data;
  },

  getProductDetails: async (productId) => {
    const response = await API.post('/api/product/details', { productId });
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await API.get(`/api/product/search?q=${query}`);
    return response.data;
  },

  filterProducts: async (filterData) => {
    const response = await API.post('/api/product/filter', filterData);
    return response.data;
  },
};