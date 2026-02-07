"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.message ?? "Unable to request reset");
      return;
    }
    setMessage(
      data?.resetUrl
        ? `Reset link generated: ${data.resetUrl}`
        : "If that account exists, a reset link has been sent."
    );
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.message ?? "Unable to reset password");
      return;
    }
    setMessage("Password updated. You can now sign in.");
  };

  const hasToken = token.length > 0;

  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 py-16">
      <form
        onSubmit={hasToken ? resetPassword : requestReset}
        className="w-full space-y-4 rounded-2xl border border-border bg-background p-6"
      >
        <h1 className="font-[var(--font-cormorant)] text-3xl">
          {hasToken ? "Set a new password" : "Reset your password"}
        </h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}

        {hasToken ? (
          <>
            <label className="block text-sm">
              <span className="text-muted-foreground">New Password</span>
              <input
                type="password"
                minLength={8}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">Confirm Password</span>
              <input
                type="password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </>
        ) : (
          <label className="block text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : hasToken
              ? "Update password"
              : "Send reset link"}
        </button>
      </form>
    </main>
  );
}
