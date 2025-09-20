import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Award } from 'lucide-react';
import { productApi } from '../api/productApi';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/Loader';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, productsResponse] = await Promise.all([
        productApi.getCategories(),
        productApi.getAllProducts()
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (productsResponse.success) {
        // Get first 8 products as featured
        setFeaturedProducts(productsResponse.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Show user-friendly error message when backend is not available
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('Backend server is not running. Please start your backend server at http://localhost:8080');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹999'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free returns'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Premium quality products'
    }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading homepage..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover Amazing
                <span className="block text-primary-300">Products</span>
              </h1>
              <p className="text-xl mb-8 text-primary-100 leading-relaxed">
                Shop the latest trends and timeless classics with unbeatable prices 
                and exceptional quality. Your perfect shopping experience starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Shopping"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Premium Quality</div>
                      <div className="text-sm text-gray-600">Trusted by 10,000+ customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the most popular and trending products
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of product categories
            </p>
          </div>

           {categories.length > 0 ? (
            <div className="space-y-16">
              {categories.slice(0, 3).map((cat) => (
                <CategoryWiseProductDisplay
                  key={cat._id}
                  category={cat.category}
                  title={`${cat.category} Collection`}
                  limit={4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No categories available</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who trust us for their shopping needs.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-lg"
          >
            Create Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;