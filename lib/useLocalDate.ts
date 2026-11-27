import { useSyncExternalStore } from "react";

export function localDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  return () => window.removeEventListener("focus", onChange);
}

export default function useLocalDate(initialDate: string) {
  return useSyncExternalStore(subscribe, localDate, () => initialDate);
}
