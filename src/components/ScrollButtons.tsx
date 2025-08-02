import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ScreenSizes } from '../types';

interface ScrollButtonsProps {
    screen: ScreenSizes | null;
}

export default function ScrollButtons({ screen }: ScrollButtonsProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const upButtonRef = useRef<HTMLButtonElement>(null);
  const downButtonRef = useRef<HTMLButtonElement>(null);
  const currentDirectionRef = useRef<'up' | 'down' | null>(null);

  if (screen === null) {
    return null;
  }

  const handleClick = (direction: 'up' | 'down') => {
    // Only handle click if not currently scrolling
    if (!isScrolling) {
      const scrollAmount = direction === 'up' ? -300 : 300;
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const startContinuousScroll = (direction: 'up' | 'down') => {
    if (isScrolling) return;

    setIsScrolling(true);
    currentDirectionRef.current = direction;
    scrollIntervalRef.current = setInterval(() => {
      window.scrollBy({
        top: direction === 'up' ? -5 : 5,
        behavior: 'auto' // Use 'auto' for smoother continuous scrolling
      });
    }, 16); // ~60fps for smoother scrolling
  };

  const stopContinuousScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsScrolling(false);
    currentDirectionRef.current = null;
  };

  // Prevent default touch behavior to avoid conflicts
  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  useEffect(() => {
    const upButton = upButtonRef.current;
    const downButton = downButtonRef.current;

    if (upButton) {
      // Mouse events
      upButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startContinuousScroll('up');
      });
      upButton.addEventListener('mouseup', stopContinuousScroll);
      upButton.addEventListener('mouseleave', stopContinuousScroll);

      // Touch events for resistive touchscreen
      upButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startContinuousScroll('up');
      }, { passive: false });

      upButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopContinuousScroll();
      }, { passive: false });

      upButton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        stopContinuousScroll();
      }, { passive: false });

      // Prevent touchmove to avoid scrolling conflicts
      upButton.addEventListener('touchmove', preventDefault, { passive: false });
    }

    if (downButton) {
      // Mouse events
      downButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startContinuousScroll('down');
      });
      downButton.addEventListener('mouseup', stopContinuousScroll);
      downButton.addEventListener('mouseleave', stopContinuousScroll);

      // Touch events for resistive touchscreen
      downButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startContinuousScroll('down');
      }, { passive: false });

      downButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopContinuousScroll();
      }, { passive: false });

      downButton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        stopContinuousScroll();
      }, { passive: false });

      // Prevent touchmove to avoid scrolling conflicts
      downButton.addEventListener('touchmove', preventDefault, { passive: false });
    }

    return () => {
      stopContinuousScroll();
    };
  }, []);

  return (
    <>
      <button
        className="fixed left-[272px] top-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        onClick={() => handleClick('up')}
        aria-label="Scroll to top"
        ref={upButtonRef}
      >
        <ChevronUp size={24} />
      </button>

      <button
        className="fixed left-[272px] bottom-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        onClick={() => handleClick('down')}
        aria-label="Scroll to bottom"
        ref={downButtonRef}
      >
        <ChevronDown size={24} />
      </button>
    </>
  );
}
