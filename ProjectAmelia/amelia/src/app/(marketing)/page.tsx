export default function Home() {
  return (
    <main className="min-h-dvh" data-scope="marketing">
      <section id="hero" className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-6 pb-24 pt-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
          <span>Project Amelia</span>
          <span className="text-primary">MVP</span>
        </div>
        <h1 className="font-[var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl tracking-tight">
          Manage clients, contracts, payments, and galleries — simply.
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
          Built for wedding photographers, planners, and creatives. One calm workspace to win leads and deliver on time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#pricing" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="See pricing" tabIndex={0}>See pricing</a>
          { }
          <a href="/auth/signin?callbackUrl=%2Fapp" className="rounded-xl bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground ring-1 ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Log in" tabIndex={0} rel="nofollow">Login</a>
          { }
          <a href="/auth/signup?callbackUrl=%2Fapp" className="rounded-xl bg-muted px-5 py-3 text-sm font-medium text-foreground ring-1 ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Sign up" tabIndex={0} rel="nofollow">Sign Up</a>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-4 font-[var(--font-cormorant)] text-3xl">Why Amelia?</h2>
        <p className="text-muted-foreground">
          A unified dashboard: lead pipeline, calendar sync, contracts & invoices, and client galleries. Warm, accessible, and fast.
        </p>
      </section>

      <section id="features" className="bg-card py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-3">
          {[
            { t: "Leads Pipeline", d: "Drag-and-drop from Lead to Booked." },
            { t: "Calendar Sync", d: "Two-way with Google Calendar." },
            { t: "Contracts & Payments", d: "E-sign PDFs. Stripe Checkout." },
            { t: "Client Galleries", d: "Secure albums with expiring links." },
            { t: "AI Helpers", d: "Draft emails, suggest next steps, tips." },
            { t: "Metrics", d: "Lead-to-booking, response time, totals." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <h2 className="mb-6 font-[var(--font-cormorant)] text-3xl">Simple Pricing</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { t: "Starter", p: "$9/mo", a: ["Leads", "Invoices", "Galleries"] },
            { t: "Pro", p: "$29/mo", a: ["Contracts", "Stripe", "AI Helpers"] },
            { t: "Studio", p: "$69/mo", a: ["Calendar 2-way", "Team", "Priority Support"] },
          ].map((plan) => (
            <div key={plan.t} className="rounded-2xl border border-border bg-background p-6">
              <h3 className="mb-1 text-lg font-semibold">{plan.t}</h3>
              <p className="mb-4 text-2xl">{plan.p}</p>
              <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                {plan.a.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
              { }
              <a href="/auth/signup?callbackUrl=%2Fapp" className="inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Choose ${plan.t}`} tabIndex={0} rel="nofollow">Choose {plan.t}</a>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h2 className="mb-6 font-[var(--font-cormorant)] text-3xl">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Is there a free trial?", a: "Yes, 14 days." },
            { q: "Do you support USD only?", a: "Yes, U.S. region for MVP." },
            { q: "Are galleries secure?", a: "Signed expiring URLs, private by default." },
          ].map((x) => (
            <details key={x.q} className="rounded-xl border border-border bg-background p-4">
              <summary className="cursor-pointer list-none">{x.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{x.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}


