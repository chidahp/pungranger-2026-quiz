"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";

type GiftResponse = {
  customer_name: string;
  books_purchased: string[];
  slug: string;
  signed_image_url?: string | null;
  signed_image_urls?: Record<string, string> | null;
};

type SignedLetterExperienceProps = {
  gift: GiftResponse;
};

const BOOK_META: Record<
  string,
  { title: string; writer: string; note: string; fallbackImage: string }
> = {
  belief: {
    title: "สิ้นสุดทางเชื่อ",
    writer: "นักเขียนที่ไม่ได้มาพบทุกคน: มาชู, มาร์ค",
    note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
    fallbackImage: "/pung-ranger-logo.png",
  },
  china: {
    title: "Made in China เพื่อนนักเรียนคนแปลกหน้าและอาอิ๋",
    writer: "นักเขียน: ดีส วชิรนันท์",
    note: "ฝากถึงผู้อ่าน: ขอบคุณที่เปิดใจให้กับเรื่องราวเล่มนี้",
    fallbackImage: "/pung-ranger-logo.png",
  },
};

function getBookMeta(bookKey: string) {
  return (
    BOOK_META[bookKey] ?? {
      title: bookKey,
      writer: "นักเขียน: พังเรนเจอร์",
      note: "ฝากถึงผู้อ่าน: ขอบคุณที่สนับสนุนพวกเรา",
      fallbackImage: "/pung-ranger-logo.png",
    }
  );
}

export default function SignedLetterExperience({ gift }: SignedLetterExperienceProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState("Save / Share");
  const [imageLoadError, setImageLoadError] = useState(false);

  const purchasedBooks = Array.from(new Set(gift.books_purchased ?? []));
  const [activeBook, setActiveBook] = useState(purchasedBooks[0] ?? "belief");

  const signedImageUrl = useMemo(() => {
    const perBookImage = gift.signed_image_urls?.[activeBook];
    const preferredImage = perBookImage ?? gift.signed_image_url;
    if (!preferredImage || imageLoadError) {
      return getBookMeta(activeBook).fallbackImage;
    }
    return preferredImage;
  }, [activeBook, gift.signed_image_url, gift.signed_image_urls, imageLoadError]);

  const activeMeta = getBookMeta(activeBook);

  const handleSaveOrShare = async () => {
    if (typeof window === "undefined") return;

    const message = `ข้อความจาก ${activeMeta.writer} ถึงคุณ ${gift.customer_name}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Pungranger Signed Letter",
          text: message,
          url: window.location.href,
        });
        setShareLabel("แชร์แล้ว");
        setTimeout(() => setShareLabel("Save / Share"), 2000);
        return;
      }

      const a = document.createElement("a");
      a.href = signedImageUrl;
      a.download = `signed-letter-${activeBook}-${gift.slug}.png`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
      setShareLabel("ดาวน์โหลดแล้ว");
      setTimeout(() => setShareLabel("Save / Share"), 2000);
    } catch {
      setShareLabel("ลองใหม่อีกครั้ง");
      setTimeout(() => setShareLabel("Save / Share"), 2000);
    }
  };

  const handleUnseal = () => {
    setImageLoadError(false);
    setIsOpened(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-3 py-6 text-zinc-100 sm:px-6 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(217,119,6,0.14), transparent 40%), radial-gradient(circle at 90% 0%, rgba(16,185,129,0.12), transparent 45%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[3px_3px] opacity-[0.04]" />

      <section className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-amber-300/35 bg-zinc-900/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="border-b border-amber-400/20 bg-linear-to-r from-amber-500/10 to-emerald-400/10 p-4 sm:p-8">
          <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-500/15 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-amber-100 sm:text-xs sm:tracking-[0.14em]">
            SIGNED LETTER EDITION
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:mt-4 sm:text-5xl">
            ถึงคุณ {gift.customer_name}
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-100/90 sm:mt-3 sm:text-base">
            เลือกแท็บหนังสือเพื่อดูรูปข้อความจากนักเขียนแต่ละคน
          </p>
        </div>

        <div className="p-4 sm:p-8">
          {!isOpened ? (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-6 text-center sm:p-8">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/70 bg-amber-500/10 sm:mb-4 sm:h-16 sm:w-16">
                <span className="text-lg sm:text-xl">✦</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-amber-200/90 sm:text-xs sm:tracking-[0.2em]">sealed for reader</p>
              <p className="mt-2 text-sm font-semibold text-zinc-100 sm:text-lg">
                จดหมายลายเซ็นฉบับพิเศษของคุณพร้อมแล้ว
              </p>
              <button
                type="button"
                onClick={handleUnseal}
                className="mt-5 w-full rounded-2xl border border-amber-200/80 bg-linear-to-r from-amber-500/70 to-yellow-300/50 px-6 py-3 text-sm font-bold tracking-[0.04em] text-white shadow-[0_16px_50px_rgba(245,158,11,0.45)] transition hover:scale-[1.02] hover:brightness-110 sm:mt-6 sm:w-auto sm:px-9 sm:tracking-[0.08em] sm:hover:scale-[1.04]"
              >
                ปลดผนึกจดหมาย
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
                {purchasedBooks.map((bookKey) => {
                  const isActive = activeBook === bookKey;
                  return (
                    <button
                      key={bookKey}
                      type="button"
                      onClick={() => {
                        setActiveBook(bookKey);
                        setImageLoadError(false);
                      }}
                      className={`shrink-0 snap-start rounded-full border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                        isActive
                          ? "border-amber-200 bg-amber-500/20 text-amber-50"
                          : "border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {getBookMeta(bookKey).title}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsViewerOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950"
              >
                <img
                  src={signedImageUrl}
                  alt="Signed letter from writer"
                  className="aspect-4/5 w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                  onError={() => setImageLoadError(true)}
                />
                <div className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 to-transparent p-5 text-left">
                  <p className="text-sm font-semibold text-emerald-200">{activeMeta.writer}</p>
                  <p className="text-xs text-zinc-300">แตะเพื่อดูเต็มจอ</p>
                </div>
              </button>

              <div className="rounded-2xl border border-zinc-600/70 bg-zinc-950/70 p-4 shadow-[inset_0_0_60px_rgba(255,255,255,0.02)]">
                <p className="text-sm font-semibold text-amber-100">{activeMeta.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-200 sm:text-sm">{activeMeta.note}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveOrShare}
                  className="w-full rounded-xl border border-cyan-300/60 bg-cyan-500/20 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:scale-[1.02] hover:bg-cyan-500/30 sm:w-auto"
                >
                  {shareLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(true)}
                  className="w-full rounded-xl border border-amber-300/70 bg-amber-500/20 px-4 py-2.5 text-sm font-semibold text-amber-50 transition hover:scale-[1.02] hover:bg-amber-500/30 sm:w-auto"
                >
                  เปิดเต็มจอ
                </button>
              </div>

              <div className="flex flex-col items-start gap-2 border-t border-zinc-700/70 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <p className="text-zinc-400">
                  รหัสของขวัญ: <span className="font-semibold text-zinc-200">{gift.slug}</span>
                </p>
                <p className="text-emerald-300">ด้วยรัก, ทีมพังเรนเจอร์</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {isViewerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6">
          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            className="absolute right-4 top-4 rounded-full border border-zinc-400 bg-zinc-900/90 px-3 py-1 text-sm text-zinc-100"
          >
            ปิด
          </button>
          <img
            src={signedImageUrl}
            alt="Signed letter full screen"
            className="relative max-h-[92vh] w-auto max-w-full rounded-2xl border border-white/15 object-contain"
            onError={() => setImageLoadError(true)}
          />
        </div>
      ) : null}
    </main>
  );
}
