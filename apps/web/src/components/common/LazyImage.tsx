import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. '16/9' or '1/1'
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Standardized LazyImage Primitive (Phase 2 Component)
 * - Explicit width/height or aspect-ratio
 * - Compulsory alt text
 * - Native loading="lazy"
 * - In-built dark skeleton placeholder while loading
 * - Never blows up or collapses
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  width,
  height,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#141614] border border-[#1F221F] rounded-sm ${className}`}
      style={{ aspectRatio, width: width || '100%', height: height || 'auto' }}
    >
      {/* Skeleton Pulse Layer */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[#1F221F]/50 animate-pulse flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#6A6E6A]">LOADING ASSET...</span>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 bg-[#141614] flex flex-col items-center justify-center p-2 text-center text-[#6A6E6A] font-mono text-[10px]">
          <span>⚠ ASSET OFFLINE</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
