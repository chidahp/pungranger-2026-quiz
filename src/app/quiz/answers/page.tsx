"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MatrixBackground from "../../components/MatrixBackground";
import ShareResultCard from "../../components/ShareResultCard";

const STORAGE_KEY = "quiz-result";
const PROCESSING_DURATION_MS = 2800;
// ลิงก์พรีวิวหนังสือ "สิ้นสุดทางเชื่อ" / "สิ้นสุดความเชื่อ" — แก้เป็น URL จริงเมื่อมี
const BOOK_PREVIEW_URL = "#";

type StoredResult = {
  answers: (0 | 1)[];
  score: number;
  totalQuestions: number;
};

type ResultBand = {
  min: number;
  max: number;
  title: string;
  description: string;
  color: string;
  emoji: string;
};

// คะแนนน้อย (0-3) = ผู้หลุดพ้น | กลาง (4-6) = เริ่มหลุดพ้น | มาก (7-10) = ยังเชื่อมาก
const RESULT_BANDS: ResultBand[] = [
  {
    min: 0,
    max: 3,
    emoji: "🟢",
    title: "คุณคือผู้หลุดพ้น!!!",
    description:
      "ยินดีที่คุณเลือกจะเชื่อในตัวเองมากกว่าสิ่งที่สังคมบอกว่าถูกต้อง หนังสือที่เหมาะกับคุณที่สุดในตอนนี้คือ \"สิ้นสุดทางเชื่อ\" เรื่องราวจากเหล่าผู้พังกรอบคิดเดิม ๆ จากสังคม เพื่อออกไปใช้ชีวิต!",
    color: "#00ff41",
  },
  {
    min: 4,
    max: 6,
    emoji: "🟡",
    title: "คุณเริ่มหลุดพ้นจากกรอบความเชื่อเดิม ๆ ได้บ้างแล้ว",
    description:
      "ถ้าอยากก้าวข้ามกรอบนี้ไปได้เต็มตัว เราขอแนะนำ \"สิ้นสุดทางเชื่อ\" หนังสือที่จะทำให้คุณทิ้งความเชื่อเดิม ๆ ได้อย่างหมดจด!",
    color: "#eab308",
  },
  {
    min: 7,
    max: 10,
    emoji: "🔴",
    title: "คุณยังใช้ชีวิตด้วยความเชื่อมากอยู่",
    description:
      "ซึ่งไม่ใช่เรื่องเลวร้ายอะไร แต่ถ้าอยากเลิกยึดติดกับความเชื่อเดิม ๆ ลองอ่าน \"สิ้นสุดความเชื่อ\" ดูสิ พรีเล้ย!",
    color: "#ef4444",
  },
];

function getResultBand(score: number): ResultBand {
  const band = RESULT_BANDS.find(
    (b) => score >= b.min && score <= b.max
  );
  return band ?? RESULT_BANDS[0];
}

export default function QuizAnswersPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      router.replace("/quiz");
      return;
    }
    try {
      const data = JSON.parse(raw) as StoredResult;
      if (
        !Array.isArray(data.answers) ||
        typeof data.score !== "number" ||
        typeof data.totalQuestions !== "number"
      ) {
        router.replace("/quiz");
        return;
      }
      queueMicrotask(() => setResult(data));
    } catch {
      router.replace("/quiz");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => setIsProcessing(false), PROCESSING_DURATION_MS);
    return () => clearTimeout(t);
  }, [result]);

  const handleRestart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push("/quiz");
  };

  if (result === null) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <MatrixBackground />
        <div className="relative z-10 font-mono text-[#00ff41] opacity-80">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  const { score, totalQuestions } = result;
  const band = getResultBand(score);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MatrixBackground />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div
          className={`relative w-full max-w-[380px] overflow-hidden rounded-3xl border border-[#00ff41]/40 bg-black/90 px-6 py-8 backdrop-blur sm:px-8 sm:py-10 ${
            isProcessing ? "" : "shadow-[0_20px_50px_rgba(0,255,65,0.12)]"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(0,255,65,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 45%)",
          }}
        >
          {isProcessing ? (
            /* Processing */
            <div className="flex flex-col items-center justify-center py-10">
              <div
                className="mb-6 h-12 w-12 rounded-full border-2 border-[#00ff41]/40 border-t-[#00ff41]"
                style={{ animation: "processing-spin 1s linear infinite" }}
                aria-hidden
              />
              <p className="text-center font-mono text-sm font-medium text-[#00ff41]">
                ระบบกำลังประมวลผล
              </p>
              <p
                className="mt-1 text-center font-mono text-xs text-[#00ff41]/80"
                style={{ animation: "processing-pulse 1.5s ease-in-out infinite" }}
              >
                กรุณารอซักครู่
              </p>
            </div>
          ) : (
            /* Result — reveal + ว้าว น่าแชร์ น่ากด */
            <div
              className="text-center"
              style={{
                animation: "result-reveal 0.5s ease-out forwards",
              }}
            >
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#00ff41]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00ff41]">
                <span aria-hidden>★</span> ผลของคุณ
              </div>
              <div
                className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00ff41]/80 bg-[#00ff41]/15 font-mono text-3xl font-bold text-[#00ff41]"
                style={{
                  animation: "score-pulse 2s ease-in-out infinite",
                  boxShadow: "0 0 24px rgba(0, 255, 65, 0.2)",
                }}
              >
                {score}/{totalQuestions}
              </div>
              <h2 className="mb-1 font-mono text-lg font-bold text-zinc-100">
                เสร็จสิ้น!
              </h2>
              <p
                className="mb-2 text-base font-semibold sm:text-lg"
                style={{
                  color: band.color,
                  textShadow: `0 0 20px ${band.color}40`,
                }}
              >
                {band.emoji} {band.title}
              </p>
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                {band.description}
              </p>

              <p className="mb-4 text-xs text-[#00ff41]/80">
                ชอบผลแบบนี้? แชร์ให้เพื่อนลองทำดูดิ
              </p>

              {/* ปุ่ม 3 ปุ่ม — น่ากด */}
              <div className="flex flex-col gap-3">
                <Link
                  href={BOOK_PREVIEW_URL}
                  target={BOOK_PREVIEW_URL.startsWith("http") ? "_blank" : undefined}
                  rel={BOOK_PREVIEW_URL.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#00ff41] bg-[#00ff41]/15 px-6 py-3 font-mono text-sm font-bold text-[#00ff41] transition-all hover:scale-[1.03] hover:bg-[#00ff41]/25 hover:shadow-[0_0_28px_rgba(0,255,65,0.35)] active:scale-[0.98]"
                  style={{
                    boxShadow: "0 0 16px rgba(0, 255, 65, 0.2)",
                  }}
                >
                  <span aria-hidden>📖</span>
                  พรีหนังสือ
                </Link>
                <ShareResultCard
                  score={score}
                  totalQuestions={totalQuestions}
                  band={{ title: band.title, description: band.description }}
                  className="min-h-[52px] transition-transform hover:scale-[1.03] active:scale-[0.98]"
                />
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800/70 px-6 py-3 font-mono text-sm font-medium text-zinc-200 transition-all hover:scale-[1.03] hover:bg-zinc-700/70 active:scale-[0.98]"
                >
                  เล่นอีกครั้ง
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
