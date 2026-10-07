import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Providers } from "./providers";

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
      <body className="font-sans antialiased transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
