"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-app-data";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const projectsQuery = useProjects();

  const projects = useMemo(() => {
    const items = projectsQuery.data ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((project) => `${project.title} ${project.status}`.toLowerCase().includes(needle));
  }, [projectsQuery.data, query]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Monitor active and upcoming projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} />

          {projectsQuery.isLoading ? <Skeleton className="h-56" /> : null}
          {projectsQuery.error ? <p className="text-sm text-red-600">Could not load projects.</p> : null}

          {!projectsQuery.isLoading && !projectsQuery.error ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>{project.eventDate ? format(new Date(project.eventDate), "MMM d, yyyy") : "-"}</TableCell>
                      <TableCell>{project.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
