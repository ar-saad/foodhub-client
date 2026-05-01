import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store } from "lucide-react";

export default function BecomePartnerCTA() {
  return (
    <section
      className="w-full py-16 md:py-24 bg-background"
      aria-labelledby="partner-cta-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16 text-center">
          {/* Decorative circles */}
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-white" aria-hidden="true" />
            </div>

            {/* Heading */}
            <h2
              id="partner-cta-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl"
            >
              Own a Restaurant? Partner With Us!
            </h2>

            {/* Subtext */}
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl">
              Join hundreds of local restaurants already growing their business
              with FoodHub. Reach thousands of hungry customers, manage your
              menu easily, and get paid quickly.
            </p>

            {/* Benefits list */}
            <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/90">
              {[
                "Zero setup fee",
                "Real-time order management",
                "Dedicated partner support",
                "Detailed sales analytics",
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    aria-hidden="true"
                  />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg px-8"
              >
                <Link href="/become-partner">Register Your Restaurant</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
