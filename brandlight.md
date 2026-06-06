# April — brandlight (Light Theme)

> Extracted from actual source files. Mirrors brandablack exactly — only color tokens change.

---

## Activation

```html
<body class="light">
```

Both pages already support this. Toggle is wired in `js/theme.js` (brandbook viewer) and inline script (dashboard).

---

## Page 1 — Dashboard (`index.html`) Light

### Token Overrides

```css
body.light {
  --bg:        #F2F2EF;              /* Warm off-white page background */
  --bg-card:   #FFFFFF;              /* Cards */
  --bg-hover:  #F8F8F5;              /* Card hover */
  --border:    rgba(0,0,0,0.07);     /* Hairline dividers */
  --border-md: rgba(0,0,0,0.12);     /* Standard borders */
  --border-hi: rgba(0,0,0,0.22);     /* Emphasis borders */
  --text:      #111110;              /* Near-black text */
  --text-2:    rgba(17,17,16,0.55);  /* Secondary text */
  --text-3:    rgba(17,17,16,0.28);  /* Muted / metadata */
  --accent:    #7C3AED;              /* Violet darkened for light-bg contrast */
}
```

### What stays the same

```
font-family: Manrope (unchanged)
border-radius: 0 (all elements — unchanged)
button sizes, padding, letter-spacing: unchanged
grid gap technique (1px gap = border): unchanged
header height (56px), layout padding: unchanged
```

### Visual result

| Element | Dark | Light |
|---------|------|-------|
| Page background | `#111110` | `#F2F2EF` |
| Cards | `#1A1A19` | `#FFFFFF` |
| Card hover | `#1F1F1E` | `#F8F8F5` |
| Borders | `#323230` (solid) | `rgba(0,0,0,0.12)` |
| Primary text | `#F4F3EF` | `#111110` |
| Secondary text | `#6B6B66` | `rgba(17,17,16,0.55)` |
| Muted text | `#3D3D39` | `rgba(17,17,16,0.28)` |
| Accent | `#8B5CF6` | `#7C3AED` (slightly darker) |

---

## Page 2 — Brandbook Viewer (`brandbook.html`) Light

Uses `css/main.css` `body.light` block.

### Token Overrides

```css
body.light {
  --bg-base:     #F8F8FC;              /* Off-white page background */
  --bg-elevated: #FFFFFF;              /* Elevated surfaces */
  --bg-card:     #FFFFFF;              /* Cards */
  --sidebar-bg:  #FFFFFF;              /* Sidebar */

  --border:        rgba(0,0,0,0.07);   /* Hairline dividers */
  --border-medium: rgba(0,0,0,0.11);   /* Standard card borders */
  --border-strong: rgba(0,0,0,0.20);   /* Emphasis borders */

  --text-primary:   #0F0F1A;                  /* Near-black */
  --text-secondary: rgba(15,15,26,0.58);      /* Body copy */
  --text-muted:     rgba(15,15,26,0.32);      /* Labels, hints */

  --shadow-md: 0 4px 20px rgba(0,0,0,0.07);  /* Shadows reduced opacity */
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
}
```

### What stays the same

```
--brand-accent:   #8B5CF6  (unchanged — purple works on white)
--brand-accent-2: #06B6D4  (unchanged)
--font-sans / --font-display: Manrope (unchanged)
--font-mono: SF Mono (unchanged)
--sidebar-w: 264px (unchanged)
--sp-* spacing: all unchanged
--r-sm/md/lg/xl: 6/10/16/24px (unchanged)
```

### Component Overrides

**Sidebar**
```
border-right: 1px solid --border-medium
box-shadow: 2px 0 16px rgba(0,0,0,0.04)
```

**Nav items**
```
hover:  background rgba(0,0,0,0.04)
active: background rgba(139,92,246,0.08)
```

**Cover section**
```
background: linear-gradient(135deg, #F8F8FC 60%, #EEE8FF 100%)
Glow pseudo-elements (::before / ::after): hidden in light mode
```

**All cards (forced white)**
```
Applies to:
  .foundation-card  .value-card      .logo-hero
  .logo-rule-card   .color-swatch    .color-ratios
  .type-family-card .imagery-style-card .imagery-rule-card
  .voice-intro      .voice-attr-card  .voice-weare
  .channel-row      .app-card

→ background: #FFFFFF
→ border-color: --border-medium
```

**Swatch body / App info panel**
```
background: #FFFFFF
```

### Visual result

| Token | Dark | Light |
|-------|------|-------|
| `--bg-base` | `#080810` | `#F8F8FC` |
| `--bg-card` | `#13131F` | `#FFFFFF` |
| `--sidebar-bg` | `#09090F` | `#FFFFFF` |
| `--text-primary` | `#F0F0FF` | `#0F0F1A` |
| `--text-secondary` | `rgba(240,240,255,0.55)` | `rgba(15,15,26,0.58)` |
| `--text-muted` | `rgba(240,240,255,0.28)` | `rgba(15,15,26,0.32)` |
| `--border-medium` | `rgba(255,255,255,0.10)` | `rgba(0,0,0,0.11)` |
| `--shadow-md` | `0 4px 20px rgba(0,0,0,0.5)` | `0 4px 20px rgba(0,0,0,0.07)` |
| `--brand-accent` | `#8B5CF6` | `#8B5CF6` same |
| `--font-display` | `Manrope` | `Manrope` same |
| Radius | 6/10/16/24px | same |

---

**Source files:** `index.html <style>` `body.light` + `css/main.css` `body.light`
**Inherits base structure from:** `brandablack.md`
**Last synced:** May 2026
