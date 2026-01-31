"use client";

import Image from "next/image";
import Link from "next/link";
import MatrixBackground from "./components/MatrixBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MatrixBackground />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-[360px] rounded-2xl border border-[#00ff41]/60 bg-black/90 px-6 py-8 text-center shadow-[0_20px_50px_rgba(0,255,65,0.12)] sm:px-8 sm:py-10"
          style={{ animation: "result-reveal 0.6s ease-out forwards" }}
        >
          <Image
            src="/pangranger-logo-belief.png"
            alt="สิ้นสุดทางเชื่อ"
            width={320}
            height={120}
            className="mx-auto w-full max-w-[240px]"
            priority
          />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00ff41]/90">
            QUIZ
          </p>
          <div
            className="mx-auto mt-4 h-px w-16 bg-[#00ff41]/60"
            style={{ animation: "blink 1.5s step-end infinite" }}
            aria-hidden
          />
          <p className="mt-5 text-sm leading-relaxed text-zinc-300">
            คุณเป็นคนใช้ชีวิตด้วย &quot;ความเชื่อ&quot; แค่ไหน
          </p>
          <Link
            href="/quiz"
            className="mt-8 inline-flex min-h-[48px] w-full max-w-[200px] items-center justify-center gap-2 rounded-lg border border-[#00ff41]/80 bg-[#00ff41]/10 px-6 py-3 font-mono text-sm font-medium text-[#00ff41] transition-all hover:scale-[1.02] hover:bg-[#00ff41]/20 hover:shadow-[0_0_24px_rgba(0,255,65,0.3)] active:scale-[0.98]"
          >
            เริ่มเล่น
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-[2px]">
              →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
