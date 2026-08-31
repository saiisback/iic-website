import type { Metadata } from "next";
import { Geist, Geist_Mono, League_Gothic, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ScrollNav } from "../components/nav/ScrollNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leagueGothic = League_Gothic({
  variable: "--font-league-gothic",
  subsets: ["latin"],
  weight: "400",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "IIC — Innovation Council",
  description: "Institution's Innovation Council — Where Ideas Become Impact",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${leagueGothic.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollNav />
        {children}
      </body>
    </html>
  );
}
