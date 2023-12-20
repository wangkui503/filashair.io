// These styles apply to every route in the application
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthStatus from "@/components/auth-status";
import { Suspense } from "react";
import NextAuthProvider from '@/components/NextAuthProvider';
import FilashAirLogo from "@/components/filashAirLogo";
import 'public/assets/css/lineicons.css'
import 'public/assets/css/animate.css'
import 'public/assets/css/tailwindcss.css'
import './main.css'

import {CounterProvider} from "@/components/context/context"





const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "filashAir";
const description =
  "fialshAir is the fundamental web app that is leveraging the filash servers and clusters to communicate with files globally.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://www.filash.io/air"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <FilashAirLogo/>
        <CounterProvider>
      <NextAuthProvider>
        <Toaster />
        <Suspense fallback="Loading...">
          <AuthStatus />          
        </Suspense>
        
        {children}
        </NextAuthProvider>
        </CounterProvider>
      </body>
    </html>
  );
}
