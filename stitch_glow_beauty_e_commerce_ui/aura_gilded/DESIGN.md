---
name: Aura & Gilded
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dd'
  on-secondary-container: '#656461'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#747676'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.03em
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system embodies an editorial, high-fashion aesthetic tailored for a premium beauty audience. It balances the timeless sophistication of luxury cosmetics with the modern, clean interface of a high-end boutique. 

The visual style is a blend of **Minimalism** and **Tactile Luxury**. It prioritizes generous negative space, allowing product photography to serve as the primary visual driver. Interactions should feel deliberate and smooth, evoking the sensory experience of unboxing a luxury product. The emotional response is one of aspiration, indulgence, and professional-grade quality.

## Colors
The palette is rooted in light, airy neutrals to maintain a clean "Glow" aesthetic.
- **Primary Surface:** Pure White (#FFFFFF) is used for the main background to ensure high clarity and product focus.
- **Secondary Surface:** Soft Beige (#F5F2ED) provides a subtle, warm depth for content sections and lower-hierarchy containers.
- **Accents:** Soft Pink (#F8E1E7) is used sparingly for highlights, secondary actions, and badges. Gold (#C5A059) is reserved for luxury touchpoints: iconography, premium borders, and high-tier status indicators.
- **Typography:** Deep Black (#1A1A1A) ensures maximum legibility and high-contrast impact against the light backgrounds.

## Typography
This system utilizes a classic editorial pairing to convey authority and modernity.
- **Headlines:** Uses a high-contrast serif for a magazine-like feel. Generous letter spacing (tracking) should be applied to larger displays to enhance the luxury feel.
- **Body & Labels:** A geometric sans-serif provides a functional, modern counterpoint. It ensures that technical details and ingredient lists remain highly legible even at small sizes.
- **Styling:** Use uppercase for labels and small buttons to create a structured, architectural look.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain editorial control over line lengths and image ratios. 
- **Desktop:** 12-column grid with wide 64px margins to create a "gallery" feel.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** Use a strict 8px baseline. Vertical spacing between sections should be intentionally large (120px+) to allow the design to "breathe," preventing a cluttered, discount-retailer appearance.
- **Alignment:** Content should predominantly be center-aligned for high-level marketing sections and left-aligned for functional shopping areas.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.
- **Surfaces:** Use the Soft Beige background to distinguish product cards from the pure white background.
- **Borders:** Instead of shadows, use 1px solid lines in very light grey or the Gold accent color to define boundaries.
- **Depth:** When shadows are necessary (e.g., modals), use a "Whisper Shadow": highly diffused (30px+ blur), low opacity (4%), with a slight warm tint to match the beige palette. This keeps the interface feeling light and ethereal.

## Shapes
The shape language is **Soft** and restrained. 
- Elements use a subtle 4px radius (Soft) to take the edge off sharp corners without becoming too "bubbly" or playful. 
- Buttons and form inputs should maintain this consistent small radius to look professional and structured.
- Product imagery should remain sharp-cornered (0px) to mimic high-fashion photography prints.

## Components
- **Buttons:** Primary buttons are solid Black with White text, using `label-caps` typography. Secondary buttons use a Gold 1px border with no fill.
- **Product Cards:** Use a minimal style. A solid Soft Beige background for the image area, with typography strictly aligned below. No heavy borders; use whitespace to define the card area.
- **Input Fields:** Bottom-border only (underlined style) for a more elegant, less boxy look. Labels should be floating and use the `label-caps` style.
- **Chips/Badges:** Small, pill-shaped with a Soft Pink background and Deep Black text for "New" or "Trending" items.
- **Lists:** Product ingredient lists or benefit lists should use the Gold accent for bullet points or icons to signal premium value.
- **Navigation:** A minimal, centered top-bar navigation with high letter spacing on links. Use a "ghost" header that turns solid white upon scroll.