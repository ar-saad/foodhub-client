"use client";

import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import CartItemCard from "./CartItemCard";
import CartSummary from "./CartSummary";

export default function CartSheet() {
  const { cart, isCartOpen, setIsCartOpen, totalItems } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
          {cart.providerName && (
            <p className="text-sm text-muted-foreground">
              From <span className="font-medium">{cart.providerName}</span>
            </p>
          )}
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground px-4">
            <ShoppingBag className="h-16 w-16 stroke-[1.2]" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-center">
              Browse meals and add them to your cart to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="space-y-1">
                {cart.items.map((item) => (
                  <CartItemCard key={item.meal.id} item={item} />
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <CartSummary />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
