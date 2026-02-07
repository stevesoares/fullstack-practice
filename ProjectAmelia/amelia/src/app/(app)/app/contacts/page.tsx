"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useContacts } from "@/hooks/use-app-data";

export default function ContactsPage() {
  const [query, setQuery] = useState("");
  const contactsQuery = useContacts();

  const contacts = useMemo(() => {
    const items = contactsQuery.data ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((contact) => {
      const haystack = `${contact.firstName} ${contact.lastName} ${contact.email ?? ""} ${contact.company ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [contactsQuery.data, query]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>Search and review your contact list.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search contacts" value={query} onChange={(event) => setQuery(event.target.value)} />

          {contactsQuery.isLoading ? <Skeleton className="h-56" /> : null}
          {contactsQuery.error ? <p className="text-sm text-red-600">Could not load contacts.</p> : null}

          {!contactsQuery.isLoading && !contactsQuery.error ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No contacts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
                      <TableCell>{contact.email ?? "-"}</TableCell>
                      <TableCell>{contact.company ?? "-"}</TableCell>
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
