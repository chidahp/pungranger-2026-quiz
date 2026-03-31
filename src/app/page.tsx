import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Image
        src="/pung-ranger-logo.png"
        alt="Pung Ranger"
        width={480}
        height={480}
        className="max-w-[70vw]"
        priority
      />
    </div>
  );
}
