"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

const springConfig = { stiffness: 260, damping: 24 };

interface ExpandableContextType {
  isExpanded: boolean;
  toggleExpand: () => void;
  expandDirection: "vertical" | "horizontal" | "both";
  expandBehavior: "replace" | "push";
  transitionDuration: number;
}

const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: "vertical",
  expandBehavior: "replace",
  transitionDuration: 0.28,
});

export const useExpandable = () => useContext(ExpandableContext);

// Native ResizeObserver measure hook
function useMeasure(): [(node: HTMLElement | null) => void, { width: number; height: number }] {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [node, setNode] = useState<HTMLElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const ref = useCallback((newNode: HTMLElement | null) => {
    setNode(newNode);
  }, []);

  useEffect(() => {
    if (!node) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.current.observe(node);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node]);

  return [ref, dimensions];
}

interface ExpandableProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode);
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: () => void;
  transitionDuration?: number;
  expandDirection?: "vertical" | "horizontal" | "both";
  expandBehavior?: "replace" | "push";
}

export const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      defaultExpanded = false,
      onToggle,
      transitionDuration = 0.28,
      expandDirection = "vertical",
      expandBehavior = "replace",
      className,
      ...props
    },
    ref
  ) => {
    const [isExpandedInternal, setIsExpandedInternal] = useState(defaultExpanded);
    const isExpanded = expanded !== undefined ? expanded : isExpandedInternal;
    const toggleExpand = onToggle || (() => setIsExpandedInternal((prev) => !prev));

    const contextValue: ExpandableContextType = {
      isExpanded,
      toggleExpand,
      expandDirection,
      expandBehavior,
      transitionDuration,
    };

    return (
      <ExpandableContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          className={cn("expandable-root", className)}
          initial={false}
          {...props}
        >
          {typeof children === "function" ? children({ isExpanded }) : children}
        </motion.div>
      </ExpandableContext.Provider>
    );
  }
);
Expandable.displayName = "Expandable";

interface ExpandableCardProps {
  children: ReactNode;
  className?: string;
  hoverToExpand?: boolean;
}

export const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  ({ children, className, hoverToExpand = false, ...props }, ref) => {
    const { isExpanded, toggleExpand } = useExpandable();

    return (
      <motion.div
        ref={ref}
        layout
        transition={springConfig}
        onClick={toggleExpand}
        onMouseEnter={() => {
          if (hoverToExpand && !isExpanded) toggleExpand();
        }}
        className={cn(
          "group/expandable relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all shadow-xs hover:border-[var(--border-strong)] hover:shadow-sm",
          isExpanded && "border-[var(--accent)]/80 ring-1 ring-[var(--accent)]/30",
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full">{children}</div>
      </motion.div>
    );
  }
);
ExpandableCard.displayName = "ExpandableCard";

export const ExpandableTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { toggleExpand } = useExpandable();

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        toggleExpand();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpand();
        }
      }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
});
ExpandableTrigger.displayName = "ExpandableTrigger";

interface ExpandableContentProps {
  children: ReactNode;
  className?: string;
}

export const ExpandableContent = React.forwardRef<HTMLDivElement, ExpandableContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isExpanded, transitionDuration } = useExpandable();
    const [measureRef, { height }] = useMeasure();
    const animatedHeight = useMotionValue(0);
    const smoothHeight = useSpring(animatedHeight, springConfig);

    useEffect(() => {
      if (isExpanded) {
        animatedHeight.set(height);
      } else {
        animatedHeight.set(0);
      }
    }, [isExpanded, height, animatedHeight]);

    return (
      <motion.div
        ref={ref}
        style={{ height: smoothHeight, overflow: "hidden" }}
        transition={{ duration: transitionDuration, ease: "easeOut" }}
        className={className}
        {...props}
      >
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              ref={measureRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: transitionDuration, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);
ExpandableContent.displayName = "ExpandableContent";

export const ExpandableCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
));
ExpandableCardHeader.displayName = "ExpandableCardHeader";

export const ExpandableCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("pt-3 overflow-hidden", className)} {...props}>
    {children}
  </div>
));
ExpandableCardContent.displayName = "ExpandableCardContent";
