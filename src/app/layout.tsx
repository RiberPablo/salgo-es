import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "salgo.es — Tu próximo plan empieza aquí",
  description:
    "Encuentra discotecas, pubs, tardeos y bares en Madrid. Filtra por zona, tipo de local o música y descubre dónde salir esta noche.",
  openGraph: {
    title: "salgo.es — Tu próximo plan empieza aquí",
    description:
      "Encuentra discotecas, pubs, tardeos y bares en Madrid. Filtra por zona, tipo de local o música y descubre dónde salir esta noche.",
    url: "https://www.salgo.es",
    siteName: "salgo.es",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "salgo.es — Tu próximo plan empieza aquí",
    description:
      "Encuentra discotecas, pubs, tardeos y bares en Madrid. Filtra por zona, tipo de local o música y descubre dónde salir esta noche.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
