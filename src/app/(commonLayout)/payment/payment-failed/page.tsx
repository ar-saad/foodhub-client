"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardHeader className="pt-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Payment Failed or Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <p className="text-muted-foreground">
            Your payment could not be processed or you cancelled the checkout. Your order has not been placed.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/checkout">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Return to Checkout
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/browse">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
