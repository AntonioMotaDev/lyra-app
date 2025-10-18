import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lyra ",
  description: "Aplicación web con metrónomo y afinador.",
  keywords: ["música", "metrónomo", "afinador", "guitarra", "bajo", "herramientas musicales"],
  authors: [{ name: "Lyra Team" }],
  openGraph: {
    title: "Lyra - Tu Compañero Musical",
    description: "Herramientas musicales profesionales: metrónomo y afinador para guitarra y bajo",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#00051F" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
