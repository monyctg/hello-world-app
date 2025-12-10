import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppBtn from "./components/WhatsAppBtn";
import ToastProvider from "./components/ToastProvider"; // 1. Import this

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
        <ToastProvider /> {/* 2. Add this line */}
      </body>
    </html>
  );
}