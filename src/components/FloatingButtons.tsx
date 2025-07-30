import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ScreenSizes } from '../types';

interface FloatingButtonsProps {
  screen: ScreenSizes | null;
}

export function FloatingButtons({ screen }: FloatingButtonsProps) {
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

  return (
    <>
      <button
        className="fixed right-4 top-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        onClick={() => handleClick('up')}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>

      <button
        className="fixed right-4 bottom-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        onClick={() => handleClick('down')}
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={24} />
      </button>
    </>
  );
}