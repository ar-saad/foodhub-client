"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/maqvnydy";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json();
        setErrorMsg(
          json?.errors?.[0]?.message ||
            "Something went wrong. Please try again.",
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-border bg-card h-full min-h-80 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thanks for reaching out. We&apos;ll get back to you at your email
          address within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-2"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 rounded-2xl border border-border bg-card space-y-6"
      noValidate
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
        <p className="text-sm text-muted-foreground mt-1">
          All fields marked with <span className="text-primary">*</span> are
          required.
        </p>
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your full name"
            required
            minLength={2}
            disabled={status === "submitting"}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email <span className="text-primary">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={status === "submitting"}
            className="bg-background"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          Subject <span className="text-primary">*</span>
        </Label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="What is this about?"
          required
          disabled={status === "submitting"}
          className="bg-background"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="contact-message">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Write your message here..."
          required
          minLength={10}
          rows={6}
          disabled={status === "submitting"}
          className="bg-background resize-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-destructive font-medium" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full font-semibold"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" aria-hidden="true" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
