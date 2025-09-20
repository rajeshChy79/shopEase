import React, { useState } from "react";
import { productApi } from "../../api/productApi";
import { LoadingSpinner } from "../../components/Loader";
import { toast } from "react-toastify";

const UploadProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    price: "",
    sellingPrice: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      !formData.sellingPrice
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await productApi.createProduct(formData);
      if (response.success) {
        toast.success("Product uploaded successfully!");
        setFormData({
          productName: "",
          description: "",
          category: "",
          price: "",
          sellingPrice: "",
        });
      } else {
        toast.error(response.message || "Failed to upload product");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Product</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
        {loading ? (
          <LoadingSpinner text="Uploading product..." />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                name="sellingPrice"
                placeholder="Selling Price"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Upload Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadProduct;
