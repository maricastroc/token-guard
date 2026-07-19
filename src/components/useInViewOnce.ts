import { useEffect, useRef, useState } from 'react';

export function useInViewOnce<T extends Element>(fallbackMs = 1400) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    let done = false;
    const reveal = () => {
      if (!done) {
        done = true;
        setInView(true);
      }
    };

    if (!el || typeof IntersectionObserver === 'undefined') {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    const timer = setTimeout(reveal, fallbackMs);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [fallbackMs]);

  return [ref, inView] as const;
}
