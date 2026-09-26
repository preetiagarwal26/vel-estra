import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-auto w-full max-w-md",
};

export function BrandLogo({
  href = "/",
  size = "sm",
  showWordmark = size !== "lg",
  className,
}: BrandLogoProps) {
  const image = (
    <Image
      src="/vel-estra-logo.jpg"
      alt="Vel-Estra"
      width={size === "lg" ? 960 : 96}
      height={size === "lg" ? 540 : 96}
      className={cn(
        size === "lg"
          ? "rounded-3xl shadow-lg"
          : "rounded-full object-cover",
        sizes[size],
      )}
      priority
    />
  );

  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      {image}
      {showWordmark ? <span className="tracking-wide">Vel-Estra</span> : null}
    </Link>
  );
}
