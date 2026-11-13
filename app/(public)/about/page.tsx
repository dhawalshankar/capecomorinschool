// app/(public)/about/page.tsx
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Cape Comorin Children School, Kanpur",
  description: "Cape Comorin Children School, established 2001 in Ratan Lal Nagar, Kanpur — an English-medium, government-recognized school for Playgroup to Class 8.",
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">About Us</div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#16233F] mb-8">
        Our Story
      </h1>
      <p className="text-[#3A3E45] leading-relaxed mb-6">
        Cape Comorin Children School was founded in 2001 with a simple belief: that
        every child deserves an education built on real effort, not
        shortcuts. For over 25 years, that belief has guided everything we
        do — from how we teach, to how we treat every single student who
        walks through our doors.
      </p>
      <p className="text-[#3A3E45] leading-relaxed mb-6">
        We are a Playgroup to Class 8, English-medium, government-recognized
        school based in Ratan Lal Nagar, Kanpur. We don&apos;t chase rankings or
        trophy walls — we focus on the quieter, harder work of actually
        teaching well.
      </p>
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="border-t-2 border-[#C9A227] pt-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-2">
            Our Mission
          </h2>
          <p className="text-[#5B5F66] text-sm leading-relaxed">
            To nurture every dream that walks through our gates — with
            honest teaching, real attention, and an environment where
            children are known, not just enrolled.
          </p>
        </div>
        <div className="border-t-2 border-[#C9A227] pt-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-2">
            Our Vision
          </h2>
          <p className="text-[#5B5F66] text-sm leading-relaxed">
            A school where dreams are treated as things worth nurturing
            carefully — one child, one classroom, one year at a time.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white border border-[#E5DFD0] rounded p-8">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">
          Principal&apos;s Message
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="w-70 h-70 rounded-full overflow-hidden border-4 border-[#C9A227] shadow-sm">
              <Image
                src="/principal.png"
                alt="Chitranshi Shukla, Principal of Cape Comorin Children School"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl leading-relaxed text-[#16233F] mb-3">
              &quot;In 25 years, I have learned that no two children grow the same
              way, on the same day, at the same pace — and a school that
              forgets this stops being a school and becomes a factory. Our
              promise here has never been to produce the loudest results. It
              has been to notice each child closely enough to know what they
              actually need, and to give it to them without hurry.&quot;
            </p>
            <div className="text-sm text-[#5B5F66]">— Chitranshi Shukla, Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
}