import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { userApi } from "../api/userApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    try {
      const res = await userApi.wishlistGet();
      if (res.success) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (productId) => {
    console.log("Toggling wishlist for productId:", productId);
    const res = await userApi.wishlistToggle(productId);
    if (res.success) {
      fetchWishlist(); // sync
    }
    return res;
  };

  // ✅ THIS is wishlistIds
  const wishlistIds = wishlist.map((p) => String(p._id));

  useEffect(() => {
    if (isAuthenticated()) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
