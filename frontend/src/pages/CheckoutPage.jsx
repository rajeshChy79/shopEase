import React, { useEffect, useState } from "react";
import { cartApi } from "../api/cartApi";
import { orderApi } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../helpers/displayCurrency";
import { LoadingSpinner } from "../components/Loader";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.viewCart();
      if (response.success) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        address,
        totalAmount: cartItems.reduce(
          (sum, item) => sum + item.productId.sellingPrice * item.quantity,
          0
        ),
      };

      const response = await orderApi.createOrder(orderData);

      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        // optional: redirect to orders page
        window.location.href = "/orders";
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Error while placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading checkout..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600">
        Your cart is empty.
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.productId.sellingPrice * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Cart Items Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b border-gray-100"
          >
            <span>
              {item.productId.productName} × {item.quantity}
            </span>
            <span>
              {formatPrice(item.productId.sellingPrice * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Address Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
