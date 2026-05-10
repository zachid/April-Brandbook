# Brandbook Generator

A Swiss International Style brand guidelines generator powered by AI. Create professional, interactive brandbooks from discovery transcripts, brand assets, and visual references.

## Features

✨ **12-Section Brandbook**
- Cover, Brand Story, Foundation, Logo System, Color System, Typography, Imagery, Icons, Illustration, Patterns, Voice & Tone, In Use

🎨 **Swiss Design System**
- Geometric typography (Syne + Inter)
- Hairline borders, left-aligned layouts
- Oversized section numerals, generous whitespace
- Dark mode first, light mode support

🤖 **AI-Powered Analysis**
- Claude Sonnet / GPT-5.4 / GPT-5.2 model selector
- Style reference image analysis → auto-fill visual descriptions
- Keyword generation from style descriptions
- DALL-E 3 image generation with brand context
- Per-slot mockup-based generation

📸 **Smart Image Handling**
- Automatic compression (10–20× smaller files)
- 8 photo slots per brandbook
- Upload or generate options for each slot
- Supports PNG, JPEG, WebP, SVG

💾 **Persistent Storage**
- Browser localStorage (no server needed)
- Cross-page sessionStorage handoff
- Project CRUD dashboard
- Export to PDF or HTML

⌨️ **Inline Editing**
- Section-by-section editors
- Multi-row lists, dropdowns, text areas
- Logo variants (symbol, typographic, full, alt)
- Typography convention scale editor
- Brand color picker on cover

## Quick Start

### Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/brandbook-generator.git
cd brandbook-generator

# Start a local server
python3 -m http.server 8080 --bind 127.0.0.1

# Open browser
open http://localhost:8080/index.html
```

### Create a Brand

1. Click **New Brand** on the dashboard
2. Upload discovery transcript (or paste text)
3. Fill in brand details
4. Add logo, colors, typography
5. Upload reference images for style analysis
6. AI generates descriptions + keywords
7. Generate images or upload your own
8. Export to PDF or HTML

### Set API Keys

In intake form or via browser console:
```javascript
sessionStorage.setItem('bb_api_key', 'sk-ant-...');        // Claude API
sessionStorage.setItem('bb_openai_key', 'sk-...'); // OpenAI (DALL-E)
```

API keys are stored **in sessionStorage only** (cleared on tab close, never persisted).

## Project Structure

```
├── index.html              # Dashboard (project list)
├── intake.html             # Create brand wizard
├── brandbook.html          # Main view (12 sections + editor)
├── js/
│   ├── app.js             # Core (1900+ lines) — render, edit, AI
│   ├── projects.js        # localStorage CRUD
│   └── theme.js           # Dark/light mode
├── css/
│   ├── main.css           # All styles (2500+ lines)
│   └── swiss.css          # Typography + layout system
├── CLAUDE.md              # Developer guide
└── vercel.json            # Deployment config
```

## Data Model

All data stored as a single `BRAND` object in localStorage:

```javascript
{
  id, name, year,
  story, foundation, logo, colors, typography,
  imagery, icons, illustration, patterns,
  voice, applications,
  accentColor, accentColor2, coverBg
}
```

Images are **base64 data URLs** — no server required.

## LLM Models

**Anthropic:**
- Claude Sonnet 4.5
- Claude Haiku 4.5
- Claude Opus 4.5

**OpenAI:**
- GPT-5.4 / GPT-5.4 mini
- GPT-5.2
- GPT-4o / GPT-4o mini
- GPT-4.1 / GPT-4.1 mini
- GPT-4.5 preview
- o4-mini
- o3

Model selection in editor topbar persists to sessionStorage.

## Image Compression

All uploads automatically compressed before storage:
- Photos: 1100px / 72% quality
- Logos: 800px / 88% quality
- Style ref: 1600px / 85% quality (higher res for AI analysis)
- SVGs: pass-through unchanged

Reduces file size ~15× before localStorage write.

## Export

**PDF:** Hides UI, exports full brandbook, ready to print or email

**HTML:** Standalone `.html` file with all styles + images embedded

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git remote add origin https://github.com/yourusername/brandbook-generator.git
git push -u origin main

# Import in Vercel
# → Select the GitHub repo
# → Use default settings (static site, no build needed)
# → Deploy
```

Live URL: `https://brandbook-generator.vercel.app`

### Other Hosts

Works on any static host (Netlify, GitHub Pages, AWS S3, etc.). Just serve the HTML files — no build step needed.

## Storage Limits

- **Max project size:** ~5MB (browser localStorage quota)
- **Max per image:** ~400KB compressed
- **Typical:** 8–12 high-quality images per brandbook

## Known Issues

✅ Fixed in this version:
- Image storage quota exceeded (now uses compression)
- Projects disappearing (deterministic sessionStorage + localStorage sync)
- Save failures (error messages in topbar)
- Generate Description button disabled after image upload

## Future Ideas

- [ ] Batch image upload (drag-drop multiple)
- [ ] Brand kit export (.zip with assets)
- [ ] Version history / rollback
- [ ] Real-time sync (multi-user editing)
- [ ] Template library (starter brandbooks)
- [ ] Figma export (auto-create design file)
- [ ] Custom domain white-label
- [ ] Analytics (views, timestamps, section activity)

## Tech Stack

- Vanilla JavaScript (no framework)
- CSS custom properties (design tokens)
- localStorage + sessionStorage (persistence)
- Claude API (Anthropic)
- OpenAI API + DALL-E 3 (image generation)
- html2pdf (PDF export)

## License

MIT

## Author

Built by Zach Idiner with Claude AI.

---

**Questions?** See `CLAUDE.md` for architecture details, patterns, and common tasks.
