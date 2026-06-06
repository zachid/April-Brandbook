# April — Design System

**April** is a Swiss International Style brand guidelines generator. The design system reflects precision, clarity, and geometric harmony.

---

## Design Philosophy

- **Structure first** — Grid systems and typography create hierarchy
- **Restraint** — Every element earns its place; no decoration without function
- **Clarity** — Dark mode optimized, high contrast, readable at any size
- **Consistency** — One typeface family, one spacing scale, one accent color
- **Left-aligned** — Text alignment respects visual hierarchy, never centered for body copy

---

## Design Tokens

### Color System

```
Primary Colors
--bg-base:     #080810  (Deep space, page background)
--bg-elevated: #0F0F1A  (Elevated surfaces, modals)
--bg-card:     #13131F  (Cards, containers)
--sidebar-bg:  #09090F  (Sidebar background)

Text Colors
--text-primary:   #F0F0FF  (Main text, 100% opacity)
--text-secondary: rgba(240,240,255,0.55)  (Secondary text, reduced emphasis)
--text-muted:     rgba(240,240,255,0.28)  (Tertiary text, hints, metadata)

Borders
--border:        rgba(255,255,255,0.06)   (Subtle dividers, 1px)
--border-medium: rgba(255,255,255,0.10)   (Standard borders)
--border-strong: rgba(255,255,255,0.18)   (Emphasis borders)

Accent Colors
--brand-accent:   #8B5CF6  (Electric violet, primary CTA, highlights)
--brand-accent-2: #06B6D4  (Cyan, secondary accent, optional)
```

### Typography

```
Font Stack
--font-sans:    'Manrope', system-ui, -apple-system, sans-serif
--font-display: 'Syne', sans-serif  (Headlines, display)
--font-mono:    'SF Mono', 'Fira Code', monospace

Font Sizes (Fluid)
Base: 16px (body text, minimum)
Scale: Major Third (1.25×)

Hierarchy
Display:    clamp(32px, 8vw, 52px)  - Page titles, hero headlines
Headline 1: 32px / font-weight: 800
Headline 2: 24px / font-weight: 700
Headline 3: 18px / font-weight: 700
Body:       16px / font-weight: 400  - Default reading size
Caption:    12px / font-weight: 500
Label:      11px / font-weight: 700  - Form labels, UI labels
```

### Spacing Scale

```
Base Unit: 4px

Spacing Scale
--sp-1:  4px    (Tight spacing, padding within elements)
--sp-2:  8px    (Small gaps, icon spacing)
--sp-3:  12px   (Micro sections, form field gaps)
--sp-4:  16px   (Standard padding, margins)
--sp-5:  20px   (Component padding)
--sp-6:  24px   (Section padding)
--sp-8:  32px   (Large sections, sidebar padding)
--sp-10: 40px   (Hero spacing)
--sp-12: 48px   (Page padding)
--sp-16: 64px   (Large whitespace)
--sp-20: 80px   (Massive whitespace)
--sp-24: 96px   (Full-page margins)
```

### Border & Radius

```
Borders
Line Weight: 1px (hairline, Swiss style)
No shadows by default

Border Radius (Minimal)
--r-sm: 6px   (Small elements only)
--r-md: 10px  (Cards, buttons in elevated context)
--r-lg: 16px  (Large modals)
--r-xl: 24px  (Oversized sections)

✓ Sharp edges preferred (border-radius: 0)
✓ Hairline borders (1px) as dividers
```

---

## Grid System

### 12-Column Grid

```
Desktop (1440px+)
- Columns: 12
- Column width: 80px
- Gutter: 24px (between columns)
- Margin: 48px (left/right page margin)

Tablet (768px—1439px)
- Columns: 8
- Column width: auto
- Gutter: 20px
- Margin: 24px

Mobile (375px—767px)
- Columns: 4
- Column width: auto
- Gutter: 16px
- Margin: 16px
```

### Sidebar Layout

```
Sidebar Width: 264px (fixed)
Content: Remaining viewport width
Ratio: ~18% sidebar, ~82% content (1440px viewport)

Mobile: Sidebar collapses or becomes drawer
```

---

## Typography System

### Font Pairing

| Role | Font | Weight | Size | Line-height | Usage |
|------|------|--------|------|-------------|-------|
| Display | Syne | 800 | 52px | 1.0 | Page titles, hero |
| Headline 1 | Manrope | 800 | 32px | 1.2 | Section titles |
| Headline 2 | Manrope | 700 | 24px | 1.3 | Subsection titles |
| Headline 3 | Manrope | 700 | 18px | 1.4 | Card titles |
| Body | Manrope | 400 | 16px | 1.6 | Default text, paragraph |
| Caption | Manrope | 500 | 12px | 1.5 | Metadata, timestamps |
| Label | Manrope | 700 | 11px | 1.4 | Form labels, tags |
| Mono | SF Mono | 400 | 13px | 1.5 | Code, data |

### Line Height & Spacing

```
Display headings: 0.95—1.0 (tight, powerful)
Headlines: 1.2—1.4 (readable, scannable)
Body text: 1.5—1.6 (comfortable reading)
Captions: 1.4—1.5 (tight, secondary)
```

---

## Component System

### Buttons

**Primary Button (CTA)**
```
Background: --brand-accent (#8B5CF6)
Color: white
Height: 44px (min touch target)
Padding: 12px 24px
Border: none
Font: 13px, weight 600, uppercase, +0.05em letter-spacing
Hover: opacity 0.9
Active: scale(0.99)
Disabled: opacity 0.5
```

**Ghost Button (Secondary)**
```
Background: transparent
Border: 1px solid --border-medium
Color: --text-secondary
Hover: border-color --border-strong, color --text-primary
```

### Forms

**Input Field**
```
Background: --bg-elevated
Border: 1px solid --border-medium
Color: --text-primary
Height: 40px
Padding: 10px 12px
Font: 13px
Focus: border-color --brand-accent
Placeholder: --text-muted
```

**Label**
```
Font: 11px, weight 700, uppercase
Color: --text-secondary
Letter-spacing: 0.08em
Margin-bottom: 6px
```

### Cards

**Standard Card**
```
Background: --bg-card
Border: 1px solid --border-medium
Padding: 24px
Border-radius: 0 (sharp)
Hover: background --bg-elevated (subtle lift)
```

**Colored Band**
```
Top border: 3px solid (brand accent)
Visual emphasis without excess decoration
```

---

## Elevation & Depth

**No shadows** — Swiss style avoids depth effects. Instead:

1. **Color contrast** — Darker background for elevation
2. **Borders** — 1px hairline dividers
3. **Whitespace** — Spacing creates separation

```
Surface 0 (base):     --bg-base
Surface 1 (elevated): --bg-elevated (+1 shade lighter)
Surface 2 (card):     --bg-card (+2 shades lighter)
Surface 3 (top):      Sidebar, modals (+3 shades lighter)
```

---

## Responsive Design

### Breakpoints

```
Mobile:     375px — 767px   (default, mobile-first)
Tablet:     768px — 1439px
Desktop:    1440px+

Media Queries
@media (min-width: 768px) { ... }
@media (min-width: 1440px) { ... }

Avoid max-width queries; use min-width mobile-first
```

### Touch Targets

```
Minimum: 44×44px (buttons, clickable elements)
Recommended: 48×48px
Safe area: 8px padding around touch targets
```

---

## Accessibility

### Color Contrast

```
WCAG AA (minimum standard)
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio

All text on dark backgrounds meets AA standards
```

### Focus States

```
Focus Ring: 2px solid --brand-accent
Offset: 2px
Visible on all interactive elements
```

### Semantic HTML

```
✓ Use <button> for buttons, not <div>
✓ Use <label for="id"> with form inputs
✓ Use proper heading hierarchy (h1, h2, h3)
✓ Use <nav>, <main>, <article> landmarks
✓ Alt text on all images
```

### Motion

```
Reduced Motion (@media prefers-reduced-motion)
✓ Respect user's motion preference
✓ Disable animations for reduced-motion users
✓ Ensure page is usable without animation
```

---

## Motion & Interaction

### Transitions

```
Timing: 150ms—300ms (snappy, not sluggish)
Easing: ease (linear acceleration/deceleration)
Properties: color, opacity, border-color

Avoid: transform (causes layout shifts)
Use: opacity, color, border-color instead
```

### Micro-interactions

```
Hover: Color shift, opacity change, subtle border glow
Active: Scale(0.99), color inversion
Loading: Opacity pulse (1s cycle)
Disabled: opacity 0.5, cursor not-allowed
```

---

## Dark Mode (Primary)

April is **dark mode first**.

```
✓ All colors optimized for dark backgrounds
✓ High contrast text (#F0F0FF on #080810)
✓ Reduced brightness accents (softer on eyes)
✓ No pure white (#FFFFFF) — use #F0F0FF instead
```

---

## Usage Examples

### Page Layout

```html
<div class="sidebar">
  <!-- Navigation -->
</div>

<main>
  <h1 class="login-title">Sign In</h1>
  <p class="login-subtitle">Your brand guideline creator</p>
  
  <button class="btn btn-primary">Continue with Google</button>
</main>
```

### Card with Accent Band

```html
<div class="project-card">
  <div class="card-color-band" style="background: #8B5CF6;"></div>
  <div class="card-body">
    <h3 class="card-name">Brand Name</h3>
    <p class="card-tagline">Short description</p>
  </div>
</div>
```

### Form with Label

```html
<div class="form-group">
  <label class="form-label" for="email">Email Address</label>
  <input 
    type="email" 
    id="email" 
    class="form-input"
    placeholder="your@email.com"
  />
</div>
```

---

## Implementation Checklist

- [ ] Fonts loaded via Google Fonts (Manrope, Syne)
- [ ] CSS custom properties set in `:root`
- [ ] Dark mode as default, no light mode by default
- [ ] Minimum font size 16px on mobile (prevents iOS zoom)
- [ ] Minimum touch targets 44×44px
- [ ] All images have alt text
- [ ] Focus rings visible on all interactive elements
- [ ] Keyboard navigation tested (Tab, Enter, Escape)
- [ ] Responsive at 375px, 768px, 1440px
- [ ] No color used as only indicator (support colorblind users)
- [ ] Animations respect `prefers-reduced-motion`

---

## File References

- **Colors & tokens** → `css/main.css` (`:root`)
- **Typography** → `css/main.css` (font family, sizes)
- **Grid & layout** → `css/swiss.css` (grid, spacing)
- **Components** → `css/main.css` (buttons, cards, forms)
- **Responsive** → Media queries in both CSS files

---

## Design System Maintenance

**Update when:**
- Adding new colors (document hex + intent)
- Introducing new font sizes (add to hierarchy)
- Creating new spacing values (use 8px multiples)
- Adding components (document structure, variants)

**Review quarterly:**
- Audit component usage across app
- Check for color contrast compliance
- Verify responsive breakpoints still work
- Test keyboard navigation

---

**Last Updated:** May 2026  
**Maintained By:** Design System Team  
**Questions?** See `CLAUDE.md` for architecture details.
