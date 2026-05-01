"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I place an order on FoodHub?",
    answer:
      "Simply enter your delivery address in the search bar, browse restaurants or cuisines available in your area, add items to your cart, and check out. You can pay online by card or choose cash on delivery.",
  },
  {
    question: "What is the average delivery time?",
    answer:
      "Most orders are delivered within 25–40 minutes depending on the restaurant's preparation time and your distance from them. You can track your order status in real time from your dashboard.",
  },
  {
    question: "Can I order from multiple restaurants at once?",
    answer:
      "Currently, each order is placed with a single restaurant to ensure food quality and accurate delivery times. You can always place a new order from a different restaurant right after.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "FoodHub accepts major debit and credit cards (Visa, Mastercard), as well as cash on delivery. We use industry-standard encryption to keep your payment information safe.",
  },
  {
    question: "How do I become a FoodHub restaurant partner?",
    answer:
      "Register for a Provider account on FoodHub and complete your restaurant profile. Our team reviews applications within 1–2 business days. Once approved, you can start listing your menu and receiving orders.",
  },
  {
    question: "What if my order is wrong or missing items?",
    answer:
      "We're sorry to hear that! Please contact us through the Help & Support page with your order ID, and our team will make it right — either with a refund, credit, or replacement order.",
  },
  {
    question: "Is there a minimum order value?",
    answer:
      "Minimum order values vary by restaurant and are displayed clearly on each restaurant's page before you add items to your cart. There is no platform-wide minimum.",
  },
  {
    question: "Can I schedule a delivery for later?",
    answer:
      "Scheduled delivery is a feature we are actively working on. For now, all orders are dispatched immediately. Stay tuned for this upcoming feature!",
  },
];

export default function FAQ() {
  return (
    <section
      className="w-full py-16 md:py-24 bg-secondary/20"
      aria-labelledby="faq-heading"
    >
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about ordering with FoodHub. Can&apos;t
            find your answer?{" "}
            <a
              href="/contact"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Contact us
            </a>
            .
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border rounded-xl bg-card px-6 data-[state=open]:border-primary/40 transition-colors duration-200"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-5 transition-colors duration-200">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
