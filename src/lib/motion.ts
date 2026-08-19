export const SLIDER_STEP = 5;

export function getNumberTickerInitialValue({
  direction,
  reduceMotion,
  startValue,
  value,
}: {
  direction: "up" | "down";
  reduceMotion: boolean;
  startValue: number;
  value: number;
}) {
  if (reduceMotion) return value;
  return direction === "down" ? value : startValue;
}

export function clampSliderValue(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getSliderValueFromKey(current: number, key: string) {
  if (key === "ArrowLeft" || key === "ArrowDown") return clampSliderValue(current - SLIDER_STEP);
  if (key === "ArrowRight" || key === "ArrowUp") return clampSliderValue(current + SLIDER_STEP);
  if (key === "Home") return 0;
  if (key === "End") return 100;
  return null;
}
