import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string; // 👈 add this
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "lg" | "sm" | "xl";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", href, ...props },
    ref,
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-white hover:brightness-105": variant === "default",
        "bg-accent text-secondary hover:brightness-150":
          variant === "secondary",
        "border border-primary text-black bg-white hover:brightness-90":
          variant === "outline",
      },
      {
        "h-9 px-4": size === "default",
        "h-10 px-6 text-lg": size === "lg",
        "h-12 px-8 text-lg": size === "xl",
        "h-8 px-3 text-sm": size === "sm",
      },
      className,
    );

    // ✅ If href is provided → render Link
    if (href) {
      return (
        <Link href={href} className={baseClasses}>
          {props.children}
        </Link>
      );
    }

    // ✅ Otherwise → render normal button
    return <button ref={ref} className={baseClasses} {...props} />;
  },
);

Button.displayName = "Button";

export { Button };
