// components/admin/ChangePasswordModal.tsx
"use client";
import { useState } from "react";
import { auth } from "@/lib/auth";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("No signed-in user found.");
      return;
    }

    setSaving(true);
    try {
      // Firebase requires a recent login before allowing a password change —
      // re-authenticate with the current password first.
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Current password is incorrect.");
      } else {
        setError("Something went wrong — please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
    <div className="bg-white rounded-lg p-8 w-full max-w-sm relative">
      {!success && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#5B5F66] hover:text-[#16233F] text-xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-[#FAF6EE] transition-colors"
        >
          ×
        </button>
      )}
      {success ? (
        <>
          <p className="text-[#16233F] font-medium mb-6">
            Password updated successfully.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#8B2E3F] hover:bg-[#732634] transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#16233F] mb-6">
              Change Password
            </h2>
            <form onSubmit={handleSubmit} className=" text-black space-y-4">
              <div>
                <label className="block text-xs text-[#5B5F66] mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-[#E5DFD0] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5B5F66] mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#E5DFD0] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5B5F66] mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#E5DFD0] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-[#E5DFD0] text-[#5B5F66] px-6 py-2.5 rounded font-medium text-sm hover:bg-[#FAF6EE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#8B2E3F] hover:bg-[#732634] disabled:opacity-60 transition-colors text-white px-6 py-2.5 rounded font-medium text-sm"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}