"use client";

import Image from "next/image";
import QRCode from "react-qr-code";

type PrintTicketClientProps = {
  slug: string;
  target: string;
};

export default function PrintTicketClient({
  slug,
  target,
}: PrintTicketClientProps) {
  return (
    <main className="bg-gray-300 flex justify-center py-10">
      {/* wrapper เพื่อให้ดูเหมือนกระดาษ */}
      <div className="scale-[0.95] origin-top shadow-xl">
        <div
          className="
            ticket-sheet
            flex flex-col items-center justify-start
            bg-white
            w-[107mm]
            px-5 py-8
            print:w-[107mm]
            print:max-w-[107mm]
            print:p-[2.5mm]
          "
        >
          <Image
            src="/pung-ranger-logo.png"
            alt="Pung Ranger"
            width={110}
            height={110}
            className="h-auto w-[42vw] max-w-[360px] min-w-[240px] print:w-[34mm]"
            priority
          />

          <div className="mt-8 border border-zinc-300 bg-white p-4 print:mt-[2mm] print:border-black print:p-[2mm]">
            <QRCode value={target} size={220} level="H" />
          </div>

          <p className="mt-8 max-w-6xl break-all px-2 text-center font-mono text-md leading-tight print:mt-[2.5mm] print:text-[9px]">
            {target}
          </p>

          {slug ? (
            <p className="mt-3 text-lg text-zinc-700 print:mt-[1mm] print:text-[8px] print:text-black">
              slug: {slug}
            </p>
          ) : null}

          <p className="mt-4">x _______________________________________ x</p>

          <p className="font-bold mt-3">พังเรนเจอร์</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Noto+Sans+Thai:wght@100..900&display=swap');

        .ticket-sheet {
          font-family: "Noto Sans Thai", sans-serif;
        }

        @page {
          size: 107mm auto;
          margin: 0;
        }

        @media print {
          html, body {
            width: 107mm;
            margin: 0;
            padding: 0;
            background: #fff;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* เอา shadow + scale ออกตอน print */
          .shadow-xl {
            box-shadow: none !important;
          }

          .scale-\\[0\\.95\\] {
            transform: scale(1) !important;
          }
        }
      `}</style>
    </main>
  );
}