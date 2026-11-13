import {useCallback, useEffect, useState} from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {ExternalLink, MapPin, Navigation, Phone} from 'lucide-react';
import {RESTAURANT_INFO} from '../data/restaurant';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_DIRECTIONS_URL,
  GOOGLE_MAPS_SEARCH_URL,
  type VerifiedPlaceInfo,
  type VerifiedReview,
} from '../lib/maps';

interface PlaceVerifierProps {
  onVerified: (info: VerifiedPlaceInfo) => void;
}

export function PlaceVerifier({onVerified}: PlaceVerifierProps) {
  const placesLib = useMapsLibrary('places');
  const loadingStatus = useApiLoadingStatus();

  useEffect(() => {
    if (
      loadingStatus === APILoadingStatus.FAILED ||
      loadingStatus === APILoadingStatus.AUTH_FAILURE
    ) {
      onVerified({status: 'unavailable', reviews: []});
      return;
    }

    if (!placesLib) return;

    let cancelled = false;

    const verifyPlace = async () => {
      onVerified({status: 'loading', reviews: []});

      try {
        const {places} = await placesLib.Place.searchByText({
          textQuery: `${RESTAURANT_INFO.name}, ${RESTAURANT_INFO.fullAddress}`,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'reviews',
            'googleMapsURI',
          ],
          maxResultCount: 1,
          region: 'GB',
          language: 'en',
        });

        if (cancelled) return;

        const match = places?.[0];
        if (!match) {
          onVerified({status: 'unavailable', reviews: []});
          return;
        }

        const loc = match.location
          ? {lat: match.location.lat(), lng: match.location.lng()}
          : undefined;

        const reviews: VerifiedReview[] = (match.reviews ?? [])
          .filter((rev) => Boolean(rev.text || rev.originalText))
          .slice(0, 4)
          .map((rev) => ({
            authorName: rev.authorAttribution?.displayName || 'Google Guest',
            authorUri: rev.authorAttribution?.uri ?? null,
            rating: rev.rating ?? 5,
            relativeTime: rev.relativePublishTimeDescription || 'Recent review',
            text: rev.text || rev.originalText || '',
            googleMapsUri: rev.googleMapsURI ?? null,
          }));

        onVerified({
          status: 'verified',
          placeId: match.id,
          displayName: match.displayName ?? RESTAURANT_INFO.name,
          formattedAddress: match.formattedAddress ?? RESTAURANT_INFO.fullAddress,
          location: loc,
          rating: match.rating ?? null,
          userRatingCount: match.userRatingCount ?? null,
          googleMapsUri: match.googleMapsURI ?? null,
          reviews,
        });
      } catch (err) {
        const errText = err instanceof Error ? err.message : String(err);
        if (errText.includes('RESOURCE_EXHAUSTED') || errText.includes('OVER_QUERY_LIMIT')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          onVerified({status: 'unavailable', reviews: []});
        }
      }
    };

    void verifyPlace();

    return () => {
      cancelled = true;
    };
  }, [placesLib, loadingStatus, onVerified]);

  return null;
}

interface NaginaLocationMapProps {
  placeInfo: VerifiedPlaceInfo;
  quotaExceeded: boolean;
}

export function NaginaLocationMap({placeInfo, quotaExceeded}: NaginaLocationMapProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const loadingStatus = useApiLoadingStatus();

  const handleCloseInfo = useCallback(() => {
    setInfoOpen(false);
  }, []);

  const showInteractiveMap =
    Boolean(GOOGLE_MAPS_API_KEY) &&
    !quotaExceeded &&
    loadingStatus !== APILoadingStatus.FAILED &&
    loadingStatus !== APILoadingStatus.AUTH_FAILURE &&
    placeInfo.status === 'verified' &&
    Boolean(placeInfo.location);

  if (showInteractiveMap && placeInfo.location) {
    return (
      <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#D4A853]/25 bg-[#160D0D]">
        <GoogleMap
          defaultCenter={placeInfo.location}
          defaultZoom={16}
          mapId="DEMO_MAP_ID"
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{width: '100%', height: '100%'}}
        >
          <AdvancedMarker
            ref={markerRef}
            position={placeInfo.location}
            title={placeInfo.displayName || RESTAURANT_INFO.name}
            onClick={() => setInfoOpen(true)}
          >
            <div className="flex items-center gap-1.5 rounded-md border border-[#E8C67A] bg-[#9B1B20] px-2.5 py-1.5 text-xs font-semibold text-[#FAF6F0] shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-[#E8C67A]" aria-hidden="true" />
              <span>Nagina Grill</span>
            </div>
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow anchor={marker} onCloseClick={handleCloseInfo} maxWidth={260}>
              <div className="p-1 text-[#1A1110]">
                <p className="font-semibold text-[#9B1B20]">
                  {placeInfo.displayName || RESTAURANT_INFO.name}
                </p>
                <p className="mt-1 text-xs text-[#4A3B36]">
                  {placeInfo.formattedAddress || RESTAURANT_INFO.fullAddress}
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-xs font-medium">
                  <a
                    href={placeInfo.googleMapsUri || GOOGLE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9B1B20] underline hover:text-[#7F1418]"
                  >
                    Directions
                  </a>
                  <a
                    href={RESTAURANT_INFO.phoneHref}
                    className="text-[#1A1110] underline hover:text-[#9B1B20]"
                  >
                    Call Restaurant
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    );
  }

  const isLoading =
    Boolean(GOOGLE_MAPS_API_KEY) &&
    !quotaExceeded &&
    (placeInfo.status === 'idle' || placeInfo.status === 'loading') &&
    loadingStatus !== APILoadingStatus.FAILED &&
    loadingStatus !== APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="flex h-[420px] w-full flex-col justify-between rounded-xl border border-[#D4A853]/25 bg-gradient-to-br from-[#201112] via-[#170D0E] to-[#120B0B] p-6 sm:p-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#D4A853]">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{isLoading ? 'Loading Interactive Map...' : 'Barking Town Centre Location'}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl font-semibold text-[#FAF6F0]">
          {RESTAURANT_INFO.name}
        </h3>
        <p className="mt-2 text-base text-[#D6CBC3]">{RESTAURANT_INFO.fullAddress}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#A89A91]">
          Located on Longbridge Road in Barking, minutes from Barking Station (District,
          Hammersmith &amp; City, Overground, and c2c lines).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={placeInfo.googleMapsUri || GOOGLE_MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#D4A853] px-5 py-2.5 text-sm font-semibold text-[#120B0B] transition-colors duration-150 hover:bg-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF6F0]"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          <span>Get Directions</span>
        </a>

        <a
          href={GOOGLE_MAPS_SEARCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#D4A853]/35 px-4 py-2.5 text-sm font-medium text-[#FAF6F0] transition-colors duration-150 hover:border-[#D4A853] hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
        >
          <span>Open Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <a
          href={RESTAURANT_INFO.phoneHref}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#9B1B20] bg-[#9B1B20]/20 px-4 py-2.5 text-sm font-medium text-[#FAF6F0] transition-colors duration-150 hover:bg-[#9B1B20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
        >
          <Phone className="h-3.5 w-3.5 text-[#E8C67A]" aria-hidden="true" />
          <span>{RESTAURANT_INFO.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
