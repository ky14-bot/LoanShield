import { useEffect, useRef, useState, type ReactNode } from 'react';

interface InfiniteSliderProps {
  children: ReactNode[];
  gap?: number;
  reverse?: boolean;
  duration?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  reverse = false,
  duration = 25,
  className = '',
}: InfiniteSliderProps) {
  const [width, setWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trackRef.current) {
      setWidth(trackRef.current.scrollWidth / 2);
    }
  }, [children]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          animation: `${reverse ? 'infiniteScrollReverse' : 'infiniteScroll'} ${duration}s linear infinite`,
          ['--slider-width' as string]: `${width + gap / 2}px`,
        }}
      >
        {children}
        {children}
      </div>

      <style>{`
        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-1 * var(--slider-width))); }
        }
        @keyframes infiniteScrollReverse {
          from { transform: translateX(calc(-1 * var(--slider-width))); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
