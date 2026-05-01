import { Zap, ShieldCheck, Wallet, HeartHandshake, Leaf, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    description:
      "Our optimized routing ensures your food arrives hot and fresh in under 30 minutes on average.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure Payments",
    description:
      "Pay with confidence. We support multiple secure payment methods including cards and cash on delivery.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Leaf,
    title: "Fresh, Quality Ingredients",
    description:
      "Every partner restaurant is vetted for quality and hygiene standards so you only get the best.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Wallet,
    title: "Best Value for Money",
    description:
      "Competitive prices, exclusive deals, and no hidden charges — your wallet stays happy.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: HeartHandshake,
    title: "Support Local Restaurants",
    description:
      "We partner with independent local restaurants helping them grow while giving you authentic choices.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Star,
    title: "Real Customer Reviews",
    description:
      "Genuine ratings from verified customers help you choose the best restaurant every time.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export default function WhyChooseFoodHub() {
  return (
    <section
      className="w-full py-16 md:py-24 bg-secondary/20"
      aria-labelledby="why-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Why FoodHub?
          </p>
          <h2
            id="why-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Everything You Need,{" "}
            <span className="text-primary">Delivered</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            We're more than a food delivery app — we're your reliable partner
            for delicious meals, every single day.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={cn(
                "group p-6 rounded-2xl border border-border bg-card",
                "hover:shadow-lg hover:border-primary/30",
                "transition-all duration-300"
              )}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon
                  className={`w-6 h-6 ${feature.color}`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
