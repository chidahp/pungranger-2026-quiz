"use client";

import Image from "next/image";
import QRCode from "react-qr-code";

type PrintTicketClientProps = {
  slug: string;
  target: string;
};

export default function PrintTicketClient({ slug, target }: PrintTicketClientProps) {
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

        <p className="mt-3 break-all text-center text-[11px] leading-tight">{target}</p>
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
