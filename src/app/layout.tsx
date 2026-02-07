import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";

// Google Font - Poppins
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Multiple weights for flexibility
  display: "swap",
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "FoodHub",
  description: "Created with ❤️ using Next.js",
};

// Accepts children, children are the pages that this layout file will wrap
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <UserProvider>
          {children}
          <Toaster richColors />
        </UserProvider>
      </body>
    </html>
  );
}
