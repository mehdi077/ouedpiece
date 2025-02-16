import type { Metadata } from "next";
import { IBM_Plex_Sans_Devanagari } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { Toaster } from "@/components/ui/toaster"
import { translations } from '@/lib/translations';

const ibmPlexSansDevanagari = IBM_Plex_Sans_Devanagari({
  variable: "--font-ibm-plex-sans-devanagari",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: translations.meta.title,
  description: translations.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${ibmPlexSansDevanagari.variable} antialiased bg-[#E5EAED]`}>
        <ConvexClientProvider>
          <ClerkProvider>
            <SyncUserWithConvex />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
