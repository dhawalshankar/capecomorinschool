// app/(public)/gallery/page.tsx
import type { ReactNode } from "react";
import Script from "next/script";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

// ---------- Icon badge system (consistent with Academics/Admissions pages) ----------
function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 w-11 h-11 rounded-full bg-[#FAF6EE] border-2 border-[#C9A227] flex items-center justify-center">
      {children}
    </div>
  );
}

const icons = {
  water: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M12 3c4 5 7 8.5 7 12a7 7 0 0 1-14 0c0-3.5 3-7 7-12Z" strokeLinejoin="round" />
    </svg>
  ),
  power: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  furniture: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" strokeLinecap="round" />
      <path d="M3 11h18v4H3v-4ZM5 15v4M19 15v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  fan: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <circle cx="12" cy="12" r="1.6" fill="#8B2E3F" stroke="none" />
      <path d="M12 12c0-3 1.5-6 4.5-6 2 0 3 1.5 2 3.5C17 11.5 14.5 12 12 12ZM12 12c3 0 6 1.5 6 4.5 0 2-1.5 3-3.5 2C13 17 12.5 14.5 12 12ZM12 12c-3 0-6-1.5-6-4.5 0-2 1.5-3 3.5-2C11 6.5 11.5 9 12 12Z" strokeLinejoin="round" />
    </svg>
  ),
  teacherRatio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 19c1-3.5 3-5 5-5s4 1.5 5 5M14 19c.6-2.4 2-3.6 3.5-3.6s2.7 1.2 3.5 3.6" strokeLinecap="round" />
    </svg>
  ),
  swing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M5 4v16M19 4v16M5 4h14" strokeLinecap="round" />
      <path d="M8 4v6l-2.5 8M16 4v6l2.5 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 18h3M14.5 18h3" strokeLinecap="round" />
    </svg>
  ),
  tv: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 17v3" strokeLinecap="round" />
      <path d="M8 9l3 2-3 2V9Z" fill="#8B2E3F" stroke="none" />
    </svg>
  ),
} as const;

export const metadata: Metadata = {
  title: "Gallery | Cape Comorin Children School, Kanpur",
  description: "A look at life at Cape Comorin Children School — classrooms, facilities, and everyday moments from Playgroup to Class 8.",
};

export default function Gallery() {
  const facilities = [
    { icon: "water", title: "Cold Drinking Water", desc: "Clean, cold drinking water available throughout the day for every child." },
    { icon: "power", title: "Uninterrupted Electricity", desc: "Constant power supply, so classrooms are never disrupted mid-lesson." },
    { icon: "furniture", title: "Well-Furnished Classrooms", desc: "Sturdy, age-appropriate furniture designed for comfort and posture." },
    { icon: "fan", title: "Fans in Every Classroom", desc: "Proper ventilation and cooling so children stay comfortable and focused." },
    { icon: "teacherRatio", title: "Attentive Teacher Ratios", desc: "Enough teachers in preparatory classes to genuinely look after every child, not just teach them." },
    { icon: "swing", title: "Swings & Play Material", desc: "Swings and hands-on play material built right into the classroom experience, so learning stays playful, not just instructional." },
    { icon: "tv", title: "Audio-Visual Learning", desc: "Televisions in preparatory classes bring lessons to life with sound and visuals, so young children stay engaged instead of bored." },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Gallery</div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#16233F] mb-4">
        Life at Cape Comorin
      </h1>
      <p className="text-[#3A3E45] leading-relaxed mb-12 max-w-2xl">
        A close look at everyday school life — the environment, the
        classrooms, and the little things that make each day comfortable
        and engaging for your child.
      </p>

      {/* ---------- Facilities (moved above the feed) ---------- */}
      <div className="max-w-2xl">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Facilities</div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F] mb-4">
          A Comfortable, Well-Cared-For Environment
        </h2>
        <p className="text-[#3A3E45] leading-relaxed mb-8">
          Beyond what&apos;s taught, we pay close attention to the everyday
          comfort and engagement of every child — because a school day well
          spent starts with the basics being taken care of, quietly and
          consistently.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mb-20">
        {facilities.map((f) => (
          <div key={f.title} className="bg-white border border-[#E5DFD0] rounded p-5 flex gap-4">
            <IconBadge>{icons[f.icon]}</IconBadge>
            <div>
              <h3 className="text-[#16233F] font-semibold mb-1.5 text-sm">{f.title}</h3>
              <p className="text-[#3A3E45] text-sm leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Social feed (moved to the bottom) ---------- */}
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Follow Along</div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F] mb-4">
        Live From Our Feed
      </h2>
      <p className="text-[#3A3E45] leading-relaxed mb-8 max-w-2xl">
        From classroom learning to extracurricular activities, here&apos;s a live
        look at school life, straight from our social media.
      </p>
      <div className="rounded overflow-hidden border border-[#E5DFD0] bg-white p-2">
        <div className="elfsight-app-2e14dd99-4c67-4204-9c5a-c84c79d9c746" data-elfsight-app-lazy />
      </div>
      <p className="text-xs text-[#8A8F97] mt-4 text-center">
        Follow us on {" "}
        <a
          href="https://www.instagram.com/ccs.nurturedreams/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8B2E3F] hover:underline"
        >
          Instagram
        </a>{" "}
        for more.
      </p>

      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </div>
  );
}