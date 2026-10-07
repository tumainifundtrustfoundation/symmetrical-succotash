/**
 * ============================================================================
 * UOMBONI SECONDARY SCHOOL — OFFICIAL GOOGLE MAPS CONFIGURATION
 * ============================================================================
 * 
 * If you have a specific Google Maps Place ID, short link (e.g. goo.gl/maps/...),
 * or custom embed iframe URL provided directly by Google Business Profile,
 * insert or update the configuration variables below.
 * 
 * The default configuration uses the authenticated location query for:
 * "Uomboni Secondary School, Marangu, Moshi, Tanzania"
 * with geographical coordinates -3.25685° S, 37.48725° E (Marangu Magharibi).
 */

export interface SchoolLocationConfig {
  schoolName: string;
  campusName: string;
  wardAndDistrict: string;
  regionAndCountry: string;
  postalAddress: string;
  fullAddressString: string;
  formattedFooterLocation: {
    line1: string;
    line2: string;
  };
  contactPhones: {
    primary: string;
    primaryFormatted: string;
    headmaster: string;
    secondMaster: string;
  };
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
    dms: string; // Degrees, minutes, seconds
  };
  // URLs for interactive maps
  officialGoogleMapsUrl: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl: string;
  // Optional custom Place ID or Business Profile URL if provided by administration
  customGoogleMapsPlaceUrl?: string;
  customGoogleMapsPlaceId?: string;
}

export const UOMBONI_LOCATION_CONFIG: SchoolLocationConfig = {
  schoolName: 'Uomboni Secondary School',
  campusName: 'Uomboni Campus',
  wardAndDistrict: 'Marangu Magharibi, Moshi Rural',
  regionAndCountry: 'Kilimanjaro Region, Tanzania',
  postalAddress: 'P.O. Box 361, Marangu-Moshi, Tanzania',
  fullAddressString: 'Uomboni Secondary School, Marangu, Moshi, Tanzania',
  formattedFooterLocation: {
    line1: 'Uomboni Secondary School',
    line2: 'Marangu, Moshi, Tanzania',
  },
  contactPhones: {
    primary: '0767 207 688',
    primaryFormatted: '+255 767 207 688',
    headmaster: '+255 782 558 127',
    secondMaster: '+255 754 532 949',
  },
  email: 'uombonisecondary@gmail.com',
  coordinates: {
    latitude: -3.25685,
    longitude: 37.48725,
    dms: "3° 15' 25\" S, 37° 29' 14\" E",
  },
  // Official search link opening Google Maps focused directly on Uomboni Secondary School
  officialGoogleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Uomboni+Secondary+School,+Marangu,+Moshi,+Tanzania',
  // Official direct turn-by-turn navigation / directions link
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Uomboni+Secondary+School,+Marangu,+Moshi,+Tanzania',
  // High-performance clean responsive iframe embed without external API key requirement
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Uomboni+Secondary+School,+Marangu,+Moshi,+Tanzania&t=&z=15&ie=UTF8&iwloc=&output=embed',
  // Placeholders for future custom Google Business Profile links if available:
  customGoogleMapsPlaceUrl: '',
  customGoogleMapsPlaceId: '',
};

/**
 * Returns the best Google Maps URL to view the school location.
 * Prioritizes custom place URL if configured, otherwise uses the official query.
 */
export function getSchoolMapUrl(): string {
  if (UOMBONI_LOCATION_CONFIG.customGoogleMapsPlaceUrl?.trim()) {
    return UOMBONI_LOCATION_CONFIG.customGoogleMapsPlaceUrl.trim();
  }
  return UOMBONI_LOCATION_CONFIG.officialGoogleMapsUrl;
}

/**
 * Returns the best directions URL to navigate to the school.
 */
export function getSchoolDirectionsUrl(): string {
  return UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl;
}

/**
 * Returns the embed URL for displaying the interactive Google Map in an iframe.
 */
export function getSchoolMapEmbedUrl(): string {
  return UOMBONI_LOCATION_CONFIG.googleMapsEmbedUrl;
}
