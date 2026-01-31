"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MatrixBackground from "../components/MatrixBackground";
import { QUIZ_DATA, getRandomQuestions, type Question } from "../../utils/quizData";


const QUIZ_RESULT_STORAGE_KEY = "quiz-result";
const QUIZ_SESSION_KEY = "quiz-questions-cache";
const QUIZ_TTL_MS = 5 * 60 * 1000; // 5 นาที

const CHOICE_LABELS = ["A", "B"] as const;

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<0 | 1 | null>(null);
  const [answers, setAnswers] = useState<(0 | 1)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = sessionStorage.getItem(QUIZ_SESSION_KEY);
    const now = Date.now();
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          timestamp: number;
          questions: Question[];
        };
        if (
          Array.isArray(parsed.questions) &&
          typeof parsed.timestamp === "number" &&
          now - parsed.timestamp < QUIZ_TTL_MS
        ) {
          queueMicrotask(() => setQuestions(parsed.questions));
          return;
        }
      } catch {
        // ignore parse errors
      }
    }
    const fresh = getRandomQuestions(QUIZ_DATA, 10);
    queueMicrotask(() => setQuestions(fresh));
    sessionStorage.setItem(
      QUIZ_SESSION_KEY,
      JSON.stringify({ timestamp: now, questions: fresh })
    );
  }, []);

  if (!questions) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <MatrixBackground />
        <div className="relative z-10 font-mono text-[#00ff41] opacity-80">
          กำลังโหลดคำถาม...
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = Math.min(10, questions.length);
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelect = (optionIndex: 0 | 1) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentIndex === totalQuestions - 1) {
      const finalAnswers = [...newAnswers];
      const score = finalAnswers.filter(
        (ans, i) => ans === questions[i].correctIndex
      ).length;
      sessionStorage.setItem(
        QUIZ_RESULT_STORAGE_KEY,
        JSON.stringify({
          answers: finalAnswers,
          score,
          totalQuestions,
        })
      );
      router.push("/quiz/answers");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MatrixBackground />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-3 py-6 sm:px-6 sm:py-12 md:px-8">
        {/* Outer glow ring */}
        <div
          className="absolute rounded-3xl"
          style={{
            width: "min(100% - 1.5rem, 40rem)",
            maxWidth: "40rem",
            height: "auto",
            minHeight: "28rem",
            boxShadow:
              "0 0 60px rgba(0, 255, 65, 0.25), 0 0 120px rgba(0, 255, 65, 0.12), 0 0 200px rgba(0, 255, 65, 0.06)",
            pointerEvents: "none",
          }}
          aria-hidden
        />

        <div
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-[#00ff41] bg-black/95 p-6 backdrop-blur sm:rounded-3xl sm:border-[3px] sm:p-8 md:p-10"
          style={{
            animation: "border-glow 2.5s ease-in-out infinite",
            boxShadow:
              "0 0 40px rgba(0, 255, 65, 0.5), 0 0 80px rgba(0, 255, 65, 0.25), inset 0 0 40px rgba(0, 255, 65, 0.1)",
          }}
        >
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-[0.04] sm:rounded-3xl"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.08) 2px, rgba(0,255,65,0.08) 4px)",
            }}
            aria-hidden
          />

          {/* Corner brackets */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl"
            aria-hidden
          >
            <span
              className="absolute left-3 top-3 font-mono text-xl text-[#00ff41] opacity-90 sm:left-5 sm:top-5 sm:text-2xl"
              style={{ textShadow: "0 0 10px rgba(0, 255, 65, 0.8)" }}
            >
              ┌
            </span>
            <span
              className="absolute right-3 top-3 font-mono text-xl text-[#00ff41] opacity-90 sm:right-5 sm:top-5 sm:text-2xl"
              style={{ textShadow: "0 0 10px rgba(0, 255, 65, 0.8)" }}
            >
              ┐
            </span>
            <span
              className="absolute bottom-3 left-3 font-mono text-xl text-[#00ff41] opacity-90 sm:bottom-5 sm:left-5 sm:text-2xl"
              style={{ textShadow: "0 0 10px rgba(0, 255, 65, 0.8)" }}
            >
              └
            </span>
            <span
              className="absolute bottom-3 right-3 font-mono text-xl text-[#00ff41] opacity-90 sm:right-5 sm:bottom-5 sm:text-2xl"
              style={{ textShadow: "0 0 10px rgba(0, 255, 65, 0.8)" }}
            >
              ┘
            </span>
          </div>

          {/* Header */}
          <div className="relative z-10 mb-5 text-center sm:mb-6">
            <h1
              className="font-mono text-xl font-bold tracking-wider text-[#00ff41] sm:text-2xl md:text-3xl"
              style={{
                animation: "title-glow 2.5s ease-in-out infinite",
                textShadow:
                  "0 0 20px rgba(0, 255, 65, 1), 0 0 50px rgba(0, 255, 65, 0.7), 0 0 100px rgba(0, 255, 65, 0.4)",
              }}
            >
              สิ้นสุดทางเชื่อ QUIZ
            </h1>
            <p className="mt-1 font-mono text-xs text-[#00ff41]/80 sm:text-sm">
              เลือก 1 ใน 2
            </p>
          </div>

          <>
            {/* Progress */}
              <div className="relative z-10 mb-5 sm:mb-6">
                <div className="flex justify-between font-mono text-xs text-[#00ff41]/90 sm:text-sm">
                  <span>
                    คำถาม {currentIndex + 1} / {totalQuestions}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800/80">
                  <div
                    className="h-full rounded-full bg-[#00ff41] transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      boxShadow: "0 0 15px rgba(0, 255, 65, 0.6)",
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2
                className="relative z-10 mb-6 min-h-12 font-mono text-base leading-relaxed text-zinc-100 sm:min-h-0 sm:text-lg md:text-xl"
                style={{
                  textShadow: "0 0 20px rgba(0, 255, 65, 0.2)",
                }}
              >
                {currentQuestion.question}
              </h2>

              {/* Options - 2 choices only */}
              <ul className="relative z-10 grid gap-4 sm:gap-5">
                {currentQuestion.options.map((option, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleSelect(i as 0 | 1)}
                      className={`flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left font-mono text-sm transition-all sm:py-5 sm:text-base touch-manipulation ${
                        selectedAnswer === i
                          ? "border-[#00ff41] bg-[#00ff4120] text-[#00ff41]"
                          : "border-zinc-600 bg-zinc-900/90 text-zinc-200 hover:border-[#00ff41]/60 hover:bg-zinc-800/90"
                      }`}
                      style={
                        selectedAnswer === i
                          ? {
                              boxShadow:
                                "0 0 25px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.08)",
                            }
                          : undefined
                      }
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold sm:h-12 sm:w-12 sm:text-base ${
                          selectedAnswer === i
                            ? "border-[#00ff41] bg-[#00ff4120] text-[#00ff41]"
                            : "border-zinc-500 text-zinc-400"
                        }`}
                        style={
                          selectedAnswer === i
                            ? {
                                textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
                              }
                            : undefined
                        }
                      >
                        {CHOICE_LABELS[i]}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Next */}
              <div className="relative z-10 mt-8 flex justify-end sm:mt-10">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="min-h-[48px] rounded-xl border-2 border-[#00ff41] bg-[#00ff4118 px-6 py-3 font-mono font-bold text-[#00ff41] transition-all disabled:cursor-not-allowed disabled:border-zinc-600 disabled:bg-transparent disabled:text-zinc-500 hover:enabled:bg-[#00ff4128] hover:enabled:shadow-[0_0_30px_rgba(0,255,65,0.5)] active:enabled:scale-[0.98] sm:px-8 sm:py-4"
                  style={{
                    boxShadow:
                      selectedAnswer !== null
                        ? "0 0 20px rgba(0, 255, 65, 0.35)"
                        : undefined,
                    animation:
                      selectedAnswer !== null
                        ? "btn-glow 2.5s ease-in-out infinite"
                        : undefined,
                  }}
                >
                  {currentIndex === totalQuestions - 1 ? "ส่งคำตอบ" : "ถัดไป"} →
                </button>
              </div>
          </>
        </div>
      </main>
    </div>
  );
}
