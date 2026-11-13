import {useCallback, useEffect, useMemo, useState, type FormEvent} from 'react';
import {APIProvider} from '@vis.gl/react-google-maps';
import {MotionConfig, motion} from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  MapPin,
  Navigation,
  Phone,
  Search,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import {DishImage} from './components/DishImage';
import {FoodGallerySlider} from './components/FoodGallerySlider';
import {GalleryModal} from './components/GalleryModal';
import {HeroSlider} from './components/HeroSlider';
import {NaginaLocationMap, PlaceVerifier} from './components/NaginaLocationMap';
import {Navbar} from './components/Navbar';
import {ReviewsSection} from './components/ReviewsSection';
import {
  ABOUT_MEDIA,
  GALLERY_PHOTOS,
  getCurrentOpeningStatus,
  MENU_CATEGORIES,
  MENU_ITEMS,
  RESTAURANT_INFO,
  WEEKEND_SPECIALS,
  type MenuCategory,
} from './data/restaurant';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_DIRECTIONS_URL,
  type VerifiedPlaceInfo,
} from './lib/maps';

const FADE_UP_VIEWPORT = {once: true, amount: 0.15} as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [menuQuery, setMenuQuery] = useState('');
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<VerifiedPlaceInfo>({
    status: GOOGLE_MAPS_API_KEY ? 'idle' : 'unavailable',
    reviews: [],
  });

  // Table / Catering Enquiry Form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryGuests, setEnquiryGuests] = useState('4');
  const [enquiryDateTime, setEnquiryDateTime] = useState('');
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const openingStatus = useMemo(() => getCurrentOpeningStatus(), []);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleVerifiedPlace = useCallback((info: VerifiedPlaceInfo) => {
    setPlaceInfo(info);
  }, []);

  const filteredMenu = useMemo(() => {
    const normalizedQuery = menuQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, menuQuery]);

  const handleEnquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!enquiryName.trim() || !enquiryPhone.trim()) {
      setEnquiryError('Please provide your name and a valid UK phone number.');
      return;
    }
    setEnquiryError(null);
    setEnquirySubmitted(true);
  };

  const mainContent = (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-[#120B0B] text-[#FAF6F0]">
        {quotaExceeded && (
          <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-900 shadow-sm md:text-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-950 underline hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Navbar />

        <main>
          {/* 1. HERO SECTION */}
          <section className="relative overflow-hidden border-b border-[#D4A853]/15">
            <div className="relative min-h-[600px] lg:min-h-[680px]">
              <HeroSlider />

              <div className="pointer-events-none relative z-10 mx-auto flex min-h-[600px] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[680px] lg:px-8">
                <motion.div
                  initial={{opacity: 0, y: 18}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.55, ease: EASE_OUT_EXPO}}
                  className="pointer-events-auto max-w-2xl"
                >
                  <p className="text-sm font-medium text-[#E8C67A]">
                    93 Longbridge Road, Barking IG11 8TB · Halal Charcoal Kitchen
                  </p>

                  <h1 className="mt-4 font-display text-[clamp(2.5rem,4.8vw,4.35rem)] font-semibold leading-[1.06] tracking-tight text-[#FAF6F0] text-balance">
                    Authentic Pakistani Charcoal Grill &amp; Heritage Kitchen
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[#E3D9D1] sm:text-lg">
                    From flame-seared seekh kebabs and sizzling iron karahis to Sunday morning
                    Halwa Puri, slow-cooked Nihari, Paya, and Haleem—prepared fresh daily in the
                    heart of Barking.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href={RESTAURANT_INFO.phoneHref}
                      className="inline-flex min-h-[48px] items-center gap-2.5 rounded-md bg-[#9B1B20] px-6 py-3 text-sm font-semibold text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B22228] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
                    >
                      <Phone className="h-4 w-4 text-[#E8C67A]" aria-hidden="true" />
                      <span>Call {RESTAURANT_INFO.phoneDisplay}</span>
                    </a>

                    <a
                      href="#menu"
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-[#D4A853]/50 bg-[#120B0B]/70 px-6 py-3 text-sm font-semibold text-[#E8C67A] whitespace-nowrap shrink-0 backdrop-blur-sm transition-colors duration-150 hover:border-[#E8C67A] hover:bg-[#D4A853] hover:text-[#120B0B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
                    >
                      <span>Explore Menu</span>
                    </a>

                    <a
                      href="#specials"
                      className="inline-flex min-h-[44px] items-center px-2 py-2 text-sm font-medium text-[#FAF6F0] underline decoration-[#D4A853]/60 underline-offset-4 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#E8C67A]"
                    >
                      Weekend Specials
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Full-width 4-column hospitality strip below Hero */}
            <div className="border-t border-[#D4A853]/15 bg-[#170D0E]">
              <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[#D4A853]/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                <div className="px-4 py-5 sm:px-6">
                  <p className="text-xs font-medium text-[#D4A853]">Visit Us</p>
                  <p className="mt-1 text-sm font-semibold text-[#FAF6F0]">
                    93 Longbridge Road
                  </p>
                  <p className="text-xs text-[#B8ABA4]">Barking IG11 8TB</p>
                </div>

                <div className="px-4 py-5 sm:px-6">
                  <p className="text-xs font-medium text-[#D4A853]">Mon – Sat Hours</p>
                  <p className="mt-1 text-sm font-semibold text-[#FAF6F0] tabular-nums">
                    12:00 PM – 12:00 AM
                  </p>
                  <p className="text-xs text-[#B8ABA4]">{openingStatus.label}</p>
                </div>

                <div className="px-4 py-5 sm:px-6">
                  <p className="text-xs font-medium text-[#D4A853]">Sunday Specials</p>
                  <p className="mt-1 text-sm font-semibold text-[#FAF6F0] tabular-nums">
                    9:00 AM – 12:00 AM
                  </p>
                  <p className="text-xs text-[#B8ABA4]">Halwa Puri · Nihari · Paya · Haleem</p>
                </div>

                <div className="px-4 py-5 sm:px-6">
                  <p className="text-xs font-medium text-[#D4A853]">Direct Enquiries</p>
                  <a
                    href={RESTAURANT_INFO.phoneHref}
                    className="mt-1 inline-block text-sm font-semibold text-[#FAF6F0] tabular-nums transition-colors hover:text-[#E8C67A]"
                  >
                    +44 20 8594 8153
                  </a>
                  <p className="text-xs text-[#B8ABA4]">Dine-in, takeaway &amp; family platters</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. ABOUT THE RESTAURANT */}
          <section id="about" aria-labelledby="about-heading" className="bg-[#120B0B] py-20 sm:py-24">
            <div className="mx-auto grid max-w-6xl items-stretch gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
              <motion.div
                initial={{opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={FADE_UP_VIEWPORT}
                transition={{duration: 0.5, ease: EASE_OUT_EXPO}}
                className="flex flex-col justify-center lg:col-span-6"
              >
                <p className="text-sm font-medium text-[#D4A853]">Our Heritage Kitchen</p>
                <h2
                  id="about-heading"
                  className="mt-2 font-display text-3xl font-semibold text-[#FAF6F0] text-balance sm:text-4xl"
                >
                  Barking’s Home for Honest Charcoal Fire &amp; Desi Hospitality
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#D6CBC3]">
                  On Longbridge Road in Barking, Nagina Grill &amp; Restaurant brings together
                  the smoky theatre of traditional Pakistani charcoal grilling and the patience
                  of slow-simmered Lahori home cooking. Every kebab skewer, masala lamb chop,
                  and iron-wok karahi is cooked fresh to order over real embers using freshly
                  ground whole spices and 100% Halal-certified cuts.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#B8ABA4]">
                  Whether you are gathering the family for an evening mixed grill, picking up a
                  late-night biryani before midnight, or arriving early on Sunday at 9am for
                  steaming Nihari and crispy Halwa Puri, our dining room is built for generous
                  portions and warm local hospitality.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#D4A853]/15 pt-7 sm:grid-cols-3">
                  <div>
                    <Flame className="h-5 w-5 text-[#D4A853]" aria-hidden="true" />
                    <h3 className="mt-2.5 text-sm font-semibold text-[#FAF6F0]">
                      Real Charcoal Grill
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#B8ABA4]">
                      Marinated lamb chops, seekh kebabs &amp; tikka seared over live coals.
                    </p>
                  </div>
                  <div>
                    <UtensilsCrossed className="h-5 w-5 text-[#D4A853]" aria-hidden="true" />
                    <h3 className="mt-2.5 text-sm font-semibold text-[#FAF6F0]">
                      Fresh Clay Tandoor
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#B8ABA4]">
                      Garlic naan, keema naan &amp; wholemeal roti baked to order.
                    </p>
                  </div>
                  <div>
                    <Clock className="h-5 w-5 text-[#D4A853]" aria-hidden="true" />
                    <h3 className="mt-2.5 text-sm font-semibold text-[#FAF6F0]">
                      Open Until Midnight
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#B8ABA4]">
                      Seven days a week, with early 9am Sunday weekend breakfast.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={FADE_UP_VIEWPORT}
                transition={{duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO}}
                className="lg:col-span-6"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#D4A853]/20 bg-[#1A0E0F] lg:h-full lg:aspect-auto">
                  <DishImage
                    src={ABOUT_MEDIA.image}
                    alt={ABOUT_MEDIA.alt}
                    title="Charcoal Mixed Grill"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. WEEKEND SPECIALS */}
          <section
            id="specials"
            aria-labelledby="specials-heading"
            className="border-t border-[#D4A853]/15 bg-[#190D0E] py-20 sm:py-24"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-[#D4A853]">
                    Weekend &amp; Sunday Morning Highlights
                  </p>
                  <h2
                    id="specials-heading"
                    className="mt-2 font-display text-3xl font-semibold text-[#FAF6F0] text-balance sm:text-4xl"
                  >
                    Traditional Weekend Specials
                  </h2>
                  <p className="mt-3 text-base text-[#C9BEB6]">
                    Slow-simmered overnight and served piping hot every weekend—our kitchen
                    opens early at 9:00 AM on Sundays especially for breakfast and brunch
                    traditions.
                  </p>
                </div>

                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-md border border-[#D4A853]/40 px-4 py-2.5 text-sm font-medium text-[#E8C67A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#D4A853] hover:text-[#120B0B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] md:self-auto"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Reserve Weekend Table</span>
                </a>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
                {WEEKEND_SPECIALS.map((dish, index) => (
                  <motion.article
                    key={dish.id}
                    initial={{opacity: 0, y: 16}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={FADE_UP_VIEWPORT}
                    transition={{duration: 0.45, delay: index * 0.06, ease: EASE_OUT_EXPO}}
                    className="group overflow-hidden rounded-xl border border-[#D4A853]/20 bg-[#120B0B] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#1D1011]">
                      <DishImage
                        src={dish.image}
                        alt={dish.alt}
                        title={dish.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4A853]">
                        <span>{dish.urduSubtitle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{dish.availability}</span>
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-semibold text-[#FAF6F0]">
                        {dish.name}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#D6CBC3]">
                        {dish.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#D4A853]/15 pt-4 text-xs">
                        <span className="text-[#A89A91]">{dish.pairing}</span>
                        <a
                          href={RESTAURANT_INFO.phoneHref}
                          className="font-semibold text-[#E8C67A] whitespace-nowrap shrink-0 hover:underline"
                        >
                          {dish.priceStatus}
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 4. FOOD MENU (WARM PARCHMENT SURFACE FOR HIGH-CONTRAST READING) */}
          <section
            id="menu"
            aria-labelledby="menu-heading"
            className="bg-[#FAF6F0] py-20 text-[#1A1110] sm:py-24"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-6 border-b border-[#1A1110]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold text-[#9B1B20]">
                    Freshly Prepared · 100% Halal
                  </p>
                  <h2
                    id="menu-heading"
                    className="mt-2 font-display text-3xl font-semibold text-[#1A1110] text-balance sm:text-4xl"
                  >
                    Our Kitchen Menu
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#574942] sm:text-base">
                    Browse our charcoal grill platters, iron-wok karahis, dum biryanis, and
                    weekend specials. Menu prices are currently confirmed directly with the
                    restaurant—call{' '}
                    <a
                      href={RESTAURANT_INFO.phoneHref}
                      className="font-semibold text-[#9B1B20] underline underline-offset-2"
                    >
                      {RESTAURANT_INFO.phoneDisplay}
                    </a>{' '}
                    for daily pricing, family deals, and takeaway orders.
                  </p>
                </div>

                {/* Search Input */}
                <div className="w-full lg:w-72">
                  <label htmlFor="menu-search" className="sr-only">
                    Search menu dishes
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E5B53]"
                      aria-hidden="true"
                    />
                    <input
                      id="menu-search"
                      type="search"
                      value={menuQuery}
                      onChange={(e) => setMenuQuery(e.target.value)}
                      placeholder="Search biryani, nihari, chops..."
                      className="min-h-[44px] w-full rounded-lg border border-[#1A1110]/15 bg-white pl-9 pr-3 text-sm text-[#1A1110] placeholder:text-[#8A7870] focus:border-[#9B1B20] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Category Filter Buttons */}
              <div
                role="tablist"
                aria-label="Menu categories"
                className="mt-6 flex flex-wrap items-center gap-2"
              >
                {MENU_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[40px] rounded-md px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1B20] sm:text-sm ${
                        isActive
                          ? 'bg-[#9B1B20] text-[#FAF6F0]'
                          : 'border border-[#1A1110]/15 bg-white text-[#3F322D] hover:border-[#9B1B20]/40 hover:text-[#9B1B20]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Menu List */}
              {filteredMenu.length === 0 ? (
                <div className="mt-10 rounded-xl border border-[#1A1110]/10 bg-white p-8 text-center">
                  <p className="font-display text-2xl font-semibold text-[#1A1110]">
                    No dishes match “{menuQuery}”
                  </p>
                  <p className="mt-2 text-sm text-[#574942]">
                    Try clearing the filter or call us directly to ask about custom dishes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 inline-flex min-h-[40px] items-center rounded-md bg-[#9B1B20] px-4 py-2 text-sm font-semibold text-[#FAF6F0] hover:bg-[#B22228]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="mt-10 grid gap-x-10 gap-y-2 md:grid-cols-2">
                  {filteredMenu.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col justify-between border-b border-[#1A1110]/10 py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-xl font-semibold text-[#1A1110] sm:text-2xl">
                          {item.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#9B1B20] tabular-nums whitespace-nowrap shrink-0">
                          {item.priceLabel}
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm leading-relaxed text-[#574942]">
                        {item.description}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2 text-xs text-[#7D6A61]">
                        <span>{item.category}</span>
                        {item.dietary && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.dietary}</span>
                          </>
                        )}
                        {item.spice && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.spice} Spice</span>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Direct Call Strip inside Menu */}
              <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#D4A853]/40 bg-[#120B0B] p-6 text-[#FAF6F0] sm:flex-row sm:items-center sm:p-7">
                <div>
                  <p className="text-xs font-medium text-[#E8C67A]">
                    Takeaway &amp; Group Orders
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-[#FAF6F0]">
                    Ready to order or ask today’s prices?
                  </p>
                </div>
                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#D4A853] px-5 py-2.5 text-sm font-semibold text-[#120B0B] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#E8C67A]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call {RESTAURANT_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </section>

          {/* 5. FOOD GALLERY */}
          <section
            id="gallery"
            aria-labelledby="gallery-heading"
            className="bg-[#120B0B] py-20 sm:py-24"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-[#D4A853]">From Our Kitchen</p>
                <h2
                  id="gallery-heading"
                  className="mt-2 font-display text-3xl font-semibold text-[#FAF6F0] text-balance sm:text-4xl"
                >
                  Food Gallery
                </h2>
                <p className="mt-3 text-base text-[#B8ABA4]">
                  Swipe, slide, or select any dish below to view it full-screen.
                </p>
              </div>

              <FoodGallerySlider
                photos={GALLERY_PHOTOS}
                onOpenLightbox={setGalleryIndex}
              />
            </div>
          </section>

          {/* 6. CUSTOMER REVIEWS (GOOGLE PLACES VERIFICATION) */}
          <ReviewsSection placeInfo={placeInfo} />

          {/* 7. VISIT US, OPENING HOURS, GOOGLE MAPS & ENQUIRY FORM */}
          <section
            id="visit"
            aria-labelledby="visit-heading"
            className="border-t border-[#D4A853]/15 bg-[#120B0B] py-20 sm:py-24"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-[#D4A853]">Plan Your Visit</p>
                <h2
                  id="visit-heading"
                  className="mt-2 font-display text-3xl font-semibold text-[#FAF6F0] text-balance sm:text-4xl"
                >
                  Hours, Location &amp; Table Enquiries
                </h2>
              </div>

              <div className="mt-10 grid gap-8 lg:grid-cols-12">
                {/* Left Column: Google Maps Location + Opening Hours */}
                <div className="space-y-6 lg:col-span-7">
                  <NaginaLocationMap placeInfo={placeInfo} quotaExceeded={quotaExceeded} />

                  <div className="grid gap-6 rounded-xl border border-[#D4A853]/20 bg-[#180E0F] p-6 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-[#D4A853]">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span>Opening Hours</span>
                      </div>
                      <dl className="mt-4 space-y-3 text-sm">
                        {RESTAURANT_INFO.hours.map((entry) => (
                          <div
                            key={entry.days}
                            className="border-b border-[#D4A853]/10 pb-2.5 last:border-b-0 last:pb-0"
                          >
                            <dt className="font-semibold text-[#FAF6F0]">{entry.days}</dt>
                            <dd className="mt-0.5 font-medium text-[#E8C67A] tabular-nums">
                              {entry.time}
                            </dd>
                            <dd className="mt-0.5 text-xs text-[#A89A91]">{entry.note}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="flex flex-col justify-between gap-5 border-t border-[#D4A853]/15 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-[#D4A853]">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          <span>Address &amp; Telephone</span>
                        </div>
                        <address className="mt-4 not-italic text-sm leading-relaxed text-[#E3D9D1]">
                          <strong className="block font-semibold text-[#FAF6F0]">
                            {RESTAURANT_INFO.name}
                          </strong>
                          {RESTAURANT_INFO.addressLine1}
                          <br />
                          {RESTAURANT_INFO.addressLine2}
                        </address>
                        <p className="mt-3 text-xs text-[#A89A91]">
                          Status: {openingStatus.label} · {openingStatus.detail}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={RESTAURANT_INFO.phoneHref}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#9B1B20] px-4 py-2 text-sm font-semibold text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B22228]"
                        >
                          <Phone className="h-4 w-4 text-[#E8C67A]" aria-hidden="true" />
                          <span>{RESTAURANT_INFO.phoneDisplay}</span>
                        </a>
                        <a
                          href={placeInfo.googleMapsUri || GOOGLE_MAPS_DIRECTIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#D4A853]/35 px-4 py-2 text-sm font-medium text-[#E8C67A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#D4A853] hover:bg-[#D4A853] hover:text-[#120B0B]"
                        >
                          <Navigation className="h-4 w-4" aria-hidden="true" />
                          <span>Directions</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Table & Catering Enquiry Form */}
                <div className="lg:col-span-5">
                  <div className="h-full rounded-xl border border-[#D4A853]/20 bg-[#180E0F] p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#D4A853]">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span>Instant Phone or Message Request</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-[#FAF6F0]">
                      Enquire About a Table or Takeaway
                    </h3>
                    <p className="mt-2 text-sm text-[#B8ABA4]">
                      For immediate seating or same-day Weekend Specials, calling{' '}
                      <a
                        href={RESTAURANT_INFO.phoneHref}
                        className="font-semibold text-[#E8C67A] underline"
                      >
                        {RESTAURANT_INFO.phoneDisplay}
                      </a>{' '}
                      is fastest.
                    </p>

                    {enquirySubmitted ? (
                      <div className="mt-8 rounded-lg border border-[#D4A853]/35 bg-[#120B0B] p-6">
                        <div className="flex items-center gap-2.5 text-[#E8C67A]">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                          <h4 className="font-display text-xl font-semibold text-[#FAF6F0]">
                            Enquiry Prepared for {enquiryName}
                          </h4>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[#D6CBC3]">
                          Party of {enquiryGuests}
                          {enquiryDateTime ? ` · ${enquiryDateTime}` : ''}. To confirm
                          immediately with our front desk in Barking, tap below to place a
                          quick call.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={RESTAURANT_INFO.phoneHref}
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#9B1B20] px-5 py-2.5 text-sm font-semibold text-[#FAF6F0] hover:bg-[#B22228]"
                          >
                            <Phone className="h-4 w-4 text-[#E8C67A]" aria-hidden="true" />
                            <span>Call {RESTAURANT_INFO.phoneDisplay}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEnquirySubmitted(false);
                              setEnquiryName('');
                              setEnquiryPhone('');
                              setEnquiryDateTime('');
                              setEnquiryNotes('');
                            }}
                            className="inline-flex min-h-[44px] items-center rounded-md border border-[#D4A853]/30 px-4 py-2 text-sm font-medium text-[#D6CBC3] hover:text-[#FAF6F0]"
                          >
                            New Enquiry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleEnquirySubmit} noValidate className="mt-6 space-y-4">
                        <div>
                          <label
                            htmlFor="enquiry-name"
                            className="block text-xs font-medium text-[#D6CBC3]"
                          >
                            Full Name *
                          </label>
                          <input
                            id="enquiry-name"
                            type="text"
                            required
                            value={enquiryName}
                            onChange={(e) => setEnquiryName(e.target.value)}
                            placeholder="e.g. Tariq Mahmood"
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#D4A853]/20 bg-[#120B0B] px-3.5 text-sm text-[#FAF6F0] placeholder:text-[#7D6E67] focus:border-[#D4A853] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="enquiry-phone"
                            className="block text-xs font-medium text-[#D6CBC3]"
                          >
                            Phone Number *
                          </label>
                          <input
                            id="enquiry-phone"
                            type="tel"
                            required
                            value={enquiryPhone}
                            onChange={(e) => setEnquiryPhone(e.target.value)}
                            placeholder="+44 7..."
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#D4A853]/20 bg-[#120B0B] px-3.5 text-sm text-[#FAF6F0] placeholder:text-[#7D6E67] focus:border-[#D4A853] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="enquiry-guests"
                              className="block text-xs font-medium text-[#D6CBC3]"
                            >
                              Guests
                            </label>
                            <select
                              id="enquiry-guests"
                              value={enquiryGuests}
                              onChange={(e) => setEnquiryGuests(e.target.value)}
                              className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#D4A853]/20 bg-[#120B0B] px-3 text-sm text-[#FAF6F0] focus:border-[#D4A853] focus:outline-none"
                            >
                              <option value="2">2 Guests</option>
                              <option value="4">4 Guests</option>
                              <option value="6">6 Guests</option>
                              <option value="8">8 Guests</option>
                              <option value="10+">10+ Group</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="enquiry-when"
                              className="block text-xs font-medium text-[#D6CBC3]"
                            >
                              Preferred Day / Time
                            </label>
                            <input
                              id="enquiry-when"
                              type="text"
                              value={enquiryDateTime}
                              onChange={(e) => setEnquiryDateTime(e.target.value)}
                              placeholder="Sun 10:30 AM"
                              className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#D4A853]/20 bg-[#120B0B] px-3 text-sm text-[#FAF6F0] placeholder:text-[#7D6E67] focus:border-[#D4A853] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="enquiry-notes"
                            className="block text-xs font-medium text-[#D6CBC3]"
                          >
                            Special Requests (Weekend Specials, Allergies)
                          </label>
                          <textarea
                            id="enquiry-notes"
                            rows={3}
                            value={enquiryNotes}
                            onChange={(e) => setEnquiryNotes(e.target.value)}
                            placeholder="Let us know if you are coming for Halwa Puri, Nihari, or family grill platters."
                            className="mt-1.5 w-full rounded-md border border-[#D4A853]/20 bg-[#120B0B] p-3 text-sm text-[#FAF6F0] placeholder:text-[#7D6E67] focus:border-[#D4A853] focus:outline-none"
                          />
                        </div>

                        {enquiryError && (
                          <p role="alert" className="text-xs font-medium text-amber-300">
                            {enquiryError}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="min-h-[46px] w-full rounded-md bg-[#D4A853] px-5 py-3 text-sm font-semibold text-[#120B0B] transition-colors duration-150 hover:bg-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF6F0]"
                        >
                          Prepare Enquiry
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#D4A853]/20 bg-[#0D0707] py-12 text-[#B8ABA4]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 pb-10 md:grid-cols-3">
              <div>
                <p className="font-display text-2xl font-semibold text-[#FAF6F0]">
                  {RESTAURANT_INFO.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#A89A91]">
                  {RESTAURANT_INFO.cuisine}. Serving Barking and East London with fresh
                  charcoal grills, slow-simmered curries, and weekend classics.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#D4A853]">Location &amp; Contact</p>
                <p className="mt-2.5 text-sm text-[#E3D9D1]">{RESTAURANT_INFO.fullAddress}</p>
                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="mt-1.5 inline-block text-sm font-semibold text-[#FAF6F0] tabular-nums hover:text-[#E8C67A]"
                >
                  {RESTAURANT_INFO.phoneDisplay}
                </a>
                <p className="mt-2 text-xs text-[#A89A91]">
                  Mon–Sat: 12:00 PM – 12:00 AM · Sun: 9:00 AM – 12:00 AM
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-xs font-semibold text-[#D4A853]">Quick Navigation</p>
                <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
                  <a href="#about" className="hover:text-[#E8C67A]">
                    About
                  </a>
                  <a href="#specials" className="hover:text-[#E8C67A]">
                    Specials
                  </a>
                  <a href="#menu" className="hover:text-[#E8C67A]">
                    Menu
                  </a>
                  <a href="#gallery" className="hover:text-[#E8C67A]">
                    Gallery
                  </a>
                  <a href="#visit" className="hover:text-[#E8C67A]">
                    Visit
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-3 border-t border-[#D4A853]/15 pt-6 text-xs text-[#9C8E86] sm:flex-row sm:items-center">
              <p>
                © {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
              </p>

              <p>
                Built and designed by{' '}
                <a
                  href={RESTAURANT_INFO.portfolio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#E8C67A] underline decoration-[#D4A853]/50 underline-offset-4 transition-colors hover:text-[#FAF6F0]"
                >
                  <span>{RESTAURANT_INFO.portfolio.agency}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
        </footer>

        <GalleryModal
          photos={GALLERY_PHOTOS}
          activeIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
          onSelectIndex={setGalleryIndex}
        />
      </div>
    </MotionConfig>
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return mainContent;
  }

  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      language="en"
      region="GB"
      libraries={['places', 'marker']}
    >
      <PlaceVerifier onVerified={handleVerifiedPlace} />
      {mainContent}
    </APIProvider>
  );
}
