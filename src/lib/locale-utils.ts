/**
 * Mapping of locales to country codes and names
 */
export const localeToCountry: Record<string, { code: string; name: string }> = {
  ja: { code: 'JP', name: 'Japan' },
  en: { code: 'US', name: 'United States' },
  ko: { code: 'KR', name: 'South Korea' },
}

/**
 * Get country info from locale
 */
export function getCountryFromLocale(locale: string): { code: string; name: string } {
  return localeToCountry[locale] || localeToCountry.en
}

/**
 * Get country name for display (localized)
 */
export const countryNames: Record<string, Record<string, string>> = {
  JP: {
    en: 'Japan',
    ja: '日本',
    ko: '일본',
  },
  US: {
    en: 'United States',
    ja: 'アメリカ',
    ko: '미국',
  },
  KR: {
    en: 'South Korea',
    ja: '韓国',
    ko: '한국',
  },
}

/**
 * Get localized country name
 */
export function getLocalizedCountryName(
  countryCode: string,
  locale: string
): string {
  return countryNames[countryCode]?.[locale] || countryNames[countryCode]?.en || countryCode
}
