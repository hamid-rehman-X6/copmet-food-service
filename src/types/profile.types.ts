// A customer's saved default delivery details, used to pre-fill checkout so
// they don't re-type the same information on every order. All fields are
// optional — the customer can save as much or as little as they like.
export type DeliveryDefaults = {
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  instructions: string | null;
};
