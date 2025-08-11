"use client";

import { useState } from "react";

export function CreateContactModalMount() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  // Expose a hidden trigger so other client components can open this modal
  return (
    <>
      <button id="open-contact-modal" onClick={() => setOpen(true)} className="hidden" aria-hidden />
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">New Contact</h3>
            <div className="space-y-3">
              <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Company" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm ring-1 ring-border">Cancel</button>
              <button disabled={loading} onClick={async ()=>{ setLoading(true); await fetch('/api/contacts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName,lastName,email,company})}); setLoading(false); setOpen(false); window.location.href='/app/contacts'; }} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">{loading?'Saving…':'Save'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CreateProjectModalMount() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  return (
    <>
      <button id="open-project-modal" onClick={() => setOpen(true)} className="hidden" aria-hidden />
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">New Project</h3>
            <div className="space-y-3">
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Project title" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={eventDate} onChange={(e)=>setEventDate(e.target.value)} type="date" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm ring-1 ring-border">Cancel</button>
              <button disabled={loading} onClick={async ()=>{ setLoading(true); await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,eventDate: eventDate || undefined})}); setLoading(false); setOpen(false); window.location.href='/app/projects'; }} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">{loading?'Saving…':'Save'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CreateEventModalMount() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  return (
    <>
      <button id="open-event-modal" onClick={() => setOpen(true)} className="hidden" aria-hidden />
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">New Meeting</h3>
            <div className="space-y-3">
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={startsAt} onChange={(e)=>setStartsAt(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={endsAt} onChange={(e)=>setEndsAt(e.target.value)} type="datetime-local" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Location" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm ring-1 ring-border">Cancel</button>
              <button disabled={loading} onClick={async ()=>{ setLoading(true); await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,startsAt,endsAt,location})}); setLoading(false); setOpen(false); window.location.reload(); }} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">{loading?'Saving…':'Save'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


