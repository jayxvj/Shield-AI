import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shield-AI | AI-Powered Cyber Threat Detection & Response",
  description:
    "Next-generation SOC frontend for real-time network traffic anomaly detection, threat classification, explainable AI (SHAP), and automated mitigation playbooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#F9FAFB] dark:bg-[#0B0F19] text-[#111827] dark:text-white antialiased transition-colors duration-200`}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
