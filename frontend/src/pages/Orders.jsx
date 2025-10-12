// src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "../helpers/displayCurrency";
import { LoadingSpinner } from "../components/Loader";
import { orderApi } from "../api/orderApi"; // 👉 Uncomment when API ready

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // 👉 Replace mock with actual API call
      const response = await orderApi.getMyOrders();
      setOrders(response.data);

      // Mock orders for testing
      const mockOrders = [
        {
          _id: "1",
          orderNumber: "ORD-2024-001",
          date: "2024-01-15",
          status: "delivered",
          total: 2499,
          items: [
            {
              productId: {
                _id: "1",
                productName: "Wireless Bluetooth Headphones",
                productImage: [
                  "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
                ],
                sellingPrice: 1999,
              },
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: "John Doe",
            address: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
          },
        },
        {
          _id: "2",
          orderNumber: "ORD-2024-002",
          date: "2024-01-20",
          status: "shipped",
          total: 1299,
          items: [
            {
              productId: {
                _id: "2",
                productName: "Smart Watch",
                productImage: [
                  "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
                ],
                sellingPrice: 1199,
              },
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: "John Doe",
            address: "123 Main Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
          },
        },
      ];

      //setOrders(mockOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <Package className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <LoadingSpinner text="Loading your orders..." />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <button
            onClick={fetchOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on{" "}
                          {new Date(order.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={
                            item.productId.productImage?.[0] ||
                            "/api/placeholder/80/80"
                          }
                          alt={item.productId.productName}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.productId.productName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatPrice(
                              item.productId.sellingPrice * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Delivering to: {order.shippingAddress.fullName},{" "}
                      {order.shippingAddress.city}
                    </div>

                    <div className="flex items-center space-x-3">
                      {order.status === "delivered" && (
                        <button
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Reorder
                        </button>
                      )}

                      {order.status === "pending" && (
                        <button
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <button
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Order Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order Status
                  </h3>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedOrder.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={
                            item.productId.productImage?.[0] ||
                            "/api/placeholder/60/60"
                          }
                          alt={item.productId.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.productId.productName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} ×{" "}
                            {formatPrice(item.productId.sellingPrice)}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(
                            item.productId.sellingPrice * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.address}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state} -{" "}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Total */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order Total
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
