import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../../lib/audio.js';

interface SpeakerButtonProps {
  audioKey: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  audioKey,
  fallbackText,
  size = 'md',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = audioService.subscribe((playing, activeKey) => {
      setIsPlaying(playing && activeKey === audioKey);
    });
    return unsubscribe;
  }, [audioKey]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      audioService.stop();
    } else {
      audioService.play(audioKey, fallbackText);
    }
  };

  const dimensions =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-12 h-12';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-kc-border-strong bg-kc-surface text-kc-ink transition-transform active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus ${dimensions} ${className}`}
      aria-label="Play audio explanation"
    >
      {isPlaying ? (
        <div className="flex items-end justify-center gap-0.5 h-5 w-5">
          <span className="w-1 bg-kc-accent rounded-full animate-bounce [animation-delay:-0.4s] h-3" />
          <span className="w-1 bg-kc-accent rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
          <span className="w-1 bg-kc-accent rounded-full animate-bounce h-2" />
          <span className="w-1 bg-kc-accent rounded-full animate-bounce [animation-delay:-0.3s] h-4" />
          <span className="w-1 bg-kc-accent rounded-full animate-bounce [animation-delay:-0.1s] h-3" />
        </div>
      ) : (
        <Volume2 className="w-5 h-5 text-kc-ink" />
      )}
    </button>
  );
};
