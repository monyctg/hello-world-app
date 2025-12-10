import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// 1. IMPORT THE BUTTON 
import WhatsAppBtn from "./components/WhatsAppBtn";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 2. PLACE IT HERE */}
        <WhatsAppBtn />
        
      </body>
    </html>
  );
}