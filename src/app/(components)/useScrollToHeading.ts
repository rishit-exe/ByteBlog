import { useCallback } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export const useScrollToHeading = () => {
  const lenis = useLenis();

  const scrollToHeading = useCallback((id: string, offset: number = -60) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with id ${id} not found`);
      return;
    }

    console.log(`Scrolling to heading: ${id}`);
    console.log('Lenis available:', !!lenis);

    if (lenis && typeof lenis.scrollTo === 'function') {
      console.log('Using lenis.scrollTo');
      try {
        // Use lenis to scroll to the element with offset
        lenis.scrollTo(element, {
          offset: Math.abs(offset), // Convert negative to positive for lenis
          duration: 0.8,
          easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
        });
        console.log('Lenis scrollTo called successfully');
      } catch (error) {
        console.error('Lenis scrollTo failed:', error);
        // Fallback to native scrolling
        fallbackScrollTo(element, offset);
      }
    } else {
      console.log('Using fallback scrollIntoView with offset:', offset);
      fallbackScrollTo(element, offset);
    }
  }, [lenis]);

  const fallbackScrollTo = (element: HTMLElement, offset: number) => {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    // Fix: offset should be subtracted, not added, to position element at top
    const offsetPosition = absoluteElementTop - Math.abs(offset);
    
    console.log('Fallback scroll details:');
    console.log('- Element rect:', elementRect);
    console.log('- Absolute top:', absoluteElementTop);
    console.log('- Offset:', offset);
    console.log('- Final position:', offsetPosition);
    
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
    
    console.log('Fallback scrollTo called');
  };

  return { scrollToHeading, lenis };
};