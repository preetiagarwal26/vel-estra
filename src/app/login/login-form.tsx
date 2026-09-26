"use client";

import { useState } from "react";
import { signIn } from "@/app/actions/auth";
import { Button, Input, Label } from "@/components/ui";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    const result = await signIn(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={submit} className="grid gap-4">
      <input type="hidden" name="next" value={nextPath} />
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input name="password" type="password" required />
      </div>
      {error ? <p className="text-sm text-[#a33b32]">{error}</p> : null}
      <Button type="submit">Continue</Button>
    </form>
  );
}
