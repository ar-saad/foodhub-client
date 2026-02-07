"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Cart, CartItem } from "@/types/cart.type";
import { Meal } from "@/types/meal.type";
import { toast } from "sonner";

const CART_STORAGE_KEY = "foodhub-cart";

const emptyCart: Cart = {
  providerId: null,
  providerName: null,
  items: [],
};

interface CartContextType {
  cart: Cart;
  addItem: (meal: Meal, providerId: string, providerName: string) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): Cart {
  if (typeof window === "undefined") return emptyCart;
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Cart;
    }
  } catch {
    // Corrupted data — reset
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return emptyCart;
}

function saveCartToStorage(cart: Cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCart(loadCartFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(cart);
    }
  }, [cart, hydrated]);

  const addItem = useCallback(
    (meal: Meal, providerId: string, providerName: string) => {
      setCart((prev) => {
        // If cart has items from a different provider, ask to clear
        if (prev.providerId && prev.providerId !== providerId) {
          const confirmed = window.confirm(
            `Your cart has items from "${prev.providerName}". Adding this item will clear your current cart. Continue?`,
          );
          if (!confirmed) return prev;
          // Clear and start fresh with new provider
          return {
            providerId,
            providerName,
            items: [{ meal, quantity: 1 }],
          };
        }

        // Check if meal already in cart
        const existingIndex = prev.items.findIndex(
          (item) => item.meal.id === meal.id,
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
          // Increment quantity
          newItems = prev.items.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          newItems = [...prev.items, { meal, quantity: 1 }];
        }

        return {
          providerId,
          providerName,
          items: newItems,
        };
      });

      toast.success(`${meal.name} added to cart`);
    },
    [],
  );

  const removeItem = useCallback((mealId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.meal.id !== mealId);
      if (newItems.length === 0) {
        return emptyCart;
      }
      return { ...prev, items: newItems };
    });
  }, []);

  const updateQuantity = useCallback((mealId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.meal.id === mealId ? { ...item, quantity } : item,
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart(emptyCart);
    toast.success("Cart cleared");
  }, []);

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  const totalPrice = useMemo(
    () =>
      cart.items.reduce(
        (sum, item) => sum + Number(item.meal.price) * item.quantity,
        0,
      ),
    [cart.items],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
