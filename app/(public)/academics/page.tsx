// app/(public)/academics/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

// ---------- Custom icon badges (echo the crest's circular medallion + gold ring) ----------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 w-11 h-11 rounded-full bg-[#FAF6EE] border-2 border-[#C9A227] flex items-center justify-center">
      {children}
    </div>
  );
}

const icons = {
  path: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M4 20c4-8 12-8 16-16" strokeLinecap="round" />
      <circle cx="4" cy="20" r="1.6" fill="#8B2E3F" stroke="none" />
      <circle cx="20" cy="4" r="1.6" fill="#C9A227" stroke="none" />
    </svg>
  ),
  speech: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M4 5h16v10H9l-4 4V5Z" strokeLinejoin="round" />
      <path d="M9 9h6M9 12h4" strokeLinecap="round" />
    </svg>
  ),
  columns: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M4 20h16M5 20V9M9 20V9M15 20V9M19 20V9M3 9l9-5 9 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  target: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="0.8" fill="#8B2E3F" />
    </svg>
  ),
  medal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <circle cx="12" cy="15" r="5" />
      <path d="M9 10 7 4M15 10l2-6" strokeLinecap="round" />
      <path d="M10.3 13.5 12 15l1.7-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  burst: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  mic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" strokeLinecap="round" />
    </svg>
  ),
  flask: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M10 3h4M10 3v6l-5 9a1.5 1.5 0 0 0 1.3 2.3h11.4A1.5 1.5 0 0 0 19 18l-5-9V3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15h8" strokeLinecap="round" />
    </svg>
  ),
  leaf: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M20 4c0 9-7 16-16 16 0-9 7-16 16-16Z" strokeLinejoin="round" />
      <path d="M5 19c4-4 7-8 11-13" strokeLinecap="round" />
    </svg>
  ),
  trophy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M12 13v4m-3 3h6m-3-3v3" strokeLinecap="round" />
    </svg>
  ),
};
export const metadata: Metadata = {
  title: "Academics | Cape Comorin Children School, Kanpur",
  description: "CBSE-pattern teaching built on NCERT foundations, from Playgroup to Class 8. Real understanding over rote memorization.",
};
export default function Academics() {
  const points = [
    { icon: "path", title: "Playgroup to Class 8", desc: "A complete early-to-middle school journey under one roof." },
    { icon: "speech", title: "English Medium", desc: "All instruction in English, from the very first year." },
    { icon: "columns", title: "Government Recognized", desc: "Fully recognized institution, held to real academic standards." },
    { icon: "target", title: "Focus on Fundamentals", desc: "Strong grounding in language, math, and science — not shortcuts." },
  ] as const;

  const activities = [
    { icon: "medal", title: "SOF Olympiads", desc: "Students regularly appear for Science Olympiad Foundation exams, sharpening skills beyond the regular syllabus." },
    { icon: "burst", title: "Gymnastics & Physical Training", desc: "Structured sessions building discipline, flexibility, and physical confidence from an early age." },
    { icon: "mic", title: "Event Management & Anchoring", desc: "Children take turns hosting and organizing school events, building stage confidence and public speaking." },
    { icon: "flask", title: "Science Exhibitions", desc: "Hands-on exhibitions where students design and present their own models, turning curiosity into real projects." },
    { icon: "leaf", title: "Green Day", desc: "A dedicated day fostering care and responsibility for the environment — instilling love for Mother Earth early on." },
    { icon: "trophy", title: "Annual Sports Day", desc: "A full day of athletic events and friendly competition, celebrating teamwork and physical achievement." },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* ---------- Hero ---------- */}
      <div className="flex flex-col md:flex-row md:items-center gap-10 mb-16">
        <div className="flex-1">
          <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Academics</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#16233F] mb-6">
            How We Teach
          </h1>
          <p className="text-[#3A3E45] leading-relaxed max-w-xl">
            Our academic approach is built around one idea: real understanding
            matters more than rote memorization. From Playgroup through Class 8,
            every year is designed to build genuinely on the one before it.
          </p>
        </div>

        {/* Signature illustration — echoes the crest's open book + flame */}
        <div className="shrink-0 self-center">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="66" fill="#FAF6EE" stroke="#C9A227" strokeWidth="2" />
            <circle cx="70" cy="42" r="10" fill="#C9A227" opacity="0.15" />
            <path d="M70 30c3 4 3 8 0 12-3-4-3-8 0-12Z" fill="#C9A227" />
            <path
              d="M70 58v42M40 62c10-4 22-3 30 4 8-7 20-8 30-4M40 62v34c10-4 22-3 30 4M100 62v34c-10-4-22-3-30 4"
              stroke="#8B2E3F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* ---------- How We Teach ---------- */}
      <div className="grid md:grid-cols-2 gap-6">
        {points.map((p) => (
          <div key={p.title} className="border border-[#E5DFD0] bg-white rounded p-6 flex gap-4">
            <Badge>{icons[p.icon]}</Badge>
            <div>
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[#16233F] mb-1.5">
                {p.title}
              </h3>
              <p className="text-sm text-[#5B5F66] leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Beyond the Classroom ---------- */}
      <div className="mt-20">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">
          Beyond the Classroom
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F] mb-4">
          A Childhood, Not Just a Curriculum
        </h2>
        <p className="text-[#3A3E45] leading-relaxed mb-8 max-w-2xl">
          We believe a child&apos;s growth cannot be measured by textbooks alone.
          Alongside academics, our students are given real, hands-on
          opportunities to compete, create, perform, and discover — building
          confidence that stays with them long after they leave our classrooms.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {activities.map((a) => (
            <div key={a.title} className="border border-[#E5DFD0] bg-white rounded p-5 flex gap-4">
              <Badge>{icons[a.icon]}</Badge>
              <div>
                <h3 className="text-[#16233F] font-semibold mb-1.5 text-sm">{a.title}</h3>
                <p className="text-[#5B5F66] text-sm leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[#3A3E45] leading-relaxed mt-8 max-w-2xl">
          Every achievement — big or small — is recognized. Students are
          rewarded with trophies and certificates at school events, reinforcing
          that effort and improvement matter as much as results.
        </p>
      </div>

      {/* ---------- Curriculum & Teaching Philosophy ---------- */}
      <div className="mt-20 max-w-2xl">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">
          Curriculum
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F] mb-4">
          CBSE-Pattern Teaching, Built on NCERT Foundations
        </h2>
        <p className="text-[#3A3E45] leading-relaxed mb-4">
          Up to Class 8, no board — CBSE, ICSE, or otherwise — conducts a formal
          board examination. What actually shapes a child at this stage isn&apos;t
          the board&apos;s name on paper; it&apos;s how seriously the foundational years
          are taught. We follow a CBSE-aligned pattern using NCERT-based
          material, with a concept-first approach designed to build real
          command over language, math, and science — not memorization for a
          test.
        </p>
        <p className="text-[#3A3E45] leading-relaxed mb-4">
          Our classrooms are built around a simple ideology: a child who
          understands deeply in the early years never struggles to catch up
          later, no matter which board or school they move to next. That&apos;s why
          we invest in strong fundamentals now, rather than rushing children
          through a syllabus.
        </p>
        <p className="text-xs text-[#8A8F98] leading-relaxed">
          Cape Comorin Children School stands as a government-recognized, English-medium
          institution, proudly affiliated within the academic fold of the
          state of Uttar Pradesh&apos;s board of education — a foundation upon
          which our CBSE-style pedagogy is layered.
        </p>
      </div>

      {/* ---------- Alumni ---------- */}
      <div className="mt-16 max-w-2xl bg-white border border-[#E5DFD0] rounded p-8 flex gap-5 items-start">
        <Badge>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5 20c1.5-4 4-5.5 7-5.5s5.5 1.5 7 5.5" strokeLinecap="round" />
          </svg>
        </Badge>
        <div>
          <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-2">Alumni</div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-3">
            Are You a Cape Comorin Children School Alumnus?
          </h2>
          <p className="text-[#3A3E45] text-sm leading-relaxed mb-4">
            We&apos;re building an alumni record — a way for future students and
            families to see the people who once sat in these same classrooms
            and where their journeys led. If you studied at Cape Comorin
            School, we&apos;d love to hear from you and add you to that record.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white px-5 py-2.5 rounded font-medium text-sm"
          >
            Reach Out as an Alumnus
          </Link>
        </div>
      </div>
    </div>
  );
}