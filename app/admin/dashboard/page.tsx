// app/admin/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authedFetch } from "@/lib/api";

function StatBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-full bg-[#FAF6EE] border-2 border-[#C9A227] flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

const icons = {
  teacher: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.2" /><path d="M5 20c1.5-4 4-5.5 7-5.5s5.5 1.5 7 5.5" strokeLinecap="round" />
    </svg>
  ),
  notice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  register: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B2E3F" strokeWidth="1.6">
      <path d="M7 3h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" strokeLinecap="round" />
    </svg>
  ),
} as const;

const quickLinks = [
  { href: "/teachers", label: "Manage Teachers", desc: "Add, edit, or remove faculty listed on the public site.", superAdminOnly: true },
  { href: "/notices", label: "Post a Notice", desc: "Upload a PDF or DOCX and publish it to the Notice Board.", superAdminOnly: false },
  { href: "/calendar", label: "Update Calendar", desc: "Add school-specific events, exams, or PTM dates.", superAdminOnly: false },
  { href: "/registers", label: "Upload Register", desc: "Upload scanned registers for AI-assisted extraction.", superAdminOnly: false },
] as const;

export default function AdminDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [teacherCount, setTeacherCount] = useState<number | null>(null);
  const [noticeCount, setNoticeCount] = useState<number | null>(null);
  const [upcomingCount, setUpcomingCount] = useState<number | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    authedFetch(`${API}/api/auth/me`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));

    authedFetch(`${API}/api/notices`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNoticeCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setNoticeCount(0));

    authedFetch(`${API}/api/calendar`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) return setUpcomingCount(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data.filter((e: { start_date: string }) => new Date(e.start_date) >= today);
        setUpcomingCount(upcoming.length);
      })
      .catch(() => setUpcomingCount(0));
  }, [API]);

  // teacher count only fetched (and only makes sense) for super admins
  useEffect(() => {
    if (role !== "super_admin") return;
    authedFetch(`${API}/api/teachers`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTeacherCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setTeacherCount(0));
  }, [role, API]);

  const isSuperAdmin = role === "super_admin";
  const visibleQuickLinks = quickLinks.filter((q) => !q.superAdminOnly || isSuperAdmin);

  return (
    <div className="max-w-5xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-2">
        Dashboard
      </h1>
      <p className="text-[#5B5F66] text-sm mb-10">
        A quick look at what&apos;s happening across the site.
      </p>

      <div className={`grid sm:grid-cols-${isSuperAdmin ? "3" : "2"} gap-6 mb-12`}>
        {isSuperAdmin && (
          <div className="bg-white border border-[#E5DFD0] rounded p-5 flex gap-4">
            <StatBadge>{icons.teacher}</StatBadge>
            <div>
              <div className="text-2xl font-semibold text-[#16233F]">
                {teacherCount === null ? "—" : teacherCount}
              </div>
              <div className="text-xs text-[#5B5F66]">Teachers Listed</div>
            </div>
          </div>
        )}
        <div className="bg-white border border-[#E5DFD0] rounded p-5 flex gap-4">
          <StatBadge>{icons.notice}</StatBadge>
          <div>
            <div className="text-2xl font-semibold text-[#16233F]">
              {noticeCount === null ? "—" : noticeCount}
            </div>
            <div className="text-xs text-[#5B5F66]">Published Notices</div>
          </div>
        </div>
        <div className="bg-white border border-[#E5DFD0] rounded p-5 flex gap-4">
          <StatBadge>{icons.calendar}</StatBadge>
          <div>
            <div className="text-2xl font-semibold text-[#16233F]">
              {upcomingCount === null ? "—" : upcomingCount}
            </div>
            <div className="text-xs text-[#5B5F66]">Upcoming Events</div>
          </div>
        </div>
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-4">
        Quick Actions
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {visibleQuickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="bg-white border border-[#E5DFD0] rounded p-5 hover:border-[#C9A227] transition-colors"
          >
            <h3 className="text-[#16233F] font-semibold text-sm mb-1">{q.label}</h3>
            <p className="text-[#5B5F66] text-sm leading-relaxed">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}