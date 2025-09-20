import React, { useState } from 'react';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { formatPrice } from '../helpers/displayCurrency';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    await updateCartItem(item.productId._id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await removeFromCart(item.productId._id);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center space-x-4 py-6 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.productId.productImage?.[0] || '/api/placeholder/80/80'}
          alt={item.productId.productName}
          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
          {item.productId.productName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Category: {item.productId.category}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {item.productId.description}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[60px] font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {formatPrice(item.productId.sellingPrice * item.quantity)}
        </div>
        <div className="text-sm text-gray-600">
          {formatPrice(item.productId.sellingPrice)} each
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center space-y-2">
        <button
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;