import { useState, useEffect, useRef } from 'react';

const PLACEHOLDERS = [
  "What are you looking for?",
  "Ask me a question about your meetings!",
  "Search for specific topics or discussions",
  "Find insights from past conversations",
  "Looking for meeting summaries?",
];

const FADE_DURATION = 1000; // 1 second fade transition
const DISPLAY_DURATION = 3000; // 3 seconds display time

export const useSearchPlaceholders = () => {
  const [currentText, setCurrentText] = useState(PLACEHOLDERS[0]);
  const [opacity, setOpacity] = useState(1);
  const currentIndex = useRef(0);
  const fadeTimeout = useRef<number | null>(null);
  const cycleTimeout = useRef<number | null>(null);

  useEffect(() => {
    const cyclePlaceholder = () => {
      // Start fade out
      setOpacity(0);
      
      // After fade out, change text and fade in
      fadeTimeout.current = window.setTimeout(() => {
        currentIndex.current = (currentIndex.current + 1) % PLACEHOLDERS.length;
        setCurrentText(PLACEHOLDERS[currentIndex.current]);
        setOpacity(1);
      }, FADE_DURATION);

      // Schedule next cycle
      cycleTimeout.current = window.setTimeout(cyclePlaceholder, FADE_DURATION + DISPLAY_DURATION);
    };

    // Start the cycle
    cycleTimeout.current = window.setTimeout(cyclePlaceholder, DISPLAY_DURATION);

    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
      if (cycleTimeout.current) clearTimeout(cycleTimeout.current);
    };
  }, []);

  return {
    text: currentText,
    opacity,
  };
};