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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pangranger.chidahp.com";
const ogImage = "/pangranger-logo-belief.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "สิ้นสุดทางเชื่อ | Matrix Quiz",
  description:
    "ชวนคุณสำรวจว่าคุณใช้ชีวิตด้วยความเชื่อแค่ไหน พร้อมผลลัพธ์แบ่งกลุ่มแบบแชร์ได้ทันที",
  openGraph: {
    title: "สิ้นสุดทางเชื่อ | Matrix Quiz",
    description:
      "ทำแบบทดสอบเพื่อดูว่าคุณใช้ชีวิตด้วยความเชื่อมากแค่ไหน แชร์ผลให้เพื่อนลองทำต่อได้ทันที",
    url: siteUrl,
    siteName: "สิ้นสุดทางเชื่อ Quiz",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "สิ้นสุดทางเชื่อ Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "สิ้นสุดทางเชื่อ | Matrix Quiz",
    description:
      "ทำแบบทดสอบว่าคุณใช้ชีวิตด้วยความเชื่อแค่ไหน แล้วแชร์ผลให้เพื่อนได้ทันที",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
