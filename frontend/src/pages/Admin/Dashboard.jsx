import React, { useEffect, useState } from "react";
import { productApi } from "../../api/productApi";
import { orderApi } from "../../api/orderApi";
import { userApi } from "../../api/userApi";
import { LoadingSpinner } from "../../components/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        productApi.getAllProducts(),
        userApi.getAllUsers(),
        orderApi.getAllOrders(),
      ]);

      setStats({
        products: productsRes.success ? productsRes.data.length : 0,
        users: usersRes.success ? usersRes.data.length : 0,
        orders: ordersRes.success ? ordersRes.data.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          <p className="text-gray-500 mt-2">Products</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
          <p className="text-gray-500 mt-2">Users</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          <p className="text-gray-500 mt-2">Orders</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
