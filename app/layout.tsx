import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Providers from "./providers";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title =
  "Umedu – Private Student Forums | Secure & Anonymous Social Platform";

const description =
  "Umedu is a secure and anonymous social platform that automatically creates private forums for students using their .edu email. Join your school's exclusive space—no personal info stored.";

export const metadata: Metadata = {
  metadataBase: new URL("https://umedu.omsimos.com"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Josh Daniel Bañares" }],
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "Umedu",
    url: "https://umedu.omsimos.com",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="max-w-xl mx-auto container">{children}</main>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
