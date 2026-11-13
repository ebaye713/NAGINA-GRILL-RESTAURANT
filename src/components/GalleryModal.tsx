import {useEffect} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import type {GalleryPhoto} from '../data/restaurant';
import {DishImage} from './DishImage';

interface GalleryModalProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function GalleryModal({
  photos,
  activeIndex,
  onClose,
  onSelectIndex,
}: GalleryModalProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        onSelectIndex((activeIndex + 1) % photos.length);
      } else if (event.key === 'ArrowLeft') {
        onSelectIndex((activeIndex - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, photos.length, onClose, onSelectIndex]);

  if (activeIndex === null) return null;

  const current = photos[activeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-[#D4A853]/30 bg-[#180E0E] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#D4A853]/15 px-5 py-3.5">
          <div>
            <p className="text-xs font-medium text-[#D4A853]">{current.category}</p>
            <h3 className="font-display text-2xl font-semibold text-[#FAF6F0]">
              {current.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery preview"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#D4A853]/25 text-[#FAF6F0] transition-colors duration-150 hover:border-[#D4A853] hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[16/10] w-full bg-[#0E0707]">
          <DishImage
            src={current.image}
            alt={current.alt}
            title={current.title}
            loading="eager"
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex - 1 + photos.length) % photos.length)}
            aria-label="Previous dish photo"
            className="absolute left-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D4A853]/40 bg-[#120B0B]/80 text-[#FAF6F0] transition-colors duration-150 hover:bg-[#9B1B20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex + 1) % photos.length)}
            aria-label="Next dish photo"
            className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D4A853]/40 bg-[#120B0B]/80 text-[#FAF6F0] transition-colors duration-150 hover:bg-[#9B1B20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#D6CBC3]">{current.caption}</p>
          <p className="text-xs font-medium text-[#D4A853] tabular-nums whitespace-nowrap shrink-0">
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
