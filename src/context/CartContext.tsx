/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { useUser } from "./UserContext";
import { AuthHelper } from "../helpers/AuthHelper";

interface CartContextType {
  cart: any | null;
  cartItemCount: number;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
  if (!user) return;

  // Eğer kullanıcı admin veya delivery ise cart çekme
  if (user.roles.includes("ADMIN") || user.roles.includes("DELIVERY")) {
    setCart(null);
    setCartItemCount(0);
    return;
  }

  try {
    const response = await cartService.getCart();
    const count = response.data.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCart(response.data);
    setCartItemCount(count);
  } catch (err) {
    setCartItemCount(0);
    setCart(null);
  }
};

  useEffect(() => {
    fetchCart();
  }, [user]);

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