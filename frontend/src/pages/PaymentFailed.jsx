import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>

        <p className="text-gray-600 mb-6">
          Something went wrong with your payment. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Retry Payment
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Go to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
