import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/orderApi";
import { formatPrice } from "../helpers/displayCurrency";
import { LoadingSpinner } from "../components/Loader";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    paymentMethod: "card",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

useEffect(() => {
  if (!isAuthenticated()) {
    navigate("/login");
    return;
  }

  if (cartItems.length === 0 && step !== 3) {
    navigate("/cart");
  }
}, [cartItems.length, step]);


  const handleInputChange = (section, field, value) => {
    setOrderData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRazorpayPayment = async () => {
  try {
    console.log("place order", placedOrder);


    // 1️⃣ Create Razorpay order from backend
    const res = await orderApi.createOrder({
      items: placedOrder.items,
      shippingAddress: placedOrder.shippingAddress,
      paymentMethod: placedOrder.paymentMethod,
      totalAmount: placedOrder.totalAmount,
      orderId: placedOrder._id,
    });

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: res.data.key,
      amount: res.data.totalAmount,
      currency: "INR",
      name: "Your Store",
      description: "Order Payment",
      order_id: res.data.razorpayOrderId,

      handler: async function (response) {
        // 2️⃣ Verify payment
        const verify = await orderApi.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: placedOrder._id,
        });

        if (verify?.success) {
          navigate("/payment-success");
        } else {
          navigate("/payment-failed");
        }
      },

      prefill: {
        name: placedOrder.shippingAddress.fullName,
        email: placedOrder.shippingAddress.email,
        contact: placedOrder.shippingAddress.phone,
      },

      theme: {
        color: "#071952",
      },

      modal: {
        ondismiss: () => {
          navigate("/payment-failed");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Razorpay Error:", error);
    navigate("/payment-failed");
  }
};


  const validateStep1 = () => {
    const { shippingAddress } = orderData;
    return (
      shippingAddress.fullName &&
      shippingAddress.email &&
      shippingAddress.phone &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.pincode
    );
  };

  const validateStep2 = () => {
    if (orderData.paymentMethod === "cod") return true;

    const { cardDetails } = orderData;
    return (
      cardDetails.cardNumber &&
      cardDetails.expiryDate &&
      cardDetails.cvv &&
      cardDetails.cardholderName
    );
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.sellingPrice,
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        totalAmount: getCartTotal() + (getCartTotal() > 999 ? 0 : 99),
      };

      const response = await orderApi.createOrder(orderPayload);

      if (response?.success) {
        setPlacedOrder(response.data);
        setStep(3);     // 👈 first
        clearCart();    // 👈 after
      } else {
        console.error(
          "Order creation failed:",
          response?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return <LoadingSpinner text="Processing your order..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                step >= 1 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 2 ? "bg-primary-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                step >= 2 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 3 ? "bg-primary-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                step >= 3 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-primary-600 text-white" : "bg-gray-200"
                }`}
              >
                3
              </div>
              <span className="font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={orderData.shippingAddress.fullName}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddress",
                            "fullName",
                            e.target.value
                          )
                        }
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={orderData.shippingAddress.email}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddress",
                            "email",
                            e.target.value
                          )
                        }
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={orderData.shippingAddress.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddress",
                            "phone",
                            e.target.value
                          )
                        }
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.pincode}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "pincode",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter PIN code"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        value={orderData.shippingAddress.address}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddress",
                            "address",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.city}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "city",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.state}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "state",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

{step === 2 && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">
      Choose Payment Method
    </h2>

    {/* Payment Method Selection */}
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-3">
        <input
          type="radio"
          id="online"
          name="paymentMethod"
          value="card"
          checked={orderData.paymentMethod === "card"}
          onChange={(e) =>
            setOrderData((prev) => ({
              ...prev,
              paymentMethod: e.target.value,
            }))
          }
        />
        <label htmlFor="online" className="cursor-pointer">
          Online Payment (UPI / Card / NetBanking)
        </label>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          value="cod"
          checked={orderData.paymentMethod === "cod"}
          onChange={(e) =>
            setOrderData((prev) => ({
              ...prev,
              paymentMethod: e.target.value,
            }))
          }
        />
        <label htmlFor="cod" className="cursor-pointer">
          Cash on Delivery
        </label>
      </div>
    </div>

    <div className="flex justify-between mt-6">
      <button
        onClick={() => setStep(1)}
        className="px-6 py-3 border border-gray-300 rounded-lg"
      >
        Back
      </button>

      <button
        onClick={() => handlePlaceOrder()}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg"
      >
        Continue
      </button>
    </div>
  </div>
)}


{step === 3 && placedOrder && (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
      
      {/* SUCCESS ICON */}
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Order Created Successfully!
        </h2>
        <p className="text-gray-600 mt-2">
          Please review your order and confirm payment.
        </p>
      </div>

      {/* ORDER ITEMS */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Order Items</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {placedOrder.items.map((item) => (
              <tr key={item.productId._id} className="border-t">
                <td className="p-2">
                  {item.productId.productName}
                </td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="mb-6 border p-4 rounded">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <p>{placedOrder.shippingAddress.fullName}</p>
        <p>{placedOrder.shippingAddress.address}</p>
        <p>
          {placedOrder.shippingAddress.city},{" "}
          {placedOrder.shippingAddress.state} –{" "}
          {placedOrder.shippingAddress.pincode}
        </p>
        <p>{placedOrder.shippingAddress.phone}</p>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
        <span>Total</span>
        <span>{formatPrice(placedOrder.totalAmount)}</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-3">
        {placedOrder.paymentMethod === "card" ? (
          <button
            onClick={handleRazorpayPayment}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            Confirm & Pay
          </button>
        ) : (
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            View Orders
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
