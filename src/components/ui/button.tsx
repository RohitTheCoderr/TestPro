import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "edit"
    | "delete"
    | "view"
    | "icon";
  size?: "default" | "lg" | "sm" | "xl" | "icon";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      href,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded text-sm font-medium transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",

      // Variants
      {
        "bg-primary text-white hover:brightness-105": variant === "default",

        "bg-accent text-secondary hover:brightness-150":
          variant === "secondary",

        "border border-primary text-black bg-white hover:brightness-90":
          variant === "outline",

        "text-gray-700 hover:bg-gray-100": variant === "ghost",

        "text-primary underline-offset-4 hover:underline": variant === "link",

        // Table action buttons
        "text-blue-600 bg-blue-50 hover:bg-blue-100": variant === "edit",

        "text-red-600 bg-red-50 hover:bg-red-100": variant === "delete",

        "text-green-600 bg-green-50 hover:bg-green-100": variant === "view",

        // Icon button
        "hover:bg-gray-100": variant === "icon",
      },

      // Sizes
      {
        "h-9 px-4": size === "default",

        "h-10 px-6 text-lg": size === "lg",

        "h-12 px-8 text-lg": size === "xl",

        "h-8 px-3 text-sm": size === "sm",

        "h-8 w-8 p-0": size === "icon",
      },

      className,
    );

    // If href is provided → render Link
    if (href) {
      return (
        <Link href={href} className={baseClasses}>
          {children}
        </Link>
      );
    }

    // Otherwise → normal button
    return (
      <button ref={ref} className={baseClasses} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
