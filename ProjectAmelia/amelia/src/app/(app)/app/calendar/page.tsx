import CalendarMonth from "../_components/CalendarMonth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Month view with quick create and inline editing.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarMonth />
        </CardContent>
      </Card>
    </main>
  );
}

