import Link from "next/link";
import { Suspense } from "react";

import { AdminAuthShell } from "@/components/admin/auth-shell";
import { ContractorApplyForm } from "@/components/contractor/apply-form";

export const metadata = {
  title: "Apply as a contractor",
  description:
    "Apply to join the Ngaris Construction verified contractor network in Zimbabwe.",
};

export default function ContractorApplyPage() {
  return (
    <AdminAuthShell
      wide
      title="Apply"
      footer={
        <p>
          Already applied?{" "}
          <Link
            href="/contractor/login"
            className="text-[#EDB254] underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <Suspense fallback={<p className="text-sm text-white/60">Loading…</p>}>
        <ContractorApplyForm />
      </Suspense>
    </AdminAuthShell>
  );
}
