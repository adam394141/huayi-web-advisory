export function shouldAnimate(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.dataset.motion !== "reduce";
}

export function isForceMode(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.dataset.motion === "force";
}
