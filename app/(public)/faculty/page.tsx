import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

// app/(public)/faculty/page.tsx
export const metadata: Metadata = {
  title: "Faculty",
  description: "Our teacher training philosophy at Cape Comorin Children School — character, ongoing training, and close classroom oversight, without publishing staff profiles.",
};

export default function Faculty() {
  const principles = [
    [
      "We hire for character before credentials",
      "A degree tells us what someone knows. It tells us nothing about whether they can sit with a struggling child and not give up. We test for the second thing far more carefully than the first.",
    ],
    [
      "Training never stops at the classroom door",
      "Every teacher at Cape Comorin goes through structured, ongoing training in teaching method, classroom management, and child psychology. Learning is not something we ask only of students.",
    ],
    [
      "Management stays close to the classroom",
      "Faculty performance isn't reviewed once a year on paper. School leadership stays actively involved in how classrooms are run, so standards don't drift once a teacher is hired.",
    ],
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Faculty</div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#16233F] mb-8">
        Our Training Philosophy
      </h1>

      <p className="text-[#3A3E45] leading-relaxed text-lg mb-6 max-w-2xl">
        We do not publish staff profiles on this website, and we never
        will. Our teachers&apos; privacy is not negotiable — not for marketing,
        not for anything else. What we owe you instead is something more
        useful than a photograph: an honest account of how we build and
        hold our faculty to a standard.
      </p>
      <p className="text-[#3A3E45] leading-relaxed mb-16 max-w-2xl">
        A child&apos;s education is only as strong as the person standing in
        front of them every day. So rather than show you faces, we&apos;d
        rather show you the thinking behind who gets to stand there.
      </p>

      <div className="space-y-10">
        {principles.map(([title, desc], i) => (
          <div key={title} className="border-l-2 border-[#C9A227] pl-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-2">
              {title}
            </h3>
            <p className="text-[#5B5F66] leading-relaxed max-w-xl">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-white border border-[#E5DFD0] rounded p-8">
        <p className="text-[#16233F] font-[family-name:var(--font-display)] text-lg leading-relaxed">
          If you have questions about who is teaching your child, ask us
          directly — we will always answer honestly, in person or over a
          call. That conversation belongs to you and us. It doesn&apos;t
          belong on a public webpage.
        </p>
      </div>
    </div>
  );
}