import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAYFLOW — Human Resource Management",
  description: "A premium HRMS platform for modern teams. Manage attendance, leave, payroll, and people — beautifully.",
  keywords: ["HRMS", "HR management", "attendance", "payroll", "leave management"],
  openGraph: {
    title: "DAYFLOW",
    description: "Premium HRMS for modern teams",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
