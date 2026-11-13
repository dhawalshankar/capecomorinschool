// app/admin/notices/page.tsx
"use client";
import { useEffect, useState } from "react";
import GenerateNoticeModal from "@/components/admin/GenerateNoticeModal";

type Notice = {
  id: number;
  title: string;
  file_url: string;
  uploaded_at: string;
};

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function loadNotices() {
    setLoading(true);
    const res = await fetch(`${API}/api/notices`, { cache: "no-store" });
    setNotices(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    async function fetchNotices() {
      const res = await fetch(`${API}/api/notices`, { cache: "no-store" });
      setNotices(await res.json());
      setLoading(false);
    }
    fetchNotices();
  }, [API]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    const res = await fetch(`${API}/api/notices`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Upload failed");
    } else {
      setTitle("");
      setFile(null);
      loadNotices();
    }
    setUploading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this notice?")) return;
    await fetch(`${API}/api/notices/${id}`, { method: "DELETE" });
    loadNotices();
  }

  return (
    <div className="max-w-3xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-8">
        Notice Board
      </h1>

      <button
        onClick={() => setShowGenerateModal(true)}
        className="bg-[#16233F] hover:bg-[#0f1830] transition-colors text-white px-6 py-2.5 rounded font-medium text-sm mb-6"
      >
        Generate Notice
      </button>

      <form onSubmit={handleUpload} className="bg-white text-black border border-[#E5DFD0] rounded p-6 mb-10 space-y-4">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notice title"
          className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <input
          required
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        <p className="text-xs text-[#8A8F97]">Accepts PDF or DOCX — DOCX is converted to PDF automatically.</p>
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          {uploading ? "Uploading..." : "Upload Notice"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-sm text-[#8A8F97]">Loading...</p>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="flex items-center justify-between bg-white border border-[#E5DFD0] rounded p-4">
              <div>
                <a
                  href={`${API}/api/notices/${n.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#16233F] text-sm hover:underline"
                >
                  {n.title}
                </a>
                <div className="text-xs text-[#5B5F66] mt-1">{new Date(n.uploaded_at).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleDelete(n.id)} className="text-xs text-red-600 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showGenerateModal && (
        <GenerateNoticeModal
          API={API}
          onClose={() => setShowGenerateModal(false)}
          onPublished={loadNotices}
        />
      )}
    </div>
  );
}