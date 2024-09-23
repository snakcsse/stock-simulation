import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: "%s | Stock Simulation",
    default: "Stock Simulation",
  },
  description: "Simulate buying and selling stocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
