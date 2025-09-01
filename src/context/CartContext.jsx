import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = useState(null);

  async function fetchCart() {
    try {
      const response = await ApiService.getCart();
      const count = response.data.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCart(response.data)
      setCartItemCount(count);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCartItemCount(0);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItemCount, setCartItemCount, fetchCart ,cart}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
