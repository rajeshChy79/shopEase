import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner } from "../components/Loader";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProductsByCategory(category);

      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={`Loading ${category} products...`} />;
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600">
        No products found in this category.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {category} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
