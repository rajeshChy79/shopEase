import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartData();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const [cartResponse, countResponse] = await Promise.all([
        cartApi.viewCart(),
        cartApi.getCartCount(),
      ]);
      console.log("cartResponse", cartResponse);
      
      if (cartResponse.success) {
        setCartItems(cartResponse.data);
      }
      
      if (countResponse.success) {
        setCartCount(countResponse.data);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData) => {
    try {
      const response = await cartApi.addToCart(productData);
      if (response.success) {
        await fetchCartData();
        return { success: true, message: 'Item added to cart' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add item' };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await cartApi.updateCartItem({ productId, quantity });
      if (response.success) {
        await fetchCartData();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update item' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartApi.deleteCartItem(productId);
      if (response.success) {
        await fetchCartData();
        return { success: true, message: 'Item removed from cart' };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove item' };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  console.log("cartItems in context", cartItems);
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item?.productId?.sellingPrice * item?.quantity), 0);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchCartData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};