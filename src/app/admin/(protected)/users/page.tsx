import { redirect } from "next/navigation";
import { Suspense } from "react";

import { UsersList, type UserListItem } from "@/components/admin/users-list";
import { listProfiles } from "@/lib/firebase/profiles";
import { getSessionContext } from "@/lib/firebase/session-context";

export const instant = false;

export const metadata = {
  title: "Users",
  description: "Manage user access levels.",
};

function formatDate(millis: number | undefined) {
  if (!millis) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(millis));
}

async function UsersContent() {
  const session = await getSessionContext();
  if (!session?.isAdmin) {
    redirect("/admin");
  }

  const profiles = await listProfiles({ limit: 200 });
  const items: UserListItem[] = profiles.map((profile) => ({
    id: profile.uid,
    fullName: profile.fullName,
    email: profile.email,
    status: profile.status,
    roles: profile.roles,
    createdLabel: formatDate(profile.createdAt?.toMillis?.()),
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#032842]">No users yet</p>
        </div>
      ) : (
        <UsersList items={items} />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[#032842]/8 bg-white px-6 py-10 text-sm text-[#032842]/45">
          Loading…
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
