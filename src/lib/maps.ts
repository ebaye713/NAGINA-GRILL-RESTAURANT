declare const __GOOGLE_MAPS_API_KEY__: string | undefined;

export const GOOGLE_MAPS_API_KEY: string =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '') ||
  '';

export interface VerifiedReview {
  authorName: string;
  authorUri: string | null;
  rating: number;
  relativeTime: string;
  text: string;
  googleMapsUri: string | null;
}

export interface VerifiedPlaceInfo {
  status: 'idle' | 'loading' | 'verified' | 'unavailable';
  placeId?: string;
  displayName?: string;
  formattedAddress?: string;
  location?: google.maps.LatLngLiteral;
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsUri?: string | null;
  reviews: VerifiedReview[];
}

export const GOOGLE_MAPS_SEARCH_URL =
  'https://www.google.com/maps/search/?api=1&query=Nagina+Grill+%26+Restaurant+93+Longbridge+Road+Barking+IG11+8TB';

export const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Nagina+Grill+%26+Restaurant+93+Longbridge+Road+Barking+IG11+8TB';
