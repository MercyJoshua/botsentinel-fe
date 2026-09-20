import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/page-header";
import { AnalysisProvider } from "@/contexts/analysis-context";
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
  title: {
    default: "BotSentinel",
    template: "%s | BotSentinel",
  },
  description:
    "Machine learning-based botnet traffic detection and analysis.",
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
      <body className="min-h-screen">
        <AnalysisProvider>
          <div className="app-shell">
            <Header />
            {children}
            <Footer />
          </div>
        </AnalysisProvider>
      </body>
    </html>
  );
}

