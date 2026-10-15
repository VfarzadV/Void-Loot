import { getRequestConfig } from "next-intl/server";

const locales = ["en", "fa"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const baseLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : "en";
  return {
    locale: baseLocale,
    messages: (await import(`../messages/${baseLocale}.json`)).default,
  };
});
