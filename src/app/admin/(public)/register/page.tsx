import Link from "next/link";

import { AdminAuthShell } from "@/components/admin/auth-shell";
import { AdminRegisterForm } from "@/components/admin/register-form";

export const instant = false;

export const metadata = {
  title: "Create account",
  description: "Register a Ngaris Construction staff account.",
};

export default function AdminRegisterPage() {
  return (
    <AdminAuthShell
      title="Create account"
      footer={
        <p>
          Already registered?{" "}
          <Link
            href="/admin/login"
            className="font-medium text-[#EDB254] underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AdminRegisterForm />
    </AdminAuthShell>
  );
}
