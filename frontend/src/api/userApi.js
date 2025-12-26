import API from './axios';

export const userApi = {
  signup: async (userData) => {
    const response = await API.post('/api/user/signup', userData);
    return response.data;
  },

  signin: async (credentials) => {
    const response = await API.post('/api/user/signin', credentials);
    console.log("signin response", response.data);
    return response.data;
  },

  getUserDetails: async () => {
    const response = await API.get('/api/user/user-details');
    return response.data;
  },

  logout: async () => {
    const response = await API.get('/api/user/logout');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await API.get('/api/user/all');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await API.post('/api/user/update', userData);
    return response.data;
  },
  activateUser: async (userId) => {
    const response = await API.patch(`/api/user/${userId}/activate`);
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await API.patch(`/api/user/${userId}/deactivate`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/api/user/${userId}`);
    return response.data;
  },
};