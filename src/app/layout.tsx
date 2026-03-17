import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Providers from "@/lib/redux/providers";
import LayoutClient from "./layoutClient";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestPro",
  description: "Mock test platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <Providers>
            <Toaster position="top-right" richColors />
            <LayoutClient header={<Header />} footer={<Footer />}>
              <section className=" min-h-screen bg-background ">
                {children}
              </section>
            </LayoutClient>
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
