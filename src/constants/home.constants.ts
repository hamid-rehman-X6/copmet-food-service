export const homeHero = {
  title: "Handcrafted meals, delivered with heart.",
  copy: "Bringing the warmth of a shared kitchen to your home. Quality ingredients, chef-prepared recipes, and effortless dining for those you love.",
  image: {
    src: "/images/home-page/hero-section-img-3.png",
    alt: "A warm overhead dining table with handcrafted dishes, salads, breads, and soft cream linens.",
  },
};

export const featuredMeals = [
  {
    id: "beef",
    title: "Rustic Slow-Roasted Beef",
    description: "Feeds a family of four. Hearty, tender, and deeply flavorful.",
    label: "Bestseller",
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
    title: "Seasonal Harvest Bowl",
    description: "Roasted sweet potatoes, chickpeas, kale, and tahini.",
    label: "Vegan",
    priceLabel: "Gluten-Free",
    image: {
      src: "/images/home-page/harvest-bowl-img.png",
      alt: "Harvest bowl with greens, chickpeas, and roasted sweet potatoes.",
    },
    size: "wide",
  },
  {
    id: "bread",
    title: "Artisan Sourdough",
    description: "Naturally leavened and baked until golden.",
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
    title: "Dark Chocolate Torte",
    description: "A rich finish with raspberries and cream.",
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
    title: "Choose Your Feast",
    description: "Select from our seasonal menu of family-style meals and artisan sides.",
    icon: "book",
    highlighted: false,
  },
  {
    title: "We Cook with Care",
    description: "Our chefs prepare each dish using locally sourced, premium ingredients.",
    icon: "chef",
    highlighted: true,
  },
  {
    title: "Delivered to You",
    description: "Arrives chilled with simple warming instructions for the perfect meal.",
    icon: "truck",
    highlighted: false,
  },
] as const;

export const testimonials = [
  {
    name: "Mark Thompson",
    time: "2 days ago",
    quote: "The roast chicken was incredible. It tasted exactly like what my grandmother used to make. We're hooked!",
    accent: "primary",
  },
  {
    name: "Elena Gomez",
    time: "1 week ago",
    quote: "Effortless ordering and the packaging was so eco-friendly. Perfect for our small dinner parties.",
    accent: "secondary",
  },
] as const;

export const communitySpotlight = {
  image: {
    src: "/images/home-page/community-img.png",
    alt: "A family sharing dinner around a warm table.",
  },
  quote: "Finally, a meal delivery that actually feels like a homemade dinner. The quality is unmatched.",
  author: "Sarah J., Busy Mom & Architect",
};
