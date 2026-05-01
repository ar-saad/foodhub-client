import { Metadata } from "next";
import ContactForm from "@/components/modules/contact/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact FoodHub — Get In Touch",
  description:
    "Have a question, feedback, or need support? Reach out to the FoodHub team. We're here to help.",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "arsaad.dev@gmail.com",
    href: "mailto:arsaad.dev@gmail.com",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1749-855360",
    href: "tel:+8801749855360",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bangladesh",
    href: null,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="w-full py-16 md:py-24 bg-secondary/20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            We&apos;d Love to{" "}
            <span className="text-primary">Hear From You</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question about a delivery, want to partner with
            us, or just want to say hi — our inbox is always open.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left — contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Contact Information
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Fill out the form and we&apos;ll get back to you as soon as
                  possible. You can also reach us directly through any of the
                  channels below.
                </p>
              </div>

              <div className="space-y-4">
                {contactDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-200"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${detail.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <detail.icon
                        className={`w-5 h-5 ${detail.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
