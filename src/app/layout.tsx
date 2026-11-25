import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ngaris Managed — Build in Zimbabwe. Manage from Anywhere.",
    template: "%s · Ngaris Managed",
  },
  description:
    "Ngaris Managed provides accountable construction management for Zimbabwe builds — verified progress, financial controls, and diaspora-ready project tracking.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] font-sans text-[#15334A]">
        {children}
      </body>
    </html>
  );
}
