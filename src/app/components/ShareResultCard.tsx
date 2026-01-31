"use client";

import { useCallback } from "react";

const SHARE_IMAGE_WIDTH = 1080;
const SHARE_IMAGE_HEIGHT = 1920;
const LOGO_URL = "/pung-ranger-logo.png";
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 70;
const IG_STORY_DEEPLINK =
  "instagram-stories://share?source_application=pungranger_quiz";
const IG_TAG = "@chidahp";

export type ShareResultBand = {
  title: string;
  description: string;
};

type ShareResultCardProps = {
  score: number;
  totalQuestions: number;
  band: ShareResultBand;
  className?: string;
};

function createShareImage(
  s: number,
  total: number,
  title: string,
  description: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = SHARE_IMAGE_WIDTH;
    canvas.height = SHARE_IMAGE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas not supported"));
      return;
    }
    const pad = 80;
    const cx = SHARE_IMAGE_WIDTH / 2;
    const green = "#00ff41";
    const black = "#000000";

    ctx.fillStyle = black;
    ctx.fillRect(0, 0, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT);

    ctx.strokeStyle = green;
    ctx.lineWidth = 8;
    ctx.strokeRect(
      pad,
      pad,
      SHARE_IMAGE_WIDTH - pad * 2,
      SHARE_IMAGE_HEIGHT - pad * 2
    );

    ctx.font = "bold 56px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = green;
    ctx.shadowColor = green;
    ctx.shadowBlur = 30;
    ctx.fillText("สิ้นสุดทางเชื่อ QUIZ", cx, 320);
    ctx.shadowBlur = 0;

    const scoreY = 580;
    ctx.beginPath();
    ctx.arc(cx, scoreY, 140, 0, Math.PI * 2);
    ctx.strokeStyle = green;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = green;
    ctx.font = "bold 72px monospace";
    ctx.fillText(`${s}/${total}`, cx, scoreY + 28);

    ctx.font = "48px monospace";
    ctx.fillStyle = "#e4e4e7";
    ctx.fillText("เสร็จสิ้น!", cx, 820);
    ctx.font = "32px monospace";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText(title, cx, 920);
    const maxLen = 24;
    const descLines: string[] = [];
    for (let i = 0; i < description.length; i += maxLen) {
      descLines.push(description.slice(i, i + maxLen));
    }
    descLines.slice(0, 3).forEach((line, i) =>
      ctx.fillText(line, cx, 980 + i * 44)
    );

    ctx.font = "28px monospace";
    ctx.fillStyle = "rgba(0,255,65,0.7)";
    ctx.fillText(
      "คุณเป็นคนใช้ชีวิตด้วย \"ความเชื่อ\" แค่ไหน",
      cx,
      SHARE_IMAGE_HEIGHT - 200
    );

    ctx.font = "bold 36px monospace";
    ctx.fillStyle = green;
    ctx.shadowColor = green;
    ctx.shadowBlur = 15;
    ctx.fillText(IG_TAG, cx, SHARE_IMAGE_HEIGHT - 120);
    ctx.shadowBlur = 0;

    const finish = () => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Failed to create image")),
        "image/png",
        0.95
      );
    };

    const logoImg = new Image();
    logoImg.onload = () => {
      ctx.drawImage(logoImg, pad, pad, LOGO_WIDTH, LOGO_HEIGHT);
      finish();
    };
    logoImg.onerror = finish;
    logoImg.src = LOGO_URL;
  });
}

export default function ShareResultCard({
  score,
  totalQuestions,
  band,
  className = "",
}: ShareResultCardProps) {
  const handleShareToStory = useCallback(async () => {
    try {
      const blob = await createShareImage(
        score,
        totalQuestions,
        band.title,
        band.description
      );
      const file = new File([blob], "quiz-result.png", { type: "image/png" });
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "สิ้นสุดทางเชื่อ QUIZ",
          text: `ได้ ${score}/${totalQuestions} คะแนน! ${band.title}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz-result.png";
        a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => {
          window.location.href = IG_STORY_DEEPLINK;
        }, 500);
      }
    } catch {
      try {
        const blob = await createShareImage(
          score,
          totalQuestions,
          band.title,
          band.description
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz-result.png";
        a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => {
          window.location.href = IG_STORY_DEEPLINK;
        }, 500);
      } catch {
        // ignore
      }
    }
  }, [score, totalQuestions, band]);

  return (
    <button
      type="button"
      onClick={handleShareToStory}
      className={`min-h-[48px] w-full rounded-xl border-2 border-[#E1306C] bg-[#E1306C]/20 px-8 py-3 font-mono font-bold text-[#E1306C] transition-all hover:bg-[#E1306C]/30 hover:shadow-[0_0_24px_rgba(225,48,108,0.45)] active:scale-[0.98] sm:w-auto ${className}`.trim()}
    >
      <span aria-hidden>↗</span> แชร์ไปให้เพื่อน
    </button>
  );
}
