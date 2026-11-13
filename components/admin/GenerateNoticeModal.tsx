// app/components/admin/GenerateNoticeModal.tsx
"use client";
import { useState } from "react";

type FieldValue = { value: string; missing: boolean };

type Fields = {
  school_name: FieldValue;
  principal_name: FieldValue;
  event_title: FieldValue;
  date: FieldValue;
  timing: FieldValue;
  venue: FieldValue;
  classes: FieldValue;
  extra_context: FieldValue;
};

type NearbyEvent = { title: string; date: string; include: boolean };

type PrimaryEvent = { title: string; type: string; date: string } | null;

type GenerateDraftResponse = {
  calendar_matched: boolean;
  primary_event: PrimaryEvent;
  fields: Fields;
  raw_prompt: string;
  nearby_events: NearbyEvent[];
};

type Step = "prompt" | "review" | "draft";

const EMPTY_FIELDS: Fields = {
  school_name: { value: "Cape Comorin School", missing: false },
  principal_name: { value: "Mrs. Chitranshi Shukla", missing: false },
  event_title: { value: "", missing: true },
  date: { value: "", missing: true },
  timing: { value: "", missing: true },
  venue: { value: "", missing: true },
  classes: { value: "", missing: true },
  extra_context: { value: "", missing: true },
};

const FIELD_LABELS: Record<keyof Fields, string> = {
  school_name: "School Name",
  principal_name: "Principal Name",
  event_title: "Event / Notice Title",
  date: "Date",
  timing: "Timing",
  venue: "Venue",
  classes: "Applicable Classes",
  extra_context: "Additional Details (fees, instructions, fields to correct, etc.)",
};

// Fields the admin should never need to hand-edit unless something went wrong
const ALWAYS_LOCKED: (keyof Fields)[] = ["school_name", "principal_name"];

export default function GenerateNoticeModal({
  API,
  onClose,
  onPublished,
}: {
  API?: string;
  onClose: () => void;
  onPublished: () => void;
}) {
  const [step, setStep] = useState<Step>("prompt");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rawPrompt, setRawPrompt] = useState("");
  const [primaryEvent, setPrimaryEvent] = useState<PrimaryEvent>(null);
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [nearbyEvents, setNearbyEvents] = useState<NearbyEvent[]>([]);

  // Snapshot of which fields were missing when the draft came back from the
  // server. This is fixed once per generation and never recomputed from live
  // typing — otherwise a field would vanish from the "fill these in" list the
  // moment its value became non-empty (i.e. after the very first keystroke),
  // which yanks focus and reshuffles the remaining inputs mid-type.
  const [originallyMissingKeys, setOriginallyMissingKeys] = useState<(keyof Fields)[]>([]);

  const [draftText, setDraftText] = useState("");

  function updateField(key: keyof Fields, value: string) {
    // Note: we still track `missing` on the value itself (useful if this
    // gets sent back to the server or read elsewhere), but nothing about
    // which inputs are *visible* should depend on this — see
    // originallyMissingKeys above.
    setFields((prev) => ({ ...prev, [key]: { value, missing: value.trim() === "" } }));
  }

  function toggleNearby(idx: number) {
    setNearbyEvents((prev) =>
      prev.map((ev, i) => (i === idx ? { ...ev, include: !ev.include } : ev))
    );
  }

  async function handleGenerateFields(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/notices/generate-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Could not read the request. Try again.");
      const data: GenerateDraftResponse = await res.json();

      const receivedFields = data.fields ?? EMPTY_FIELDS;
      setRawPrompt(data.raw_prompt ?? prompt);
      setPrimaryEvent(data.primary_event ?? null);
      setFields(receivedFields);
      setNearbyEvents(data.nearby_events ?? []);

      // Freeze the missing-fields list right here, from the server response,
      // before any typing happens. This list will not change again for this
      // generation cycle, no matter what the admin types afterward.
      const missingNow = (Object.keys(receivedFields) as (keyof Fields)[]).filter(
        (k) => receivedFields[k].missing && !ALWAYS_LOCKED.includes(k)
      );
      setOriginallyMissingKeys(missingNow);

      setStep("review");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDraft() {
    setLoading(true);
    setError("");
    try {
      const includeEvents = nearbyEvents
        .filter((ev) => ev.include)
        .map((ev) => ({ title: ev.title, date: ev.date }));

      const res = await fetch(`${API}/api/notices/generate-draft/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_event: primaryEvent,
          event_title: fields.event_title.value,
          date: fields.date.value,
          timing: fields.timing.value,
          venue: fields.venue.value,
          classes: fields.classes.value,
          include_events: includeEvents,
          raw_prompt: rawPrompt,
          extra_context: fields.extra_context.value,
        }),
      });
      if (!res.ok) throw new Error("Could not generate the draft. Try again.");
      const data = await res.json();
      setDraftText(data.draft_text || "");
      setStep("draft");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!draftText.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/notices/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_text: draftText,
          classes: fields.classes.value,
          event_title: fields.event_title.value || "Notice",
        }),
      });
      if (!res.ok) throw new Error("Could not publish the notice. Try again.");
      onPublished();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Use the frozen snapshot, not a live recomputation from `fields` — see
  // the comment on originallyMissingKeys above for why.
  const missingFieldKeys = originallyMissingKeys;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#16233F]">
            Generate Notice
          </h2>
          <button onClick={onClose} className="text-[#8A8F97] hover:text-[#16233F] text-sm">
            Close
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
            {error}
          </p>
        )}

        {step === "prompt" && (
          <form onSubmit={handleGenerateFields} className="text-black space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#16233F] mb-2">
                Describe the notice
              </label>
              <textarea
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="e.g. ID card notice — parents need to deposit ₹100. If any admission form details are wrong (name, DOB, father's name, address, phone number), they should visit the office to get it corrected."
                className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm"
              />
              <p className="text-xs text-[#8A8F97] mt-1">
                Write everything you want covered — fees, deadlines, instructions, lists of
                details to verify, etc. Nothing here is thrown away; only genuinely missing
                pieces (like exact date or venue) will be asked separately.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#16233F] hover:bg-[#0f1830] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
            >
              {loading ? "Reading..." : "Continue"}
            </button>
          </form>
        )}

        {step === "review" && (
          <div className="space-y-5">
            {primaryEvent && (
              <p className="text-xs text-[#8A8F97] bg-[#F7F4EC] border border-[#E5DFD0] rounded p-3">
                Matched calendar event: <strong>{primaryEvent.title}</strong> on{" "}
                {primaryEvent.date}
              </p>
            )}

            {missingFieldKeys.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#8B2E3F]">
                  A few details weren&apos;t in your prompt — fill these in:
                </p>
                {missingFieldKeys.map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-[#16233F] mb-1">
                      {FIELD_LABELS[key]}
                    </label>
                    <input
                      value={fields[key].value}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="w-full border border-[#E5DFD0] rounded px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <details className="text-sm text-black">
              <summary className="cursor-pointer text-[#16233F] font-medium">
                Everything detected from your prompt
              </summary>
              <div className="mt-3 space-y-3">
                {(Object.keys(fields) as (keyof Fields)[])
                  .filter((k) => !ALWAYS_LOCKED.includes(k))
                  .map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-[#16233F] mb-1">
                        {FIELD_LABELS[key]}
                      </label>
                      <textarea
                        value={fields[key].value}
                        onChange={(e) => updateField(key, e.target.value)}
                        rows={key === "extra_context" ? 4 : 1}
                        className="w-full border border-[#E5DFD0] rounded px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
              </div>
            </details>

            {nearbyEvents.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[#16233F] mb-2">
                  Nearby events — include a mention?
                </p>
                <div className="space-y-2">
                  {nearbyEvents.map((ev, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={ev.include}
                        onChange={() => toggleNearby(idx)}
                      />
                      {ev.title} — {ev.date}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("prompt")}
                className="border border-[#E5DFD0] text-[#16233F] px-6 py-2.5 rounded font-medium text-sm"
              >
                Back
              </button>
              <button
                onClick={handleConfirmDraft}
                disabled={loading}
                className="bg-[#16233F] hover:bg-[#0f1830] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
              >
                {loading ? "Writing draft..." : "Generate Draft"}
              </button>
            </div>
          </div>
        )}

        {step === "draft" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#16233F] mb-1">
              Review and edit the draft before publishing
            </label>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={14}
              className="w-full border border-[#E5DFD0] rounded px-4 py-2 text-sm font-mono"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep("review")}
                className="border border-[#E5DFD0] text-[#16233F] px-6 py-2.5 rounded font-medium text-sm"
              >
                Back
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
              >
                {loading ? "Publishing..." : "Publish Notice"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}