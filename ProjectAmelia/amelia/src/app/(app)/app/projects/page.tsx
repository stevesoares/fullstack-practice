async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects`, { cache: "no-store" });
  const data = await res.json();
  return data.projects as Array<{ id: string; title: string; eventDate?: string; status: string }>;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="mb-6 font-[var(--font-cormorant)] text-4xl">Projects</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Event Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.eventDate ? new Date(p.eventDate).toDateString() : "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


