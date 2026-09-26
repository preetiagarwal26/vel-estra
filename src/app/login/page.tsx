import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { BrandLogo } from "@/components/brand-logo";
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
        <BrandLogo className="mb-4 text-[#163247]" />
        <h1 className="mt-2 mb-6 text-3xl">{title}</h1>
        {children}
      </Card>
    </div>
  );
}
