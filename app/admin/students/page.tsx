// app/admin/students/page.tsx
"use client";
import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/api";
import AddStudentModal from "@/components/admin/AddStudentModal";

type Student = {
  id: number;
  sr_number: number;
  student_name: string;
  father_name: string;
  mother_name: string;
  father_address?: string;
  dob: string;
  joining_class: string;
  joining_date?: string;
  last_school?: string;
  digital_id: string;
  match_score?: number;
  verified?: number;
};

type StudentEditFields = {
  student_name: string;
  mother_name: string;
  father_name: string;
  father_address: string;
  dob: string;
  joining_class: string;
  joining_date: string;
  last_school: string;
};

type DedupePreview = {
  status: string;
  duplicate_groups_found: number;
  records_removed: number;
  removed: { id: number; sr_number: number; school_id: string; student_name: string; kept_id: number }[];
};

const EDIT_FIELDS: { key: keyof StudentEditFields; label: string; type?: string }[] = [
  { key: "student_name", label: "Student Name" },
  { key: "father_name", label: "Father's Name" },
  { key: "mother_name", label: "Mother's Name" },
  { key: "father_address", label: "Father's Address" },
  { key: "dob", label: "Date of Birth (DD-MM-YYYY)" },
  { key: "joining_class", label: "Joining Class" },
  { key: "joining_date", label: "Joining Date (DD-MM-YYYY)" },
  { key: "last_school", label: "Last School" },
];

export default function AdminStudents() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingSr, setEditingSr] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<StudentEditFields | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [dedupePreview, setDedupePreview] = useState<DedupePreview | null>(null);
  const [dedupeLoading, setDedupeLoading] = useState(false);
  const [dedupeError, setDedupeError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const isSuperAdmin = role === "super_admin";

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    authedFetch(`${API}/api/auth/me`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  async function loadAllStudents() {
    setLoading(true);
    const res = await authedFetch(`${API}/api/students/list`);
    const data = await res.json();
    setResults(data.results || []);
    setSelected(new Set());
    setLoading(false);
  }

  useEffect(() => {
    async function fetchStudents() {
      const res = await authedFetch(`${API}/api/students/list`);
      const data = await res.json();
      setResults(data.results || []);
      setSelected(new Set());
      setLoading(false);
    }
    fetchStudents();
  }, [API]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (query.trim().length === 0) {
      loadAllStudents();
      return;
    }
    if (query.length < 2) return;

    setLoading(true);
    const res = await authedFetch(`${API}/api/students/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
    setSelected(new Set());
    setLoading(false);
  }

  function startEdit(s: Student) {
    setSaveError(null);
    setEditingSr(s.sr_number);
    setEditForm({
      student_name: s.student_name || "",
      father_name: s.father_name || "",
      mother_name: s.mother_name || "",
      father_address: s.father_address || "",
      dob: s.dob || "",
      joining_class: s.joining_class || "",
      joining_date: s.joining_date || "",
      last_school: s.last_school || "",
    });
  }

  function cancelEdit() {
    setEditingSr(null);
    setEditForm(null);
    setSaveError(null);
  }

  function updateField(key: keyof StudentEditFields, value: string) {
    setEditForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function saveEdit(sr_number: number) {
    if (!editForm) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await authedFetch(`${API}/api/students/sr/${sr_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSaveError(data.error || "Failed to save changes.");
        setSaving(false);
        return;
      }
      setResults((prev) =>
        prev.map((s) => (s.sr_number === sr_number ? { ...s, ...editForm } : s))
      );
      setSaving(false);
      setEditingSr(null);
      setEditForm(null);
    } catch (err) {
      setSaveError("Network error — please try again.");
      setSaving(false);
    }
  }

  function toggleSelected(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map((s) => s.id)));
    }
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    const confirmed = window.confirm(
      `Delete ${selected.size} student record${selected.size > 1 ? "s" : ""}? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await authedFetch(`${API}/api/students/delete-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setDeleteError(data.error || "Failed to delete selected records.");
        setDeleting(false);
        return;
      }
      setResults((prev) => prev.filter((s) => !selected.has(s.id)));
      setSelected(new Set());
      setDeleting(false);
    } catch (err) {
      setDeleteError("Network error — please try again.");
      setDeleting(false);
    }
  }

  async function handleFindDuplicates() {
    setDedupeLoading(true);
    setDedupeError(null);
    setDedupePreview(null);
    try {
      const res = await authedFetch(`${API}/api/students/dedupe?dry_run=true`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setDedupeError(data.error || "Failed to check for duplicates.");
      } else {
        setDedupePreview(data);
      }
    } catch (err) {
      setDedupeError("Network error — please try again.");
    }
    setDedupeLoading(false);
  }

  async function handleConfirmDedupe() {
    if (!dedupePreview) return;
    const confirmed = window.confirm(
      `Remove ${dedupePreview.records_removed} duplicate record${dedupePreview.records_removed > 1 ? "s" : ""} across ${dedupePreview.duplicate_groups_found} group(s)? The most complete record in each group is kept. This cannot be undone.`
    );
    if (!confirmed) return;

    setDedupeLoading(true);
    setDedupeError(null);
    try {
      const res = await authedFetch(`${API}/api/students/dedupe?dry_run=false`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setDedupeError(data.error || "Failed to remove duplicates.");
      } else {
        setDedupePreview(null);
        await loadAllStudents();
      }
    } catch (err) {
      setDedupeError("Network error — please try again.");
    }
    setDedupeLoading(false);
  }

  return (
    <div className="max-w-3xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-8">
        Student Records
      </h1>

      <form onSubmit={handleSearch} className="flex text-black gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student name..."
          className="flex-1 border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#16233F] hover:bg-[#0f1830] transition-colors text-white px-6 py-2.5 rounded font-medium text-sm whitespace-nowrap"
        >
          + Add Student
        </button>
      </form>

      {isSuperAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[#5B5F66]">
              <input
                type="checkbox"
                checked={results.length > 0 && selected.size === results.length}
                onChange={toggleSelectAll}
              />
              Select all
            </label>
            {selected.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="text-xs font-medium text-white bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors rounded px-4 py-1.5"
              >
                {deleting ? "Deleting..." : `Delete Selected (${selected.size})`}
              </button>
            )}
          </div>

          <button
            onClick={handleFindDuplicates}
            disabled={dedupeLoading}
            className="text-xs font-medium text-[#16233F] border border-[#E5DFD0] hover:bg-[#F0EDE2] disabled:opacity-60 transition-colors rounded px-4 py-1.5"
          >
            {dedupeLoading ? "Checking..." : "Find Duplicates"}
          </button>
        </div>
      )}

      {deleteError && <p className="text-sm text-red-600 mb-4">{deleteError}</p>}

      {dedupeError && <p className="text-sm text-red-600 mb-4">{dedupeError}</p>}

      {isSuperAdmin && dedupePreview && (
        <div className="mb-6 p-4 bg-[#FAF8F2] border border-[#E5DFD0] rounded text-sm">
          {dedupePreview.duplicate_groups_found === 0 ? (
            <p className="text-[#5B5F66]">No duplicate records found (matched by SR number + school).</p>
          ) : (
            <>
              <p className="text-[#16233F] mb-2">
                Found <strong>{dedupePreview.duplicate_groups_found}</strong> duplicate group(s), affecting{" "}
                <strong>{dedupePreview.records_removed}</strong> record(s) that would be removed. The most
                complete record in each group is kept automatically.
              </p>
              <ul className="text-xs text-[#5B5F66] mb-3 max-h-40 overflow-y-auto space-y-1">
                {dedupePreview.removed.map((r) => (
                  <li key={r.id}>
                    SR {r.sr_number} &middot; {r.student_name || "(unnamed)"} &middot; record id {r.id} would be
                    removed, keeping id {r.kept_id}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDedupe}
                  disabled={dedupeLoading}
                  className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-5 py-2 rounded font-medium text-xs"
                >
                  {dedupeLoading ? "Removing..." : "Confirm & Remove Duplicates"}
                </button>
                <button
                  onClick={() => setDedupePreview(null)}
                  disabled={dedupeLoading}
                  className="border border-[#E5DFD0] hover:bg-[#F0EDE2] disabled:opacity-60 transition-colors text-[#16233F] px-5 py-2 rounded font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="divide-y divide-[#E5DFD0] border-t border-b border-[#E5DFD0]">
        {results.map((s) => {
          const isEditing = editingSr === s.sr_number;
          return (
            <div key={s.sr_number} className="py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {isSuperAdmin && (
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selected.has(s.id)}
                      onChange={() => toggleSelected(s.id)}
                    />
                  )}
                  <div>
                    <div className="font-medium text-[#16233F] text-sm">{s.student_name}</div>
                    <div className="text-xs text-[#5B5F66]">
                      {s.digital_id} &middot; Father: {s.father_name || "—"} &middot; Class:{" "}
                      {s.joining_class || "—"}
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(s)}
                    className="shrink-0 text-xs font-medium text-[#8B2E3F] hover:text-[#732634] border border-[#E5DFD0] rounded px-3 py-1.5 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing && editForm && (
                <div className="mt-4 mb-2 p-4 bg-[#FAF8F2] border border-[#E5DFD0] rounded">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EDIT_FIELDS.map((f) => (
                      <label key={f.key} className="text-xs text-[#5B5F66]">
                        {f.label}
                        <input
                          type={f.type || "text"}
                          value={editForm[f.key]}
                          onChange={(e) => updateField(f.key, e.target.value)}
                          className="mt-1 w-full border border-[#E5DFD0] rounded px-3 py-2 text-sm text-black bg-white"
                        />
                      </label>
                    ))}
                  </div>

                  {saveError && (
                    <p className="text-xs text-[#8B2E3F] mt-3">{saveError}</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => saveEdit(s.sr_number)}
                      disabled={saving}
                      className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-5 py-2 rounded font-medium text-xs"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="border border-[#E5DFD0] hover:bg-[#F0EDE2] disabled:opacity-60 transition-colors text-[#16233F] px-5 py-2 rounded font-medium text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {results.length === 0 && !loading && (
          <p className="text-sm text-[#8A8F97] py-4">No students found.</p>
        )}
      </div>

      {showAddModal && (
        <AddStudentModal
          API={API}
          onClose={() => setShowAddModal(false)}
          onCreated={loadAllStudents}
        />
      )}
    </div>
  );
}