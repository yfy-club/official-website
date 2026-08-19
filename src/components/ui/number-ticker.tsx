"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties } from "react"
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"
import { getNumberTickerInitialValue } from "@/lib/motion"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

function formatTickerValue(value: number, decimalPlaces: number) {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: false,
  }).format(Number(value.toFixed(decimalPlaces)))
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  style,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const initialValue = getNumberTickerInitialValue({
    direction,
    reduceMotion: shouldReduceMotion === true,
    startValue,
    value,
  })
  const motionValue = useMotionValue(initialValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (shouldReduceMotion) {
      springValue.jump(value)
      if (ref.current) ref.current.textContent = formatTickerValue(value, decimalPlaces)
      return
    }

    if (isInView && !shouldReduceMotion) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, springValue, isInView, delay, value, direction, startValue, decimalPlaces, shouldReduceMotion])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = formatTickerValue(latest, decimalPlaces)
        }
      }),
    [springValue, decimalPlaces]
  )

  return (
    <span
      className={cn("number-ticker tabular", className)}
      data-number-ticker-value={formatTickerValue(value, decimalPlaces)}
      style={{
        "--number-ticker-width": `${Math.max(formatTickerValue(value, decimalPlaces).length, formatTickerValue(startValue, decimalPlaces).length)}ch`,
        ...style,
      } as CSSProperties}
      suppressHydrationWarning
      {...props}
    >
      <span className="number-ticker__animated" ref={ref} suppressHydrationWarning>
        {formatTickerValue(initialValue, decimalPlaces)}
      </span>
      <span className="number-ticker__reduced">
        {formatTickerValue(value, decimalPlaces)}
      </span>
    </span>
  )
}
