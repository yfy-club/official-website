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

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__header flex flex-col gap-1.5 p-4 sm:p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("card__title font-sans text-base font-semibold tracking-tight text-[var(--fg)]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("card__description font-sans text-xs text-[var(--fg-faint)] leading-relaxed", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__body", className)} {...props} />;
}

export function CardPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__panel p-4 sm:p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__footer", className)} {...props} />;
}

/* ── CardFrame 工业仪表舱框架 ────────────────────────────────────────── */

export function CardFrame({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-frame relative flex flex-col rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function CardFrameHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-frame__header flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3.5 sm:px-5 sm:py-4 bg-[var(--surface-2)]/35",
        className
      )}
      {...props}
    />
  );
}

export function CardFrameTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("card-frame__title font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]", className)}
      {...props}
    />
  );
}

export function CardFrameDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("card-frame__description font-sans text-xs text-[var(--fg-muted)]", className)}
      {...props}
    />
  );
}

export function CardFrameAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("card-frame__action flex items-center gap-2 shrink-0", className)}
      {...props}
    />
  );
}

export function CardFrameFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-frame__footer border-t border-[var(--border)] px-4 py-3 sm:px-5 font-mono text-xs text-[var(--fg-faint)] bg-[var(--surface-2)]/20",
        className
      )}
      {...props}
    />
  );
}

export { cardVariants };
