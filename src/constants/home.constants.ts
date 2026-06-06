export const homeHero = {
  title: "Homemade frozen meals, ready when life gets busy.",
  copy: "Stock your freezer with small-batch comfort food made for real homes. We cook, freeze, and deliver family favorites so dinner is simple whenever you need it.",
  image: {
    src: "/images/home-page/hero-section-img-3.png",
    alt: "A warm overhead dining table with prepared dishes, salads, breads, and soft cream linens.",
  },
};

export const featuredMeals = [
  {
    id: "beef",
    title: "Slow-Roasted Beef Freezer Tray",
    description: "A hearty family-size tray, frozen fresh and ready to heat for an easy comfort dinner.",
    label: "Family Pack",
    price: 48,
    priceLabel: "$48",
    image: {
      src: "/images/home-page/beaf-steak-img.png",
      alt: "Slow-roasted beef served with carrots and mashed potatoes.",
    },
    size: "large",
  },
  {
    id: "harvest",
    title: "Vegetable Freezer Bowl",
    description: "Roasted sweet potatoes, chickpeas, kale, and tahini, packed for quick freezer-to-table meals.",
    label: "Vegan",
    priceLabel: "Freezer Ready",
    image: {
      src: "/images/home-page/harvest-bowl-img.png",
      alt: "Harvest bowl with greens, chickpeas, and roasted sweet potatoes.",
    },
    size: "wide",
  },
  {
    id: "bread",
    title: "Freezer Sourdough Loaf",
    description: "Par-baked, sliced, and ready to warm straight from your freezer.",
    label: "Side Dish",
    priceLabel: "$8",
    image: {
      src: "/images/home-page/bread-img.png",
      alt: "Artisan sourdough bread on a rustic surface.",
    },
    size: "small",
  },
  {
    id: "cake",
    title: "Frozen Chocolate Torte",
    description: "A rich dessert to keep on hand for family nights and last-minute guests.",
    label: "Dessert",
    priceLabel: "$9",
    image: {
      src: "/images/home-page/choco-strawberry-cake.png",
      alt: "Dark chocolate cake with berries.",
    },
    size: "small",
  },
] as const;

export const howItWorksSteps = [
  {
    title: "Choose Your Freezer Stock",
    description: "Pick family trays, single portions, sides, and desserts made for easy storage.",
    icon: "book",
    highlighted: false,
  },
  {
    title: "We Cook, Cool, and Freeze",
    description: "Our kitchen prepares each batch with homestyle care, then freezes it to preserve flavor.",
    icon: "chef",
    highlighted: true,
  },
  {
    title: "You Heat and Serve",
    description: "Your order arrives frozen with clear warming instructions for stress-free meals.",
    icon: "truck",
    highlighted: false,
  },
] as const;

export const testimonials = [
  {
    name: "Mark Thompson",
    time: "2 days ago",
    quote: "The frozen trays taste like someone cooked for us at home. We keep two in the freezer every week now.",
    accent: "primary",
  },
  {
    name: "Elena Gomez",
    time: "1 week ago",
    quote: "The portions are generous, the heating directions are clear, and weeknight dinners feel calm again.",
    accent: "secondary",
  },
] as const;

export const communitySpotlight = {
  image: {
    src: "/images/home-page/community-img.png",
    alt: "A family sharing dinner around a warm table.",
  },
  quote: "Finally, frozen food that still feels homemade. It saves time without tasting like a shortcut.",
  author: "Sarah J., Busy Mom and Architect",
};
