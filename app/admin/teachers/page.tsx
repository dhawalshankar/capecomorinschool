// app/admin/teachers/page.tsx
"use client";
import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/api";

type Teacher = {
  id: number;
  name: string;
  subject: string | null;
  grade_level: string | null;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  published: boolean;
};

type NewTeacherCredentials = {
  login_email: string;
  temp_password: string;
  teacher_name: string;
};

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("Mrs.");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [credentials, setCredentials] = useState<NewTeacherCredentials | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function loadTeachers() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await authedFetch(`${API}/api/teachers`);
      if (!res.ok) {
        setLoadError(
          res.status === 403
            ? "You don't have access to the staff roster."
            : "Couldn't load teachers. Try refreshing."
        );
        setTeachers([]);
        return;
      }
      setTeachers(await res.json());
    } catch {
      setLoadError("Couldn't reach the server. Check your connection.");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await authedFetch(`${API}/api/teachers`);
        if (!res.ok) {
          setLoadError(
            res.status === 403
              ? "You don't have access to the staff roster."
              : "Couldn't load teachers. Try refreshing."
          );
          setTeachers([]);
          return;
        }
        setTeachers(await res.json());
      } catch {
        setLoadError("Couldn't reach the server. Check your connection.");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [API]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const fullName = `${title} ${name}`.trim();
    try {
      const res = await authedFetch(`${API}/api/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, subject, grade_level: gradeLevel }),
      });
      const result = await res.json();
      if (!res.ok) {
        setFormError(result.error || "Couldn't add this teacher.");
        return;
      }
      setCredentials({
        login_email: result.login_email,
        temp_password: result.temp_password,
        teacher_name: fullName,
      });
      setName("");
      setSubject("");
      setGradeLevel("");
      loadTeachers();
    } catch {
      setFormError("Couldn't reach the server. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(t: Teacher) {
    await authedFetch(`${API}/api/teachers/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    loadTeachers();
  }

  async function handleSaveEdit(updated: Partial<Teacher>) {
    if (!editingTeacher) return;
    await authedFetch(`${API}/api/teachers/${editingTeacher.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setEditingTeacher(null);
    loadTeachers();
  }

  async function handleConfirmDelete() {
    if (!deletingTeacher) return;
    await authedFetch(`${API}/api/teachers/${deletingTeacher.id}`, { method: "DELETE" });
    setDeletingTeacher(null);
    loadTeachers();
  }

  return (
    <div className="max-w-3xl">
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-3">Admin Panel</div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#16233F] mb-2">
        Teachers
      </h1>
      <p className="text-sm text-[#8A8F97] mb-8">
        This is your internal staff roster — separate from the public Faculty page,
        which never lists names by design.
      </p>

      <form
        onSubmit={handleAdd}
        className="bg-white text-black border border-[#E5DFD0] rounded p-6 mb-10 grid sm:grid-cols-3 gap-4"
      >
        <div className="flex gap-2 sm:col-span-3">
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#E5DFD0] rounded px-3 py-2 text-sm bg-white"
          >
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
          </select>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (without title)"
            className="flex-1 border border-[#E5DFD0] rounded px-4 py-2 text-sm"
          />
        </div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <input
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          placeholder="Grade / Class"
          className="border border-[#E5DFD0] rounded px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
        >
          {saving ? "Adding..." : "Add Teacher"}
        </button>
        {formError && (
          <p className="sm:col-span-3 text-xs text-[#8B2E3F] bg-[#F3E9E9] rounded px-3 py-2">
            {formError}
          </p>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-[#8A8F97]">Loading...</p>
      ) : loadError ? (
        <p className="text-sm text-[#8B2E3F] bg-[#F3E9E9] rounded px-4 py-3">{loadError}</p>
      ) : teachers.length === 0 ? (
        <p className="text-sm text-[#8A8F97] py-4">No teachers on the roster yet.</p>
      ) : (
        <div className="divide-y divide-[#E5DFD0] border-t border-b border-[#E5DFD0]">
          {teachers.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-[#16233F] text-sm">{t.name}</div>
                <div className="text-xs text-[#5B5F66]">
                  {t.subject || "—"} {t.grade_level ? `· ${t.grade_level}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublished(t)}
                  className={`text-xs px-2 py-1 rounded ${
                    t.published ? "bg-[#E9F3EC] text-green-700" : "bg-[#F3E9E9] text-[#8B2E3F]"
                  }`}
                >
                  {t.published ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => setEditingTeacher(t)}
                  className="text-xs text-[#16233F] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingTeacher(t)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => setCredentials(null)}
        />
      )}

      {editingTeacher && (
        <EditTeacherModal
          teacher={editingTeacher}
          onCancel={() => setEditingTeacher(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingTeacher && (
        <ConfirmDeleteModal
          teacherName={deletingTeacher.name}
          onCancel={() => setDeletingTeacher(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function ModalShell({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-[#16233F]/40 flex items-center justify-center p-4 z-50"
      onClick={onDismiss}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CredentialsModal({
  credentials,
  onClose,
}: {
  credentials: NewTeacherCredentials;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `Email: ${credentials.login_email}\nPassword: ${credentials.temp_password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ModalShell>
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-2">
        Teacher Added
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-1">
        {credentials.teacher_name}
      </h2>
      <p className="text-sm text-[#8A8F97] mb-5">
        Share these login details directly with them. This password won&apos;t be shown again.
      </p>

      <div className="border border-[#E5DFD0] rounded divide-y divide-[#E5DFD0] mb-4">
        <div className="px-4 py-3">
          <div className="text-xs text-[#8A8F97] mb-1">Login email</div>
          <div className="text-sm text-[#16233F] font-mono break-all">
            {credentials.login_email}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="text-xs text-[#8A8F97] mb-1">Temporary password</div>
          <div className="text-sm text-[#16233F] font-mono break-all">
            {credentials.temp_password}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 border border-[#E5DFD0] text-[#16233F] rounded px-4 py-2 text-sm font-medium hover:bg-[#F7F5EF] transition-colors"
        >
          {copied ? "Copied" : "Copy both"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white rounded px-4 py-2 text-sm font-medium"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}

const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr."];

function splitTitle(fullName: string): { title: string; name: string } {
  const match = TITLES.find((t) => fullName.startsWith(`${t} `));
  return match
    ? { title: match, name: fullName.slice(match.length + 1) }
    : { title: "Mrs.", name: fullName };
}

function EditTeacherModal({
  teacher,
  onCancel,
  onSave,
}: {
  teacher: Teacher;
  onCancel: () => void;
  onSave: (updated: Partial<Teacher>) => void;
}) {
  const initial = splitTitle(teacher.name);
  const [title, setTitle] = useState(initial.title);
  const [name, setName] = useState(initial.name);
  const [subject, setSubject] = useState(teacher.subject || "");
  const [gradeLevel, setGradeLevel] = useState(teacher.grade_level || "");
  const [bio, setBio] = useState(teacher.bio || "");

  return (
    <ModalShell onDismiss={onCancel}>
      <div className="text-[#C9A227] uppercase tracking-[0.2em] text-xs mb-2">Edit Teacher</div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-5">
        {teacher.name}
      </h2>

      <div className="space-y-3 mb-5">
        <div className="flex gap-2">
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#E5DFD0] rounded px-3 py-2 text-sm bg-white text-black"
          >
            {TITLES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (without title)"
            className="flex-1 border border-[#E5DFD0] rounded px-4 py-2 text-sm text-black"
          />
        </div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm text-black"
        />
        <input
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          placeholder="Grade / Class"
          className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm text-black"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio (optional)"
          rows={3}
          className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm text-black resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-[#E5DFD0] text-[#16233F] rounded px-4 py-2 text-sm font-medium hover:bg-[#F7F5EF] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              name: `${title} ${name}`.trim(),
              subject,
              grade_level: gradeLevel,
              bio,
            })
          }
          className="flex-1 bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white rounded px-4 py-2 text-sm font-medium"
        >
          Save changes
        </button>
      </div>
    </ModalShell>
  );
}

function ConfirmDeleteModal({
  teacherName,
  onCancel,
  onConfirm,
}: {
  teacherName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell onDismiss={onCancel}>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F] mb-2">
        Remove {teacherName}?
      </h2>
      <p className="text-sm text-[#8A8F97] mb-6">
        This removes them from the roster and disables their login. This can&apos;t be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-[#E5DFD0] text-[#16233F] rounded px-4 py-2 text-sm font-medium hover:bg-[#F7F5EF] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white rounded px-4 py-2 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </ModalShell>
  );
}