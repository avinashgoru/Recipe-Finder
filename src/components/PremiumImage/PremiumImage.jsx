import { useState } from 'react';
import './PremiumImage.css';

export default function PremiumImage({ src, alt, className = '', wrapperClassName = '', ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`premium-image-wrapper ${wrapperClassName}`}>
      {/* Premium Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="premium-image-skeleton" aria-hidden="true" />
      )}
      
      <img
        src={hasError ? 'https://images.unsplash.com/photo-1495195134817-a169d261e47f?q=80&w=600&auto=format&fit=crop' : src}
        alt={alt}
        className={`premium-image ${isLoaded ? 'premium-image--loaded' : ''} ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        {...props}
      />
    </div>
  );
}
