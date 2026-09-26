import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-[#e4d8c4] bg-[#fffdf8] p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#5d6b75]">
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#e4d8c4] bg-white px-3 py-2 text-sm outline-none focus:border-[#c9842a]",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#e4d8c4] bg-white px-3 py-2 text-sm outline-none focus:border-[#c9842a]",
        props.className,
      )}
    />
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-[#163247] text-[#f6f1e8] hover:bg-[#1d425c]",
    ghost: "border border-[#e4d8c4] bg-white text-[#163247] hover:bg-[#f6f1e8]",
    danger: "bg-[#a33b32] text-white hover:bg-[#8a2f28]",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "buy" | "pass" | "negotiate" | "neutral";
}) {
  const tones = {
    buy: "bg-[#e8f6ee] text-[#1f7a4d]",
    pass: "bg-[#fdecea] text-[#a33b32]",
    negotiate: "bg-[#fff3e0] text-[#b26a12]",
    neutral: "bg-[#efe8da] text-[#163247]",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}
