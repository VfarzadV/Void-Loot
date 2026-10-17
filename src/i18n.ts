import { getRequestConfig } from "next-intl/server";

const locales = ["en", "fa"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const baseLocale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : "en";

  return {
    locale: baseLocale,
    messages: (await import(`../messages/${baseLocale}.json`)).default,
  };
});
