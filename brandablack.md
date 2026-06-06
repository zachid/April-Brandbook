# April — brandablack (Dark Theme)

> Extracted from actual source files. Two pages, two CSS scopes — documented separately.

---

## Page 1 — Dashboard (`index.html`)

Self-contained inline `<style>`. Strict Swiss: zero radius, solid borders, Manrope only.

### Tokens

```css
/* Dark (default) */
:root {
  --bg:        #111110;
  --bg-card:   #1A1A19;
  --bg-hover:  #1F1F1E;
  --border:    #252523;     /* Solid hex — not rgba */
  --border-md: #323230;
  --border-hi: #4A4A47;
  --text:      #F4F3EF;     /* Warm white */
  --text-2:    #6B6B66;     /* Secondary text */
  --text-3:    #3D3D39;     /* Muted / metadata */
  --accent:    #8B5CF6;     /* Electric violet */
}

/* Light override */
body.light {
  --bg:        #F2F2EF;
  --bg-card:   #FFFFFF;
  --bg-hover:  #F8F8F5;
  --border:    rgba(0,0,0,0.07);
  --border-md: rgba(0,0,0,0.12);
  --border-hi: rgba(0,0,0,0.22);
  --text:      #111110;
  --text-2:    rgba(17,17,16,0.55);
  --text-3:    rgba(17,17,16,0.28);
  --accent:    #7C3AED;   /* Darkened for light-bg contrast */
}
```

### Typography

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Logo | Manrope | 800 | 11px | Uppercase, letter-spacing 0.14em |
| Page title | Manrope | 800 | clamp(44px, 6vw, 80px) | letter-spacing -0.04em, line-height 0.92 |
| Eyebrow | Manrope | 700 | 10px | Uppercase, letter-spacing 0.16em, color --accent |
| Page subtitle | Manrope | 400 | 14px | line-height 1.6, color --text-2 |
| Card name | Manrope | 800 | 18px | letter-spacing -0.03em |
| Card tagline | Manrope | 400 | 13px | line-height 1.55, color --text-2 |
| Buttons | Manrope | 700 | 10px | Uppercase, letter-spacing 0.10em |
| Labels | Manrope | 700 | 10–11px | Uppercase, letter-spacing 0.08–0.16em |
| Metadata | Manrope | 600 | 10px | Uppercase, color --text-3 |

Single typeface throughout. **No Syne.**

### Layout

```
Header: sticky, height 56px, padding 0 48px, border-bottom 1px --border-md
Main: max-width 1280px, margin auto, padding 72px 48px
Page header: margin-bottom 64px, padding-bottom 48px, border-bottom 1px --border-md
```

### Project Grid

```
display: grid
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
gap: 1px                        ← gap IS the border (Swiss technique)
background: var(--border-md)    ← gap color = border color
border: 1px solid var(--border-md)
```

### Project Card

```
background: --bg-card (#1A1A19)
border-radius: 0                ← sharp, no rounding
cursor: pointer
hover: background --bg-hover

Card color band (top accent line):
  height: 3px
  width: 100%

Card body: padding 28px 28px 24px
Card meta: padding-top 16px, border-top 1px --border

Card name: 18px / 800 / letter-spacing -0.03em
Card tagline: 13px / 400 / color --text-2
Card updated: 10px / 600 / uppercase / color --text-3
Card open link: 10px / 700 / uppercase / color --text-3 → --text on hover
```

### Create New Card

```
background: --bg-card
border-radius: 0
padding: 28px
min-height: 180px

Inner dashed frame (::after):
  inset: 10px
  border: 1px dashed --border-hi
  → border-color: --accent on hover
```

### Buttons

```
border-radius: 0 (all buttons)
height: 36px
padding: 0 18px
font: Manrope 700 10px uppercase letter-spacing 0.10em

Primary:  background --accent, border --accent, color #fff
          hover → #7C3AED
Ghost:    transparent, border --border-md, color --text-2
          hover → border --border-hi, color --text
Danger:   background #EF4444, hover → #DC2626
```

### Modals

```
background: --bg-card
border: 1px solid --border-md
border-radius: 0
padding: 36px
max-width: 360px (standard) / 480px (lg)
```

### Settings Inputs

```
background: --bg
border: 1px solid --border-md
border-radius: 0
padding: 10px 12px
font: Manrope 12px
focus: border-color --accent
```

---

## Page 2 — Brandbook Viewer (`brandbook.html`)

Uses `css/main.css`. More expressive: rounded cards, shadow tokens, cool-dark backgrounds.

### Tokens

```css
:root {
  --brand-accent:   #8B5CF6;
  --brand-accent-2: #06B6D4;

  --bg-base:     #080810;   /* Deep navy-black */
  --bg-elevated: #0F0F1A;
  --bg-card:     #13131F;
  --sidebar-bg:  #09090F;

  --border:        rgba(255,255,255,0.06);
  --border-medium: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);

  --text-primary:   #F0F0FF;                 /* Cool white */
  --text-secondary: rgba(240,240,255,0.55);
  --text-muted:     rgba(240,240,255,0.28);

  --font-sans:    'Manrope', system-ui, sans-serif;
  --font-display: 'Manrope', sans-serif;   /* Same font — no Syne */
  --font-mono:    'SF Mono', 'Fira Code', 'Cascadia Code', monospace;

  --sidebar-w: 264px;

  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px;  --sp-8: 32px; --sp-10: 40px;
  --sp-12: 48px; --sp-16: 64px; --sp-20: 80px; --sp-24: 96px;

  --r-sm: 6px;   /* Tags, small buttons */
  --r-md: 10px;  /* Inputs */
  --r-lg: 16px;  /* Rule cards, swatches, value cards */
  --r-xl: 24px;  /* Foundation cards, type family cards, imagery cards */

  --shadow-md: 0 4px 20px rgba(0,0,0,0.5);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.6);
}
```

### Typography

| Element | Font | Weight | Size | Line-height | Notes |
|---------|------|--------|------|-------------|-------|
| Cover brand name | Manrope | 800 | clamp(72px, 10vw, 128px) | 0.92 | letter-spacing -0.04em |
| Section title | Manrope | 800 | clamp(30px, 3.5vw, 52px) | 1.05 | letter-spacing -0.03em |
| Section desc | Manrope | 400 | 17px | 1.7 | max-width 580px |
| Story narrative | Manrope | 300 | clamp(18px, 2.2vw, 26px) | 1.6 | max-width 72ch |
| Card quote | Manrope | 500 | 20px | 1.5 | letter-spacing -0.02em |
| Body | Manrope | 400 | 16px | 1.65 | — |
| UI section num | Manrope | 700 | 12px | — | --brand-accent, letter-spacing 0.06em |
| UI section tag | Manrope | 600 | 11px | — | Uppercase, muted, letter-spacing 0.12em |
| Nav label | Manrope | 500 | 13px | — | letter-spacing -0.01em |
| Nav num | Manrope | 700 | 11px | — | letter-spacing 0.02em |
| Labels | Manrope | 600–700 | 10px | — | Uppercase, letter-spacing 0.12–0.14em |
| Mono / hex | SF Mono | 400 | 11px | — | Hex values, code |

### Sidebar

```
width: 264px (--sidebar-w), fixed
background: --sidebar-bg (#09090F)
border-right: 1px solid --border

Nav item: padding 9px 12px, radius --r-md (10px)
  default: color --text-secondary
  hover:   background rgba(255,255,255,0.04), color --text-primary
  active:  background rgba(139,92,246,0.10), color --text-primary
           + 2px left bar (height 18px, color --brand-accent)
  num:     color --text-muted → --brand-accent on hover/active
```

### Section Layout

```
min-height: 100vh
padding: --sp-24 (96px) vertical, --sp-16 (64px) horizontal
border-bottom: 1px solid --border
max-width: 960px content area
```

### Cards (Brandbook Viewer)

```
Foundation cards:   radius --r-xl (24px), padding --sp-8
Value cards:        radius --r-lg (16px), padding --sp-6
Type family cards:  radius --r-xl (24px), padding --sp-8
Color swatches:     radius --r-lg (16px)
Rule cards:         radius --r-lg (16px), padding --sp-6
Imagery cards:      radius --r-xl (24px), padding --sp-8 --sp-10
All:                background --bg-card, border 1px --border-medium
```

### Swiss Override (`css/swiss.css` — `body.swiss`)

Activates by adding class `swiss` to `<body>`. Converts brandbook viewer to true Swiss:

```css
--bg-base:     #111110;    /* Warmer blacks */
--bg-elevated: #1C1C1B;
--bg-card:     #1A1A19;
--sidebar-bg:  #0C0C0B;

--border:        #252523;  /* Solid hex borders */
--border-medium: #323230;
--border-strong: #4A4A47;

--text-primary:   #F4F3EF; /* Warm white */
--text-secondary: #6B6B66;
--text-muted:     #3D3D39;

--r-sm: 0; --r-md: 0; --r-lg: 0; --r-xl: 0;   /* All sharp */
--shadow-sm: none; --shadow-md: none; --shadow-lg: none;
```

---

## Fonts Loaded

Both pages load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap">
```

**One typeface. Manrope. No Syne. No Inter. No exceptions.**

---

## Token Name Differences (watch out)

| Concept | index.html name | brandbook viewer name |
|---------|----------------|-----------------------|
| Page background | `--bg` | `--bg-base` |
| Card background | `--bg-card` | `--bg-card` |
| Primary text | `--text` | `--text-primary` |
| Secondary text | `--text-2` | `--text-secondary` |
| Muted text | `--text-3` | `--text-muted` |
| Standard border | `--border-md` | `--border-medium` |
| Accent color | `--accent` | `--brand-accent` |

Two separate CSS scopes. Token names are not interchangeable.

---

**Source files:** `index.html <style>` + `css/main.css` + `css/swiss.css`
**Last synced:** May 2026
