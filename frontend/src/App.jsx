import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { router } from "./routes";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ProductProvider>
            <OrderProvider>
              <RouterProvider router={router} />
            </OrderProvider>
          </ProductProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
