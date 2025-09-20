import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { LoadingSpinner } from "../components/Loader";
import { formatPrice } from "../helpers/displayCurrency";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProductById(id);

      if (response.success) {
        setProduct(response.data);

        // Fetch related products by category
        if (response.data.category) {
          const relatedRes = await productApi.getProductsByCategory(
            response.data.category
          );
          if (relatedRes.success) {
            const filtered = relatedRes.data.filter((p) => p._id !== id);
            setRelatedProducts(filtered.slice(0, 4));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={product.productImage?.[0] || "/api/placeholder/500/500"}
            alt={product.productName}
            className="w-full rounded-lg border border-gray-200 object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.productName}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            Category: {product.category}
          </p>
          <div className="text-2xl font-bold text-primary-600 mb-6">
            {formatPrice(product.sellingPrice)}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
