import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // ✅ Google Font
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Font setup
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hidden Voices",
  description: "Send and receive honest anonymous feedback easily and securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${poppins.className} bg-background text-foreground min-h-screen`}>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
