import { useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";

export default function useChartSelection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  function togglePin(index: number) {
    setPinned((current) => current === index ? null : index);
  }

  function pointProps(index: number) {
    return {
      "aria-pressed": pinned === index,
      onPointerEnter(event: PointerEvent<HTMLButtonElement>) {
        if (event.pointerType !== "touch") setHovered(index);
      },
      onPointerLeave() {
        setHovered(null);
      },
      onFocus(event: FocusEvent<HTMLButtonElement>) {
        if (event.currentTarget.matches(":focus-visible")) setFocused(index);
      },
      onBlur() {
        setFocused(null);
      },
      onClick() {
        togglePin(index);
      },
      onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key === "Escape") {
          setHovered(null);
          setFocused(null);
          setPinned(null);
        }
      },
    };
  }

  return { active: hovered ?? focused ?? pinned, pointProps, setHovered, togglePin };
}
