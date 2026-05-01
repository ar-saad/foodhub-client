import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FoodHub",
  description: "Learn how FoodHub collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background min-h-screen py-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 text-center">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              Welcome to FoodHub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at arsaad.dev@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p>
              We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> We collect your name, email address, phone number, and delivery address when you register or place an order.</li>
              <li><strong>Payment Data:</strong> We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by Stripe.</li>
              <li><strong>Social Media Login Data:</strong> We may provide you with the option to register with us using your existing social media account details, like your Google account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To fulfill and manage your orders.</li>
              <li>To deliver services to the user.</li>
              <li>To respond to user inquiries/offer support to users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. This includes sharing with restaurant partners and delivery personnel to fulfill your orders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. How Long Do We Keep Your Information?</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. How Do We Keep Your Information Safe?</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures. We use SSL encryption and secure payment gateways (Stripe) to protect your sensitive data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Privacy Rights</h2>
            <p>
              In some regions (like the EEA), you have certain rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, to request rectification or erasure, and to restrict the processing of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Updates To This Policy</h2>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
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
