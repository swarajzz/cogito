import type React from "react";
import type { Metadata } from "next";
import "@/src/styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cogito - AI-Powered Concept Mapping",
  description:
    "Transform any topic into a visual knowledge map with AI-powered concept mapping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
