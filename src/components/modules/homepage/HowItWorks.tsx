import { MapPin, ShoppingBag, Bike } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: MapPin,
    title: "Set Your Location",
    description:
      "Enter your delivery address and discover all the restaurants delivering to your doorstep right now.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    id: 2,
    icon: ShoppingBag,
    title: "Choose & Order",
    description:
      "Browse menus from your favorite restaurants, pick your meals, and place your order in just a few taps.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    id: 3,
    icon: Bike,
    title: "Fast Delivery",
    description:
      "Sit back and relax. Your food is prepared fresh and delivered straight to your door, hot and on time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="w-full py-16 md:py-24 bg-secondary/20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Simple & Fast
          </p>
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            How It{" "}
            <span className="text-primary">Works</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting your favorite food delivered has never been easier. Three
            simple steps and your meal is on its way.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-12 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-border"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step number bubble + icon */}
              <div className="relative mb-6">
                {/* Outer ring */}
                <div
                  className={`w-24 h-24 rounded-full ${step.bg} border-2 ${step.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <step.icon
                    className={`w-10 h-10 ${step.color}`}
                    aria-hidden="true"
                  />
                </div>
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {step.id}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
