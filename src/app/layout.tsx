import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WordPress Blog",
  description: "Next.js + WordPress headless blog",
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
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold">WP Blog</a>
            <nav className="text-sm">
              <a href="/" className="hover:underline">Home</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} WP Blog</div>
        </footer>
      </body>
    </html>
  );
}
