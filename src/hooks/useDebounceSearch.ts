import { useCallback, useRef } from "react";

export function useDebounce(cb: (...args: any[]) => void, delay = 1000) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => cb(...args), delay);
    },
    [cb, delay]
  );
}
