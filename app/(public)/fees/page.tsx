// app/(public)/fees/page.tsx
"use client";

export default function FeePayment() {
  function handlePay() {
    window.open("https://pages.razorpay.com/pl_RMuEpNshlRNVz1/view", "_blank");
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Fee Payment</div>

      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#16233F] mb-8">
        Pay School Fees
      </h1>

      <div className="bg-white border border-[#E5DFD0] rounded p-8 space-y-4 mb-12">
        <p className="text-sm text-[#5B5F66] leading-relaxed">
          Click below to proceed to our secure payment page. You&apos;ll be able
          to enter your student details and amount there.
        </p>
             
        <button
          onClick={handlePay}
          className="w-full bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          Pay Now
        </button>
         <p className="text-xs text-[#8A8F97] text-center">
                You&apos;ll be redirected to our secure Razorpay payment page. Please have
                your child&apos;s name, class, and month ready for the receipt.
              </p>
      </div>

      <div className="border-t border-[#E5DFD0] pt-10">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">
          Where Your Fees Goes?
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#16233F] mb-6">
          Why This Matters to Us?
        </h2>
        <p className="text-[#3A3E45] leading-relaxed mb-6">
          When you pay fees, you&apos;re not just settling an invoice — you&apos;re
          directly funding the things that let us keep our promise to your
          child. We take that seriously, and we think you deserve to know
          exactly what it goes toward.
        </p>

        <div className="space-y-6">
          <div className="border-l-2 border-[#C9A227] pl-5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-[#16233F] mb-1">
              Our Teachers
            </h3>
            <p className="text-sm text-[#5B5F66] leading-relaxed">
              Fair pay and continuous training for the people who actually
              teach your child, every single day.
            </p>
          </div>
          <div className="border-l-2 border-[#C9A227] pl-5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-[#16233F] mb-1">
              Learning Materials & Facilities
            </h3>
            <p className="text-sm text-[#5B5F66] leading-relaxed">
              Books, classroom resources, and keeping the school itself a
              safe, well-maintained place to learn.
            </p>
          </div>
          <div className="border-l-2 border-[#C9A227] pl-5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-[#16233F] mb-1">
              Day-to-Day School Operations
            </h3>
            <p className="text-sm text-[#5B5F66] leading-relaxed">
              Everything that has to run quietly in the background so the
              classroom experience never suffers.
            </p>
          </div>
        </div>

        <p className="text-[#3A3E45] leading-relaxed mt-8">
          We don&apos;t chase rankings or trophies. What we do chase, every
          year, is making sure the fee you pay turns into a real,
          honest education for your child — not overhead, not excess,
          just the actual work of teaching well.
        </p>
      </div>
    </div>
  );
}