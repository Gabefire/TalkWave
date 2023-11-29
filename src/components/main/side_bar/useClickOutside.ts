import { RefObject, useEffect } from "react";

export default function useClickOutside(ref: RefObject<HTMLDivElement> | null, additionalRef: RefObject<HTMLElement> | null, onClickOutside: () => void) {
    useEffect(() => {

      
      function handleClickOutside(event: MouseEvent) {
        if (!ref || !event.target || !additionalRef || !additionalRef.current) {
            return
        } 
        if (ref.current && !ref.current.contains(event.target as Node) && !additionalRef.current.contains(event.target as Node)) {
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