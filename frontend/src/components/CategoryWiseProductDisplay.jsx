import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { productApi } from '../api/productApi';
import ProductCard from './ProductCard';
import { LoadingSpinner } from './Loader';

const CategoryWiseProductDisplay = ({ category, title, limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getProductsByCategory(category);
      
      if (response.success) {
        // Limit the number of products displayed
        const limitedProducts = response.data.slice(0, limit);
        setProducts(limitedProducts);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {title || category}
          </h2>
        </div>
        <LoadingSpinner text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {title || category}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {title || category}
        </h2>
        <Link
          to={`/category/${category}`}
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* View All Link for Mobile */}
      <div className="flex justify-center mt-8">
        <Link
          to={`/category/${category}`}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <span>View All {category} Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;