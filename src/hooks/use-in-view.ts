import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver visibility hook.
 * Used to lazy-mount heavy animated demos and to pause loops off-screen.
 */
export function useInView<T extends HTMLElement>(threshold = 0.25, once = false) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (once) {
          if (visible) {
            setInView(true);
            io.disconnect();
          }
        } else {
          setInView(visible);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}
