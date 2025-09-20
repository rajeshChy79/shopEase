import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,      // user details
  token: null,     // optional, if backend returns token
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      if (action.payload.token) localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
