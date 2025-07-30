import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ScreenSizes } from '../types';

interface ScrollButtonsProps {
    screen: ScreenSizes | null;
}

const abortController = new AbortController();

export default function ScrollButtons({ screen }: ScrollButtonsProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const upButtonRef = useRef<HTMLButtonElement>(null);
  const downButtonRef = useRef<HTMLButtonElement>(null);

  if (screen === null) {
    return null;
  }

  const handleClick = (direction: 'up' | 'down') => {
    const scrollAmount = direction === 'up' ? -300 : 300;
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth'
    });
  };

  const startContinuousScroll = (direction: 'up' | 'down') => {
    if (isScrolling) return;

    setIsScrolling(true);
    scrollIntervalRef.current = setInterval(() => {
      window.scrollBy({
        top: direction === 'up' ? -5 : 5,
        behavior: 'smooth'
      });
    }, 1); // 1ms interval for smooth continuous scrolling
  };

  const stopContinuousScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsScrolling(false);
  };

  useEffect(() => {
    const upButton = upButtonRef.current;
    const downButton = downButtonRef.current;

    if (upButton) {
      upButton.addEventListener('mousedown', () => startContinuousScroll('up'), {
        signal: abortController.signal
      });
      upButton.addEventListener('mouseup', stopContinuousScroll, {
        signal: abortController.signal
      });
      upButton.addEventListener('mouseleave', stopContinuousScroll, {
        signal: abortController.signal
      });
      upButton.addEventListener('touchstart', () => startContinuousScroll('up'), {
        signal: abortController.signal
      });
      upButton.addEventListener('touchend', stopContinuousScroll, {
        signal: abortController.signal
      });
    }

    if (downButton) {
      downButton.addEventListener('mousedown', () => startContinuousScroll('down'), {
        signal: abortController.signal
      });
      downButton.addEventListener('mouseup', stopContinuousScroll, {
        signal: abortController.signal
      });
      downButton.addEventListener('mouseleave', stopContinuousScroll, {
        signal: abortController.signal
      });
      downButton.addEventListener('touchstart', () => startContinuousScroll('down'), {
        signal: abortController.signal
      });
      downButton.addEventListener('touchend', stopContinuousScroll, {
        signal: abortController.signal
      });
    }

    return () => {
      stopContinuousScroll();
      abortController.abort();
    };
  }, [isScrolling]);

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
