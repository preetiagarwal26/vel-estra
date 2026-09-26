"use client";

import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import { Button, Card, Input, Label } from "@/components/ui";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    setMessage("");
    const result = await signUp(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setMessage(result.success);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.16em] text-[#c9842a]">Vel-Estra</p>
        <h1 className="mt-2 mb-6 text-3xl">Create account</h1>
        <form action={submit} className="grid gap-4">
          <div>
            <Label>Name</Label>
            <Input name="displayName" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" minLength={8} required />
          </div>
          {error ? <p className="text-sm text-[#a33b32]">{error}</p> : null}
          {message ? <p className="text-sm text-[#1f7a4d]">{message}</p> : null}
          <Button type="submit">Create account</Button>
        </form>
        <p className="mt-4 text-sm text-[#5d6b75]">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
