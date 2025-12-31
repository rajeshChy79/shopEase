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

      // 1️⃣ Fetch categories
      const categoriesResponse = await productApi.getCategories();
      if (!categoriesResponse.success) return;

      const normalized = categoriesResponse.data.map((cat) =>
        typeof cat === "string" ? cat : cat.category || cat.name
      );

      setCategories(normalized);

      // 2️⃣ Fetch products category-wise (FIXED)
      const results = await Promise.all(
        normalized.map(async (category) => {
          const res = await productApi.getProductsByCategory(category); // ✅ FIX
          const products = res.success ? res.data : [];

          return {
            name: category,
            count: products.length,
            image: products[0]?.productImage?.[0] || null,
            products: products.slice(0, 3),
          };
        })
      );

      const mapped = {};
      results.forEach((item) => {
        mapped[item.name.toLowerCase()] = item;
      });

      setCategoryData(mapped);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Category image fallback
  const getCategoryImage = (categoryName) => {
    const images = {
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
      images[categoryName.toLowerCase()] ||
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Categories</h1>
          <p className="text-xl text-gray-600">
            Explore our diverse range of product categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => {
            const data = categoryData[category.toLowerCase()] || {};
            const image = data.image || getCategoryImage(category);

            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={image}
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold">
                      {data.count || 0} items
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold capitalize">
                        {category}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" />
                    </div>

                    {data.products?.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {data.products.map((p) => (
                          <img
                            key={p._id}
                            src={p.productImage?.[0]}
                            alt={p.productName}
                            className="w-1/3 h-12 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Categories Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-16">
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
      </div>
    </div>
  );
};

export default Categories;
