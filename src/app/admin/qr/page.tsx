"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

type BookKey = "belief" | "china";

type RegisterPayload = {
  customer_name: string;
  books_purchased: BookKey[];
};

type RegisterSuccessBody = {
  id?: string;
  customer_name?: string;
  books_purchased?: BookKey[];
  slug?: string;
  created_at?: string;
};

const BOOK_OPTIONS: { key: BookKey; label: string }[] = [
  { key: "belief", label: "สิ้นสุดทางเชื่อ" },
  { key: "china", label: "Made in China เพื่อนนักเรียนคนแปลกหน้าและอาอิ๋" },
];

const REGISTER_URL = "https://playground.chidahp.com/api/pungranger/register";
const FALLBACK_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pungranger.chidahp.com";
const GIFT_PATH_PREFIX = "/gift";

export default function AdminQrPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [booksPurchased, setBooksPurchased] = useState<BookKey[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<unknown>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const payload: RegisterPayload = useMemo(
    () => ({
      customer_name: customerName.trim(),
      books_purchased: booksPurchased,
    }),
    [customerName, booksPurchased]
  );

  const slugFromResponse = useMemo(() => {
    if (
      !apiResult ||
      typeof apiResult !== "object" ||
      !("body" in apiResult) ||
      typeof apiResult.body !== "object" ||
      !apiResult.body
    ) {
      return null;
    }

    const body = apiResult.body as RegisterSuccessBody;
    return typeof body.slug === "string" && body.slug.length > 0 ? body.slug : null;
  }, [apiResult]);

  const qrTargetUrl = useMemo(() => {
    if (!slugFromResponse) return null;

    const browserBaseUrl =
      typeof window !== "undefined" ? window.location.origin : FALLBACK_BASE_URL;
    const normalizedBaseUrl = browserBaseUrl.replace(/\/$/, "");
    return `${normalizedBaseUrl}${GIFT_PATH_PREFIX}/${slugFromResponse}`;
  }, [slugFromResponse]);

  const qrContent = useMemo(() => {
    if (qrTargetUrl) {
      return qrTargetUrl;
    }
    if (apiResult !== null) {
      return JSON.stringify(apiResult);
    }
    return JSON.stringify(payload);
  }, [apiResult, payload, qrTargetUrl]);

  const toggleBook = (key: BookKey) => {
    setBooksPurchased((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    setApiResult(null);

    if (!payload.customer_name) {
      setApiError("กรุณากรอกชื่อลูกค้า");
      return;
    }

    if (payload.books_purchased.length === 0) {
      setApiError("กรุณาเลือกหนังสืออย่างน้อย 1 เล่ม");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let parsedBody: unknown = rawText;

      try {
        parsedBody = JSON.parse(rawText);
      } catch (error){
        console.log("Response is not JSON; keep plain text instead.", error);
        // Response is not JSON; keep plain text instead.
      }

      const resultForLog = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
      };

      console.log("Pungranger register API response:", resultForLog);

      if (!response.ok) {
        setApiError(`API error ${response.status}: ${response.statusText}`);
      }

      setApiResult(resultForLog);

      if (response.ok && typeof parsedBody === "object" && parsedBody) {
        const body = parsedBody as RegisterSuccessBody;
        if (body.slug) {
          const target = `${window.location.origin}${GIFT_PATH_PREFIX}/${body.slug}`;
          router.push(
            `/admin/qr/print?slug=${encodeURIComponent(body.slug)}&target=${encodeURIComponent(target)}`
          );
        }
      }
    } catch (error) {
      console.error("Pungranger register API failed:", error);
      setApiError("เกิดข้อผิดพลาดระหว่างเรียก API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8">
        <h1 className="text-2xl font-bold text-white">Admin: Generate QR Code</h1>
        <p className="mt-2 text-sm text-zinc-400">
          กรอกข้อมูลลูกค้า แล้วส่งไป API จากนั้นสร้าง QR จากผลลัพธ์ที่ได้
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="customer_name">
              Customer Name
            </label>
            <input
              id="customer_name"
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-400"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Books Purchased</p>
            <div className="space-y-2">
              {BOOK_OPTIONS.map((book) => (
                <label
                  key={book.key}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                >
                  <input
                    type="checkbox"
                    checked={booksPurchased.includes(book.key)}
                    onChange={() => toggleBook(book.key)}
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />
                  <span className="text-sm text-zinc-200">
                    <span className="font-semibold">{book.key}</span> = {book.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลและ Generate QR"}
          </button>
        </form>

        {apiError ? (
          <div className="mt-5 rounded-lg border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
            {apiError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-zinc-300">Payload ที่จะยิง</h2>
            <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
              {JSON.stringify(payload, null, 2)}
            </pre>

            <h2 className="mb-2 mt-4 text-sm font-semibold text-zinc-300">API Result</h2>
            <pre className="max-h-72 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
              {apiResult ? JSON.stringify(apiResult, null, 2) : "ยังไม่มีผลลัพธ์จาก API"}
            </pre>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-300">QR Code</h2>
            <div className="inline-block rounded-md bg-white p-3">
              <QRCode value={qrContent} size={320} />
            </div>
            {qrTargetUrl ? (
              <p className="mt-3 break-all text-xs text-emerald-400">{qrTargetUrl}</p>
            ) : null}
            <p className="mt-3 text-xs text-zinc-500">
              QR จะ encode เป็น `baseURL/slug` เมื่อ API ส่ง `slug` กลับมา
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
