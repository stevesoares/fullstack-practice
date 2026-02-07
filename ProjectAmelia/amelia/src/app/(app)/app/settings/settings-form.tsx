"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetcher";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  image: string | null;
  plan: string | null;
  billingEmail: string | null;
};

const initialPassword = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function SettingsForm({ user }: { user: User | null }) {
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    companyName: user?.companyName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    addressStreet: user?.addressStreet ?? "",
    addressCity: user?.addressCity ?? "",
    addressState: user?.addressState ?? "",
    addressPostalCode: user?.addressPostalCode ?? "",
    billingEmail: user?.billingEmail ?? user?.email ?? "",
    plan: user?.plan ?? "starter",
  });
  const [password, setPassword] = useState(initialPassword);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileDirty = useMemo(() => {
    return (
      profile.firstName !== (user?.firstName ?? "") ||
      profile.lastName !== (user?.lastName ?? "") ||
      profile.companyName !== (user?.companyName ?? "") ||
      profile.email !== (user?.email ?? "") ||
      profile.phone !== (user?.phone ?? "") ||
      profile.addressStreet !== (user?.addressStreet ?? "") ||
      profile.addressCity !== (user?.addressCity ?? "") ||
      profile.addressState !== (user?.addressState ?? "") ||
      profile.addressPostalCode !== (user?.addressPostalCode ?? "") ||
      profile.billingEmail !== (user?.billingEmail ?? user?.email ?? "")
    );
  }, [profile, user]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingProfile(true);
    setError(null);
    setMessage(null);

    const response = await fetchJson<null>("/api/settings/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    });

    setSavingProfile(false);

    if (!response.ok) {
      setError(response.message ?? "Failed to save profile");
      return;
    }

    setMessage(response.message ?? "Profile updated");
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingPassword(true);
    setError(null);
    setMessage(null);

    const response = await fetchJson<null>("/api/settings/password", {
      method: "POST",
      body: JSON.stringify(password),
    });

    setSavingPassword(false);

    if (!response.ok) {
      setError(response.message ?? "Failed to update password");
      return;
    }

    setPassword(initialPassword);
    setMessage(response.message ?? "Password updated");
  };

  return (
    <div className="space-y-6">
      {message ? <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">{message}</div> : null}
      {error ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Business details used across your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="First Name" value={profile.firstName} onChange={(value) => setProfile((prev) => ({ ...prev, firstName: value }))} />
              <Field label="Last Name" value={profile.lastName} onChange={(value) => setProfile((prev) => ({ ...prev, lastName: value }))} />
              <Field label="Company" value={profile.companyName} onChange={(value) => setProfile((prev) => ({ ...prev, companyName: value }))} className="sm:col-span-2" />
              <Field label="Email" type="email" value={profile.email} onChange={(value) => setProfile((prev) => ({ ...prev, email: value }))} />
              <Field label="Phone" value={profile.phone} onChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))} />
              <Field label="Street Address" value={profile.addressStreet} onChange={(value) => setProfile((prev) => ({ ...prev, addressStreet: value }))} className="sm:col-span-2" />
              <Field label="City" value={profile.addressCity} onChange={(value) => setProfile((prev) => ({ ...prev, addressCity: value }))} />
              <Field label="State" value={profile.addressState} onChange={(value) => setProfile((prev) => ({ ...prev, addressState: value }))} />
              <Field label="ZIP" value={profile.addressPostalCode} onChange={(value) => setProfile((prev) => ({ ...prev, addressPostalCode: value }))} />
              <Field label="Billing Email" type="email" value={profile.billingEmail} onChange={(value) => setProfile((prev) => ({ ...prev, billingEmail: value }))} />
              <Field label="Plan" value={profile.plan} onChange={() => undefined} disabled />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{profileDirty ? "Unsaved profile changes" : "Profile is up to date"}</p>
              <Button disabled={!profileDirty || savingProfile}>{savingProfile ? "Saving..." : "Save profile"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update security credentials for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePassword} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Current Password" type="password" value={password.currentPassword} onChange={(value) => setPassword((prev) => ({ ...prev, currentPassword: value }))} />
              <div />
              <Field label="New Password" type="password" value={password.newPassword} onChange={(value) => setPassword((prev) => ({ ...prev, newPassword: value }))} />
              <Field label="Confirm Password" type="password" value={password.confirmPassword} onChange={(value) => setPassword((prev) => ({ ...prev, confirmPassword: value }))} />
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters, include 1 uppercase letter, and at least one number or symbol.</p>
            <div className="flex justify-end">
              <Button disabled={savingPassword}>{savingPassword ? "Saving..." : "Change password"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className={className}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="mt-1" />
    </label>
  );
}
