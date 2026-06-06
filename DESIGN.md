---
name: Nourish & Gather
colors:
  surface: '#fdf9f3'
  surface-dim: '#dddad4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#56423c'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#8a726b'
  outline-variant: '#ddc0b8'
  surface-tint: '#a0401f'
  primary: '#9d3e1d'
  on-primary: '#ffffff'
  primary-container: '#bd5533'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#815600'
  on-secondary: '#ffffff'
  secondary-container: '#fec166'
  on-secondary-container: '#764e00'
  tertiary: '#486347'
  on-tertiary: '#ffffff'
  tertiary-container: '#607c5e'
  on-tertiary-container: '#f7fff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#802909'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#f7bc61'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ccebc7'
  tertiary-fixed-dim: '#b0cfad'
  on-tertiary-fixed: '#07200b'
  on-tertiary-fixed-variant: '#334d33'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality is rooted in homemade food made practical: the relief of having real, comforting meals ready in the freezer. It is charming, dependable, and deeply human. The target audience includes busy professionals and families who value quality ingredients, homestyle cooking, freezer-ready convenience, and a frictionless ordering experience.

The design style is **Modern Organic**. It prioritizes generous whitespace and a soft, approachable aesthetic that avoids the coldness of traditional tech platforms. Soft shadows and organic curves create a digital environment that feels as welcoming as a neighborhood kitchen while still supporting efficient catalog browsing, checkout, and delivery tracking.

## Colors

The palette is inspired by natural ingredients, warm kitchens, and dependable freezer storage.

- **Primary (Terracotta):** Used for primary actions and brand moments. It evokes appetite, warmth, and homestyle comfort.
- **Secondary (Soft Amber):** Used for highlights, ratings, promotional tags, and batch-drop moments.
- **Tertiary (Sage Green):** Used for dietary indicators, freezer-ready tags, cold delivery states, and success states.
- **Neutral (Cream):** The foundation of the design system. It replaces harsh whites to reduce eye strain and provide a cozy, paper-like background.
- **Text & Accents:** Deep charcoal is used for text to maintain high legibility against the cream background without the jarring contrast of pure black.

## Typography

This design system uses a tiered typographic scale to balance charm with functional clarity.

**Quicksand** is reserved for headlines and hero moments. Its rounded terminals mirror the soft shapes used throughout the UI, reinforcing the friendly brand voice.

**Be Vietnam Pro** is used for all functional text, including body copy and labels. Its contemporary grotesque structure ensures high legibility during browsing, checkout, and order tracking. Avoid over-using bold weights in body copy; use hierarchy through size and color instead.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile devices.

- **Generous Margins:** Desktop layouts use a significant side margin (64px) to keep content focused and premium.
- **Rhythm:** An 8px linear scale governs all padding and margins.
- **Content-First:** Frozen meal categories and catalog listings use flexible CSS grids to support image-led browsing and quick comparison.
- **Safe Areas:** On mobile, critical navigation and checkout actions keep ample padding to accommodate thumb-reach zones.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and tonal layering.

- **Surface Levels:** The base layer is Neutral Cream. Elevated cards use a pure white background to subtly pop against the cream.
- **Shadow Profile:** Shadows are extremely soft, using a deep terracotta or warm grey tint rather than pure black.
- **Interactive Depth:** On hover, cards should lift slightly to provide tactile feedback.
- **Modals:** Use a heavy backdrop blur with a warm-grey overlay to keep focus on the ordering task while maintaining the site's context.

## Shapes

The shape language is defined by rounded, organic forms.

- **Base Radius:** A 0.5rem (8px) radius is the standard for small elements like input fields and small buttons.
- **Large Radius:** Food cards and containers use a 1rem (16px) radius to emphasize the soft brand personality.
- **Icons:** Use rounded icon sets with a consistent 2px stroke weight to match the typography's visual weight.
- **Images:** Food photography should have rounded corners; sharp edges are avoided in this design system.

## Components

- **Buttons:** Primary buttons use Terracotta with white text and slightly larger padding for a touchable appearance.
- **Chips:** Used for frozen food filters and tags such as "Vegan," "Gluten-Free," and "Freezer Ready."
- **Input Fields:** Inputs use a soft cream fill with a subtle 1px border that darkens on focus.
- **Cards:** Food cards feature a full-bleed image at the top, followed by a padded section for titles, freezer details, price, and tags.
- **Progress Bars:** Use Sage Green or Amber to indicate checkout, packing, cold delivery, and delivered states.
- **Quantity Pickers:** Pill-shaped controls with large touch targets support easy freezer stock-up ordering.
