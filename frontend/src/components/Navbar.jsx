import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActivePage = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl text-primary-900 hover:text-primary-700 transition-colors"
          >
            <Package className="w-8 h-8" />
            <span>ShopEase</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center space-x-1 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:block">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActivePage('/login')
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-700 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/cart"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated() ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;