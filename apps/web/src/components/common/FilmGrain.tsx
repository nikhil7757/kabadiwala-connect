import React, { useEffect, useState } from 'react';

export const FilmGrain: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Lerp/subtle vertical drift with scroll
          setOffsetY((window.scrollY * 0.15) % 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="film-grain"
      style={{
        transform: `translateY(${offsetY}px)`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
};
