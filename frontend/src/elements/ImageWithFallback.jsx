import { useState } from 'react';

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        {...props}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🐟</div>
          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            {alt || 'Image'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div 
          className={`bg-muted animate-pulse ${className}`}
          {...props}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
}
