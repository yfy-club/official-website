import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const cardVariants = cva("card", {
  variants: {
    variant: {
      default: "card--default",
      frame: "card--frame",
      inset: "card--inset",
    },
    density: {
      comfortable: "card--comfortable",
      compact: "card--compact",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "comfortable",
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    corners?: boolean;
  };

export function Card({
  children,
  className,
  corners = false,
  density,
  variant,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ density, variant }), className)} {...props}>
      {corners && <CardCorners />}
      {children}
    </div>
  );
}

export function CardCorners() {
  return (
    <span className="card__corners" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export function CardMeta({
  className,
  code,
  revision,
  status,
}: {
  className?: string;
  code: ReactNode;
  revision?: ReactNode;
  status?: {
    label: ReactNode;
    pulse?: boolean;
    variant?: BadgeProps["variant"];
  };
}) {
  return (
    <div className={cn("card__meta", className)}>
      <kbd className="card__code">{code}</kbd>
      <span className="card__meta-end">
        {status && (
          <Badge variant={status.variant} pulse={status.pulse}>
            {status.label}
          </Badge>
        )}
        {revision && <span className="card__revision tabular">{revision}</span>}
      </span>
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__body", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__footer", className)} {...props} />;
}

export { cardVariants };
