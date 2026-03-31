"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

const FALLBACK_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pungranger.chidahp.com";
const GIFT_PATH_PREFIX = "/gift";

export default function QrPrintPage() {
  const params = useSearchParams();
  const slug = params.get("slug")?.trim() ?? "";
  const base = FALLBACK_BASE_URL.replace(/\/$/, "");
  const target =
    params.get("target")?.trim() ||
    (slug ? `${base}${GIFT_PATH_PREFIX}/${slug}` : `${base}${GIFT_PATH_PREFIX}`);

  return (
    <main className="min-h-screen bg-white px-2 py-4 text-black">
      <div className="mx-auto flex w-full max-w-[107mm] flex-col items-center border border-zinc-300 bg-white p-3">
        <Image
          src="/pung-ranger-logo.png"
          alt="Pung Ranger"
          width={220}
          height={220}
          className="h-auto w-[42mm]"
          priority
        />

        <div className="mt-3 border border-zinc-300 bg-white p-2">
          <QRCode value={target} size={272} />
        </div>

        <p className="mt-3 text-center text-[11px] leading-tight break-all">{target}</p>
        {slug ? <p className="mt-1 text-[10px] text-zinc-700">slug: {slug}</p> : null}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 w-full rounded border border-black px-3 py-2 text-sm font-semibold print:hidden"
        >
          Print
        </button>
      </div>

      <style>{`
        @page {
          size: 107mm auto;
          margin: 4mm;
        }
        @media print {
          html,
          body {
            width: 107mm;
            margin: 0;
            padding: 0;
            background: #fff;
          }
        }
      `}</style>
    </main>
  );
}
