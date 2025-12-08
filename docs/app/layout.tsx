import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Food Calorie Calculator App Architecture | Aashish Joshi",
  description:
    "A modern full-stack web app architecture presentation for tracking daily calorie intake. Built with Next.js, .NET Core, and SQL Server.",
  keywords: [
    "calorie calculator",
    "food tracking",
    "nutrition app",
    "full-stack development",
    "Next.js",
    ".NET Core",
    "SQL Server",
  ],
  authors: [{ name: "Aashish Joshi" }],
  openGraph: {
    title: "Food Calorie Calculator App Architecture",
    description:
      "A modern full-stack web app for tracking daily calorie intake",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
