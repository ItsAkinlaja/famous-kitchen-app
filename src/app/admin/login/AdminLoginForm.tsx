"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { rateLimit } from "@/lib/rateLimit";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side rate limiting (basic deterrent — IP-based server check would be better)
    const attemptKey = `login:${email}`;
    if (typeof window !== "undefined") {
      const attempts = parseInt(sessionStorage.getItem(attemptKey) || "0", 10);
      if (attempts >= 5) {
        setError("Too many failed attempts. Please wait 15 minutes.");
        return;
      }
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Track failed attempts
      if (typeof window !== "undefined") {
        const attempts = parseInt(sessionStorage.getItem(attemptKey) || "0", 10);
        sessionStorage.setItem(attemptKey, String(attempts + 1));
        setTimeout(() => sessionStorage.removeItem(attemptKey), 15 * 60 * 1000);
      }
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="admin@example.com"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
