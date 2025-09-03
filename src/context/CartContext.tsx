import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";

interface CartContextType {
  cart: any | null;
  cartItemCount: number;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }) {

  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      const count = response.data.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCart(response.data);
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
      value={{ cartItemCount, setCartItemCount, fetchCart, cart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}