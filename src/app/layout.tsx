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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pungranger.chidahp.com";
const ogImage = "/pung-ranger-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
  description:
    "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
  openGraph: {
    title: "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
    description:
      "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
    url: siteUrl,
    siteName: "พังเรนเจอร์",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
    description:
      "พังเรนเจอร์ | สำนักพิมพ์ของเหล่าคนพัง ที่ลุกขึ้นมาทำสิ่งที่โคตรจริงจัง",
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
