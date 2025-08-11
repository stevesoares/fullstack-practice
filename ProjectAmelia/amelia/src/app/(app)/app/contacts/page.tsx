async function getContacts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/contacts`, { cache: "no-store" });
  const data = await res.json();
  return data.contacts as Array<{ id: string; firstName: string; lastName: string; email?: string; company?: string }>;
}

export default async function ContactsPage() {
  const contacts = await getContacts();
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="mb-6 font-[var(--font-cormorant)] text-4xl">Contacts</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Company</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2">{c.firstName} {c.lastName}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.email ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.company ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


