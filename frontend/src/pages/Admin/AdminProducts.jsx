import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Package,
  Star,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productApi } from '../../api/productApi';
import { displayCurrency } from '../../helpers/displayCurrency';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi
      .getAllProducts();
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Add delete API call here
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        // Add bulk delete API call here
        setProducts(products.filter(p => !selectedProducts.includes(p._id)));
        setSelectedProducts([]);
        setShowBulkActions(false);
        toast.success(`${selectedProducts.length} products deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete products');
      }
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      const newSelection = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
      setShowBulkActions(false);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
      setShowBulkActions(true);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = (!priceRange.min || product.sellingPrice >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.sellingPrice <= parseFloat(priceRange.max));
    const matchesStatus = !statusFilter || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.productName.toLowerCase();
        bValue = b.productName.toLowerCase();
        break;
      case 'price':
        aValue = a.sellingPrice;
        bValue = b.sellingPrice;
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getProductStatus = (product) => {
    // Mock status logic - replace with actual product status
    return Math.random() > 0.2 ? 'active' : 'inactive';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Manage your product catalog and inventory</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/add-product')}
              className="flex items-center space-x-2 bg-[#071952] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
              <option value="date">Sort by Date</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Price Range:</label>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#071952] focus:border-[#071952]"
              />
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">{filteredProducts.length} products</span>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#071952] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#071952] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedProducts([]);
                    setShowBulkActions(false);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Display */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" />
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const status = getProductStatus(product);
                  return (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleProductSelect(product._id)}
                          className="absolute top-3 left-3 w-4 h-4 text-[#071952] bg-white border-gray-300 rounded focus:ring-[#071952] z-10"
                        />
                        <img
                          src={product.productImage?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                          alt={product.productName}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.productName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                        <p className="text-sm text-gray-500 capitalize mb-3">{product.category}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold text-[#071952]">
                              {displayCurrency(product.sellingPrice)}
                            </span>
                            {product.price !== product.sellingPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {displayCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-[#071952] bg-white border-gray-300 rounded focus:ring-[#071952]"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => {
                        const status = getProductStatus(product);
                        return (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => handleProductSelect(product._id)}
                                className="w-4 h-4 text-[#071952] bg-white border-gray-300 rounded focus:ring-[#071952]"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.productImage?.[0] || 'https://via.placeholder.com/40x40?text=No+Image'}
                                  alt={product.productName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                                  <div className="text-sm text-gray-500">{product.brandName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {displayCurrency(product.sellingPrice)}
                              </div>
                              {product.price !== product.sellingPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {displayCurrency(product.price)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/product/${product._id}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Product"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory || statusFilter || priceRange.min || priceRange.max
                    ? 'Try adjusting your filters to see more products.'
                    : 'Get started by adding your first product.'}
                </p>
                <button
                  onClick={() => navigate('/admin/add-product')}
                  className="bg-[#071952] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;