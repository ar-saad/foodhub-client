import { Metadata } from "next";
import { getPlatformStats } from "@/actions/stats.actions";
import {
  Heart,
  Zap,
  ShieldCheck,
  Users,
  Store,
  Target,
  Handshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About FoodHub — Our Story & Mission",
  description:
    "Learn about FoodHub — the food delivery platform connecting hungry people with the best local restaurants, built with passion in Bangladesh.",
};

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with one question: does this make the experience better for our customers?",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Speed & Reliability",
    description:
      "We obsess over delivery times. Fresh, hot food delivered fast is not a luxury — it's the standard we set.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "From honest pricing to genuine reviews, we believe in a platform our users can trust completely.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Handshake,
    title: "Supporting Local",
    description:
      "We are proud to amplify independent local restaurants, helping them grow alongside us.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export default async function AboutPage() {
  const statsResponse = await getPlatformStats();
  const platformStats = statsResponse.data;

  const stats = [
    {
      icon: Store,
      value: platformStats?.restaurantCount?.toLocaleString() ?? "—",
      label: "Partner Restaurants",
    },
    {
      icon: Users,
      value: platformStats?.customerCount?.toLocaleString() ?? "—",
      label: "Happy Customers",
    },
    {
      icon: Target,
      value: platformStats?.orderCount?.toLocaleString() ?? "—",
      label: "Orders Delivered",
    },
    { icon: Zap, value: "~30 min", label: "Avg. Delivery Time" },
  ];

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="w-full py-20 md:py-28 bg-secondary/20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
            Food That Brings{" "}
            <span className="text-primary">People Together</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FoodHub was born out of a simple frustration — finding and ordering
            great local food should be effortless. We built the platform we
            always wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Connecting Hungry People With Great Local Food
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                FoodHub is a food delivery platform built for Bangladesh,
                designed to empower local restaurant owners and delight everyday
                customers. We believe that the best meals come from your
                neighborhood — not from global chains — and our platform exists
                to make those meals accessible with just a few clicks.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We partner with independent restaurants, provide them with tools
                to manage their menus and orders, and give customers a seamless
                experience from browse to doorstep. No fuss, no hidden fees —
                just great food, delivered fast.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl border border-border bg-card text-center hover:shadow-md transition-shadow duration-300"
                >
                  <stat.icon
                    className="w-8 h-8 text-primary mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-16 md:py-24 bg-secondary/20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center"
              >
                <div
                  className={`w-14 h-14 rounded-full ${value.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon
                    className={`w-7 h-7 ${value.color}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      {/* <section className="w-full py-16 md:py-24">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            How It Started
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            A Project Born From Passion
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              FoodHub started as a university project — an exploration into
              what a modern, full-stack food delivery platform could look like
              when built with care and the right technology. What began as an
              assignment quickly became something more: a real, working product
              that we are proud of.
            </p>
            <p>
              Built with Next.js on the frontend and Node.js with PostgreSQL on
              the backend, FoodHub is designed to be fast, scalable, and
              maintainable. Every feature — from real-time cart management to
              Stripe payments and role-based dashboards — has been built from
              scratch with production readiness in mind.
            </p>
            <p>
              We believe that building real things is the best way to learn.
              FoodHub is our proof of that belief — a showcase of modern web
              development skills applied to a meaningful, everyday problem.
            </p>
          </div>
        </div>
      </section> */}
    </main>
  );
}
