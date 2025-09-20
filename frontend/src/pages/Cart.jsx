import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../helpers/displayCurrency';
import CartItem from '../components/CartItem';
import { LoadingSpinner } from '../components/Loader';

const Cart = () => {
  const { cartItems, loading, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your cart
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to add items to your cart and make purchases.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <LoadingSpinner text="Loading your cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-lg text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.productId._id} className="px-6">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add {formatPrice(999 - subtotal)} more for free shipping!
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                
                <Link
                  to="/"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;