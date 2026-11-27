import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/sidebar";
import { getSessionContext } from "@/lib/firebase/session-context";

export const instant = false;

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();
  if (!session) {
    redirect("/api/auth/logout?next=/admin/login");
  }

  if (session.profile?.status === "disabled") {
    redirect("/api/auth/logout?next=/admin/login");
  }

  if (session.isContractor && !session.isStaff) {
    redirect("/contractor");
  }

  if (session.isPending || !session.isStaff) {
    redirect("/admin/pending");
  }

  return (
    <AdminShell email={session.user.email} isAdmin={session.isAdmin}>
      {children}
    </AdminShell>
  );
}
