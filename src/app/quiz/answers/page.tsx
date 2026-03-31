"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Modal, Stack, Typography, Tooltip } from "@mui/material";
import MatrixBackground from "../../components/MatrixBackground";

const STORAGE_KEY = "quiz-result";
const PROCESSING_DURATION_MS = 2800;
// ลิงก์พรีวิวหนังสือ "สิ้นสุดทางเชื่อ" / "สิ้นสุดความเชื่อ" — แก้เป็น URL จริงเมื่อมี
const BOOK_PREVIEW_URL = "https://link.chidahp.com/pungranger2026";

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
  image: string;
};

// คะแนนน้อย (0-3) = ผู้หลุดพ้น | กลาง (4-6) = เริ่มหลุดพ้น | มาก (7-10) = ยังเชื่อมาก
const RESULT_BANDS: ResultBand[] = [
  {
    min: 0,
    max: 3,
    emoji: "🟢",
    title: "คุณคือผู้หลุดพ้น!!!!",
    description:
      "ยินดีที่คุณเลือกจะเชื่อในตัวเองมากกว่าสิ่งที่สังคมบอกว่าถูกต้อง หนังสือที่เหมาะกับคุณที่สุดในตอนนี้คือ \"สิ้นสุดทางเชื่อ\" เรื่องราวจากเหล่าผู้พังกรอบคิดเดิม ๆ จากสังคม เพื่อออกไปใช้ชีวิต!",
    color: "#00ff41",
    image: "/1.png",
  },
  {
    min: 4,
    max: 6,
    emoji: "🟡",
    title: "คุณเริ่มหลุดพ้นจากกรอบความเชื่อเดิม ๆ ได้บ้างแล้ว",
    description:
      "ถ้าอยากก้าวข้ามกรอบนี้ไปได้เต็มตัว เราขอแนะนำ \"สิ้นสุดทางเชื่อ\" หนังสือที่จะทำให้คุณทิ้งความเชื่อเดิม ๆ ได้อย่างหมดจด!",
    color: "#eab308",
    image: "/2.png",
  },
  {
    min: 7,
    max: 10,
    emoji: "🔴",
    title: "คุณยังใช้ชีวิตด้วยความเชื่อมากอยู่",
    description:
      "ซึ่งไม่ใช่เรื่องเลวร้ายอะไร แต่ถ้าอยากเลิกยึดติดกับความเชื่อเดิม ๆ ลองอ่าน \"สิ้นสุดความเชื่อ\" ดูสิ พรีเล้ย!",
    color: "#ef4444",
    image: "/3.png",
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
  const [showShare, setShowShare] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "loading" | "error">(
    "idle"
  );

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

  const handleShareImage = async (imageUrl: string) => {
    if (typeof window === "undefined") return;
    setShareState("loading");
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "quiz-result.png", { type: blob.type });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "สิ้นสุดทางเชื่อ Quiz",
          text: "ลองทำแบบทดสอบนี้สิ ที่นี่เลย! https://pungranger.chidahp.com",
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz-result.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      setShareState("idle");
    } catch {
      setShareState("error");
      setTimeout(() => setShareState("idle"), 1500);
    }
  };

  const handleDownloadImage = async (imageUrl: string) => {
    if (typeof window === "undefined") return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz-result.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
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

  const band = getResultBand(result.score);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MatrixBackground />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div
          className={`relative w-full max-w-[380px] overflow-hidden rounded-3xl border border-[#00ff41]/40 bg-black/90 px-6 py-8 backdrop-blur sm:px-8 sm:py-10 ${
            isProcessing ? "" : "shadow-[0_20px_50px_rgba(0,255,65,0.12)]"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(0,255,65,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 45%)",
            padding: 0,
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
              className="relative overflow-hidden rounded-2xl text-center"
              style={{
                animation: "result-reveal 0.5s ease-out forwards",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.65) 100%), url(${band.image})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                aria-hidden
              />

              <div className="relative flex min-h-[720px] flex-col items-center justify-end px-3 py-6 sm:min-h-[760px] sm:px-5 sm:py-8 mb-20">
                <div className="w-full max-w-[360px] sm:max-w-[390px]">
                  <div className="rounded-2xl border border-[#00ff41]/35 bg-black/75 p-4 shadow-[0_18px_38px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-5">
                    <div className="flex flex-col gap-3 sm:gap-3.5">
                      <Link
                        href={BOOK_PREVIEW_URL}
                        target={BOOK_PREVIEW_URL.startsWith("http") ? "_blank" : undefined}
                        rel={
                          BOOK_PREVIEW_URL.startsWith("http") ? "noopener noreferrer" : undefined
                        }
                        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#00ff41] bg-[#00ff41]/15 px-6 py-3 font-mono text-sm font-bold text-[#00ff41] transition-all hover:scale-[1.03] hover:bg-[#00ff41]/25 hover:shadow-[0_0_28px_rgba(0,255,65,0.35)] active:scale-[0.98]"
                        style={{
                          boxShadow: "0 0 16px rgba(0, 255, 65, 0.2)",
                        }}
                      >
                        <span aria-hidden>📖</span>
                        พรีหนังสือ (กดเล้ยยยย!!!!)
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowShare(true)}
                        className="flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-[#E1306C] bg-[#E1306C]/20 px-6 py-3 font-mono text-sm font-bold text-[#E1306C] transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(225,48,108,0.35)] active:scale-[0.98]"
                      >
                        ↗ แชร์ไปให้เพื่อน
                      </button>
                      <button
                        type="button"
                        onClick={handleRestart}
                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800/70 px-6 py-3 font-mono text-sm font-medium text-zinc-200 transition-all hover:scale-[1.03] hover:bg-zinc-700/70 active:scale-[0.98]"
                      >
                        เล่นอีกครั้ง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal open={showShare} onClose={() => setShowShare(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(90vw, 380px)",
            bgcolor: "#0f0f0f",
            border: "1px solid #2f2f2f",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Stack direction="column" spacing={2} mb={3}>
            <Typography
              fontFamily="var(--font-geist-mono)"
              fontSize={22}
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #00ff41 0%, #00cc33 50%, #7cff7c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 24px rgba(0,255,65,0.4)",
                letterSpacing: "0.02em",
              }}
            >
              แชร์ผลของคุณ
            </Typography>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
                py: 2,
                px: 2,
                borderRadius: 2,
                bgcolor: "rgba(225,48,108,0.15)",
                border: "2px solid rgba(225,48,108,0.55)",
                boxShadow: "0 0 28px rgba(225,48,108,0.25), inset 0 0 24px rgba(225,48,108,0.08)",
              }}
            >
              <Typography
                fontSize={15}
                color="#f4f4f5"
                fontFamily="var(--font-geist-mono)"
                fontWeight={700}
                sx={{ width: "100%", mb: 0.5 }}
              >
                ⚠️⚠️ แชร์ IG Story อย่าลืม Follow ก่อนที่จะแท็ก ให้พวกเราดูด้วยน้าาาา ✨✨
              </Typography>
              <Typography
                component="span"
                fontSize={13}
                fontFamily="var(--font-geist-mono)"
                fontWeight={700}
                sx={{
                  color: "white",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: "rgba(225,48,108,0.3)",
                  border: "1px solid rgba(225,48,108,0.5)",
                }}
              >
                IG: @chidahp
              </Typography>
              <Typography
                component="span"
                fontSize={13}
                fontFamily="var(--font-geist-mono)"
                fontWeight={700}
                sx={{
                  color: "#00ff41",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: "rgba(0,255,65,0.2)",
                  border: "1px solid rgba(0,255,65,0.4)",
                }}
              >
                IG: @pungranger.co
              </Typography>
            </Box>
          </Stack>

          <Stack mt={3} spacing={1.2}>
            <Tooltip title="แชร์ IG Story แล้วอย่าลืมแท็ก @chidahp @pungranger.co" placement="top">
              <span>
                <Button
                  className="w-full"
                  onClick={() => handleShareImage(band.image)}
                  variant="outlined"
                  sx={{
                    borderColor: "#E1306C",
                    color: "#E1306C",
                    bgcolor: "rgba(225,48,108,0.15)",
                    textTransform: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontWeight: 700,
                    minHeight: 48,
                    "&:hover": {
                      borderColor: "#E1306C",
                      bgcolor: "rgba(225,48,108,0.25)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {shareState === "loading"
                    ? "กำลังแชร์..."
                    : shareState === "error"
                      ? "ลองใหม่อีกครั้ง"
                      : "แชร์ภาพนี้"}
                </Button>
              </span>
            </Tooltip>
            <Button
              onClick={() => handleDownloadImage(band.image)}
              variant="outlined"
              sx={{
                borderColor: "rgba(0,255,65,0.6)",
                color: "#00ff41",
                bgcolor: "rgba(0,255,65,0.1)",
                textTransform: "none",
                fontFamily: "var(--font-geist-mono)",
                fontWeight: 600,
                minHeight: 48,
                "&:hover": {
                  borderColor: "#00ff41",
                  bgcolor: "rgba(0,255,65,0.2)",
                  transform: "scale(1.02)",
                },
              }}
            >
              ดาวน์โหลดภาพ
            </Button>
            {/* <Button
              onClick={handleCopyLink}
              variant="outlined"
              sx={{
                borderColor: "#3f3f46",
                color: "#e4e4e7",
                bgcolor: "rgba(63,63,70,0.4)",
                textTransform: "none",
                fontFamily: "var(--font-geist-mono)",
                fontWeight: 600,
                minHeight: 48,
                "&:hover": {
                  bgcolor: "rgba(63,63,70,0.6)",
                  transform: "scale(1.02)",
                },
              }}
            >
              {copyState === "done" ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
            </Button> */}
            <Button
              onClick={() => setShowShare(false)}
              variant="text"
              sx={{
                color: "#a1a1aa",
                textTransform: "none",
                fontSize: 12,
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              ปิด
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
