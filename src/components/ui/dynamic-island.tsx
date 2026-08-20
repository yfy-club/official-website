"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useWillChange, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

const stiffness = 380;
const damping = 30;
const MIN_WIDTH = 760;

export type SizePresets =
  | "reset"
  | "empty"
  | "default"
  | "compact"
  | "compactLong"
  | "large"
  | "long"
  | "minimalLeading"
  | "minimalTrailing"
  | "compactMedium"
  | "medium"
  | "tall"
  | "ultra"
  | "massive";

export const SIZE_PRESETS = {
  RESET: "reset",
  EMPTY: "empty",
  DEFAULT: "default",
  COMPACT: "compact",
  COMPACT_LONG: "compactLong",
  LARGE: "large",
  LONG: "long",
  MINIMAL_LEADING: "minimalLeading",
  MINIMAL_TRAILING: "minimalTrailing",
  COMPACT_MEDIUM: "compactMedium",
  MEDIUM: "medium",
  TALL: "tall",
  ULTRA: "ultra",
  MASSIVE: "massive",
} as const;

export type Preset = {
  width: number;
  height?: number;
  aspectRatio: number;
  borderRadius: number;
};

export const DynamicIslandSizePresets: Record<SizePresets, Preset> = {
  [SIZE_PRESETS.RESET]: {
    width: 180,
    aspectRatio: 1,
    borderRadius: 20,
  },
  [SIZE_PRESETS.EMPTY]: {
    width: 0,
    aspectRatio: 0,
    borderRadius: 0,
  },
  [SIZE_PRESETS.DEFAULT]: {
    width: 320,
    aspectRatio: 52 / 320,
    borderRadius: 36,
  },
  [SIZE_PRESETS.MINIMAL_LEADING]: {
    width: 54,
    aspectRatio: 48 / 54,
    borderRadius: 24,
  },
  [SIZE_PRESETS.MINIMAL_TRAILING]: {
    width: 54,
    aspectRatio: 48 / 54,
    borderRadius: 24,
  },
  [SIZE_PRESETS.COMPACT]: {
    width: 340,
    aspectRatio: 52 / 340,
    borderRadius: 36,
  },
  [SIZE_PRESETS.COMPACT_LONG]: {
    width: 440,
    aspectRatio: 56 / 440,
    borderRadius: 36,
  },
  [SIZE_PRESETS.COMPACT_MEDIUM]: {
    width: 480,
    aspectRatio: 72 / 480,
    borderRadius: 32,
  },
  [SIZE_PRESETS.LONG]: {
    width: 540,
    aspectRatio: 90 / 540,
    borderRadius: 32,
  },
  [SIZE_PRESETS.MEDIUM]: {
    width: 600,
    aspectRatio: 260 / 600,
    borderRadius: 28,
  },
  [SIZE_PRESETS.LARGE]: {
    width: 640,
    aspectRatio: 140 / 640,
    borderRadius: 32,
  },
  [SIZE_PRESETS.TALL]: {
    width: 680,
    aspectRatio: 360 / 680,
    borderRadius: 28,
  },
  [SIZE_PRESETS.ULTRA]: {
    width: 760,
    aspectRatio: 440 / 760,
    borderRadius: 28,
  },
  [SIZE_PRESETS.MASSIVE]: {
    width: 820,
    aspectRatio: 520 / 820,
    borderRadius: 28,
  },
};

type BlobStateType = {
  size: SizePresets;
  previousSize: SizePresets | undefined;
  animationQueue: Array<{ size: SizePresets; delay: number }>;
  isAnimating: boolean;
};

type BlobAction =
  | { type: "SET_SIZE"; newSize: SizePresets }
  | { type: "INITIALIZE"; firstState: SizePresets }
  | {
      type: "SCHEDULE_ANIMATION";
      animationSteps: Array<{ size: SizePresets; delay: number }>;
    }
  | { type: "ANIMATION_END" };

type BlobContextType = {
  state: BlobStateType;
  dispatch: React.Dispatch<BlobAction>;
  setSize: (size: SizePresets) => void;
  scheduleAnimation: (animationSteps: Array<{ size: SizePresets; delay: number }>) => void;
  presets: Record<SizePresets, Preset>;
};

const BlobContext = createContext<BlobContextType | undefined>(undefined);

const blobReducer = (state: BlobStateType, action: BlobAction): BlobStateType => {
  switch (action.type) {
    case "SET_SIZE":
      return {
        ...state,
        size: action.newSize,
        previousSize: state.size,
        isAnimating: false,
      };
    case "SCHEDULE_ANIMATION":
      return {
        ...state,
        animationQueue: action.animationSteps,
        isAnimating: action.animationSteps.length > 0,
      };
    case "INITIALIZE":
      return {
        ...state,
        size: action.firstState,
        previousSize: SIZE_PRESETS.EMPTY,
        isAnimating: false,
      };
    case "ANIMATION_END":
      return {
        ...state,
        isAnimating: false,
      };
    default:
      return state;
  }
};

export interface DynamicIslandProviderProps {
  children: ReactNode;
  initialSize?: SizePresets;
  initialAnimation?: Array<{ size: SizePresets; delay: number }>;
}

export const DynamicIslandProvider: React.FC<DynamicIslandProviderProps> = ({
  children,
  initialSize = SIZE_PRESETS.DEFAULT,
  initialAnimation = [],
}) => {
  const initialState: BlobStateType = {
    size: initialSize,
    previousSize: SIZE_PRESETS.EMPTY,
    animationQueue: initialAnimation,
    isAnimating: initialAnimation.length > 0,
  };

  const [state, dispatch] = useReducer(blobReducer, initialState);

  useEffect(() => {
    let isCancelled = false;
    const processQueue = async () => {
      for (const step of state.animationQueue) {
        if (isCancelled) break;
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        if (isCancelled) break;
        dispatch({ type: "SET_SIZE", newSize: step.size });
      }
      if (!isCancelled) {
        dispatch({ type: "ANIMATION_END" });
      }
    };

    if (state.animationQueue.length > 0) {
      processQueue();
    }

    return () => {
      isCancelled = true;
    };
  }, [state.animationQueue]);

  const setSize = useCallback(
    (newSize: SizePresets) => {
      if (state.size !== newSize) {
        dispatch({ type: "SET_SIZE", newSize });
      }
    },
    [state.size]
  );

  const scheduleAnimation = useCallback((animationSteps: Array<{ size: SizePresets; delay: number }>) => {
    dispatch({ type: "SCHEDULE_ANIMATION", animationSteps });
  }, []);

  const contextValue = {
    state,
    dispatch,
    setSize,
    scheduleAnimation,
    presets: DynamicIslandSizePresets,
  };

  return <BlobContext.Provider value={contextValue}>{children}</BlobContext.Provider>;
};

export const useDynamicIslandSize = () => {
  const context = useContext(BlobContext);
  if (!context) {
    throw new Error("useDynamicIslandSize must be used within a DynamicIslandProvider");
  }
  return context;
};

export const useScheduledAnimations = (animations: Array<{ size: SizePresets; delay: number }>) => {
  const { scheduleAnimation } = useDynamicIslandSize();
  const animationsRef = useRef(animations);

  useEffect(() => {
    scheduleAnimation(animationsRef.current);
  }, [scheduleAnimation]);
};

export interface DynamicIslandProps extends Omit<HTMLMotionProps<"div">, "id"> {
  children: ReactNode;
  id: string;
  className?: string;
}

export function DynamicIsland({ children, id, className, ...props }: DynamicIslandProps) {
  const willChange = useWillChange();
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth <= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="z-10 flex h-full w-full items-center justify-center bg-transparent py-4">
      <DynamicIslandContent
        id={id}
        willChange={willChange}
        screenSize={screenSize}
        className={className}
        {...props}
      >
        {children}
      </DynamicIslandContent>
    </div>
  );
}

function calculateDimensions(
  size: SizePresets,
  screenSize: string,
  currentSize: Preset
): { width: string; height: string | number } {
  if (screenSize === "mobile") {
    if (size === "default" || size === "compact") {
      return { width: "100%", height: 54 };
    }
    return { width: "100%", height: "auto" };
  }

  const targetWidth = Math.min(currentSize.width, MIN_WIDTH);
  const targetHeight = currentSize.aspectRatio * targetWidth;

  return {
    width: `${targetWidth}px`,
    height: currentSize.aspectRatio > 0.3 ? "auto" : `${targetHeight}px`,
  };
}

interface DynamicIslandContentProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  id: string;
  willChange: ReturnType<typeof useWillChange>;
  screenSize: string;
}

function DynamicIslandContent({
  children,
  id,
  willChange,
  screenSize,
  className,
  ...props
}: DynamicIslandContentProps) {
  const { state, presets } = useDynamicIslandSize();
  const currentSize = presets[state.size] || presets.default;
  const dimensions = calculateDimensions(state.size, screenSize, currentSize);

  return (
    <motion.div
      id={id}
      layout
      className={cn(
        "relative mx-auto flex flex-col items-center justify-center overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--fg)] shadow-xl backdrop-blur-xl transition-colors duration-300 select-none",
        state.size !== "default" && state.size !== "compact" && "ring-1 ring-[var(--accent)]/40",
        className
      )}
      animate={{
        width: dimensions.width,
        borderRadius: currentSize.borderRadius,
      }}
      transition={{
        type: "spring",
        stiffness,
        damping,
      }}
      style={{ willChange }}
      {...props}
    >
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </motion.div>
  );
}

export interface DynamicContainerProps {
  className?: string;
  children?: ReactNode;
}

export const DynamicContainer = ({ className, children }: DynamicContainerProps) => {
  const willChange = useWillChange();
  const { state } = useDynamicIslandSize();
  const { size } = state;

  return (
    <motion.div
      key={size}
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{
        type: "spring",
        stiffness,
        damping,
      }}
      style={{ willChange }}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  );
};

export const DynamicTitle = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <motion.h3
      className={cn("font-bold tracking-tight text-[var(--fg)]", className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness, damping }}
    >
      {children}
    </motion.h3>
  );
};

export const DynamicDescription = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <motion.p
      className={cn("text-xs text-[var(--fg-muted)] leading-relaxed", className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness, damping }}
    >
      {children}
    </motion.p>
  );
};

export const DynamicDiv = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness, damping }}
    >
      {children}
    </motion.div>
  );
};
