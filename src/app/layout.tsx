import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ngaris Managed — Build in Zimbabwe. Manage from Anywhere.",
    template: "%s · Ngaris Managed",
  },
  description:
    "Ngaris Managed helps diaspora and local clients identify verified service providers in Zimbabwe, select the right team together, and manage construction and property projects from anywhere.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[#032842]">
        {children}
      </body>
    </html>
  );
}
