// app/(admin)/calendar/page.tsx
"use client";
import { useEffect, useState } from "react";

type CalendarEvent = {
  id: number;
  title: string;
  start_date: string;
  end_date: string | null;
  type: string;
  source: string;
};

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Event");
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function loadEvents() {
    setLoading(true);
    const res = await fetch(`${API}/api/calendar`, { cache: "no-store" });
    const data = await res.json();
    data.sort((a: CalendarEvent, b: CalendarEvent) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchCalendar() {
      const res = await fetch(`${API}/api/calendar`, { cache: "no-store" });
      const data = await res.json();
      data.sort((a: CalendarEvent, b: CalendarEvent) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
      setEvents(data);
      setLoading(false);
    }
    fetchCalendar();
  }, [API]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`${API}/api/calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        start_date: startDate,
        end_date: endDate || null,
        type,
      }),
    });
    setTitle("");
    setStartDate("");
    setEndDate("");
    setType("Event");
    setSaving(false);
    loadEvents();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API}/api/calendar/${id}`, { method: "DELETE" });
    loadEvents();
  }

  return (
    <div className="max-w-4xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-8">
        Academic Calendar
      </h1>

      <form onSubmit={handleAdd} className="bg-white text-black border border-[#E5DFD0] rounded p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm sm:col-span-2"
        />
        <input
          required
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End date (optional)"
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        >
          <option>Event</option>
          <option>Holiday</option>
          <option>Exam</option>
          <option>PTM</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          {saving ? "Adding..." : "Add Event"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[#8A8F97]">Loading...</p>
      ) : (
        <div className="divide-y divide-[#E5DFD0] border-t border-b border-[#E5DFD0]">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-[#16233F] text-sm">{e.title}</div>
                <div className="text-xs text-[#5B5F66]">
                  {e.start_date}{e.end_date ? ` – ${e.end_date}` : ""} &middot; {e.type} &middot; {e.source}
                </div>
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}