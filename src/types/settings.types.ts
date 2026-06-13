// Store-wide settings that are safe to expose to the public storefront.
// Currency is configuration (not hardcoded) so it can be changed by an admin
// without any code change. Amounts are plain numbers in the store currency.
export type PublicSettings = {
  currencyCode: string;
  currencyLocale: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
};
