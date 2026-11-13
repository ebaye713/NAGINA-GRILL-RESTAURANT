import {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {ChevronLeft, ChevronRight, Expand, Pause, Play} from 'lucide-react';
import type {GalleryPhoto} from '../data/restaurant';
import {DishImage} from './DishImage';

interface FoodGallerySliderProps {
  photos: GalleryPhoto[];
  onOpenLightbox: (index: number) => void;
}

const AUTO_SLIDE_MS = 4500;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function FoodGallerySlider({photos, onOpenLightbox}: FoodGallerySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback(
    (nextIndex: number) => {
      const target = (nextIndex + photos.length) % photos.length;
      setDirection(nextIndex >= activeIndex ? 1 : -1);
      setActiveIndex(target);
    },
    [activeIndex, photos.length]
  );

  useEffect(() => {
    if (prefersReducedMotion || !isAutoPlaying || isHovered) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isAutoPlaying, isHovered, photos.length]);

  const activePhoto = photos[activeIndex];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mt-10"
    >
      {/* Primary Sliding Showcase */}
      <div className="relative overflow-hidden rounded-xl border border-[#D4A853]/25 bg-[#190D0E]">
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/8]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activePhoto.id}
              custom={direction}
              initial={
                prefersReducedMotion
                  ? {opacity: 0}
                  : {opacity: 0, x: direction > 0 ? '8%' : '-8%'}
              }
              animate={{opacity: 1, x: 0}}
              exit={
                prefersReducedMotion
                  ? {opacity: 0}
                  : {opacity: 0, x: direction > 0 ? '-8%' : '8%'}
              }
              transition={{duration: 0.55, ease: EASE_OUT_EXPO}}
              drag={prefersReducedMotion ? false : 'x'}
              dragConstraints={{left: 0, right: 0}}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  goTo(activeIndex + 1);
                } else if (info.offset.x > 50) {
                  goTo(activeIndex - 1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <DishImage
                src={activePhoto.image}
                alt={activePhoto.alt}
                title={activePhoto.title}
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120B0B]/95 via-[#120B0B]/25 to-transparent"
              />
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Controls */}
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous gallery dish"
            className="absolute left-3 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D4A853]/40 bg-[#120B0B]/80 text-[#FAF6F0] backdrop-blur-sm transition-colors duration-150 hover:bg-[#9B1B20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next gallery dish"
            className="absolute right-3 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D4A853]/40 bg-[#120B0B]/80 text-[#FAF6F0] backdrop-blur-sm transition-colors duration-150 hover:bg-[#9B1B20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Caption & Expand Overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end sm:p-7">
            <div className="max-w-xl">
              <p className="text-xs font-medium text-[#E8C67A]">{activePhoto.category}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-[#FAF6F0] sm:text-3xl">
                {activePhoto.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#D6CBC3]">{activePhoto.caption}</p>
            </div>

            <div className="pointer-events-auto flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                aria-label={isAutoPlaying ? 'Pause gallery slideshow' : 'Play gallery slideshow'}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[#D4A853]/35 bg-[#120B0B]/85 px-3 py-2 text-xs font-medium text-[#E8C67A] whitespace-nowrap shrink-0 backdrop-blur-sm transition-colors duration-150 hover:border-[#D4A853] hover:bg-[#1E1213]"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Auto-Slide</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenLightbox(activeIndex)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#9B1B20] px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B22228]"
              >
                <Expand className="h-3.5 w-3.5 text-[#E8C67A]" aria-hidden="true" />
                <span>View Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sliding Thumbnail Filmstrip */}
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {photos.map((photo, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Select ${photo.title}`}
              aria-current={isActive ? 'true' : undefined}
              className={`group relative overflow-hidden rounded-lg border text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] ${
                isActive
                  ? 'border-[#D4A853] ring-1 ring-[#D4A853]/60'
                  : 'border-[#D4A853]/15 opacity-70 hover:border-[#D4A853]/45 hover:opacity-100'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#180E0F]">
                <DishImage
                  src={photo.image}
                  alt={photo.alt}
                  title={photo.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="bg-[#160D0E] px-2 py-1.5">
                <p className="truncate text-[11px] font-medium text-[#FAF6F0]">
                  {photo.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
