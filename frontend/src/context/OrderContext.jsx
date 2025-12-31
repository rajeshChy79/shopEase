import { createContext, useContext, useState, useCallback } from "react";
import { orderApi } from "../api/orderApi";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    return await orderApi.createOrder(orderData);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await orderApi.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await orderApi.getAllOrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        setOrders([]);
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        createOrder,
        fetchOrders,
        fetchAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
