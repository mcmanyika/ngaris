import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/leads?id=${encodeURIComponent(id)}`);
}
