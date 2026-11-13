// app/admin/registers/page.tsx
"use client";
import { useState } from "react";
import { authedFetch } from "@/lib/api";

type UploadResult = {
  status: string;
  inserted: number;
  skipped: number;
  total: number;
};

export default function AdminRegisters() {
  const [file, setFile] = useState<File | null>(null);
  const [srSeries, setSrSeries] = useState<"old" | "new">("old");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sr_series", srSeries);
    const res = await authedFetch(`${API}/api/registers/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setError("Upload failed — check the file and try again.");
    } else {
      setResult(await res.json());
    }
    setUploading(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-8">
        Register Upload
      </h1>
      <form onSubmit={handleUpload} className="bg-white text-black border border-[#E5DFD0] rounded p-6 space-y-4">
        <div>
          <label className="block text-xs text-[#5B5F66] mb-1.5">SR Series</label>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={srSeries === "old"} onChange={() => setSrSeries("old")} />
              CC-OLD (old series)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={srSeries === "new"} onChange={() => setSrSeries("new")} />
              CC (new series)
            </label>
          </div>
        </div>
        <input
          required
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        <p className="text-xs text-[#8A8F97]">Upload a scanned Scholar&apos;s Register PDF for AI extraction.</p>
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          {uploading ? "Processing..." : "Upload Register"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      {result && (
        <div className="mt-6 bg-white text-black border border-[#E5DFD0] rounded p-6 text-sm space-y-1">
          <p><span className="text-[#5B5F66]">Status:</span> {result.status}</p>
          <p><span className="text-[#5B5F66]">Inserted:</span> {result.inserted}</p>
          <p><span className="text-[#5B5F66]">Skipped (duplicates):</span> {result.skipped}</p>
          <p><span className="text-[#5B5F66]">Total found:</span> {result.total}</p>
        </div>
      )}
    </div>
  );
}