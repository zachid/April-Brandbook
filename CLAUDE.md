# Brandbook Generator — Project Guide

## Overview

A web-based brand guidelines generator. Users upload discovery transcripts, assets, and brand details. The app renders a Swiss-style interactive brandbook with 12 sections, inline editing, AI-powered analysis, and export to PDF/HTML.

**Live:** `brandbook.html?id={projectId}`  
**Dashboard:** `index.html`  
**Intake:** `intake.html`

## Stack

- **Vanilla JS** — no framework, IIFE-based modules
- **CSS custom properties** — design system tokens in `:root`
- **localStorage** — project persistence (`bb_projects` index + `bb_project_${id}` data)
- **sessionStorage** — cross-page brand handoff (`bb_pending_brand`, `bb_last_brand`)
- **Claude API** (Anthropic) + **OpenAI API** — AI features (analysis, generation, keywords)
- **DALL-E 3** — image generation (requires OpenAI key)
- **html2pdf** — PDF export

## Project Structure

```
├── brandbook.html          // Main view (read-only + edit mode)
├── index.html              // Dashboard (project list)
├── intake.html             // Create new brand wizard
├── js/
│   ├── app.js              // Core renderer, editors, collectors, AI functions (1900+ lines)
│   ├── projects.js         // localStorage CRUD for projects
│   ├── theme.js            // Dark/light mode toggle
│   └── brand.config.js     // [DEPRECATED] fallback — never used now
├── css/
│   ├── main.css            // All styles (2500+ lines)
│   └── swiss.css           // Swiss typography + layout system
└── README.md               // User docs
```

## Data Model

### BRAND object (in-memory + localStorage)

```javascript
{
  id:           string,           // Unique project ID (Date.now.toString(36) + random)
  name:         string,           // Brand name
  year:         number,           // Copyright year
  accentColor:  hex,              // Primary accent (#8B5CF6 default)
  accentColor2: hex,              // Secondary accent
  
  // 12 sections — each has own structure
  story:        { headline, description },
  foundation:   { mission, vision, values[] },
  logo:         { primary, symbol, typographic, full, alt[] },
  colors:       { primary[], secondary[], functional[] },
  typography:   { display: {name, weights[], usage}, body: {}, conventions[] },
  imagery:      { style: {description, keywords[], photos[], ...}, dos[], donts[] },
  icons:        { family, style, description, colors[] },
  illustration: { style, colors[] },
  patterns:     { description },
  voice:        { description, attributes[], weare[], werenot[], channelTones[] },
  applications:{ image, name, description }[],
  
  // Cover (special)
  coverBg:      hex,              // Cover background color (editable via picker)
}
```

All **images** stored as **base64 data URLs** — no server needed.

## Key Files & Patterns

### `js/app.js` — Core engine

**12 Sections array:**
```javascript
const SECTIONS = [
  { id: 'cover', label: 'Cover', num: '00', render: renderCover },
  { id: 'story', label: 'Brand Story', num: '01', render: renderStory },
  // ... (12 total, 00-11)
];
```

**Render functions:** Each `render${Section}(sectionNum)` returns HTML. Data bound from `BRAND.${sectionId}`.

**Editor builder helpers:**
- `eF(id, label, value)` — single input field
- `eTA(id, label, value)` — textarea
- `eList(id, label, items)` — multi-row list (keywords, values, etc.)
- `eRows(id, label, items, fieldDefs)` — grid of rows with multiple columns
- `eLogoSlot(key, label)` — logo upload + preview slot
- `ePhotoSlot(idx)` — photo slot with per-slot upload + generate buttons

**EDITORS object:**
```javascript
EDITORS = {
  typography() { /* build editor UI for typography section */ },
  imagery() { /* complex multi-panel: style analyzer, keywords, photo grid */ },
  // ... one method per section
};
```

Returns HTML string ready to insert into editor body.

**COLLECTORS object:**
```javascript
COLLECTORS = {
  typography() { /* read form inputs, write to BRAND.typography */ },
  imagery() { /* read form inputs + photos, write to BRAND.imagery */ },
  // ... one method per section
};
```

Called on Save to extract all form data back into `BRAND`.

**`wireFiles(sectionId)`:**
- Wires all file inputs in editor body
- Photo uploads → `compressImage()` → `BRAND.imagery.photos[idx]`
- Logo uploads → `compressImage()` → `_uploads` cache (persisted in COLLECTORS)
- Generic slots (icons, illustration, patterns) → compressed + stored by section

**`openEditor(sectionId)`:**
1. Create overlay + editor shell with topbar (title, model selector, Cancel/Save buttons)
2. Get editor HTML from `EDITORS[sectionId]()`
3. Insert into section overlay
4. Call `wireFiles(sectionId)` to hook up uploads
5. Wire section-specific logic (cover color picker, imagery controls, typography conventions, etc.)

**`saveEditor(sectionId)`:**
1. Call `COLLECTORS[sectionId]()` to extract form data
2. Merge `_uploads` into `BRAND` via `deepSet()`
3. Call `persistBrand()` to save to localStorage
4. Show success/error in topbar, re-render section

**`persistBrand()`:**
```javascript
return { ok: true } or { ok: false, err: 'message' }
```
Tries to save via `Projects.save()`. Catches `QuotaExceededError` specifically. Never falls back to brand.config.js.

### AI Functions

**`callAI({ prompt, images[], json })`**
- Unified interface for both Anthropic + OpenAI
- Reads `bb_selected_model` from sessionStorage
- Dispatches to correct API based on provider
- If `json: true`, parses response as JSON
- Supports vision (images) for both providers

**`generateImage(prompt)`**
- Uses DALL-E 3 (requires OpenAI key in `bb_openai_key`)
- Returns base64 data URL
- Called by `generateBrandImage()` and `generateBrandImageSlot()`

**`analyzeImageryStyle()`**
- Analyzes uploaded style reference image
- Calls AI to extract: description, keywords, generation prompt
- Auto-fills imagery editor fields

**`generateBrandImageSlot(idx, mockupType, customPrompt, triggerBtn)`**
- Per-slot image generation (not global)
- Uses brand colors + style description + custom prompt
- Places result in photo slot `[idx]`
- Collapses generation panel on success

**`generateKeywords()`**
- Generates 6–8 keywords from style description
- Populates `ed-img-kw` list via AI

### Image Compression

**`compressImage(file, maxWidth, quality)`**
- Loads image → resizes canvas → re-encodes as JPEG
- SVGs pass through unchanged
- Photos: 1100px / 72% quality (~10–20× smaller)
- Logos: 800px / 88% quality
- Style ref: 1600px / 85% quality (higher res for AI vision)
- Prevents localStorage quota errors

### Storage & Boot Flow

**When opening a project (`brandbook.html?id=abc`):**

1. Check URL `?id=` parameter
2. Try sessionStorage (`bb_pending_brand`, `bb_last_brand`) — fastest
3. Fall back to localStorage via `Projects.get(id)`
4. If still nothing, redirect to `index.html` (no silent fallback)

**When navigating from dashboard (`index.html`):**
- Card click writes `bb_pending_brand` + `bb_last_brand` to sessionStorage
- Then navigates to `brandbook.html?id=abc`
- brandbook.html immediately finds it in sessionStorage

**sessionStorage is ephemeral** (cleared on tab close) but acts as a "next page" cache. localStorage is permanent.

## LLM Models

```javascript
const LLM_MODELS = [
  { id: 'gpt-5.4',         label: 'GPT-5.4',        provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-5.4-mini',    label: 'GPT-5.4 mini',   provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-5.2',         label: 'GPT-5.2',        provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-4o',          label: 'GPT-4o',         provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-4o-mini',     label: 'GPT-4o mini',    provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-4.1',         label: 'GPT-4.1',        provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-4.1-mini',    label: 'GPT-4.1 mini',   provider: 'openai', key: 'bb_openai_key' },
  { id: 'gpt-4.5-preview', label: 'GPT-4.5 preview',provider: 'openai', key: 'bb_openai_key' },
  { id: 'o4-mini',         label: 'o4-mini',        provider: 'openai', key: 'bb_openai_key' },
  { id: 'o3',              label: 'o3',             provider: 'openai', key: 'bb_openai_key' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'anthropic', key: 'bb_api_key' },
  { id: 'claude-haiku-4-5',  label: 'Claude Haiku 4.5',  provider: 'anthropic', key: 'bb_api_key' },
  { id: 'claude-opus-4-5',   label: 'Claude Opus 4.5',   provider: 'anthropic', key: 'bb_api_key' },
];
```

Model selector in editor topbar persists choice to `sessionStorage.bb_selected_model`.

## Design System

**Typography:**
- Display: **Syne** (geometric, bold headlines)
- Body: **Inter** (clean, modern UI text)
- Fallback: system fonts

**Colors (CSS variables):**
```css
--text-primary:       #F0F0FF
--text-secondary:     #C4C4D8
--text-muted:         #888899
--bg:                 #111110
--bg-card:            #1A1A24
--bg-input:           #0F0F1A
--brand-accent:       #8B5CF6 (electric violet)
--border:             rgba(255,255,255,0.08)
--border-medium:      rgba(255,255,255,0.15)
```

**Spacing scale (8px base):**
`--sp-1` (4px) through `--sp-8` (64px)

**Swiss style rules:**
- Left-aligned text (never center)
- Hairline borders (1px, no shadows)
- Zero border-radius (sharp edges)
- Generous whitespace (40%+ of canvas)
- Asymmetric layout
- Oversized section numerals (200px, low opacity) as anchors

## Common Tasks

### Add a new section

1. Add to `SECTIONS` array:
   ```javascript
   { id: 'newsection', label: 'News Section', num: '12', render: renderNewsection }
   ```

2. Create `renderNewsection(num)` function returning HTML

3. Create `EDITORS.newsection()` returning editor UI

4. Create `COLLECTORS.newsection()` extracting form data to `BRAND.newsection`

5. Add `BRAND.newsection = {}` init in `persistBrand()` if needed

6. Wire any special inputs in `openEditor()` block

### Add an AI feature

1. Call `callAI({ prompt, images?, json? })` — returns parsed result
2. Read current model from `getSelectedModel()`
3. Pass model ID to `callAI()` internally
4. Handle both Anthropic + OpenAI responses

### Compress images before saving

Always use `compressImage(file, maxWidth, quality)` not raw `readFileB64()`:
```javascript
const url = await compressImage(file, 1100, 0.72);
```

### Export formats

- **PDF:** `__bbExportPDF()` — uses html2pdf, hides UI, exports full document
- **HTML:** `__bbExportHTML()` — clones DOM, removes scripts/edit buttons, downloads `.html` file

## Known Issues & Fixes

✅ **Storage quota exceeded** — Fixed by adding `compressImage()` to all image uploads. Photos now ~10–20× smaller.

✅ **"Always shows AURA project"** — Fixed by:
1. Writing sessionStorage BEFORE navigating (index.html)
2. Removing silent brand.config.js fallback in brandbook.html
3. Redirecting to index.html if brand not found

✅ **Save not working** — Fixed by:
1. Adding error handling to `persistBrand()` with return value
2. Showing error message in topbar
3. Re-enabling button on failure

✅ **Generate Description button disabled after upload** — Fixed by explicitly calling `.disabled = false` in upload handler

## Next Ideas

- [ ] Batch image upload (drag-drop multiple)
- [ ] Brand kit export (JSON or .zip with all assets)
- [ ] Version history / rollback
- [ ] Real-time sync (multi-user editing)
- [ ] Template library (starter brandbooks)
- [ ] Figma export (auto-create design file from brand data)
- [ ] Custom domain brandbooks (white-label view)
- [ ] Analytics (who viewed, when, what sections)

## Testing Locally

1. **Mock a project:**
   ```javascript
   // In browser console
   window.BRAND = {
     id: 'test-' + Date.now(),
     name: 'Test Brand',
     story: { headline: 'Test' },
     // ... etc
   };
   ```

2. **View a specific project:**
   ```
   brandbook.html?id=1234567890abc
   ```

3. **Clear all projects:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

4. **Monitor saves:**
   Watch browser console for `[Brandbook]` log messages

## Performance Notes

- **Lazy render:** Sections render on demand (when scrolled into view via scroll-spy)
- **Image compression:** Reduces file size ~15× before localStorage write
- **sessionStorage caching:** Eliminates localStorage read on immediate navigation
- **CSS custom properties:** Single style system, easy to theme

## File Size & Limits

- **Max project size:** ~5MB (localStorage quota)
- **Max per image:** ~400KB compressed (JPEG at 72% quality)
- **Max photos:** ~8–12 high-quality images per brandbook
- **Session limit:** 24 hours before sessionStorage clears
