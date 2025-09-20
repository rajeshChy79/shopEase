import { toast } from 'react-hot-toast';

export const addToCartHelper = async (cartContext, productData, showToast = true) => {
  try {
    const result = await cartContext.addToCart(productData);
    
    if (result.success && showToast) {
      toast.success(result.message || 'Item added to cart!');
    } else if (!result.success && showToast) {
      toast.error(result.message || 'Failed to add item to cart');
    }
    
    return result;
  } catch (error) {
    if (showToast) {
      toast.error('Failed to add item to cart');
    }
    return { success: false, message: 'Network error' };
  }
};