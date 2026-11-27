import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/providers?id=${encodeURIComponent(id)}`);
}
