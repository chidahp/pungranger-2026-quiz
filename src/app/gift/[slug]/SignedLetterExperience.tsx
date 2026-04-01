"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState } from "react";

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

type WriterMeta = {
  key: string;
  name: string;
  note: string;
  fallbackImage: string;
};

type BookMeta = {
  title: string;
  writers: WriterMeta[];
};

const BOOK_META: Record<string, BookMeta> = {
  belief: {
    title: "สิ้นสุดทางเชื่อ",
    writers: [
      {
        key: "army",
        name: "อาร์มี่",
        note: "-",
        fallbackImage: "/pung-ranger-logo.png",
      },
      {
        key: "game",
        name: "เกม",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/signed-pungranger/game.png",
      },
      {
        key: "kamlha",
        name: "คำหล้า",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/signed-pungranger/kamlha.png",
      },
      {
        key: "top",
        name: "ท็อป",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "pung-ranger-logo.png",
      },
      {
        key: "poon",
        name: "ปูน",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/signed-pungranger/poon.png",
      },
      {
        key: "shefon",
        name: "ชีฝน",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/signed-pungranger/shefon.png",
      },
      {
        key: "machu",
        name: "มาชู",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/pung-ranger-logo.png",
      },
      {
        key: "mark",
        name: "มาร์ค",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/pung-ranger-logo.png",
      },
      {
        key: "tonmai",
        name: "ต้นไม้",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/pung-ranger-logo.png",
      },
      {
        key: "tob",
        name: "ต๊อบ",
        note: "ฝากถึงผู้อ่าน: ขอบคุณที่เชื่อในเสียงของตัวเองและเดินทางมาด้วยกัน",
        fallbackImage: "/pung-ranger-logo.png",
      }
    ],
  },
  china: {
    title: "Made in China เพื่อนนักเรียนคนแปลกหน้าและอาอิ๋",
    writers: [
      {
        key: "diss",
        name: "ดีส วชิรนันท์",
        note: "ขอให้สนุกกับการอ่าน Made in China นะคะ แล้วอย่าลืมกลับมาเล่าพาร์ทที่ชอบให้ฟัง ที่พังเรนเจอร์ หรือชี้ดาบ",
        fallbackImage: "/signed-pungranger/p-diss-china.png",
      },
    ],
  },
};

const DEFAULT_BOOK_META: BookMeta = {
  title: "หนังสือ",
  writers: [
    {
      key: "default",
      name: "พังเรนเจอร์",
      note: "ฝากถึงผู้อ่าน: ขอบคุณที่สนับสนุนพวกเรา",
      fallbackImage: "/pung-ranger-logo.png",
    },
  ],
};

function getBookMeta(bookKey: string): BookMeta {
  return BOOK_META[bookKey] ?? DEFAULT_BOOK_META;
}

export default function SignedLetterExperience({ gift }: SignedLetterExperienceProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState("แชร์ลง IG Story");
  const [isSharing, setIsSharing] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const purchasedBooks = Array.from(new Set(gift.books_purchased ?? []));
  const [activeBook, setActiveBook] = useState(purchasedBooks[0] ?? "belief");
  const [activeWriterKey, setActiveWriterKey] = useState(() => {
    return getBookMeta(purchasedBooks[0] ?? "belief").writers[0].key;
  });

  const bookMeta = getBookMeta(activeBook);
  const activeWriter =
    bookMeta.writers.find((w) => w.key === activeWriterKey) ?? bookMeta.writers[0];

  const signedImageUrl = useMemo(() => {
    const imageKey =
      bookMeta.writers.length > 1 ? `${activeBook}-${activeWriter.key}` : activeBook;
    const perImage = gift.signed_image_urls?.[imageKey];
    const preferredImage = perImage ?? gift.signed_image_url;
    if (!preferredImage || imageLoadError) {
      return activeWriter.fallbackImage;
    }
    return preferredImage;
  }, [activeBook, activeWriter.key, activeWriter.fallbackImage, bookMeta.writers.length, gift.signed_image_url, gift.signed_image_urls, imageLoadError]);

  const resetShareLabel = useCallback(() => {
    setTimeout(() => setShareLabel("แชร์ลง IG Story"), 2500);
  }, []);

  const handleShareToStory = async () => {
    if (typeof window === "undefined" || isSharing) return;
    setIsSharing(true);

    try {
      const res = await fetch(signedImageUrl);
      const blob = await res.blob();
      const ext = blob.type === "image/jpeg" ? "jpg" : "png";
      const file = new File(
        [blob],
        `pungranger-signed-${activeBook}-${activeWriter.key}.${ext}`,
        { type: blob.type || "image/png" },
      );

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        setShareLabel("แชร์แล้ว ✓");
        resetShareLabel();
        return;
      }

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
      setShareLabel("บันทึกรูปแล้ว ✓");
      resetShareLabel();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        resetShareLabel();
        return;
      }
      setShareLabel("ลองใหม่อีกครั้ง");
      resetShareLabel();
    } finally {
      setIsSharing(false);
    }
  };

  const handleUnseal = () => {
    setImageLoadError(false);
    setIsRevealing(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsRevealing(false);
    }, 900);
  };

  const hasMultipleWriters = bookMeta.writers.length > 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Noto+Sans+Thai:wght@100..900&display=swap');
        .ticket-sheet { font-family: 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif; }

        @keyframes sl-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sl-glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.2), inset 0 0 20px rgba(245,158,11,0.05); }
          50% { box-shadow: 0 0 70px rgba(245,158,11,0.45), 0 0 120px rgba(245,158,11,0.12), inset 0 0 40px rgba(245,158,11,0.1); }
        }
        @keyframes sl-float-1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        @keyframes sl-float-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes sl-float-3 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(0.96); }
        }
        @keyframes sl-seal-break {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          30% { transform: scale(1.25) rotate(-8deg); opacity: 1; filter: brightness(1.6); }
          60% { transform: scale(1.5) rotate(12deg); opacity: 0.5; filter: brightness(2.2); }
          100% { transform: scale(0) rotate(40deg); opacity: 0; filter: brightness(3); }
        }
        @keyframes sl-fade-up {
          from { opacity: 0; transform: translateY(36px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sl-twinkle {
          0%, 100% { opacity: 0.12; transform: scale(0.6); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes sl-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sl-flash {
          0% { opacity: 0; }
          40% { opacity: 0.85; }
          100% { opacity: 0; }
        }
        @keyframes sl-border-glow {
          0%, 100% { border-color: rgba(245,158,11,0.18); }
          50% { border-color: rgba(245,158,11,0.5); }
        }
        .sl-stagger-1 { animation: sl-fade-up 0.7s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .sl-stagger-2 { animation: sl-fade-up 0.7s cubic-bezier(.22,1,.36,1) 0.18s both; }
        .sl-stagger-3 { animation: sl-fade-up 0.7s cubic-bezier(.22,1,.36,1) 0.32s both; }
        .sl-stagger-4 { animation: sl-fade-up 0.7s cubic-bezier(.22,1,.36,1) 0.46s both; }
        .sl-stagger-5 { animation: sl-fade-up 0.7s cubic-bezier(.22,1,.36,1) 0.60s both; }
        .sl-shimmer-text {
          background: linear-gradient(90deg, #fbbf24 0%, #fef3c7 25%, #f59e0b 50%, #fef3c7 75%, #fbbf24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sl-shimmer 4s linear infinite;
        }
        .sl-card-glow { animation: sl-border-glow 4s ease-in-out infinite; }
      `}</style>

      <main className="ticket-sheet relative min-h-screen overflow-hidden bg-[#06060a] px-3 py-6 text-zinc-100 sm:px-6 sm:py-12">
        {/* Atmospheric gradients */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 15% 10%, rgba(217,119,6,0.1), transparent), radial-gradient(ellipse 60% 40% at 85% 5%, rgba(16,185,129,0.07), transparent), radial-gradient(ellipse 50% 35% at 50% 95%, rgba(168,85,247,0.05), transparent)",
        }} />

        {/* Animated floating orbs */}
        <div className="pointer-events-none absolute left-[8%] top-[12%] h-80 w-80 rounded-full opacity-[0.15] blur-[100px]" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.5), transparent 70%)", animation: "sl-float-1 9s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute right-[3%] top-[2%] h-72 w-72 rounded-full opacity-[0.1] blur-[100px]" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)", animation: "sl-float-2 12s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute bottom-[8%] left-[35%] h-64 w-64 rounded-full opacity-[0.08] blur-[100px]" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)", animation: "sl-float-3 14s ease-in-out infinite 3s" }} />

        {/* Noise texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Twinkling stars */}
        {[
          { x: 12, y: 8, size: 8, delay: 0, dur: 2.4 },
          { x: 28, y: 22, size: 6, delay: 0.6, dur: 3.1 },
          { x: 55, y: 6, size: 10, delay: 1.2, dur: 2.8 },
          { x: 72, y: 18, size: 7, delay: 0.3, dur: 3.5 },
          { x: 88, y: 10, size: 9, delay: 1.8, dur: 2.6 },
          { x: 42, y: 88, size: 6, delay: 2.1, dur: 3 },
          { x: 18, y: 75, size: 8, delay: 0.9, dur: 2.9 },
          { x: 80, y: 82, size: 7, delay: 1.5, dur: 3.3 },
        ].map((s, i) => (
          <div key={i} className="pointer-events-none absolute text-amber-300/40" style={{
            left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}px`,
            animation: `sl-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}>✦</div>
        ))}

        {/* Flash on unseal */}
        {isRevealing && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-amber-50" style={{ animation: "sl-flash 0.9s ease-out forwards" }} />
        )}

        <section className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border bg-zinc-900/50 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sl-card-glow">
          <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)" }} />

          {/* ─── Header ─── */}
          <div className="relative overflow-hidden border-b border-amber-400/15 p-5 sm:p-10" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(16,185,129,0.04) 50%, rgba(168,85,247,0.03) 100%)" }}>
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 25% -20%, rgba(245,158,11,0.12), transparent 60%)" }} />

            <span className="relative inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-amber-200 backdrop-blur sm:text-xs">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" style={{ boxShadow: "0 0 8px rgba(245,158,11,0.7)", animation: "sl-glow-pulse 2.5s ease-in-out infinite" }} />
              SIGNED LETTER EDITION
            </span>

            <div className="my-4 flex items-center gap-3 sm:my-5">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.3), transparent)" }} />
              <span className="text-xs text-amber-400/40">✦</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.3), transparent)" }} />
            </div>

            <h1 className="sl-shimmer-text text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              ถึงคุณ {gift.customer_name}
            </h1>
            <p className="relative mt-3 max-w-xl text-xs leading-relaxed text-zinc-300 sm:mt-4 sm:text-base">
              เลือกแท็บหนังสือเพื่อดูรูปข้อความจากนักเขียนแต่ละคน
            </p>
          </div>

          {/* ─── Body ─── */}
          <div className="p-5 sm:p-10">
            {!isOpened ? (
              <div
                className="relative flex flex-col items-center rounded-2xl border border-zinc-700/50 bg-zinc-950/50 p-8 text-center sm:p-14"
                style={isRevealing ? { animation: "sl-seal-break 0.9s ease-in forwards" } : undefined}
              >
                {/* Spinning decorative rings */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-44 w-44 rounded-full border border-dashed border-amber-400/10 sm:h-52 sm:w-52" style={{ animation: "sl-ring-spin 30s linear infinite" }} />
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-56 w-56 rounded-full border border-amber-300/4 sm:h-64 sm:w-64" style={{ animation: "sl-ring-spin 45s linear infinite reverse" }} />
                </div>

                {/* Wax seal */}
                <div className="relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 border-amber-300/30 sm:h-32 sm:w-32" style={{
                  background: "radial-gradient(circle at 38% 32%, rgba(245,158,11,0.2), rgba(180,83,9,0.1) 60%, rgba(0,0,0,0.25))",
                  animation: "sl-glow-pulse 3s ease-in-out infinite",
                }}>
                  <span className="text-4xl sm:text-5xl" style={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.5))" }}>✦</span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200/60 sm:text-xs">
                  ─── sealed for you ───
                </p>
                <p className="mt-3 text-lg font-bold text-zinc-50 sm:text-xl">
                  จดหมายลายเซ็นฉบับพิเศษของคุณพร้อมแล้ว
                </p>
                <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
                  กดปลดผนึกเพื่อเปิดอ่านข้อความจากนักเขียน
                </p>

                <button
                  type="button"
                  onClick={handleUnseal}
                  disabled={isRevealing}
                  className="group relative mt-8 overflow-hidden rounded-2xl border border-amber-200/50 px-10 py-4 text-sm font-bold tracking-wider text-white transition-all hover:scale-[1.04] hover:border-amber-200/70 disabled:pointer-events-none sm:mt-10 sm:px-14 sm:text-base"
                  style={{
                    background: "linear-gradient(135deg, rgba(245,158,11,0.65) 0%, rgba(234,179,8,0.45) 50%, rgba(217,119,6,0.65) 100%)",
                    boxShadow: "0 20px 70px rgba(245,158,11,0.3), 0 0 40px rgba(245,158,11,0.1)",
                  }}
                >
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "sl-shimmer 2s ease-in-out infinite" }} />
                  <span className="relative">{isRevealing ? "กำลังเปิด..." : "ปลดผนึกจดหมาย"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Book tabs */}
                <div className="sl-stagger-1 -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
                  {purchasedBooks.map((bookKey) => {
                    const isActive = activeBook === bookKey;
                    return (
                      <button
                        key={bookKey}
                        type="button"
                        onClick={() => {
                          setActiveBook(bookKey);
                          setActiveWriterKey(getBookMeta(bookKey).writers[0].key);
                          setImageLoadError(false);
                        }}
                        className={`shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 sm:px-5 sm:text-sm ${
                          isActive
                            ? "border-amber-300/60 bg-amber-500/20 text-amber-50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                            : "border-zinc-700/80 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        }`}
                      >
                        {getBookMeta(bookKey).title}
                      </button>
                    );
                  })}
                </div>

                {/* Writer sub-tabs — horizontal scroll on narrow screens */}
                {hasMultipleWriters && (
                  <div className="sl-stagger-2 space-y-2">
                    <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/70 sm:text-xs">
                      เลือกนักเขียน
                    </p>
                    <div
                      className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1.5 [scrollbar-color:rgba(63,63,70,0.65)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600/80 [&::-webkit-scrollbar-track]:bg-transparent"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      {bookMeta.writers.map((writer) => {
                        const isActive = activeWriterKey === writer.key;
                        return (
                          <button
                            key={writer.key}
                            type="button"
                            onClick={() => {
                              setActiveWriterKey(writer.key);
                              setImageLoadError(false);
                            }}
                            className={`shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 sm:px-5 sm:text-sm ${
                              isActive
                                ? "border-emerald-400/55 bg-emerald-500/18 text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.18)] ring-1 ring-emerald-400/20"
                                : "border-zinc-700/80 bg-zinc-900/70 text-zinc-400 hover:border-emerald-700/50 hover:text-zinc-200"
                            }`}
                          >
                            {writer.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Image with decorative corner brackets */}
                <div className={`group relative ${hasMultipleWriters ? "sl-stagger-3" : "sl-stagger-2"}`}>
                  <div className="absolute -left-0.5 -top-0.5 z-10 h-8 w-8 border-l-2 border-t-2 border-amber-400/25 transition-colors duration-300 group-hover:border-amber-300/60" />
                  <div className="absolute -right-0.5 -top-0.5 z-10 h-8 w-8 border-r-2 border-t-2 border-amber-400/25 transition-colors duration-300 group-hover:border-amber-300/60" />
                  <div className="absolute -bottom-0.5 -left-0.5 z-10 h-8 w-8 border-b-2 border-l-2 border-amber-400/25 transition-colors duration-300 group-hover:border-amber-300/60" />
                  <div className="absolute -bottom-0.5 -right-0.5 z-10 h-8 w-8 border-b-2 border-r-2 border-amber-400/25 transition-colors duration-300 group-hover:border-amber-300/60" />

                  <button
                    type="button"
                    onClick={() => setIsViewerOpen(true)}
                    className="relative block w-full overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]"
                  >
                    <img
                      src={signedImageUrl}
                      alt="Signed letter from writer"
                      className="w-full object-contain transition duration-500 group-hover:scale-[1.015]"
                      onError={() => setImageLoadError(true)}
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-left" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}>
                      <p className="text-sm font-semibold text-emerald-200" style={{ textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
                        นักเขียน: {activeWriter.name}
                      </p>
                      <p className="text-xs text-zinc-400">แตะเพื่อดูเต็มจอ</p>
                    </div>
                  </button>
                </div>

                {/* Quote card */}
                <div className={`relative overflow-hidden rounded-2xl border border-zinc-600/40 bg-zinc-950/60 p-5 ${hasMultipleWriters ? "sl-stagger-4" : "sl-stagger-3"}`} style={{ boxShadow: "inset 0 0 80px rgba(245,158,11,0.02)" }}>
                  <div className="pointer-events-none absolute -right-4 -top-4 font-serif text-6xl text-amber-400/6">&ldquo;</div>
                  <p className="text-sm font-semibold text-amber-100">{bookMeta.title}</p>
                  <div className="my-2.5 h-px w-12" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.4), transparent)" }} />
                  <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">{activeWriter.note}</p>
                </div>

                {/* Actions */}
                <div className={`flex flex-col gap-3 sm:flex-row ${hasMultipleWriters ? "sl-stagger-5" : "sl-stagger-4"}`}>
                  <button
                    type="button"
                    onClick={handleShareToStory}
                    disabled={isSharing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-pink-400/40 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(253,29,29,0.15)] disabled:opacity-60 sm:w-auto"
                    style={{ background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    {isSharing ? "กำลังโหลด..." : shareLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsViewerOpen(true)}
                    className="w-full rounded-xl border border-amber-300/40 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 transition-all duration-200 hover:scale-[1.02] hover:border-amber-300/60 hover:bg-amber-500/20 hover:shadow-[0_0_24px_rgba(245,158,11,0.1)] sm:w-auto"
                  >
                    เปิดเต็มจอ
                  </button>
                </div>

                {/* Footer */}
                <div className={`flex flex-col items-start gap-2 border-t border-zinc-700/40 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm ${hasMultipleWriters ? "sl-stagger-5" : "sl-stagger-5"}`}>
                  <p className="text-zinc-500">
                    รหัสของขวัญ: <span className="font-semibold text-zinc-300">{gift.slug}</span>
                  </p>
                  <p className="font-medium text-emerald-400/80" style={{ textShadow: "0 0 16px rgba(16,185,129,0.2)" }}>
                    ด้วยรัก, ทีมพังเรนเจอร์
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Full-screen viewer */}
        {isViewerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 backdrop-blur-sm sm:p-6">
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="absolute inset-0 bg-black/95"
              aria-label="Close viewer"
            />
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/90 text-sm text-zinc-200 transition hover:border-zinc-400 hover:bg-zinc-800 sm:right-6 sm:top-6"
            >
              ✕
            </button>
            <img
              src={signedImageUrl}
              alt="Signed letter full screen"
              className="relative max-h-[92vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)]"
              style={{ animation: "sl-fade-up 0.4s ease-out" }}
              onError={() => setImageLoadError(true)}
            />
          </div>
        )}
      </main>
    </>
  );
}
