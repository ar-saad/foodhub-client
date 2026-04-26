"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <Card className="max-w-md mx-auto text-center border-green-200">
      <CardHeader className="pt-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          Payment Successful!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <p className="text-muted-foreground">
          Thank you for your order. Your payment has been processed successfully. An invoice has been sent to your email.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/orders">
              View My Orders
              <ArrowRight className="ml-2 w-4 h-4" />
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
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
