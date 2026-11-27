import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAuthShell } from "@/components/admin/auth-shell";
import { LogoutButton } from "@/components/admin/logout-button";
import { getSessionContext } from "@/lib/firebase/session-context";

export const instant = false;

export const metadata = {
  title: "Awaiting access",
  description: "Your account is pending admin activation.",
};

export default async function AdminPendingPage() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.isStaff) {
    redirect("/admin");
  }

  if (session.isContractor && session.profile?.status !== "pending") {
    redirect("/contractor");
  }

  return (
    <AdminAuthShell title="Awaiting access">
      <div className="space-y-5">
        <p className="text-sm text-white/65">
          Your account is registered
          {session.user.email ? (
            <>
              {" "}
              as <span className="text-white">{session.user.email}</span>
            </>
          ) : null}
          . An admin must activate it before you can open the dashboard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/login"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#EDB254] text-sm font-semibold text-[#032842]"
          >
            Back to sign in
          </Link>
          <LogoutButton redirectTo="/admin/login" />
        </div>
      </div>
    </AdminAuthShell>
  );
}
