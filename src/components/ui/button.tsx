"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn text-button uppercase tracking-wider font-semibold transition-all duration-200 ring-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-purple text-white shadow-card hover:bg-purple-dark hover:shadow-card-hover active:scale-[0.98]",
        ghost:
          "border border-line bg-transparent text-ink hover:border-purple hover:text-purple hover:bg-purple/5",
        outline:
          "border border-purple bg-transparent text-purple hover:bg-purple hover:text-white",
        subtle: "bg-purple/10 text-purple hover:bg-purple/15",
        plain:
          "bg-transparent text-ink hover:bg-line/40 normal-case tracking-normal",
        danger: "bg-danger text-white hover:bg-danger/90",
        link: "bg-transparent text-purple normal-case tracking-normal underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
