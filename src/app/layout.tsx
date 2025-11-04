import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Providers from "@/lib/redux/providers";
import LayoutClient from "./layoutClient";

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
        <Providers>
          {/* <GlobalLoader /> */}
           <LayoutClient
            header={<Header />}
            footer={<Footer />}
          >
            {children}
            {/* <Footer /> */}
          </LayoutClient>

          {/* <Header />
          {children}
          <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
