import Link from "next/link";
import { Suspense } from "react";

import { AdminAuthShell } from "@/components/admin/auth-shell";
import { AdminLoginForm } from "@/components/admin/login-form";

export const instant = false;

export const metadata = {
  title: "Admin login",
  description: "Sign in to the Ngaris Construction admin console.",
};

export default function AdminLoginPage() {
  return (
    <AdminAuthShell
      title="Sign in"
      footer={
        <p>
          No account?{" "}
          <Link
            href="/admin/register"
            className="font-medium text-[#EDB254] underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={<div className="h-40 animate-pulse rounded-lg bg-white/5" />}
      >
        <AdminLoginForm />
      </Suspense>
    </AdminAuthShell>
  );
}
