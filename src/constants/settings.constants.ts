// Common currency presets for the admin settings page. Selecting one sets both
// the ISO currency code and a sensible display locale. Switching currency is a
// pure admin action — no code changes and no amount conversion.
export const currencyPresets: { label: string; code: string; locale: string }[] = [
  { label: "Pakistani Rupee (PKR)", code: "PKR", locale: "en-PK" },
  { label: "US Dollar (USD)", code: "USD", locale: "en-US" },
  { label: "Euro (EUR)", code: "EUR", locale: "en-IE" },
  { label: "British Pound (GBP)", code: "GBP", locale: "en-GB" },
  { label: "UAE Dirham (AED)", code: "AED", locale: "en-AE" },
  { label: "Saudi Riyal (SAR)", code: "SAR", locale: "en-SA" },
];
