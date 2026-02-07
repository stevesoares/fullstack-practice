"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    if (res?.error) {
      setError("Sign-in failed. If your account has no password yet, use password reset.");
      return;
    }
    window.location.href = res?.url ?? callbackUrl;
  };

  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-2xl border border-border bg-background p-6" aria-label="Sign in form">
        <h1 className="font-[var(--font-cormorant)] text-3xl">Sign in</h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <label className="block text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            aria-label="Email address"
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Password</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="whitespace-nowrap rounded-lg px-2 py-1 text-xs ring-1 ring-border"
              aria-pressed={showPassword}
              aria-label="Toggle show password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={rememberMe}
            onChange={() => setRememberMe((s) => !s)}
            aria-label="Remember me"
          />
          <span>Remember me</span>
        </label>

        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Sign in">
          Continue
        </button>

        <p className="text-center text-sm text-muted-foreground">
          No account? <a className="underline" href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Sign up</a>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <a className="underline" href="/auth/reset-password">Forgot password?</a>
        </p>
      </form>
    </main>
  );
}
