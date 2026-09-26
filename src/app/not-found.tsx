import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl">Page not found</h1>
      <Link href="/" className="mt-4 underline">
        Back home
      </Link>
    </div>
  );
}
