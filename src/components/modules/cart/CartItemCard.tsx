"use client";

import { useCart } from "@/contexts/CartContext";
import { CartItem as CartItemType } from "@/types/cart.type";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

export default function CartItemCard({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
        {item.meal.image ? (
          <Image
            src={item.meal.image}
            alt={item.meal.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{item.meal.name}</h4>
        <p className="text-sm text-muted-foreground">
          ৳{Number(item.meal.price).toFixed(2)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              if (item.quantity === 1) {
                removeItem(item.meal.id);
              } else {
                updateQuantity(item.meal.id, item.quantity - 1);
              }
            }}
          >
            {item.quantity === 1 ? (
              <Trash2 className="h-3 w-3 text-destructive" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
          </Button>

          <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Line total */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.meal.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        <p className="text-sm font-semibold">
          ৳{(Number(item.meal.price) * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
