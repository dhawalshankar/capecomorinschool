// app/admin/fees/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
// import { authedFetch } from "@/lib/api";

/**
 * MOCK MODE
 * ---------
 * The Razorpay hosted-checkout migration means /api/fees has no webhook
 * writing rows yet (blocked on the bank-side integration). Rather than ship
 * a screen that just says "check your connection", this page runs on
 * generated mock data so finance staff can see the dashboard shape now.
 *
 * To reconnect to the real API once the webhook is live:
 *   1. Set MOCK_MODE to false.
 *   2. Uncomment the authedFetch import above and the fetchLive() call below.
 *   3. Make sure the API returns FeeTransaction[] in the same shape.
 */
const MOCK_MODE = true;

type FeeStatus = "paid" | "pending" | "overdue" | "refunded";

type FeeTransaction = {
  id: number;
  student_digital_id: string;
  student_name: string;
  class_label: string;
  amount: number;
  status: FeeStatus;
  created_at: string;
};

const STATUS_STYLES: Record<FeeStatus, { label: string; text: string; bg: string; dot: string }> = {
  paid: { label: "Paid", text: "#2F6B4F", bg: "#E8F0E9", dot: "#2F6B4F" },
  pending: { label: "Pending", text: "#8A6A00", bg: "#FBF1D6", dot: "#C9A227" },
  overdue: { label: "Overdue", text: "#8B2E3F", bg: "#F3E9E9", dot: "#8B2E3F" },
  refunded: { label: "Refunded", text: "#5B5F66", bg: "#EFEFEC", dot: "#8A8F97" },
};

const CLASSES = ["Nursery", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const FIRST_NAMES = ["Aarav", "Ishaan", "Diya", "Anaya", "Vihaan", "Myra", "Kabir", "Saanvi", "Reyansh", "Aadhya", "Arjun", "Kiara"];
const LAST_NAMES = ["Sharma", "Verma", "Gupta", "Reddy", "Iyer", "Khan", "Singh", "Mehta", "Chatterjee", "Nair"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateMockTransactions(): FeeTransaction[] {
  const rand = seededRandom(42);
  const now = new Date();
  const rows: FeeTransaction[] = [];
  const statusPool: FeeStatus[] = ["paid", "paid", "paid", "paid", "pending", "pending", "overdue", "refunded"];

  for (let i = 0; i < 86; i++) {
    const daysAgo = Math.floor(rand() * 165);
    const created = new Date(now);
    created.setDate(created.getDate() - daysAgo);

    const cls = CLASSES[Math.floor(rand() * CLASSES.length)];
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const status = statusPool[Math.floor(rand() * statusPool.length)];
    const baseAmount = 6000 + Math.floor(rand() * 14) * 500;

    rows.push({
      id: i + 1,
      student_digital_id: `STU-${2031 + Math.floor(rand() * 900)}`,
      student_name: `${first} ${last}`,
      class_label: cls,
      amount: baseAmount,
      status,
      created_at: created.toISOString(),
    });
  }
  return rows.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function formatCompactINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n}`;
}

function monthKey(d: Date) {
  return d.toLocaleDateString("en-IN", { month: "short" });
}

export default function AdminFees() {
  const [txns, setTxns] = useState<FeeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeeStatus | "all">("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setForbidden(false);
      setLoadError(null);

      if (MOCK_MODE) {
        // Small artificial delay so the loading state is visible, matching
        // the feel of a real network round trip.
        await new Promise((r) => setTimeout(r, 350));
        setTxns(generateMockTransactions());
        setLoading(false);
        return;
      }

      // --- Live path, restored once the webhook ships ---
      // try {
      //   const API = process.env.NEXT_PUBLIC_API_BASE_URL;
      //   const res = await authedFetch(`${API}/api/fees`);
      //   if (res.status === 403) {
      //     setForbidden(true);
      //     return;
      //   }
      //   if (!res.ok) {
      //     setLoadError("Couldn't load fee transactions. Try refreshing.");
      //     return;
      //   }
      //   const data = await res.json();
      //   setTxns(Array.isArray(data) ? data : []);
      // } catch {
      //   setLoadError("Couldn't reach the server. Check your connection.");
      // } finally {
      //   setLoading(false);
      // }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const collected = txns.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
    const pending = txns.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
    const overdue = txns.filter((t) => t.status === "overdue");
    const overdueAmount = overdue.reduce((s, t) => s + t.amount, 0);
    const total = txns.length;
    const paidCount = txns.filter((t) => t.status === "paid").length;
    const collectionRate = total ? Math.round((paidCount / total) * 100) : 0;
    return { collected, pending, overdueAmount, overdueCount: overdue.length, collectionRate };
  }, [txns]);

  const monthlyTrend = useMemo(() => {
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.set(monthKey(d), 0);
    }
    txns
      .filter((t) => t.status === "paid")
      .forEach((t) => {
        const key = monthKey(new Date(t.created_at));
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + t.amount);
      });
    return Array.from(buckets.entries()).map(([month, amount]) => ({ month, amount }));
  }, [txns]);

  const statusBreakdown = useMemo(() => {
    const order: FeeStatus[] = ["paid", "pending", "overdue", "refunded"];
    return order
      .map((status) => ({
        status,
        label: STATUS_STYLES[status].label,
        value: txns.filter((t) => t.status === status).length,
        color: STATUS_STYLES[status].dot,
      }))
      .filter((s) => s.value > 0);
  }, [txns]);

  const classWise = useMemo(() => {
    const buckets = new Map<string, number>();
    CLASSES.forEach((c) => buckets.set(c, 0));
    txns
      .filter((t) => t.status === "paid")
      .forEach((t) => buckets.set(t.class_label, (buckets.get(t.class_label) ?? 0) + t.amount));
    return CLASSES.map((c) => ({ class: c, amount: buckets.get(c) ?? 0 })).filter((c) => c.amount > 0);
  }, [txns]);

  const filtered = useMemo(() => {
    return txns.filter((t) => {
      const matchesSearch =
        search.trim() === "" ||
        t.student_digital_id.toLowerCase().includes(search.toLowerCase()) ||
        t.student_name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesClass = classFilter === "all" || t.class_label === classFilter;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [txns, search, statusFilter, classFilter]);

  function exportCSV() {
    const header = ["Student ID", "Name", "Class", "Amount", "Status", "Date"];
    const rows = filtered.map((t) => [
      t.student_digital_id,
      t.student_name,
      t.class_label,
      t.amount,
      STATUS_STYLES[t.status].label,
      new Date(t.created_at).toLocaleDateString("en-IN"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fee-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl">
        <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-2">
          Fee Transactions
        </h1>
        <p className="text-sm text-[#8A8F97] bg-[#F3E9E9] text-[#8B2E3F] rounded px-4 py-3 mt-6">
          You don&apos;t have access to this section.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F]">
            Fee Transactions
          </h1>
        </div>
        {MOCK_MODE && (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[#8A6A00] bg-[#FBF1D6] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
            Demo data — live sync pending bank webhook
          </span>
        )}
      </div>
      <p className="text-sm text-[#8A8F97] mb-8 max-w-2xl">
        Fees now route through Razorpay&apos;s hosted payment page. Once the webhook is connected,
        this dashboard will reflect real-time payment activity automatically.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-[#F3F1EA] animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <p className="text-sm text-[#8B2E3F] bg-[#F3E9E9] rounded px-4 py-3">{loadError}</p>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard label="Total Collected" value={`₹${formatCompactINR(stats.collected)}`} accent="#2F6B4F" />
            <KpiCard label="Pending Dues" value={`₹${formatCompactINR(stats.pending)}`} accent="#C9A227" />
            <KpiCard
              label="Overdue"
              value={`${stats.overdueCount} students`}
              sub={`₹${formatCompactINR(stats.overdueAmount)}`}
              accent="#8B2E3F"
            />
            <KpiCard label="Collection Rate" value={`${stats.collectionRate}%`} accent="#16233F" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 border border-[#E5DFD0] rounded-lg p-5">
              <h2 className="text-sm font-semibold text-[#16233F] mb-1">Collection trend</h2>
              <p className="text-xs text-[#8A8F97] mb-4">Paid amount by month, last 6 months</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyTrend} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="feeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16233F" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#16233F" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E5DFD0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5B5F66" }} axisLine={{ stroke: "#E5DFD0" }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#5B5F66" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCompactINR(v)}
                    width={56}
                  />
                  <Tooltip
                    formatter={(v: unknown) => [
                      `₹${formatINR(typeof v === "number" ? v : typeof v === "string" ? Number(v) || 0 : 0)}`,
                      "Collected",
                    ]}
                    contentStyle={{ borderColor: "#E5DFD0", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#16233F" strokeWidth={2} fill="url(#feeArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-[#E5DFD0] rounded-lg p-5">
              <h2 className="text-sm font-semibold text-[#16233F] mb-1">Status breakdown</h2>
              <p className="text-xs text-[#8A8F97] mb-4">By transaction count</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="label" innerRadius={42} outerRadius={64} paddingAngle={2}>
                    {statusBreakdown.map((s) => (
                      <Cell key={s.status} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderColor: "#E5DFD0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center gap-1.5 text-xs text-[#5B5F66]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label} ({s.value})
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-[#E5DFD0] rounded-lg p-5 mb-8">
            <h2 className="text-sm font-semibold text-[#16233F] mb-1">Collection by class</h2>
            <p className="text-xs text-[#8A8F97] mb-4">Paid amount, current session</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={classWise} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="#E5DFD0" vertical={false} />
                <XAxis dataKey="class" tick={{ fontSize: 12, fill: "#5B5F66" }} axisLine={{ stroke: "#E5DFD0" }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#5B5F66" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => formatCompactINR(v)}
                  width={56}
                />
                <Tooltip
                  formatter={(v: unknown) => [
                    `₹${formatINR(typeof v === "number" ? v : typeof v === "string" ? Number(v) || 0 : 0)}`,
                    "Collected",
                  ]}
                  contentStyle={{ borderColor: "#E5DFD0", fontSize: 12 }}
                />
                <Bar dataKey="amount" fill="#C9A227" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or ID"
              className="flex-1 min-w-[200px] text-sm border border-[#E5DFD0] rounded px-3 py-2 text-[#16233F] placeholder:text-[#8A8F97] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FeeStatus | "all")}
              className="text-sm border border-[#E5DFD0] rounded px-3 py-2 text-[#16233F] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_STYLES).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-sm border border-[#E5DFD0] rounded px-3 py-2 text-[#16233F] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
            >
              <option value="all">All classes</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
            <button
              onClick={exportCSV}
              className="text-sm font-medium text-[#16233F] border border-[#E5DFD0] rounded px-3 py-2 hover:bg-[#F8F6EF] transition-colors"
            >
              Export CSV
            </button>
          </div>

          {/* Transactions table */}
          {filtered.length === 0 ? (
            <p className="text-sm text-[#8A8F97] py-8 text-center border border-dashed border-[#E5DFD0] rounded-lg">
              No transactions match these filters.
            </p>
          ) : (
            <>
              <div className="border-t border-b border-[#E5DFD0]">
                <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 py-2 text-xs font-medium text-[#8A8F97] uppercase tracking-wide">
                  <div>Student</div>
                  <div className="hidden sm:block">Class</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Status</div>
                </div>
                <div className="divide-y divide-[#E5DFD0]">
                  {filtered.slice(0, visibleCount).map((t) => {
                    const s = STATUS_STYLES[t.status];
                    return (
                      <div
                        key={t.id}
                        className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-center py-3 text-sm"
                      >
                        <div>
                          <div className="font-medium text-[#16233F]">{t.student_name}</div>
                          <div className="text-xs text-[#5B5F66]">
                            {t.student_digital_id} · {new Date(t.created_at).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <div className="hidden sm:block text-[#5B5F66]">Class {t.class_label}</div>
                        <div className="text-right font-medium text-[#16233F]">₹{formatINR(t.amount)}</div>
                        <div className="text-right">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1"
                            style={{ color: s.text, backgroundColor: s.bg }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                            {s.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-[#8A8F97]">
                  Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} transactions
                </p>
                {visibleCount < filtered.length && (
                  <button
                    onClick={() => setVisibleCount((v) => v + 12)}
                    className="text-xs font-medium text-[#16233F] border border-[#E5DFD0] rounded px-3 py-1.5 hover:bg-[#F8F6EF] transition-colors"
                  >
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="border border-[#E5DFD0] rounded-lg p-4 relative overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
      <div className="text-xs text-[#8A8F97] mb-1.5">{label}</div>
      <div className="text-2xl font-semibold text-[#16233F] font-[family-name:var(--font-display)]">{value}</div>
      {sub && <div className="text-xs text-[#5B5F66] mt-1">{sub}</div>}
    </div>
  );
}