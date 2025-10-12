import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { productApi } from "../api/productApi";
import Loader from "../components/Loader";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categoriesResponse = await productApi.getCategories();
      if (categoriesResponse.success) {
        const categoriesList = categoriesResponse.data || [];

        // Normalize category names (strings only)
        const normalized = categoriesList.map((cat) =>
          typeof cat === "string" ? cat : cat.category || cat.name
        );
        setCategories(normalized);

        // Fetch products for each category
        const categoryDataPromises = normalized.map(async (category) => {
          try {
            const productsResponse = await productApi.getProductsByCategory({
              category,
            });
            if (productsResponse.success) {
              const products = productsResponse.data || [];
              return {
                name: category,
                count: products.length,
                image: products[0]?.productImage?.[0] || null,
                products: products.slice(0, 3),
              };
            }
            return { name: category, count: 0, image: null, products: [] };
          } catch (error) {
            console.error(`Error fetching products for ${category}:`, error);
            return { name: category, count: 0, image: null, products: [] };
          }
        });

        const categoryDataResults = await Promise.all(categoryDataPromises);

        // Map by lowercase name for consistency
        const categoryDataMap = {};
        categoryDataResults.forEach((data) => {
          categoryDataMap[data.name.toLowerCase()] = data;
        });

        setCategoryData(categoryDataMap);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Category images fallback
  const getCategoryImage = (categoryName) => {
    const categoryImages = {
      electronics:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500",
      clothing:
        "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500",
      shoes:
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
      accessories:
        "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=500",
      home: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500",
      books:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500",
      sports:
        "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500",
      beauty:
        "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500",
    };

    return (
      categoryImages[categoryName.toLowerCase()] ||
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=500"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of product categories and find exactly
            what you're looking for
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories available
            </h3>
            <p className="text-gray-600">
              Categories will appear here once products are added to the store.
            </p>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {categories.map((category) => {
                const data = categoryData[category.toLowerCase()] || {};
                const image = data.image || getCategoryImage(category);

                return (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#071952]">
                      {/* Category Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={image}
                          alt={category}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Product Count Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {data.count || 0} items
                          </span>
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 capitalize group-hover:text-[#071952] transition-colors">
                              {category}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {data.count || 0} products available
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#071952] group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Sample Products Preview */}
                        {data.products && data.products.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">
                              Featured products:
                            </p>
                            <div className="flex space-x-2">
                              {data.products.slice(0, 3).map((product) => (
                                <div key={product._id} className="flex-1">
                                  <img
                                    src={
                                      product.productImage?.[0] ||
                                      getCategoryImage(category)
                                    }
                                    alt={product.productName}
                                    className="w-full h-12 object-cover rounded border border-gray-200"
                                    loading="lazy"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Featured Categories Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Popular Categories
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 8).map((category) => {
                  const data = categoryData[category.toLowerCase()] || {};
                  return (
                    <Link
                      key={category}
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="group flex flex-col items-center p-4 rounded-xl hover:bg-[#EBF4F6] transition-colors"
                    >
                      <div className="w-16 h-16 bg-[#EBF4F6] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#071952] transition-colors">
                        <Package className="w-8 h-8 text-[#071952] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 capitalize text-center">
                        {category}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.count || 0} items
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-[#071952] to-blue-800 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Can't find what you're looking for?
                </h2>
                <p className="text-xl mb-6 text-blue-100">
                  Browse all our products or use our search feature
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/products"
                    className="bg-white text-[#071952] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View All Products
                  </Link>
                  <Link
                    to="/products?search="
                    className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#071952] transition-colors"
                  >
                    Search Products
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
