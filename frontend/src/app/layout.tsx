import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heartometer — Estimate your chance of heart disease",
  description:
    "Heartometer turns blood sugar, blood pressure, age, and alcohol status into a machine-learning prediction of heart-disease risk.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
