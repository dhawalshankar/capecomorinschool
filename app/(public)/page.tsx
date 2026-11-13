// app/(public)/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

type Notice = {
  id: number;
  title: string;
  file_url: string;
  uploaded_at: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function getNotices(): Promise<Notice[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notices`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export const metadata: Metadata = {
  title: "Home",
  description: "Cape Comorin Children School, Kanpur — English-medium, government-recognized school for Playgroup to Class 8. Admissions open for 2026–27.",
};

export default async function Home() {
  const notices = await getNotices();
  const latestNotices = notices.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src="/hero-school.jpg"
          alt="Cape Comorin Children School campus"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#16233F]/70" />
        <svg
          className="absolute right-[-80px] top-[-80px] opacity-15 pointer-events-none"
          width="500" height="500" viewBox="0 0 500 500" fill="none"
        >
          {[60, 110, 160, 210, 260].map((r) => (
            <circle key={r} cx="250" cy="250" r={r} stroke="#C9A227" strokeWidth="1.5" />
          ))}
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 md:py-36 text-[#FAF6EE]">
          <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-4">
            Est. 2001 &middot; Playgroup to Class 8
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-semibold leading-tight max-w-2xl">
            Where the Dreams are Nurtured
          </h1>
          <p className="mt-6 text-[#C9C4B8] max-w-lg text-lg">
            Cape Comorin Children School has spent 25+ years building a place where
            children are known by name, and education means real, honest
            effort — not certificates on a wall.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/admissions" className="bg-[#8B2E3F] hover:bg-[#732634] transition-colors px-6 py-3 rounded font-medium">
              Admissions Open
            </Link>
            <Link href="/about" className="border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#16233F] transition-colors px-6 py-3 rounded font-medium">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-6 text-center">
        {[
          ["25+", "Years of Legacy"],
          ["Playgroup–8", "Classes Offered"],
          ["English", "Medium"],
          ["Govt.", "Recognized"],
        ].map(([big, small]) => (
          <div key={small} className="border-t-2 border-[#C9A227] pt-4">
            <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F]">
              {big}
            </div>
            <div className="text-sm text-[#5B5F66] mt-1">{small}</div>
          </div>
        ))}
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">
            From the Principal&apos;s Desk
          </div>
          <p className="font-[family-name:var(--font-display)] text-2xl leading-relaxed text-[#16233F]">
            &quot;Every child who walks through our gates carries a dream. Our
            work, every single day, is to make sure that dream is taken
            seriously.&quot;
          </p>
          <div className="mt-4 text-sm text-[#5B5F66]">
            — Chitranshi Shukla, Principal
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F]">
            Notice Board
          </h2>
          <Link href="/notices" className="text-sm text-[#8B2E3F] hover:underline">
            View all →
          </Link>
        </div>

        {latestNotices.length === 0 ? (
          <p className="text-sm text-[#8A8F97]">No notices published yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {latestNotices.map((n) => (
              <a
                key={n.id}
                href={n.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[#E5DFD0] bg-white rounded p-5 hover:border-[#C9A227] transition-colors"
              >
                <div className="text-xs text-[#C9A227] uppercase tracking-wide mb-2">Notice</div>
                <div className="font-medium text-[#16233F]">{n.title}</div>
                <div className="text-sm text-[#5B5F66] mt-1">
                  {formatDate(n.uploaded_at)} &middot; View PDF →
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}