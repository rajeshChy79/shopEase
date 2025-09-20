import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  loading: false,
  subtotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload;
      state.subtotal = action.payload.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    },
    addItem(state, action) {
      state.cartItems.push(action.payload);
      state.subtotal += action.payload.product.price * action.payload.quantity;
    },
    removeItem(state, action) {
      const index = state.cartItems.findIndex(
        item => item.product._id === action.payload
      );
      if (index !== -1) {
        state.subtotal -=
          state.cartItems[index].product.price * state.cartItems[index].quantity;
        state.cartItems.splice(index, 1);
      }
    },
    clearCart(state) {
      state.cartItems = [];
      state.subtotal = 0;
    },
  },
});

export const { setCartItems, addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
