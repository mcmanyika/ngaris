"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  redirectTo = "/admin/login",
  className,
}: {
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace(redirectTo);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void onLogout()}
      className={
        className ??
        "inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-white/20 text-sm font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
      }
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
