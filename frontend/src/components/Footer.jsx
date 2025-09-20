import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary-300" />
              <span className="text-xl font-bold">ShopEase</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Your one-stop destination for quality products at unbeatable prices. 
              We bring you the best shopping experience with secure payments and fast delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-primary-200 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-200 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-300 flex-shrink-0" />
                <span className="text-primary-200 text-sm">
                  123 Commerce Street, Business District, City 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-300" />
                <span className="text-primary-200 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-300" />
                <span className="text-primary-200 text-sm">support@shopease.com</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-primary-800 border border-primary-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-primary-300"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8 text-center">
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} ShopEase. All rights reserved. Built with ❤️ for great shopping experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;