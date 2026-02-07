"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function CartSummary() {
  const router = useRouter();
  const { totalItems, totalPrice, clearCart, setIsCartOpen } = useCart();

  return (
    <div className="space-y-3 pt-2">
      <Separator />
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span>৳{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span className="text-primary">৳{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          setIsCartOpen(false);
          router.push("/checkout");
        }}
      >
        Proceed to Checkout
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full text-destructive hover:text-destructive"
        onClick={clearCart}
      >
        Clear Cart
      </Button>
    </div>
  );
}
