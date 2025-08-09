### Amelia Backlog (Concise, vendor-first)

#### Dashboard & Quick Actions (MVP+)
- Quick actions: New Lead, New Client, New Meeting, New Invoice, Send Contract, Share Booking Link, Create Gallery.
- Overview KPIs: Conversion, Leads This Week, Avg Sales/Client; Today card (events/tasks).

#### Contacts, Companies, Projects
- Models for `Contact`, `Company`, `Project`; convert lead→project; timeline and participants.
- CSV import for contacts/companies/leads.

#### Invoices & Payments
- Invoice builder (items, tax/discount, due dates), Stripe Checkout, receipts, schedules/reminders.
- Webhooks to update status; payouts report; export CSV.

#### Contracts & E‑sign
- Templates with variables; send-to-sign; single/multi-signer; audit trail; signed PDF storage.

#### Scheduling & Calendar
- Event types + booking links, availability/buffers, Google 2‑way sync, tentative holds.

#### Forms & Automations
- Form builder + branching; responses on projects.
- Triggers (stage/contract/payment/form/time) → actions (email, task, move stage, send form/contract).

#### Client Portal & Galleries (key differentiator)
- Portal per project showing invoices/contracts/forms/messages/galleries.
- Galleries (MVP):
  - Branded, responsive layouts (masonry/grid/slideshow; light/dark) + album sections
  - Secure sharing via tokens (optional password/PIN), per‑album or whole gallery, expiry
  - Client proofing: favorites/labels + per‑image comments; export selections
  - Downloads: presets (Full/Web/Social), ZIP builder, per‑album/whole, expiring links
  - Watermark presets; storage usage meter by plan (S3 + CloudFront)
  - Video support baseline (HLS transcode or external embed)
- Monetization (Phase 2):
  - Stripe storefront for prints/frames/digitals, packages, taxes/shipping; orders in dashboard
  - Marketing automations (publish → notify; favorites/cart → offers; abandoned cart)
  - CTA to book new session from gallery (ties to Scheduling)
- Differentiators (Phase 3):
  - Hybrid photo+video timelines; smart slideshow export for socials
  - AI curation: de‑dupe, sharpness/eye‑open scoring, face clustering “Smart Selects”
  - Guest uploads with moderation

#### Messaging & Email
- Project threads; send via Resend; inbound email to append replies; branded templates.

#### Analytics & KPIs
- Funnel by source; revenue; response SLA; exports.

#### Billing/Plans & Storage
- Starter/Pro/Studio feature flags; Stripe subscriptions + portal; storage quotas/overage.

#### Tasks & Project Management
- Tasks with assignees/due dates/checklists; Kanban per project; comments.

#### Settings
- Business profile, timezone/currency/tax defaults, templates & terms.
- Split address fields (street/city/state/zip) across app.

#### Security & RBAC
- Workspaces and roles; resource scoping; audit log.

#### PWA / Mobile UX
- PWA install, push notifications, offline shell; mobile-first layouts (scrollable tabs, bottom nav).

#### Onboarding
- 3‑step wizard to capture goals/services/brand; seeds default templates.

Order of execution: Projects → Invoices & Contracts → Client Portal & Galleries → Scheduling → Forms & Automations → Analytics & Billing → Messaging → RBAC/PWA.
