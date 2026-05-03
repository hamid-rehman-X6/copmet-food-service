// Admin login page using NextAuth credentials flow.
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!result || result.error) {
      setError("Invalid credentials.");
      return;
    }
    router.push(ROUTES.adminDashboard);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="mb-4 text-2xl font-semibold">Admin Login</h1>
      <div className="space-y-3">
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" value={email} />
        <Input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          value={password}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-full" onClick={handleLogin}>
          Sign in
        </Button>
      </div>
    </main>
  );
}
