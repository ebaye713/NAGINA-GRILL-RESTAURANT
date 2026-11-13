import {useState} from 'react';
import {Utensils} from 'lucide-react';

interface DishImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function DishImage({
  src,
  alt,
  title,
  className = 'h-full w-full object-cover',
  loading = 'lazy',
}: DishImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#2B1012] via-[#1A0D0E] to-[#120B0B] p-6 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A853]/30 bg-[#9B1B20]/20 text-[#D4A853]">
          <Utensils className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="font-display text-lg font-semibold text-[#FAF6F0]">{title}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
