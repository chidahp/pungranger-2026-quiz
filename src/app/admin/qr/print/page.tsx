import PrintTicketClient from "./PrintTicketClient";

type PrintPageProps = {
  searchParams: Promise<{
    slug?: string;
    target?: string;
    customerName?: string;
  }>;
};

const FALLBACK_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pungranger.chidahp.com";
const GIFT_PATH_PREFIX = "/gift";

export default async function QrPrintPage({ searchParams }: PrintPageProps) {
  const params = await searchParams;
  const slug = params.slug?.trim() ?? "";
  const customerName = params.customerName?.trim() ?? "";
  const base = FALLBACK_BASE_URL.replace(/\/$/, "");
  const target =
    params.target?.trim() ||
    (slug ? `${base}${GIFT_PATH_PREFIX}/${slug}` : `${base}${GIFT_PATH_PREFIX}`);

  return <PrintTicketClient slug={slug} target={target} customerName={customerName} />;
}
