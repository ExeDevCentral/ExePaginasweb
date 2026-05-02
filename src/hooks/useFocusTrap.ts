import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(focusableElementsString);
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus logic to move focus inside the modal when it opens
    // We use a slight delay to allow animations to start and DOM to be fully ready
    const timeoutId = setTimeout(() => {
      if (modalRef.current) {
        // Try focusing the modal itself first to prevent scrolling issues
        modalRef.current.focus({ preventScroll: true });
        
        // Then try focusing the first focusable element
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(focusableElementsString);
        if (focusableElements.length > 0) {
           focusableElements[0].focus({ preventScroll: true });
        }
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [isActive]);

  return modalRef;
};
