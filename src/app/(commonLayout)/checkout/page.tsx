"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { createOrder } from "@/actions/order.actions";
import { PaymentType, OrderItem } from "@/types/order.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ShoppingBag,
  Banknote,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const TAX_RATE = 0.05; // 5%
const DELIVERY_CHARGE = 50; // BDT 50

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart, totalItems } = useCart();
  const { user } = useUser();

  const [address, setAddress] = useState(user?.address || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = totalPrice;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax + DELIVERY_CHARGE;

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground stroke-[1.2]" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Add some meals to your cart before checking out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/browse">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      router.push("/login");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }

    if (!cart.providerId) {
      toast.error("Cart is missing provider information.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = cart.items.map((item) => ({
        mealId: item.meal.id,
        quantity: item.quantity,
        price: Number(item.meal.price),
      }));

      const { error } = await createOrder({
        customerId: user.id,
        providerId: cart.providerId,
        orderItems,
        totalAmount: Number(grandTotal.toFixed(2)),
        address: address.trim(),
        paymentType: PaymentType.COD,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {user?.address && address !== user.address && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setAddress(user.address || "")}
                  >
                    Use saved address
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4">
                <Banknote className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">
                    Pay when your order is delivered
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Selected
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Items
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"} from{" "}
                  {cart.providerName})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.meal.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      {item.meal.image && (
                        <img
                          src={item.meal.image}
                          alt={item.meal.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.meal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ৳{Number(item.meal.price).toFixed(2)} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ৳{(Number(item.meal.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span>৳{DELIVERY_CHARGE.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">৳{grandTotal.toFixed(2)}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !address.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order — ৳${grandTotal.toFixed(2)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to pay the total amount upon
                delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
