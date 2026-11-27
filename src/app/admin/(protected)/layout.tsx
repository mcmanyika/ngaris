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

  if (session.isContractor && !session.isStaff) {
    redirect("/contractor");
  }

  if (!session.isStaff) {
    redirect("/api/auth/logout?next=/admin/login");
  }

  return <AdminShell email={session.user.email}>{children}</AdminShell>;
}
