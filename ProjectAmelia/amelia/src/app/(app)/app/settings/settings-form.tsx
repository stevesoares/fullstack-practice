"use client";

import { useState } from "react";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  image: string | null;
  plan: string | null;
  billingEmail: string | null;
};

export default function SettingsForm({ user }: { user: User | null }) {
  const [state, setState] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    companyName: user?.companyName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    addressStreet: (user as any)?.addressStreet ?? "",
    addressCity: (user as any)?.addressCity ?? "",
    addressState: (user as any)?.addressState ?? "",
    addressPostalCode: (user as any)?.addressPostalCode ?? "",
    billingEmail: user?.billingEmail ?? user?.email ?? "",
    plan: user?.plan ?? "starter",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: state.firstName,
        lastName: state.lastName,
        companyName: state.companyName,
        email: state.email,
        phone: state.phone,
        address: state.address,
        addressStreet: state.addressStreet,
        addressCity: state.addressCity,
        addressState: state.addressState,
        addressPostalCode: state.addressPostalCode,
        billingEmail: state.billingEmail,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message ?? "Failed to save");
      return;
    }
    setMessage("Profile updated");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: state.currentPassword,
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message ?? "Failed to change password");
      return;
    }
    setMessage("Password updated");
    setState((s) => ({ ...s, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <div className="space-y-6">
      {message ? <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">{message}</div> : null}
      {error ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <form onSubmit={handleSaveProfile} className="rounded-2xl border border-border bg-background p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field name="firstName" label="First Name" value={state.firstName} onChange={handleChange} />
          <Field name="lastName" label="Last Name" value={state.lastName} onChange={handleChange} />
          <Field name="companyName" label="Company" value={state.companyName} onChange={handleChange} className="sm:col-span-2" />
          <Field name="email" type="email" label="Email" value={state.email} onChange={handleChange} />
          <Field name="phone" label="Phone" value={state.phone} onChange={handleChange} />
          <Field name="addressStreet" label="Street Address" value={state.addressStreet} onChange={handleChange} className="sm:col-span-2" />
          <Field name="addressCity" label="City" value={state.addressCity} onChange={handleChange} />
          <Field name="addressState" label="State" value={state.addressState} onChange={handleChange} />
          <Field name="addressPostalCode" label="ZIP Code" value={state.addressPostalCode} onChange={handleChange} />
          <Field name="billingEmail" type="email" label="Billing Email" value={state.billingEmail} onChange={handleChange} />
          <Field name="plan" label="Plan" value={state.plan} onChange={handleChange} disabled />
        </div>
        <button disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Save profile</button>
      </form>

      <form onSubmit={handleChangePassword} className="rounded-2xl border border-border bg-background p-6 space-y-4">
        <h2 className="text-lg font-semibold">Password</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field name="currentPassword" type="password" label="Current Password" value={state.currentPassword} onChange={handleChange} />
          <div />
          <Field name="newPassword" type="password" label="New Password" value={state.newPassword} onChange={handleChange} />
          <Field name="confirmPassword" type="password" label="Confirm Password" value={state.confirmPassword} onChange={handleChange} />
        </div>
        <p className="text-xs text-muted-foreground">Must be at least 8 characters, include 1 uppercase letter, and at least one number or symbol.</p>
        <button disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Change password</button>
      </form>
    </div>
  );
}

const Field = ({ name, label, value, onChange, className = "", type = "text", disabled = false }: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
}) => (
  <label className={`text-sm ${className}`}>
    <span className="text-muted-foreground">{label}</span>
    <input name={name} value={value} onChange={onChange} type={type} disabled={disabled} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
  </label>
);


