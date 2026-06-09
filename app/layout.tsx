import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {


  title: "Notify — Your thoughts, beautifully organized",
  description:
    "The modern workspace for notes, tasks, and ideas. Capture, connect, and never lose a thought again.",
  icons: {
    icon: "/notify.ico",
  }

};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        
        <Navbar />
        {children}

      </body>
        
    </html>

  );
}
