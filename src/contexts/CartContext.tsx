"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { Cart, CartItem } from "@/types/cart.type";
import { Meal } from "@/types/meal.type";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface PendingItem {
  meal: Meal;
  providerId: string;
  providerName: string;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showProviderConflict, setShowProviderConflict] = useState(false);
  const cartRef = useRef(cart);

  // Keep ref in sync
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

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
      const current = cartRef.current;

      // If cart has items from a different provider, show confirmation dialog
      if (current.providerId && current.providerId !== providerId) {
        setPendingItem({ meal, providerId, providerName });
        setShowProviderConflict(true);
        return;
      }

      // No conflict — add directly
      setCart((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.meal.id === meal.id,
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
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

  const handleConfirmProviderSwitch = useCallback(() => {
    if (!pendingItem) return;
    const { meal, providerId, providerName } = pendingItem;
    setCart({
      providerId,
      providerName,
      items: [{ meal, quantity: 1 }],
    });
    toast.success(`${meal.name} added to cart`);
    setPendingItem(null);
    setShowProviderConflict(false);
  }, [pendingItem]);

  const handleCancelProviderSwitch = useCallback(() => {
    setPendingItem(null);
    setShowProviderConflict(false);
  }, []);

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
    <>
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

      {/* Provider-conflict confirmation dialog */}
      <AlertDialog
        open={showProviderConflict}
        onOpenChange={(open) => {
          if (!open) handleCancelProviderSwitch();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace cart items?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart has items from{" "}
              <span className="font-semibold">{cart.providerName}</span>. Adding
              this item will clear your current cart and start a new one from{" "}
              <span className="font-semibold">{pendingItem?.providerName}</span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelProviderSwitch}>
              Keep current cart
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmProviderSwitch}>
              Clear &amp; add new item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
