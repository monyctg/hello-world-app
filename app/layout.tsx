import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Google Font
import "./globals.css";
import WhatsAppBtn from "./components/WhatsAppBtn";

// 2. Configure the font
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
      <body
        suppressHydrationWarning={true}
        className={inter.className} // 3. Apply the font class here
      >
        {children}
        <WhatsAppBtn />
      </body>
    </html>
  );
}