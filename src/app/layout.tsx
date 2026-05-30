import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SupportWidget from "@/components/SupportWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ФСИН: калькулятор расчета компенсации за неполученное вещевое довольствие",
  description: "Профессиональный онлайн-калькулятор расчета компенсации за неполученное вещевое довольствие сотрудников ФСИН (ведомственной вещевки) в период прохождения службы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <SupportWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
