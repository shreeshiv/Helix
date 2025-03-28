import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { SearchModeProvider } from "@/contexts/search-mode-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helix | AI Recruiting Assistant",
  description: "AI-powered recruiting outreach tool for crafting personalized candidate sequences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}>
        <SearchModeProvider>
          <div className="flex h-screen">
            <div className="hidden md:flex w-80 flex-col fixed inset-y-0 border-r border-zinc-800">
              <Sidebar />
            </div>
            <main className="md:pl-80 flex-1">
              {children}
            </main>
          </div>
        </SearchModeProvider>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
