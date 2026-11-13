import {ExternalLink, Star} from 'lucide-react';
import {RESTAURANT_INFO} from '../data/restaurant';
import {GOOGLE_MAPS_SEARCH_URL, type VerifiedPlaceInfo} from '../lib/maps';

interface ReviewsSectionProps {
  placeInfo: VerifiedPlaceInfo;
}

function StarRow({rating}: {rating: number}) {
  const filledCount = Math.round(rating);
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({length: 5}).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < filledCount
              ? 'fill-[#D4A853] text-[#D4A853]'
              : 'fill-transparent text-[#D4A853]/30'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReviewsSection({placeInfo}: ReviewsSectionProps) {
  const isVerified =
    placeInfo.status === 'verified' && typeof placeInfo.rating === 'number';
  const displayRating = isVerified
    ? placeInfo.rating!.toFixed(1)
    : RESTAURANT_INFO.reportedRating.toFixed(1);
  const mapsReviewsHref = placeInfo.googleMapsUri || GOOGLE_MAPS_SEARCH_URL;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="border-t border-[#D4A853]/15 bg-[#170D0E] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-[#D4A853]/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D4A853]">Guest Reputation</p>
            <h2
              id="reviews-heading"
              className="mt-2 font-display text-3xl font-semibold text-[#FAF6F0] text-balance sm:text-4xl"
            >
              Customer Reviews in Barking
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-semibold text-[#E8C67A] tabular-nums">
                {displayRating}
              </span>
              <div>
                <StarRow rating={Number(displayRating)} />
                <p className="mt-1 text-xs text-[#B8ABA4] tabular-nums">
                  {isVerified
                    ? `Verified via Google Places${
                        placeInfo.userRatingCount
                          ? ` · ${placeInfo.userRatingCount} Google reviews`
                          : ''
                      }`
                    : 'Reported 4.5 ★ rating · Verify live on Google Maps'}
                </p>
              </div>
            </div>

            <a
              href={mapsReviewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#D4A853]/35 px-4 py-2 text-sm font-medium text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#D4A853] hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
            >
              <span>Verify Reviews on Google</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {placeInfo.status === 'loading' && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[0, 1].map((slot) => (
              <div
                key={slot}
                className="h-40 animate-pulse rounded-xl border border-[#D4A853]/15 bg-[#1E1213] p-6"
              />
            ))}
          </div>
        )}

        {placeInfo.status === 'verified' && placeInfo.reviews.length > 0 && (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {placeInfo.reviews.map((review, idx) => (
                <article
                  key={`${review.authorName}-${idx}`}
                  className="flex flex-col justify-between rounded-xl border border-[#D4A853]/15 bg-[#1E1213] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <StarRow rating={review.rating} />
                      <span className="text-xs text-[#A89A91]">{review.relativeTime}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#E5DBD3]">
                      “{review.text}”
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#D4A853]/10 pt-4 text-xs">
                    <span className="font-semibold text-[#FAF6F0]">
                      {review.authorName}
                    </span>
                    {review.googleMapsUri && (
                      <a
                        href={review.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D4A853] hover:underline"
                      >
                        Google Review
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs text-[#A89A91]">
              Ratings and guest reviews provided live by Google Places.
            </p>
          </>
        )}

        {placeInfo.status !== 'loading' && placeInfo.reviews.length === 0 && (
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-[#D4A853]/20 bg-[#1E1213] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl font-semibold text-[#FAF6F0]">
                Live Google Reviews Verification
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C9BEB6]">
                Nagina Grill &amp; Restaurant holds a reported 4.5-star local reputation on
                Longbridge Road. Open our official Google Maps listing to read current
                customer reviews and dining photos directly from guests.
              </p>
            </div>
            <a
              href={mapsReviewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#9B1B20] px-5 py-2.5 text-sm font-semibold text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B22228] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
            >
              <span>Read Google Reviews</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
