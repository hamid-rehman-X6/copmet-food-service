// Currency-agnostic money formatting.
//
// All amounts in the app are plain numbers in the store currency. The currency
// code/locale come from admin-configurable settings, so switching currencies
// (e.g. PKR -> USD) only changes how the same number is displayed — there is no
// conversion and no code change required.

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currencyCode: string, locale: string) {
  const cacheKey = `${locale}:${currencyCode}`;
  let formatter = formatterCache.get(cacheKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    });
    formatterCache.set(cacheKey, formatter);
  }

  return formatter;
}

/** Format an amount as currency using the provided code/locale. */
export function formatMoney(amount: number, currencyCode: string, locale: string) {
  return getFormatter(currencyCode, locale).format(amount);
}
