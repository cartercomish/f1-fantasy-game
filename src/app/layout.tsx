import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "F1 Fantasy 2026",
  description: "Friend league F1 fantasy standings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} antialiased bg-[#15151E] text-white min-h-screen`}>
        <header className="border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white hover:text-[#FF1E00] transition-colors">
              F1 FANTASY
            </a>
            <div className="flex gap-6 text-sm text-[#8F8F9D]">
              <a href="/" className="hover:text-white transition-colors">Dashboard</a>
              <a href="/rules" className="hover:text-white transition-colors">Rules</a>
              <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
