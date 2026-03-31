import Link from "next/link";
import SignedLetterExperience from "./SignedLetterExperience";

type GiftResponse = {
  customer_name: string;
  books_purchased: string[];
  slug: string;
  signed_image_url?: string | null;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const GIFT_API_BASE = "https://playground.chidahp.com/api/pungranger/gift";
async function getGiftBySlug(slug: string): Promise<GiftResponse | null> {
  try {
    const response = await fetch(`${GIFT_API_BASE}/${encodeURIComponent(slug)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GiftResponse;
    if (!data?.slug) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export default async function GiftSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const gift = await getGiftBySlug(slug);
  if (gift) {
    return <SignedLetterExperience gift={gift} />;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 py-10 text-zinc-100 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-3xl rounded-3xl border border-rose-500/30 bg-zinc-900/75 p-6 backdrop-blur sm:p-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">ไม่พบข้อความนี้</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
          ลิงก์นี้อาจหมดอายุ หรือ slug ไม่ถูกต้อง กรุณาลองสแกน QR ใหม่อีกครั้ง
        </p>
        <p className="mt-2 text-xs text-zinc-500 sm:text-sm">slug ที่ตรวจสอบ: {slug}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          กลับหน้าหลัก
        </Link>
      </section>
    </main>
  );
}
