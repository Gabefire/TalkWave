import { RefObject, useEffect } from "react";

export default function useClickOutside(
  ref: RefObject<HTMLDivElement> | null,
  onClickOutside: () => void,
  additionalRef?: RefObject<HTMLElement> | null
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref || !event.target) {
        return;
      }

      if (
        !additionalRef &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        onClickOutside();
      } else if (
        additionalRef &&
        additionalRef.current &&
        !additionalRef.current.contains(event.target as Node) &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside, additionalRef]);
}
