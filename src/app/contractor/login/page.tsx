import Link from "next/link";
import { Suspense } from "react";

import { AdminAuthShell } from "@/components/admin/auth-shell";
import { ContractorLoginForm } from "@/components/contractor/login-form";

export const metadata = {
  title: "Contractor sign in",
  description: "Sign in to your Ngaris Construction contractor portal.",
};

export default function ContractorLoginPage() {
  return (
    <AdminAuthShell
      title="Sign in"
      footer={
        <p>
          New here?{" "}
          <Link
            href="/contractor/apply"
            className="text-[#EDB254] underline-offset-2 hover:underline"
          >
            Apply
          </Link>
        </p>
      }
    >
      <Suspense fallback={<p className="text-sm text-white/60">Loading…</p>}>
        <ContractorLoginForm />
      </Suspense>
    </AdminAuthShell>
  );
}
