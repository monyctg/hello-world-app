import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react"; // 1. Import Suspense
import "./globals.css";
import WhatsAppBtn from "./components/WhatsAppBtn";
import ToastProvider from "./components/ToastProvider";

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
        {children}
        
        <WhatsAppBtn />
        
        {/* 2. Wrap ToastProvider in Suspense to fix the build error */}
        <Suspense fallback={null}>
          <ToastProvider />
        </Suspense>
        
      </body>
    </html>
  );
}git add .
git commit -m "Wrapped ToastProvider in Suspense to fix build"
git push