"use client";

import { useEffect, useRef, useState } from "react";
import { Store, ShoppingBag, Users, Clock } from "lucide-react";

interface StatsSectionProps {
  restaurantCount?: number;
  customerCount?: number;
  orderCount?: number;
}

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bg: string;
}

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300 group">
      <div
        className={`w-16 h-16 rounded-full ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <stat.icon className={`w-8 h-8 ${stat.color}`} aria-hidden="true" />
      </div>
      <p className="text-4xl md:text-5xl font-extrabold text-foreground tabular-nums">
        {count.toLocaleString()}
        <span className="text-primary">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-base text-muted-foreground font-medium">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsSection({
  restaurantCount = 0,
  customerCount = 0,
  orderCount = 0,
}: StatsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats: Stat[] = [
    {
      icon: Store,
      value: restaurantCount,
      suffix: "+",
      label: "Partner Restaurants",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: ShoppingBag,
      value: orderCount,
      suffix: "+",
      label: "Orders Delivered",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      icon: Users,
      value: customerCount,
      suffix: "+",
      label: "Happy Customers",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Clock,
      value: 30,
      suffix: " min",
      label: "Avg. Delivery Time",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full py-16 md:py-24 bg-background"
      aria-labelledby="stats-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            By The Numbers
          </p>
          <h2
            id="stats-heading"
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Trusted by Thousands
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real numbers that speak to the quality and reach of FoodHub across
            the city.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
