import LeadDetailClient from "./lead-detail-client";

type PageProps = { params: Promise<{ id: string }> };

export default async function AppLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <LeadDetailClient id={id} />;
}
