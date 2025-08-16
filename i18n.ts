
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

// Wersja "server-side" – importuje pliki JSON z tłumaczeniami
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
