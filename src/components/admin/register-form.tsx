"use client";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { getClientAuth } from "@/lib/firebase/client";

export function AdminRegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setPending(true);

    try {
      const auth = getClientAuth();
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(credential.user, {
        displayName: fullName.trim(),
      });

      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          fullName: fullName.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        pendingAccess?: boolean;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Registration failed.");
      }

      if (payload?.pendingAccess) {
        router.replace("/admin/pending");
        router.refresh();
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      const message = getAuthErrorMessage(err);
      if (/Registration is not configured/i.test(message)) {
        setError(
          "Server Admin credentials are missing. Add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local, then restart next dev.",
        );
      } else {
        setError(message);
      }
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "h-11 w-full rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25";

  if (info) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg border border-[#EDB254]/30 bg-[#EDB254]/10 px-3 py-3 text-sm text-[#EDB254]">
          {info}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#EDB254] text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-white">
          Full name
        </label>
        <input
          id="fullName"
          autoComplete="name"
          required
          minLength={2}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass}
          placeholder="At least 8 characters"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-white"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={fieldClass}
          placeholder="Repeat password"
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
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
