import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {GALLERY_PHOTOS} from '../data/restaurant';
import {DishImage} from './DishImage';

const SLIDE_INTERVAL_MS = 5500;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const slides = GALLERY_PHOTOS;

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isPaused, slides.length]);

  const goToSlide = (nextIndex: number) => {
    const normalized = (nextIndex + slides.length) % slides.length;
    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(normalized);
  };

  const currentSlide = slides[activeIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="absolute inset-0"
    >
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={currentSlide.id}
          custom={direction}
          initial={
            prefersReducedMotion
              ? {opacity: 0}
              : {opacity: 0, x: direction > 0 ? '4%' : '-4%', scale: 1.04}
          }
          animate={{opacity: 1, x: 0, scale: 1}}
          exit={
            prefersReducedMotion
              ? {opacity: 0}
              : {opacity: 0, x: direction > 0 ? '-4%' : '4%'}
          }
          transition={{duration: 0.85, ease: EASE_OUT_EXPO}}
          className="absolute inset-0"
        >
          <DishImage
            src={currentSlide.image}
            alt={currentSlide.alt}
            title={currentSlide.title}
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Measured contrast scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#120B0B]/95 via-[#120B0B]/80 to-[#120B0B]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120B0B] via-transparent to-[#120B0B]/45"
      />

      {/* Bottom-right slide indicator & manual controls */}
      <div className="pointer-events-auto absolute bottom-5 right-4 z-20 flex items-center gap-3 rounded-lg border border-[#D4A853]/25 bg-[#120B0B]/80 px-3.5 py-2 backdrop-blur-md sm:bottom-6 sm:right-6 lg:right-8">
        <div className="hidden text-right sm:block">
          <p className="text-[11px] font-medium text-[#D4A853]">{currentSlide.category}</p>
          <p className="text-xs font-semibold text-[#FAF6F0]">{currentSlide.title}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label="Previous featured dish"
            className="inline-flex h-8 w-8 items-center justify-center rounded text-[#D6CBC3] transition-colors duration-150 hover:bg-[#9B1B20]/40 hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label="Hero dish slides">
            {slides.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${slide.title}`}
                  onClick={() => goToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] ${
                    isActive
                      ? 'w-6 bg-[#D4A853]'
                      : 'w-2 bg-[#FAF6F0]/35 hover:bg-[#FAF6F0]/65'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label="Next featured dish"
            className="inline-flex h-8 w-8 items-center justify-center rounded text-[#D6CBC3] transition-colors duration-150 hover:bg-[#9B1B20]/40 hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
