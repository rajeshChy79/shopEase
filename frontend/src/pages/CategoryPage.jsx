// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal, X } from "lucide-react";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner } from "../components/Loader";
import { formatPrice } from "../helpers/displayCurrency";

const CategoryPage = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // 🔹 INPUT STATE (typing does NOT trigger API)
  const [filters, setFilters] = useState({
    priceRange: ["", ""],
    sortBy: "newest",
  });

  // 🔹 APPLIED STATE (API runs ONLY on this)
  const [appliedFilters, setAppliedFilters] = useState(filters);

  /* ----------------------------------------
     Debounce filter typing (IMPORTANT FIX)
  -----------------------------------------*/
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters(filters);
    }, 2000); // wait after typing stops

    return () => clearTimeout(timer);
  }, [filters]);

  /* ----------------------------------------
     Fetch products ONLY when applied filters change
  -----------------------------------------*/
  useEffect(() => {
    fetchCategoryProducts();
  }, [category, appliedFilters]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const response = await productApi.getProductsByCategory(category);

      if (response.success) {
        let filtered = [...response.data];

        const min = Number(appliedFilters.priceRange[0]) || 0;
        const max = Number(appliedFilters.priceRange[1]) || Infinity;

        // ✅ Price filter
        filtered = filtered.filter(
          (p) => p.sellingPrice >= min && p.sellingPrice <= max
        );

        // ✅ Sorting
        switch (appliedFilters.sortBy) {
          case "price-low":
            filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
            break;
          case "price-high":
            filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
            break;
          case "name":
            filtered.sort((a, b) =>
              a.productName.localeCompare(b.productName)
            );
            break;
          default:
            break; // newest
        }

        setProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      priceRange: ["", ""],
      sortBy: "newest",
    });
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold capitalize">
                {category} Products
              </h1>
              <p className="text-gray-600">{products.length} products found</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View toggle */}
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64`}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <div className="flex justify-between mb-6 lg:hidden">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X />
                </button>
              </div>

              {/* Price */}
              <div className="space-y-4">
                <h3 className="font-semibold">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        priceRange: [e.target.value, p.priceRange[1]],
                      }))
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        priceRange: [p.priceRange[0], e.target.value],
                      }))
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>

                <p className="text-sm text-gray-600">
                  {formatPrice(filters.priceRange[0] || 0)} –{" "}
                  {formatPrice(filters.priceRange[1] || 0)}
                </p>

                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, sortBy: e.target.value }))
                  }
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="w-full border border-primary-600 text-primary-600 py-2 rounded"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">No products found</p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
