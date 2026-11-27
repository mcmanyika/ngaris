"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { getClientAuth } from "@/lib/firebase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const credential = await signInWithEmailAndPassword(
        getClientAuth(),
        email.trim(),
        password,
      );
      const idToken = await credential.user.getIdToken(true);

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        destination?: string;
        isStaff?: boolean;
        isContractor?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Sign-in failed.");
      }

      if (payload?.isContractor && !payload?.isStaff) {
        router.replace("/contractor");
      } else {
        router.replace(
          nextPath.startsWith("/admin")
            ? nextPath
            : (payload?.destination ?? "/admin"),
        );
      }
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
          placeholder="you@ngaris.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-white">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#EDB254] text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
