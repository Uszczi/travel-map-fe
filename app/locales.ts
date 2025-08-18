export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];
