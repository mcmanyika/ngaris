import { redirect } from "next/navigation";

import { ContractorShell } from "@/components/contractor/sidebar";
import { getSessionContext } from "@/lib/firebase/session-context";

export const instant = false;

export default async function ContractorProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();
  if (!session) {
    redirect("/api/auth/logout?next=/contractor/login");
  }

  if (session.isStaff && !session.isContractor) {
    redirect("/admin");
  }

  if (!session.isContractor) {
    redirect("/contractor/apply");
  }

  return (
    <ContractorShell email={session.user.email}>{children}</ContractorShell>
  );
}
