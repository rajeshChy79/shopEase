import { createContext, useContext, useState, useEffect } from "react";
import { productApi } from "../api/productApi";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await productApi.getAllProducts();
    if (res.success) setProducts(res.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await productApi.getCategories();
    if (res.success) setCategories(res.data);
  };

  const getProductById = async (id) => {
    return await productApi.getProductDetails(id);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        fetchProducts,
        fetchCategories,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
