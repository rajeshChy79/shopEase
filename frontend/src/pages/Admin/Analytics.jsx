import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Star,
  Award,
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { displayCurrency } from '../../helpers/displayCurrency';
import Loader from '../../components/Loader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: {
      users: 0,
      products: 0,
      orders: 0,
      revenue: 0
    }
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [chartData, setChartData] = useState({
    revenue: null,
    orders: null,
    categories: null,
    userGrowth: null
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchAnalytics();
  }, [isAdmin, navigate, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data - replace with actual API calls
      const mockAnalytics = {
        totalUsers: 1247,
        totalProducts: 156,
        totalOrders: 892,
        totalRevenue: 245680,
        monthlyGrowth: {
          users: 12.5,
          products: 8.3,
          orders: 15.7,
          revenue: 23.4
        }
      };

      const mockTopProducts = [
        {
          _id: '1',
          productName: 'Wireless Bluetooth Headphones',
          productImage: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
          sellingPrice: 1999,
          totalSold: 145,
          revenue: 289855,
          rating: 4.8,
          category: 'Electronics'
        },
        {
          _id: '2',
          productName: 'Smart Watch Series 5',
          productImage: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
          sellingPrice: 2999,
          totalSold: 98,
          revenue: 293902,
          rating: 4.6,
          category: 'Electronics'
        },
        {
          _id: '3',
          productName: 'Gaming Mechanical Keyboard',
          productImage: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg'],
          sellingPrice: 1599,
          totalSold: 87,
          revenue: 139113,
          rating: 4.7,
          category: 'Electronics'
        },
        {
          _id: '4',
          productName: 'Laptop Stand Adjustable',
          productImage: ['https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg'],
          sellingPrice: 1299,
          totalSold: 76,
          revenue: 98724,
          rating: 4.5,
          category: 'Accessories'
        },
        {
          _id: '5',
          productName: 'Wireless Mouse',
          productImage: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg'],
          sellingPrice: 899,
          totalSold: 134,
          revenue: 120466,
          rating: 4.4,
          category: 'Electronics'
        }
      ];

      const mockRecentProducts = [
        {
          _id: '6',
          productName: 'USB-C Hub 7-in-1',
          productImage: ['https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg'],
          sellingPrice: 2499,
          category: 'Accessories',
          createdAt: '2024-01-16T10:30:00Z',
          status: 'active'
        },
        {
          _id: '7',
          productName: 'Portable Phone Charger',
          productImage: ['https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg'],
          sellingPrice: 1799,
          category: 'Electronics',
          createdAt: '2024-01-15T14:20:00Z',
          status: 'active'
        },
        {
          _id: '8',
          productName: 'Bluetooth Speaker Mini',
          productImage: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
          sellingPrice: 1299,
          category: 'Electronics',
          createdAt: '2024-01-14T09:15:00Z',
          status: 'active'
        },
        {
          _id: '9',
          productName: 'Desk Organizer Set',
          productImage: ['https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg'],
          sellingPrice: 999,
          category: 'Office',
          createdAt: '2024-01-13T16:45:00Z',
          status: 'active'
        },
        {
          _id: '10',
          productName: 'LED Desk Lamp',
          productImage: ['https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg'],
          sellingPrice: 1899,
          category: 'Home',
          createdAt: '2024-01-12T11:30:00Z',
          status: 'active'
        }
      ];

      // Generate chart data
      const generateChartData = () => {
        const days = parseInt(timeRange);
        const labels = [];
        const revenueData = [];
        const ordersData = [];
        const usersData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          
          // Generate mock data with some randomness
          revenueData.push(Math.floor(Math.random() * 5000) + 2000);
          ordersData.push(Math.floor(Math.random() * 50) + 10);
          usersData.push(Math.floor(Math.random() * 20) + 5);
        }

        return {
          revenue: {
            labels,
            datasets: [
              {
                label: 'Revenue',
                data: revenueData,
                borderColor: '#071952',
                backgroundColor: 'rgba(7, 25, 82, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          orders: {
            labels,
            datasets: [
              {
                label: 'Orders',
                data: ordersData,
                backgroundColor: '#071952',
                borderColor: '#071952',
                borderWidth: 1,
              },
            ],
          },
          categories: {
            labels: ['Electronics', 'Accessories', 'Office', 'Home', 'Fashion'],
            datasets: [
              {
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                  '#071952',
                  '#EBF4F6',
                  '#3791A5',
                  '#87BDC9',
                  '#AFD3DB',
                ],
                borderWidth: 2,
                borderColor: '#fff',
              },
            ],
          },
          userGrowth: {
            labels,
            datasets: [
              {
                label: 'New Users',
                data: usersData,
                borderColor: '#3791A5',
                backgroundColor: 'rgba(55, 145, 165, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
        };
      };

      setAnalytics(mockAnalytics);
      setTopProducts(mockTopProducts);
      setRecentProducts(mockRecentProducts);
      setChartData(generateChartData());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      growth: analytics.monthlyGrowth.users,
      prefix: ''
    },
    {
      title: 'Total Products',
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-green-500',
      growth: analytics.monthlyGrowth.products,
      prefix: ''
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      growth: analytics.monthlyGrowth.orders,
      prefix: ''
    },
    {
      title: 'Total Revenue',
      value: displayCurrency(analytics.totalRevenue),
      icon: DollarSign,
      color: 'bg-orange-500',
      growth: analytics.monthlyGrowth.revenue,
      prefix: ''
    }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      },
    },
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#071952] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive business insights and metrics</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.prefix}{stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        {stat.growth >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
                  <LineChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-80">
                  {chartData.revenue && (
                    <Line data={chartData.revenue} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Orders Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Daily Orders</h2>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-80">
                  {chartData.orders && (
                    <Bar data={chartData.orders} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Sales by Category</h2>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-80">
                  {chartData.categories && (
                    <Doughnut data={chartData.categories} options={doughnutOptions} />
                  )}
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">User Growth</h2>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-80">
                  {chartData.userGrowth && (
                    <Line data={chartData.userGrowth} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Top Performing Products</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>Based on sales volume</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Units Sold</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.productImage[0]}
                              alt={product.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{product.productName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {displayCurrency(product.sellingPrice)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {product.totalSold.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-medium text-green-600">
                          {displayCurrency(product.revenue)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recently Added Products</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last 7 days</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProducts.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.productName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                        <p className="text-lg font-bold text-[#071952] mt-2">
                          {displayCurrency(product.sellingPrice)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/admin/add-product')}
                  className="bg-[#071952] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Add New Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;