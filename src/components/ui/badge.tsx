import { cva, type VariantProps } from "class-variance-authority";
import * as Slot from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("badge", {
  variants: {
    variant: {
      default: "badge--default",
      active: "badge--active",
      warning: "badge--warning",
      success: "badge--success",
      neutral: "badge--neutral",
      outline: "badge--outline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    pulse?: boolean;
  };

function Badge({
  asChild = false,
  children,
  className,
  pulse = false,
  variant = "default",
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-pulse={pulse || undefined}
      data-slot="badge"
      data-variant={variant}
      {...props}
    >
      {!asChild && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
