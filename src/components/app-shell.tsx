import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deals/new", label: "New analysis" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/compare", label: "Compare" },
  { href: "/alerts", label: "Alerts" },
  { href: "/advisor", label: "Advisor" },
  { href: "/activity", label: "Activity" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#e4d8c4] bg-[#163247] text-[#f6f1e8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg tracking-wide">
            Vel-Estra
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="opacity-90 hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={signOut} className="flex items-center gap-3">
            <span className="hidden text-xs opacity-70 sm:inline">{email}</span>
            <Button variant="ghost" className="border-[#c9842a] text-[#f6f1e8]">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
