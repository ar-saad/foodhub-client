"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }
    setStatus("loading");
    authClient
      .verifyEmail({ query: { token } })
      .then(() => {
        setStatus("success");
        setMessage(
          "Your email has been successfully verified. Redirecting to home page...",
        );
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.message ||
            "Verification failed. The token may be invalid or expired.",
        );
      });
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
      {status === "loading" && <p>Verifying your email...</p>}
      {status !== "loading" && (
        <p className={status === "success" ? "text-green-600" : "text-red-600"}>
          {message}
        </p>
      )}
    </div>
  );
}
