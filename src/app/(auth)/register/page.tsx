"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "RENTER" as "RENTER" | "HOST",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!form.acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setLoading(false);
      if (typeof data.error === "string") {
        setError(data.error);
      } else {
        const first = Object.values(data.error).flat()[0];
        setError(first as string);
      }
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign in failed. Please log in manually.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Join Joy Rental Express today
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField("role", "RENTER")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.role === "RENTER"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                Rent a car
              </button>
              <button
                type="button"
                onClick={() => updateField("role", "HOST")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.role === "HOST"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                List my car
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              error={fieldErrors.firstName}
              required
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              error={fieldErrors.lastName}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={fieldErrors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={fieldErrors.password}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            error={fieldErrors.confirmPassword}
            required
          />

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => updateField("acceptTerms", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
            />
            <span className="text-sm text-gray-500">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-green-600 hover:text-green-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-green-600 hover:text-green-700"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
