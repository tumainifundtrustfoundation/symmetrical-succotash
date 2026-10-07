/**
 * OFFICIAL UOMBONI SECONDARY SCHOOL — GOOGLE MAPS CONFIGURATION
 * ==============================================================
 * This configuration file centrally manages the official Google Maps
 * coordinates, embed URLs, and navigation links for Uomboni Secondary School
 * located in Marangu, Moshi Rural, Kilimanjaro, Tanzania.
 *
 * TO UPDATE WITH A CUSTOM GOOGLE BUSINESS PLACE ID OR SHORTLINK:
 * Simply replace the `embedUrl`, `googleMapsUrl`, or `directionsUrl` below.
 */

export interface SchoolMapConfig {
  schoolName: string;
  campusLabel: string;
  subtitle: string;
  locationLine1: string;
  locationLine2: string;
  districtRegion: string;
  poBox: string;
  openLocationCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  primaryPhone: string;
  secondaryPhone: string;
  academicPhone: string;
  email: string;
  secondaryEmail: string;
  embedUrl: string;
  googleMapsUrl: string;
  directionsUrl: string;
}

export const UOMBONI_MAP_CONFIG: SchoolMapConfig = {
  // Official Institution Branding
  schoolName: 'Uomboni Secondary School',
  campusLabel: 'Uomboni Secondary School Campus',
  subtitle: 'Visit us at our school campus in Marangu, Moshi.',

  // Exact Physical Location
  locationLine1: 'Uomboni Secondary School',
  locationLine2: 'Marangu, Moshi, Tanzania',
  districtRegion: 'Marangu Magharibi, Moshi Rural District, Kilimanjaro Region',
  poBox: 'P.O. Box 273, Moshi, Tanzania',
  openLocationCode: '6G8VPFVP+7W (Marangu)',

  // Geographical Coordinates (Marangu Magharibi, Slopes of Mt. Kilimanjaro)
  coordinates: {
    lat: -3.25685,
    lng: 37.48725,
  },

  // Official Institutional Contact Lines
  primaryPhone: '+255 782 558 127',
  secondaryPhone: '+255 754 532 949',
  academicPhone: '+255 745 548 225',
  email: 'uombonisec@gmail.com',
  secondaryEmail: 'info@uombonisec.ac.tz',

  /**
   * Official Google Maps Embed Iframe URL
   * Real location: Uomboni Secondary School, Marangu, Moshi, Tanzania
   */
  embedUrl:
    'https://maps.google.com/maps?q=-3.25685,37.48725+(Uomboni+Secondary+School)&t=&z=15&ie=UTF8&iwloc=B&output=embed',

  /**
   * "Open in Google Maps" Direct Link
   * Opens the real location in Google Maps on Web, Android, or iOS
   */
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=-3.25685,37.48725+(Uomboni+Secondary+School+Marangu+Moshi)',

  /**
   * "Get Directions" Direct Navigation Link
   * Directly initiates turn-by-turn navigation or route planning to Uomboni Secondary School
   */
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-3.25685,37.48725+(Uomboni+Secondary+School+Marangu+Moshi)',
};

export default UOMBONI_MAP_CONFIG;
