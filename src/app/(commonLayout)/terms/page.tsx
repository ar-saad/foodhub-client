import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | FoodHub",
  description: "Read our terms and conditions for using the FoodHub platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-background min-h-screen py-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 text-center">
          Terms & <span className="text-primary">Conditions</span>
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the FoodHub website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p>
              FoodHub provides a platform that connects customers with local restaurants. We facilitate the ordering and delivery of food items. We do not prepare the food ourselves; the responsibility for food quality and preparation lies solely with the restaurant partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
            <p>
              To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Ordering and Payment</h2>
            <p>
              When you place an order, you agree to pay the total price, including food costs, delivery fees, and any applicable taxes. Payments are processed securely via Stripe. All sales are final, though refunds may be issued at our discretion in cases of significant order errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Delivery</h2>
            <p>
              We aim to provide accurate estimated delivery times, but these are not guaranteed. Delivery times may vary based on weather, traffic, and restaurant preparation times. It is your responsibility to be available to receive the order at the provided address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Restaurant Partners</h2>
            <p>
              Restaurant partners are independent entities. While we strive to partner with high-quality establishments, FoodHub is not liable for any issues arising from the food prepared by these partners, including allergies or quality concerns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
            <p>
              All content on the FoodHub platform, including text, graphics, logos, and software, is the property of FoodHub or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <p>
              FoodHub shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services. Our total liability for any claim arising from these terms shall not exceed the amount paid by you for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Your continued use of the platform after changes are posted constitutes your acceptance of the new terms.
            </p>
          </section>

          <p className="text-sm italic pt-8 border-t border-border">
            Last updated: May 1, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
