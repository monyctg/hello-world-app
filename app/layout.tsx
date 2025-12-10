import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import WhatsAppBtn from "./components/WhatsAppBtn";
import ToastProvider from "./components/ToastProvider";
// Import new components
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Magfar - Full Stack Developer",
  description: "Portfolio of a Top Rated Upwork Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        
        {/* GLOBAL HEADER */}
        <Header />

        {children}
        
        {/* GLOBAL FOOTER */}
        <Footer />
        
        <WhatsAppBtn />
        <Suspense fallback={null}>
          <ToastProvider />
        </Suspense>
      </body>
    </html>
  );
}