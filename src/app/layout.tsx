import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import LenisProvider from "./(components)/LenisProvider";
import Particles from "./(components)/Particles";
import ScrollToTop from "./(components)/ScrollToTop";
import PillNav from "./(components)/PillNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ByteBlog - Modern Blog Platform",
  description: "A modern, feature-rich blog platform built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen overflow-x-hidden`}
      >
        <SessionProvider>
          <LenisProvider>
            {/* Background particles covering full viewport */}
            <div className="fixed inset-0 z-0">
              <Particles 
                particleCount={300}
                particleSpread={12}
                speed={0.15}
                moveParticlesOnHover={true}
                particleHoverFactor={2}
                alphaParticles={true}
                particleBaseSize={120}
                sizeRandomness={1.5}
                cameraDistance={25}
                particleColors={['#ffffff', '#e0e7ff', '#c7d2fe', '#a5b4fc']}
              />
            </div>
            
            {/* Navigation overlay */}
            <div className="relative z-50">
              <PillNav />
            </div>
            
            {/* Main content with proper z-index */}
            <main className="relative z-10 min-h-screen">
              {children}
            </main>
            
            {/* Scroll to top button */}
            <div className="relative z-40">
              <ScrollToTop />
            </div>
          </LenisProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
