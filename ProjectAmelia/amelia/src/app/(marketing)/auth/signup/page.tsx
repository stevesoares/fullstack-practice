"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { US_STATES } from "@/lib/us-states";
// Address fields are collected separately (street, city, state, postalCode)

export default function SignUpPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressPostalCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldTouched = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  const emailValid = useMemo(() => /^(?:[a-zA-Z0-9_\-.+])+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(form.email), [form.email]);
  const phoneDigits = form.phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 10;
  const formattedPhone = useMemo(() => {
    const d = phoneDigits;
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  }, [phoneDigits]);

  useEffect(() => {
    // auto-format phone as user types
    if (form.phone !== formattedPhone) {
      setForm((f) => ({ ...f, phone: formattedPhone }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedPhone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({
      firstName: true,
      lastName: true,
      companyName: true,
      email: true,
      phone: true,
      address: true,
      addressStreet: true,
      addressCity: true,
      addressState: true,
      addressPostalCode: true,
      password: true,
      confirmPassword: true,
    });
    // Client-side password policy
    const hasMinLen = form.password.length >= 8;
    const hasUpper = /[A-Z]/.test(form.password);
    const hasDigit = /\d/.test(form.password);
    const hasSymbol = /[^A-Za-z0-9]/.test(form.password);
    const meetsPolicy = hasMinLen && hasUpper && (hasDigit || hasSymbol);
    const allValid =
      form.firstName &&
      form.lastName &&
      form.companyName &&
      emailValid &&
      phoneValid &&
      form.addressStreet && form.addressCity && form.addressState && form.addressPostalCode &&
      meetsPolicy &&
      form.password === form.confirmPassword;
    if (!allValid) {
      setError("Please correct the highlighted fields.");
      return;
    }
    if (!meetsPolicy) {
      setError("Password must be at least 8 characters, include 1 uppercase letter, and at least one number or symbol.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        address: form.addressStreet && form.addressCity && form.addressState && form.addressPostalCode
          ? `${form.addressStreet}, ${form.addressCity}, ${form.addressState} ${form.addressPostalCode}`
          : form.address,
        addressStreet: form.addressStreet,
        addressCity: form.addressCity,
        addressState: form.addressState,
        addressPostalCode: form.addressPostalCode,
        password: form.password,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message ?? "Sign up failed");
      return;
    }
    setSuccess("Account created successfully. You can now sign in.");
  };

  return (
    <main className="mx-auto grid min-h-dvh max-w-lg place-items-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-2xl border border-border bg-background p-6" aria-label="Sign up form" noValidate>
        <h1 className="font-[var(--font-cormorant)] text-3xl">Create your account</h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p>{success}</p>
            <a className="mt-2 inline-block rounded-md bg-primary px-3 py-1 text-primary-foreground" href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Go to sign in</a>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-muted-foreground">First Name</span>
            <input name="firstName" required value={form.firstName} onChange={handleChange} onBlur={() => setFieldTouched("firstName")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.firstName && !form.firstName ? "border-red-500" : "border-border"}`} aria-label="First Name" />
          </label>
          <label className="text-sm">
            <span className="text-muted-foreground">Last Name</span>
            <input name="lastName" required value={form.lastName} onChange={handleChange} onBlur={() => setFieldTouched("lastName")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.lastName && !form.lastName ? "border-red-500" : "border-border"}`} aria-label="Last Name" />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-muted-foreground">Company Name</span>
          <input name="companyName" required value={form.companyName} onChange={handleChange} onBlur={() => setFieldTouched("companyName")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.companyName && !form.companyName ? "border-red-500" : "border-border"}`} aria-label="Company Name" />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-muted-foreground">Email</span>
            <input type="email" name="email" required value={form.email} onChange={handleChange} onBlur={() => setFieldTouched("email")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.email && !emailValid ? "border-red-500" : "border-border"}`} aria-label="Email" />
            {touched.email && !emailValid ? <p className="mt-1 text-xs text-red-600">Enter a valid email.</p> : null}
          </label>
          <label className="text-sm">
            <span className="text-muted-foreground">Phone</span>
            <input name="phone" required value={form.phone} onChange={handleChange} onBlur={() => setFieldTouched("phone")} inputMode="numeric" className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.phone && !phoneValid ? "border-red-500" : "border-border"}`} aria-label="Phone" placeholder="(555) 555-5555" />
            {touched.phone && !phoneValid ? <p className="mt-1 text-xs text-red-600">Enter a 10-digit US phone number.</p> : null}
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            <span className="text-muted-foreground">Street Address</span>
            <input name="addressStreet" required value={form.addressStreet} onChange={handleChange} onBlur={() => setFieldTouched("addressStreet")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.addressStreet && !form.addressStreet ? "border-red-500" : "border-border"}`} aria-label="Street Address" />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-sm sm:col-span-2">
              <span className="text-muted-foreground">City</span>
              <input name="addressCity" required value={form.addressCity} onChange={handleChange} onBlur={() => setFieldTouched("addressCity")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.addressCity && !form.addressCity ? "border-red-500" : "border-border"}`} aria-label="City" />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">State</span>
              <select name="addressState" required value={form.addressState} onChange={handleChange} onBlur={() => setFieldTouched("addressState")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.addressState && !form.addressState ? "border-red-500" : "border-border"}`} aria-label="State">
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm">
            <span className="text-muted-foreground">ZIP Code</span>
            <input name="addressPostalCode" required value={form.addressPostalCode} onChange={handleChange} onBlur={() => setFieldTouched("addressPostalCode")} className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.addressPostalCode && !form.addressPostalCode ? "border-red-500" : "border-border"}`} aria-label="ZIP Code" />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-muted-foreground">Password</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              onBlur={() => setFieldTouched("password")}
              className={`w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.password && !(form.password.length >= 8 && /[A-Z]/.test(form.password) && (/[0-9]/.test(form.password) || /[^A-Za-z0-9]/.test(form.password))) ? "border-red-500" : "border-border"}`}
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
          <p className={`mt-1 text-xs ${touched.password && !(form.password.length >= 8 && /[A-Z]/.test(form.password) && (/[0-9]/.test(form.password) || /[^A-Za-z0-9]/.test(form.password))) ? "text-red-600" : "text-muted-foreground"}`}>Must be at least 8 characters, include 1 uppercase letter, and at least one number or symbol.</p>
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Confirm Password</span>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            minLength={8}
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={() => setFieldTouched("confirmPassword")}
            className={`mt-1 w-full rounded-lg bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring border ${touched.confirmPassword && form.confirmPassword !== form.password ? "border-red-500" : "border-border"}`}
            aria-label="Confirm Password"
          />
          {touched.confirmPassword && form.confirmPassword !== form.password ? <p className="mt-1 text-xs text-red-600">Passwords do not match.</p> : null}
        </label>

        {(() => {
          const passwordValid = form.password.length >= 8 && /[A-Z]/.test(form.password) && (/[0-9]/.test(form.password) || /[^A-Za-z0-9]/.test(form.password));
          const missing: string[] = [];
          if (!form.firstName) missing.push("First Name");
          if (!form.lastName) missing.push("Last Name");
          if (!form.companyName) missing.push("Company Name");
          if (!emailValid) missing.push("Valid Email");
          if (!phoneValid) missing.push("Valid Phone");
          if (!form.addressStreet) missing.push("Street Address");
          if (!form.addressCity) missing.push("City");
          if (!form.addressState) missing.push("State");
          if (!form.addressPostalCode) missing.push("ZIP Code");
          if (!passwordValid) missing.push("Password Policy");
          if (form.confirmPassword !== form.password) missing.push("Passwords Must Match");
          const disabled = submitting || missing.length > 0;
          const title = disabled ? `Complete required fields: ${missing.join(", ")}` : undefined;
          return (
            <button
              disabled={disabled}
              type="submit"
              title={title}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Create account"
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          );
        })()}
        
        

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <a className="underline" href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Sign in</a>
        </p>
      </form>
    </main>
  );
}


