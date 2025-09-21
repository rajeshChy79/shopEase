import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { formatPrice } from '../helpers/displayCurrency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      // Handle unauthenticated user (show login popup maybe)
      return;
    }

    await addToCart({
      productId: product._id,
      quantity: 1,
    });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={(Array.isArray(product.productImage) && product.productImage[0]) || '/api/placeholder/300/300'}
          alt={product.productName || 'Product'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-primary-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
              <Heart className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Sale Badge */}
        {product.sellingPrice < product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-md">
            {String(product.category || "Uncategorized")}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.productName || "Unnamed Product"}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || "No description available"}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Number(product.rating || 4)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({Array.isArray(product.reviews) ? product.reviews.length : product.reviews || 0} reviews)
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.sellingPrice < product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.sellingPrice < product.price && (
            <div className="text-sm text-green-600 font-medium">
              {Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% off
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
