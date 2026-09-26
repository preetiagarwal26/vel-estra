import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { Card } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthScreen title="Sign in">
      <LoginForm nextPath={params.next ?? "/dashboard"} />
      <p className="mt-4 text-sm text-[#5d6b75]">
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </AuthScreen>
  );
}

function AuthScreen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.16em] text-[#c9842a]">Vel-Estra</p>
        <h1 className="mt-2 mb-6 text-3xl">{title}</h1>
        {children}
      </Card>
    </div>
  );
}
