(function () {
  'use strict';

  // ── Section registry ─────────────────────────────────────────
  const SECTIONS = [
    { id: 'cover',        label: 'Cover',         num: '00', render: renderCover },
    { id: 'story',        label: 'Brand Story',   num: '01', render: renderStory },
    { id: 'foundation',   label: 'Foundation',    num: '02', render: renderFoundation },
    { id: 'logo',         label: 'Logo System',   num: '03', render: renderLogo },
    { id: 'colors',       label: 'Color System',  num: '04', render: renderColors },
    { id: 'typography',   label: 'Typography',    num: '05', render: renderTypography },
    { id: 'imagery',      label: 'Imagery',       num: '06', render: renderImagery },
    { id: 'icons',        label: 'Icons',         num: '07', render: renderIcons },
    { id: 'illustration', label: 'Illustration',  num: '08', render: renderIllustration },
    { id: 'patterns',     label: 'Patterns',      num: '09', render: renderPatterns },
    { id: 'voice',        label: 'Voice & Tone',  num: '10', render: renderVoice },
    { id: 'applications', label: 'In Use',        num: '11', render: renderApplications },
  ];

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    applyAccentColors();
    setPageTitle();
    buildSidebar();
    renderAllSections();
    setupScrollSpy();
    setupProgressBar();
  }

  function applyAccentColors() {
    if (BRAND.accentColor)  document.documentElement.style.setProperty('--brand-accent',   BRAND.accentColor);
    if (BRAND.accentColor2) document.documentElement.style.setProperty('--brand-accent-2', BRAND.accentColor2);
  }

  function setPageTitle() {
    const title = `${BRAND.name} — Brand Guidelines`;
    document.title = title;
    document.getElementById('page-title').textContent = title;
  }

  function buildSidebar() {
    // Brand name (preserve the ← back arrow that lives in sidebar-logo)
    const nameEl = document.getElementById('sidebar-brand-name');
    if (nameEl) {
      nameEl.textContent = BRAND.name;
    } else {
      // Fallback: overwrite whole element (e.g. when loading brand.config.js directly)
      const logoEl = document.getElementById('sidebar-logo');
      if (logoEl) logoEl.innerHTML = `<span class="sidebar-logo-text">${BRAND.name}</span>`;
    }

    // Year
    document.getElementById('sidebar-year').textContent = BRAND.year || new Date().getFullYear();

    // Nav items
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = SECTIONS.map(s => `
      <a class="nav-item" data-section="${s.id}" href="#section-${s.id}">
        <span class="nav-num">${s.num}</span>
        <span class="nav-label">${s.label}</span>
      </a>
    `).join('');

    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById(`section-${item.dataset.section}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function renderAllSections() {
    const content = document.getElementById('content');
    const editSVG = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z"/></svg>`;
    content.innerHTML = SECTIONS.map(s => `
      <section class="section" id="section-${s.id}" data-section="${s.id}" data-num="${s.num}">
        <button class="section-edit-btn" data-edit="${s.id}" title="Edit section">${editSVG} Edit</button>
        ${s.render(s.num)}
      </section>
    `).join('');
    // Wire edit buttons via delegation (avoids inline onclick in strict-mode IIFE)
    content.addEventListener('click', e => {
      const btn = e.target.closest('.section-edit-btn');
      if (btn) openEditor(btn.dataset.edit);
    });
  }

  function setupScrollSpy() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.section;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector(`.nav-item[data-section="${id}"]`)?.classList.add('active');
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('.section').forEach(s => observer.observe(s));
  }

  function setupProgressBar() {
    const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }, { passive: true });
  }

  // ── Shared helpers ───────────────────────────────────────────
  function eyebrow(num, tag) {
    return `
      <div class="section-eyebrow">
        <span class="section-num">${num}</span>
        <span class="section-tag">${tag}</span>
      </div>`;
  }

  function sectionHead(num, tag, title, desc = '') {
    return `
      ${eyebrow(num, tag)}
      <h2 class="section-title">${title}</h2>
      ${desc ? `<p class="section-desc">${desc}</p>` : ''}
    `;
  }

  function imgWithFallback(src, alt, fallbackHTML) {
    if (!src) return fallbackHTML;
    return `<img src="${src}" alt="${alt}" onerror="this.replaceWith(document.createRange().createContextualFragment(\`${fallbackHTML.replace(/`/g, '\\`')}\`))">`;
  }

  function isLightHex(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }

  // ════════════════════════════════════════
  //  RENDER FUNCTIONS
  // ════════════════════════════════════════

  // ── 00 Cover ─────────────────────────────
  function renderCover(num = '00') {
    const b = BRAND;
    const coverBg = b.coverBg || '';
    const coverStyle = coverBg ? `style="background:${coverBg}"` : '';
    const logoSrc = b.logo?.primary || b.logo?.reversed || '';
    const accentLight = coverBg ? isLightHex(coverBg) : false;
    const textColor   = accentLight ? '#0A0A0F' : '#F0F0FF';
    const mutedColor  = accentLight ? 'rgba(0,0,0,0.45)' : 'rgba(240,240,255,0.45)';

    return `
      <div class="cover-inner" ${coverStyle}>
        ${coverBg ? `<style>#section-cover::before,#section-cover::after{display:none!important}#section-cover{background:${coverBg}!important}</style>` : ''}
        <div class="cover-top">
          ${logoSrc ? `<img class="cover-logo" src="${logoSrc}" alt="${b.name} logo" style="max-height:56px;max-width:220px;object-fit:contain">` : ''}
          <p class="cover-label" style="color:${mutedColor}">Brand Guidelines ${b.year || ''}</p>
        </div>
        <div class="cover-body">
          <h1 class="cover-brand-name" style="color:${textColor}">${b.name}</h1>
          <p class="cover-tagline" style="color:${mutedColor}">${b.tagline || ''}</p>
          <div class="cover-divider" style="border-color:${accentLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)'}"></div>
          ${b.description ? `<p class="cover-description" style="color:${mutedColor}">${b.description}</p>` : ''}
        </div>
        <div class="cover-meta">
          <div class="cover-meta-item">
            <span class="cover-meta-label" style="color:${mutedColor}">Year</span>
            <span class="cover-meta-value" style="color:${textColor}">${b.year || new Date().getFullYear()}</span>
          </div>
          <div class="cover-meta-item">
            <span class="cover-meta-label" style="color:${mutedColor}">Version</span>
            <span class="cover-meta-value" style="color:${textColor}">1.0</span>
          </div>
          <div class="cover-meta-item">
            <span class="cover-meta-label" style="color:${mutedColor}">Classification</span>
            <span class="cover-meta-value" style="color:${textColor}">Internal Use</span>
          </div>
        </div>
      </div>`;
  }

  // ── 01 Brand Story ───────────────────────
  function renderStory() {
    const s = BRAND.story;
    // Also pull from foundation if story isn't present
    const f = BRAND.foundation;

    const vision  = s?.vision  || f?.vision  || '';
    const mission = s?.mission || f?.mission || '';
    const strategy   = s?.strategy   || '';
    const narrative  = s?.narrative  || BRAND.description || '';

    // If none of the fields are populated, render a minimal placeholder
    if (!narrative && !strategy && !vision && !mission) {
      return `
        <div class="section-inner">
          ${sectionHead('01', 'Brand Story', 'Brand Story')}
          <p style="color:var(--text-muted);font-size:14px">No brand story supplied. Re-run intake with brand documents to populate this section.</p>
        </div>`;
    }

    return `
      <div class="section-inner story-section">
        ${sectionHead('01', 'Brand Story', 'Brand Story')}

        ${narrative ? `
        <div class="story-narrative">
          <p class="story-narrative-text">${narrative}</p>
        </div>` : ''}

        ${strategy ? `
        <div class="story-strategy">
          <div class="story-field-label">Strategy</div>
          <p class="story-field-text">${strategy}</p>
        </div>` : ''}

        <div class="story-pillars">
          ${vision ? `
          <div class="story-pillar">
            <div class="story-pillar-label">Vision</div>
            <div class="story-pillar-body">"${vision}"</div>
          </div>` : ''}

          ${mission ? `
          <div class="story-pillar">
            <div class="story-pillar-label">Mission</div>
            <div class="story-pillar-body">"${mission}"</div>
          </div>` : ''}
        </div>
      </div>`;
  }

  // ── 02 Foundation ────────────────────────
  function renderFoundation() {
    const f = BRAND.foundation;
    if (!f) return '<p style="color:var(--text-muted)">No foundation data configured.</p>';

    return `
      <div class="section-inner">
        ${sectionHead('02', 'Foundation', 'Brand Foundation')}

        <div class="foundation-grid">
          ${f.mission ? `
          <div class="foundation-card span-2">
            <div class="foundation-card-label">Mission</div>
            <div class="foundation-card-body quote">"${f.mission}"</div>
          </div>` : ''}

          ${f.vision ? `
          <div class="foundation-card span-2">
            <div class="foundation-card-label">Vision</div>
            <div class="foundation-card-body quote">"${f.vision}"</div>
          </div>` : ''}

          ${f.audience ? `
          <div class="foundation-card span-2">
            <div class="foundation-card-label">Target Audience</div>
            <div class="foundation-card-body">${f.audience}</div>
          </div>` : ''}
        </div>

        ${f.values?.length ? `
        <h3 class="subsection-title">Brand Values</h3>
        <div class="values-grid">
          ${f.values.map(v => `
            <div class="value-card">
              <div class="value-name">${v.name}</div>
              <div class="value-desc">${v.description}</div>
            </div>`).join('')}
        </div>` : ''}

        ${f.personality?.length ? `
        <h3 class="subsection-title">Brand Personality</h3>
        <div class="personality-table">
          <div class="personality-header">
            <span>We Are</span>
            <span>We're Not</span>
          </div>
          ${f.personality.map(p => `
            <div class="personality-row">
              <span class="personality-trait">${p.trait}</span>
              <span class="personality-vs">vs</span>
              <span class="personality-not">${p.not}</span>
            </div>`).join('')}
        </div>` : ''}
      </div>`;
  }

  // ── 03 Logo ──────────────────────────────
  function renderLogo(num = '03') {
    const l = BRAND.logo || {};

    const heroContent = l.primary
      ? `<img class="logo-hero-img" src="${l.primary}" alt="${BRAND.name} logo"
           onerror="this.outerHTML='<div class=logo-hero-text>${BRAND.name}</div>'">`
      : `<div class="logo-hero-text">${BRAND.name}</div>`;

    // Core variants always shown
    const coreVariants = [
      { label: 'Primary',     desc: 'On dark backgrounds',  src: l.primary,   bg: '#0A0A0F', tc: '#fff' },
      { label: 'Reversed',    desc: 'On light backgrounds', src: l.reversed || l.white || l.dark, bg: '#F0F0FF', tc: '#000' },
      { label: 'Symbol',      desc: 'Icon / mark only',     src: l.icon,      bg: BRAND.accentColor || '#8B5CF6', tc: '#fff' },
      { label: 'Wordmark',    desc: 'Typographic only',     src: l.wordmark,  bg: '#18181F', tc: '#fff' },
      { label: 'Full Lockup', desc: 'Icon + wordmark',      src: l.lockup,    bg: '#0F0F1A', tc: '#fff' },
      { label: 'Color Alt',   desc: 'Brand color background',src: l.colorAlt, bg: BRAND.accentColor2 || '#06B6D4', tc: '#fff' },
    ];

    // Extra custom variants from BRAND.logo.variants array
    const extraVariants = (l.variants || []).map(v => ({
      label: v.label || 'Variant',
      desc:  v.desc  || '',
      src:   v.src   || '',
      bg:    v.bg    || '#111110',
      tc:    v.tc    || '#fff',
    }));

    const allVariants = [...coreVariants, ...extraVariants];

    return `
      <div class="section-inner">
        ${sectionHead(num, 'Logo System', 'Logo System', 'Our logo is the most recognisable expression of our brand. Treat it with care.')}

        <div class="logo-hero">
          <div class="logo-hero-dot-grid"></div>
          ${heroContent}
        </div>

        <div class="logo-variants-expanded">
          ${allVariants.map(v => logoVariant(v.label, v.desc, v.src, v.bg, v.tc)).join('')}
        </div>

        <div class="logo-rules-grid">
          <div class="logo-rule-card">
            <div class="rule-card-header">
              <span class="rule-card-title">Clear Space & Sizing</span>
            </div>
            ${l.clearSpace ? `<p style="font-size:14px;color:var(--text-secondary);line-height:1.65;margin-bottom:var(--sp-4)">${l.clearSpace}</p>` : ''}
            ${l.minSize ? `
            <div class="logo-spec-grid">
              ${l.minSize.print   ? `<div class="logo-spec-item"><div class="logo-spec-label">Print min.</div><div class="logo-spec-value">${l.minSize.print}</div></div>` : ''}
              ${l.minSize.digital ? `<div class="logo-spec-item"><div class="logo-spec-label">Digital min.</div><div class="logo-spec-value">${l.minSize.digital}</div></div>` : ''}
            </div>` : ''}
          </div>

          ${l.donts?.length ? `
          <div class="logo-rule-card">
            <div class="rule-card-header">
              <span class="badge badge-dont">Don't</span>
              <span class="rule-card-title">Logo Don'ts</span>
            </div>
            <ul class="rule-list">
              ${l.donts.map(d => `<li class="rule-item">${d}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      </div>`;
  }

  function logoVariant(label, desc, src, bg, textColor) {
    const inner = src
      ? `<img style="max-height:56px;max-width:160px;object-fit:contain" src="${src}" alt="${label}"
           onerror="this.outerHTML='<span style=font-family:var(--font-display);font-size:20px;font-weight:800;color:${textColor}>${BRAND.name}</span>'">`
      : `<span style="font-family:var(--font-display);font-size:20px;font-weight:800;color:${textColor};opacity:0.25">${BRAND.name}</span>`;

    return `
      <div class="logo-variant">
        <div class="logo-variant-preview" style="background:${bg}">${inner}</div>
        <div class="logo-variant-info">
          <div class="logo-variant-name">${label}</div>
          <div class="logo-variant-desc">${desc}</div>
        </div>
      </div>`;
  }

  // ── 03 Colors ────────────────────────────
  function renderColors() {
    const c = BRAND.colors;
    if (!c) return '<p style="color:var(--text-muted)">No color data configured.</p>';

    return `
      <div class="section-inner">
        ${sectionHead('04', 'Color System', 'Color System', 'Color is one of the most immediate expressions of our brand. Use it with intention.')}

        ${c.primary?.length   ? colorPalette('Primary Palette',    c.primary)   : ''}
        ${c.secondary?.length ? colorPalette('Secondary Palette',  c.secondary) : ''}
        ${c.functional?.length ? colorPalette('Functional Colors', c.functional) : ''}

        ${c.ratios?.length ? `
        <div class="color-ratios">
          <div class="ratios-title">Color Usage Ratios</div>
          <div class="ratio-bar">
            ${c.ratios.map(r => `
              <div class="ratio-segment" style="flex:${r.percent};background:${r.hex}">
                <span style="color:${isLightHex(r.hex) ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'};font-weight:700;font-size:11px">${r.percent}%</span>
              </div>`).join('')}
          </div>
          <div class="ratio-legend">
            ${c.ratios.map(r => `
              <div class="ratio-legend-row">
                <div class="ratio-dot" style="background:${r.hex}"></div>
                <span class="ratio-percent">${r.percent}%</span>
                <span style="font-weight:600;color:var(--text-primary)">${r.name}</span>
                <span class="ratio-note">— ${r.note}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}
      </div>`;
  }

  function colorPalette(title, colors) {
    return `
      <div class="palette-block">
        <div class="palette-label">${title}</div>
        <div class="swatch-row">
          ${colors.map(c => {
            const light = isLightHex(c.hex);
            return `
              <div class="color-swatch">
                <div class="swatch-chip" style="background:${c.hex}">
                  ${c.pantone ? `<span class="swatch-pantone" style="color:${light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'}">P ${c.pantone}</span>` : ''}
                </div>
                <div class="swatch-body">
                  <div class="swatch-name">${c.name}</div>
                  <div class="swatch-hex">${c.hex}</div>
                  ${c.rgb  ? `<div class="swatch-rgb">RGB ${c.rgb}</div>`  : ''}
                  ${c.cmyk ? `<div class="swatch-rgb">CMYK ${c.cmyk}</div>` : ''}
                  ${c.usage ? `<div class="swatch-usage">${c.usage}</div>` : ''}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // ── 05 Typography ────────────────────────
  function renderTypography(num = '05') {
    const t = BRAND.typography;
    if (!t) return '<p style="color:var(--text-muted)">No typography data configured.</p>';

    const displayName = t.display?.name || 'Syne';
    const bodyName    = t.body?.name    || 'Inter';

    return `
      <div class="section-inner">
        ${sectionHead(num, 'Typography', 'Typography System', 'Our typefaces carry brand personality into every word we write.')}
      </div>

      ${t.display ? typeSpecimenBlock(t.display, 'Display / Headline', `'${displayName}', var(--font-display)`) : ''}
      ${t.body    ? typeSpecimenBlock(t.body,    'Body / UI',           `'${bodyName}', var(--font-sans)`)      : ''}

      <div class="section-inner">
        ${(t.conventions || t.scale)?.length ? `
        <div class="type-scale">
          <div class="type-scale-header">
            <span>Convention</span>
            <span>Specimen</span>
          </div>
          ${(t.conventions || t.scale).map(s => {
            const fontFamily = s.font === 'display'
              ? `'${displayName}', var(--font-display)`
              : `'${bodyName}', var(--font-sans)`;
            const lh   = s.lineHeight || s.leading || '1.5';
            const size = s.size || '16px';
            const wt   = s.weight || '400';
            const tr   = s.tracking || '0';
            const tf   = s.transform || 'none';
            const mob  = s.sizeMobile ? ` / ${s.sizeMobile} mobile` : '';
            return `
            <div class="type-scale-row">
              <div class="scale-meta">
                <div class="scale-meta-name">${s.name}</div>
                <div class="scale-meta-spec">${size}${mob} · wt ${wt} · lh ${lh}${tr !== '0' ? ` · ls ${tr}` : ''}${tf !== 'none' ? ` · ${tf}` : ''}</div>
                <div class="scale-meta-usage">${s.usage || ''}</div>
              </div>
              <div class="scale-sample" style="font-size:clamp(12px,${size},48px);font-weight:${wt};line-height:${lh};letter-spacing:${tr};text-transform:${tf};font-family:${fontFamily}">
                The quick brown fox jumps
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>`;
  }

  function typeSpecimenBlock(family, role, fontFace) {
    const weightNums = (family.weights || []).map(w => {
      const m = String(w).match(/\d{3}/);
      return m ? parseInt(m[0]) : 400;
    });
    const heaviest = weightNums.length ? Math.max(...weightNums) : 800;

    return `
      <div class="type-specimen-block">
        <div class="type-specimen-meta">
          <div class="type-specimen-role">${role}</div>
          <div class="type-specimen-name" style="font-family:${fontFace};font-weight:${heaviest}">${family.name}</div>
          <div class="type-specimen-usage">${family.usage || ''}</div>
          <div class="type-weights">
            ${(family.weights || []).map(w => {
              const m = String(w).match(/\d{3}/);
              const n = m ? parseInt(m[0]) : 400;
              return `<span class="weight-tag" style="font-family:${fontFace};font-weight:${n}">${w}</span>`;
            }).join('')}
          </div>
        </div>
        <div class="type-specimen-display" style="font-family:${fontFace};font-weight:${heaviest}">
          <div class="type-alphabet">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm</div>
          <div class="type-alphabet-lower">Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
          <div class="type-numerals">0 1 2 3 4 5 6 7 8 9</div>
        </div>
      </div>`;
  }

  // ── 06 Imagery ───────────────────────────
  function renderImagery(num = '06') {
    const img = BRAND.imagery;
    if (!img) return '<p style="color:var(--text-muted)">No imagery data configured.</p>';

    const validPhotos = (img.photos || []).filter(Boolean);

    return `
      <div class="section-inner">
        ${sectionHead(num, 'Imagery', 'Imagery & Visual Language')}

        ${img.style ? `
        <div class="imagery-style-card">
          <div class="imagery-quote">"${img.style.description}"</div>
          ${img.style.keywords?.length ? `
          <div class="imagery-keywords">
            ${img.style.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
          </div>` : ''}
        </div>` : ''}

        ${img.aiPrompt ? `
        <div class="imagery-ai-prompt">
          <div class="imagery-ai-prompt-label">
            <span>✦ Generation Prompt</span>
            <button class="copy-prompt-btn" data-copy="${encodeURIComponent(img.aiPrompt)}">Copy</button>
          </div>
          <div class="imagery-ai-prompt-text">${img.aiPrompt}</div>
        </div>` : ''}

        <div class="imagery-rules">
          ${img.dos?.length ? `
          <div class="imagery-rule-card">
            <div class="imagery-rule-header">
              <span class="badge badge-do">Do</span>
              <span class="imagery-rule-title">Photography Dos</span>
            </div>
            <ul class="imagery-rule-list">
              ${img.dos.map(d => `<li class="imagery-rule-item do">${d}</li>`).join('')}
            </ul>
          </div>` : ''}

          ${img.donts?.length ? `
          <div class="imagery-rule-card">
            <div class="imagery-rule-header">
              <span class="badge badge-dont">Don't</span>
              <span class="imagery-rule-title">Photography Don'ts</span>
            </div>
            <ul class="imagery-rule-list">
              ${img.donts.map(d => `<li class="imagery-rule-item dont">${d}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      </div>

      ${validPhotos.length ? `
      <div class="imagery-gallery-fullbleed">
        ${validPhotos.map((p, i) => `
          <div class="imagery-gallery-cell">
            <img src="${p}" alt="Brand photo ${i + 1}"
              onerror="this.parentNode.style.display='none'">
          </div>`).join('')}
      </div>` : ''}`;
  }

  // ── 06 Voice & Tone ──────────────────────
  function renderVoice() {
    const v = BRAND.voice;
    if (!v) return '<p style="color:var(--text-muted)">No voice data configured.</p>';

    return `
      <div class="section-inner">
        ${sectionHead('07', 'Voice & Tone', 'Voice & Tone')}

        ${v.description ? `
        <div class="voice-intro">
          <div class="voice-intro-text">${v.description}</div>
        </div>` : ''}

        ${v.attributes?.length ? `
        <div class="voice-attributes">
          ${v.attributes.map(a => `
            <div class="voice-attr-card">
              <div class="voice-attr-trait">${a.trait}</div>
              <div class="voice-attr-desc">${a.description}</div>
              ${a.example ? `<div class="voice-example">${a.example}</div>` : ''}
            </div>`).join('')}
        </div>` : ''}

        ${(v.weare?.length || v.werenot?.length) ? `
        <div class="voice-weare">
          <div>
            <div class="weare-col-label pos">We Are</div>
            <ul class="weare-list">
              ${(v.weare || []).map(t => `<li class="weare-item pos">${t}</li>`).join('')}
            </ul>
          </div>
          <div class="weare-divider"></div>
          <div>
            <div class="weare-col-label neg">We're Not</div>
            <ul class="weare-list">
              ${(v.werenot || []).map(t => `<li class="weare-item neg">${t}</li>`).join('')}
            </ul>
          </div>
        </div>` : ''}

        ${v.channelTones?.length ? `
        <h3 class="subsection-title">Tone by Channel</h3>
        <div class="voice-channels">
          ${v.channelTones.map(c => `
            <div class="channel-row">
              <span class="channel-name">${c.channel}</span>
              <span class="channel-tone">${c.tone}</span>
              <span class="channel-example">${c.example}</span>
            </div>`).join('')}
        </div>` : ''}
      </div>`;
  }

  // ── 07 Applications ──────────────────────
  function renderApplications() {
    const apps = BRAND.applications;

    return `
      <div class="section-inner">
        ${sectionHead('08', 'In Use', 'Brand in Use', 'How our brand comes to life across touchpoints and applications.')}

        ${apps?.length ? `
        <div class="apps-grid">
          ${apps.map(app => `
            <div class="app-card">
              <div class="app-preview">
                ${app.image
                  ? `<img src="${app.image}" alt="${app.name}"
                       onerror="this.parentNode.innerHTML='<div class=app-preview-placeholder>${app.name}</div>'">`
                  : `<div class="app-preview-placeholder">${app.name}</div>`}
              </div>
              <div class="app-info">
                <div class="app-name">${app.name}</div>
                ${app.description ? `<div class="app-desc">${app.description}</div>` : ''}
              </div>
            </div>`).join('')}
        </div>` : `<p style="color:var(--text-muted)">Add application images to brand.config.js to populate this section.</p>`}
      </div>`;
  }

  // ── 07 Icons ─────────────────────────────
  function renderIcons(num = '07') {
    const ic = BRAND.icons || {};
    const images = (ic.images || []).filter(Boolean);
    return `
      <div class="section-inner">
        ${sectionHead(num, 'Icons', 'Icon System')}
        ${ic.family ? `<p class="section-desc" style="margin-top:-var(--sp-4)">Icon family: <strong>${ic.family}</strong>${ic.style ? ` · Style: ${ic.style}` : ''}</p>` : ''}
        ${ic.description ? `<p class="section-desc">${ic.description}</p>` : ''}
        ${ic.colors?.length ? `<div class="icon-color-row">${ic.colors.map(h => `<span class="icon-swatch" style="background:${h}" title="${h}"></span>`).join('')}</div>` : ''}
      </div>
      ${images.length ? `
      <div class="asset-gallery-fullbleed">
        ${images.map((src, i) => `<div class="asset-gallery-cell"><img src="${src}" alt="Icon ${i+1}" onerror="this.parentNode.style.display='none'"></div>`).join('')}
      </div>` : `<div class="section-inner"><p style="color:var(--text-muted);font-size:14px">Upload icon set images in the editor to populate this section.</p></div>`}
    `;
  }

  // ── 08 Illustration ──────────────────────
  function renderIllustration(num = '08') {
    const il = BRAND.illustration || {};
    const images = (il.images || []).filter(Boolean);
    return `
      <div class="section-inner">
        ${sectionHead(num, 'Illustration', 'Illustration System')}
        ${il.style ? `<p class="section-desc">${il.style}</p>` : ''}
        ${il.colors?.length ? `<div class="icon-color-row">${il.colors.map(h => `<span class="icon-swatch" style="background:${h}" title="${h}"></span>`).join('')}</div>` : ''}
      </div>
      ${images.length ? `
      <div class="asset-gallery-fullbleed asset-gallery-2col">
        ${images.map((src, i) => `<div class="asset-gallery-cell"><img src="${src}" alt="Illustration ${i+1}" onerror="this.parentNode.style.display='none'"></div>`).join('')}
      </div>` : `<div class="section-inner"><p style="color:var(--text-muted);font-size:14px">Upload illustration examples in the editor to populate this section.</p></div>`}
    `;
  }

  // ── 09 Patterns ──────────────────────────
  function renderPatterns(num = '09') {
    const pt = BRAND.patterns || {};
    const images = (pt.images || []).filter(Boolean);
    return `
      <div class="section-inner">
        ${sectionHead(num, 'Patterns', 'Patterns & Shapes')}
        ${pt.description ? `<p class="section-desc">${pt.description}</p>` : ''}
      </div>
      ${images.length ? `
      <div class="asset-gallery-fullbleed asset-gallery-4col">
        ${images.map((src, i) => `<div class="asset-gallery-cell pattern-cell"><img src="${src}" alt="Pattern ${i+1}" onerror="this.parentNode.style.display='none'"></div>`).join('')}
      </div>` : `<div class="section-inner"><p style="color:var(--text-muted);font-size:14px">Upload pattern and shape assets in the editor to populate this section.</p></div>`}
    `;
  }

  // ════════════════════════════════════════
  //  INLINE EDITOR SYSTEM
  // ════════════════════════════════════════

  let _uploads = {}; // pending file base64 data during an edit session

  // ── Core utilities ──────────────────────
  function deepSet(obj, path, value) {
    const keys = path.split('.');
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!o[keys[i]] || typeof o[keys[i]] !== 'object') o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }

  function readFileB64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // Compress image via canvas before storing — keeps localStorage manageable.
  // SVGs are passed through unmodified (canvas can't reliably re-encode them).
  function compressImage(file, maxWidth, quality) {
    maxWidth = maxWidth || 1200;
    quality  = quality  || 0.75;
    // Keep SVG as-is
    if (file.type === 'image/svg+xml') return readFileB64(file);
    return new Promise((res, rej) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(objUrl);
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        res(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = rej;
      img.src = objUrl;
    });
  }

  function gv(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function getList(id) {
    const el = document.getElementById(id);
    if (!el) return [];
    return [...el.querySelectorAll('.erow-input')].map(i => i.value.trim()).filter(Boolean);
  }

  function getRows(id, fields) {
    const el = document.getElementById(id);
    if (!el) return [];
    return [...el.querySelectorAll('.erow[data-row]')].map(row => {
      const obj = {};
      fields.forEach(f => { const i = row.querySelector(`[data-f="${f}"]`); if (i) obj[f] = i.value.trim(); });
      return obj;
    }).filter(obj => fields.some(f => obj[f]));
  }

  // ── Available LLM models ─────────────────
  const LLM_MODELS = [
    { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'anthropic', key: 'bb_api_key' },
    { id: 'claude-haiku-4-5',  label: 'Claude Haiku 4.5',  provider: 'anthropic', key: 'bb_api_key' },
    { id: 'claude-opus-4-5',   label: 'Claude Opus 4.5',   provider: 'anthropic', key: 'bb_api_key' },
    { id: 'gpt-5.4',           label: 'GPT-5.4',             provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-5.4-mini',     label: 'GPT-5.4 mini',        provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-5.2',          label: 'GPT-5.2',             provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-4o',            label: 'GPT-4o',              provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-4o-mini',       label: 'GPT-4o mini',         provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-4.1',           label: 'GPT-4.1',             provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-4.1-mini',      label: 'GPT-4.1 mini',        provider: 'openai', key: 'bb_openai_key' },
    { id: 'gpt-4.5-preview',   label: 'GPT-4.5 preview',     provider: 'openai', key: 'bb_openai_key' },
    { id: 'o4-mini',           label: 'o4-mini',             provider: 'openai', key: 'bb_openai_key' },
    { id: 'o3',                label: 'o3',                  provider: 'openai', key: 'bb_openai_key' },
  ];

  const MOCKUP_TYPES = [
    'Product Hero Shot', 'Social Media Post', 'Business Card', 'Website Hero Section',
    'Mobile App Screen', 'Packaging / Box', 'Billboard / OOH Ad', 'Email Newsletter Header',
    'Merchandise / Apparel', 'Presentation Slide', 'Stationery / Letterhead',
    'Storefront / Signage', 'Magazine Editorial Spread', 'Digital Banner Ad',
    'Environmental Branding', 'Book Cover', 'Poster / Flyer', 'Landing Page Section',
  ];

  function getSelectedModel() {
    const saved = sessionStorage.getItem('bb_selected_model') || 'claude-sonnet-4-5';
    return LLM_MODELS.find(m => m.id === saved) || LLM_MODELS[0];
  }

  // ── Unified AI call (Anthropic + OpenAI) ─
  async function callAI({ prompt, images = [], json = true }) {
    const model = getSelectedModel();
    const apiKey = sessionStorage.getItem(model.key);
    if (!apiKey) throw new Error(`No API key for ${model.label}. Set it in the intake page.`);

    if (model.provider === 'anthropic') {
      const content = [
        ...images.map(src => ({
          type: 'image',
          source: { type: 'base64', media_type: src.match(/data:(image\/\w+);/)?.[1] || 'image/jpeg', data: src.replace(/^data:image\/\w+;base64,/, '') },
        })),
        { type: 'text', text: prompt },
      ];
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: model.id, max_tokens: 1500, messages: [{ role: 'user', content }] }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || res.statusText); }
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      if (!json) return text;
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('No JSON in response');
      return JSON.parse(m[0]);

    } else {
      // OpenAI
      const msgContent = [
        ...images.map(src => ({ type: 'image_url', image_url: { url: src } })),
        { type: 'text', text: prompt },
      ];
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model.id, max_tokens: 1500, messages: [{ role: 'user', content: msgContent }] }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || res.statusText); }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (!json) return text;
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('No JSON in response');
      return JSON.parse(m[0]);
    }
  }

  // ── Image generation via DALL-E 3 ────────
  async function generateImage(promptText) {
    const key = sessionStorage.getItem('bb_openai_key');
    if (!key) throw new Error('OpenAI key required for image generation. Add bb_openai_key in intake.');
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'dall-e-3', prompt: promptText, n: 1, size: '1024x1024', response_format: 'b64_json' }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || res.statusText); }
    const data = await res.json();
    return 'data:image/png;base64,' + data.data[0].b64_json;
  }

  function persistBrand() {
    const urlId = new URLSearchParams(location.search).get('id');
    const id = urlId || BRAND.id;
    if (!id) {
      console.error('[Brandbook] persistBrand: no id found — BRAND.id:', BRAND.id);
      return { ok: false, err: 'Brand has no ID. Re-open from the dashboard.' };
    }
    if (typeof Projects === 'undefined') {
      return { ok: false, err: 'Projects module not loaded.' };
    }
    try {
      BRAND.id = id;
      const saved = Projects.save({ ...BRAND, id });
      console.log('[Brandbook] Saved id=%s name=%s', saved.id, saved.name);
      try { sessionStorage.setItem('bb_last_brand', JSON.stringify(saved)); } catch(e) {}
      return { ok: true };
    } catch (err) {
      console.error('[Brandbook] Save error:', err);
      if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        return { ok: false, err: 'Storage full — try removing some photos.' };
      }
      return { ok: false, err: err.message || 'Unknown save error.' };
    }
  }

  function escV(v) {
    return String(v || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }

  // ── Re-render a single section ──────────
  function reRenderSection(id) {
    const section = document.getElementById(`section-${id}`);
    const def = SECTIONS.find(s => s.id === id);
    if (!section || !def) return;
    section.classList.remove('editing');
    const editSVG = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z"/></svg>`;
    section.innerHTML = `
      <button class="section-edit-btn" data-edit="${id}" title="Edit section">${editSVG} Edit</button>
      ${def.render(def.num)}
    `;
  }

  // ── Open / Cancel / Save ────────────────
  function openEditor(sectionId) {
    _uploads = {};
    const section = document.getElementById(`section-${sectionId}`);
    const def = SECTIONS.find(s => s.id === sectionId);
    const edFn = EDITORS[sectionId];
    if (!section || !def || !edFn) return;

    const curModel = getSelectedModel();
    const modelOptions = LLM_MODELS.map(m =>
      `<option value="${m.id}" ${m.id === curModel.id ? 'selected' : ''}>${m.label}</option>`
    ).join('');

    section.classList.add('editing');
    section.innerHTML = `
      <div class="editor-shell">
        <div class="editor-topbar">
          <span class="editor-topbar-title">${def.label}</span>
          <div class="editor-topbar-center">
            <label class="model-select-wrap" title="AI model used for generation & analysis">
              <span class="model-select-icon">✦</span>
              <select class="model-select" id="editor-model-select">${modelOptions}</select>
            </label>
          </div>
          <div class="editor-topbar-actions">
            <button class="editor-btn-cancel" data-cancel="${sectionId}">Cancel</button>
            <button class="editor-btn-save"   data-save="${sectionId}">Save Changes</button>
          </div>
        </div>
        <div class="editor-body" id="editor-body-${sectionId}">${edFn()}</div>
      </div>
    `;

    // Persist model selection
    section.querySelector('#editor-model-select').addEventListener('change', function() {
      sessionStorage.setItem('bb_selected_model', this.value);
    });

    // Wire topbar buttons
    section.querySelector('[data-cancel]').addEventListener('click', () => { _uploads = {}; reRenderSection(sectionId); });
    section.querySelector('[data-save]').addEventListener('click',   () => saveEditor(sectionId));

    // Wire file inputs
    wireFiles(sectionId);

    // Wire cover-bg-picker
    if (sectionId === 'cover') {
      const body = document.getElementById(`editor-body-${sectionId}`);
      if (body) {
        body.addEventListener('click', e => {
          const pill = e.target.closest('.cover-color-pill');
          if (!pill) return;
          body.querySelectorAll('.cover-color-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          document.getElementById('ed-cover-bg').value = pill.dataset.hex || '#0A0A0F';
        });
      }
    }

    // Wire imagery editor controls
    if (sectionId === 'imagery') {
      // Style reference image upload → show + enable Generate Description button
      const refInput = document.getElementById('style-ref-input');
      if (refInput) {
        refInput.addEventListener('change', async function() {
          const file = this.files[0]; if (!file) return;
          // Keep higher res for AI analysis (vision needs detail), but compress for storage
          const url = await compressImage(file, 1600, 0.85);
          _styleRefImage = url;
          const prev = document.getElementById('style-ref-preview');
          if (prev) {
            prev.style.position = 'relative';
            prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;position:absolute;inset:0" alt=""><label style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;padding:4px 8px;border-radius:4px;cursor:pointer;z-index:2"><input type="file" class="style-ref-change-input" accept="image/*" style="display:none">Change</label>`;
            // Wire the "Change" input inside the preview
            prev.querySelector('.style-ref-change-input')?.addEventListener('change', async function() {
              const f2 = this.files[0]; if (!f2) return;
              const u2 = await compressImage(f2, 1600, 0.85);
              _styleRefImage = u2;
              prev.querySelector('img').src = u2;
            });
          }
          // Always show + enable the button after upload
          const analyzeBtn = document.getElementById('btn-analyze-style');
          if (analyzeBtn) {
            analyzeBtn.style.display = 'block';
            analyzeBtn.disabled = false;
            analyzeBtn.removeAttribute('title');
          }
        });
      }
      const analyzeBtn = document.getElementById('btn-analyze-style');
      if (analyzeBtn) analyzeBtn.addEventListener('click', () => analyzeImageryStyle());

      // Generate keywords button
      const kwBtn = document.getElementById('btn-gen-keywords');
      if (kwBtn) kwBtn.addEventListener('click', () => generateKeywords());

      // Generate image button (global, uses first empty slot)
      const genBtn = document.getElementById('btn-gen-image');
      if (genBtn) genBtn.addEventListener('click', () => generateBrandImage());
    }

    // Wire typography convention: add row + delete rows
    if (sectionId === 'typography') {
      const body = document.getElementById(`editor-body-${sectionId}`);
      if (body) {
        const addConvBtn = document.getElementById('btn-add-conv');
        if (addConvBtn) {
          addConvBtn.addEventListener('click', () => {
            const grid = document.getElementById('ed-t-convs');
            if (!grid) return;
            const sizeOptions = ['10px','11px','12px','13px','14px','15px','16px','18px','20px','22px','24px','28px','32px','36px','40px','48px','56px','64px','72px','80px','96px','112px','128px'];
            const weightOptions = ['100','200','300','400','500','600','700','800','900'];
            const lineHeightOptions = ['1','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','2'];
            const div = document.createElement('div');
            div.className = 'type-convention-row'; div.dataset.convRow = '';
            div.innerHTML = `
              <div class="type-convention-row-head">
                <input class="editor-input type-conv-name" data-cf="name" type="text" value="" placeholder="Convention name (e.g. H1)">
                <button type="button" class="type-conv-del">✕</button>
              </div>
              <div class="type-conv-row-fields">
                <div>
                  <div class="ef-label" style="font-size:9px;margin-bottom:3px">Font</div>
                  <select class="type-conv-select" data-cf="font">
                    <option value="display">Display</option>
                    <option value="body" selected>Body</option>
                  </select>
                </div>
                <div>
                  <div class="ef-label" style="font-size:9px;margin-bottom:3px">Size</div>
                  <select class="type-conv-select" data-cf="size">
                    <option value="">—</option>
                    ${sizeOptions.map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <div class="ef-label" style="font-size:9px;margin-bottom:3px">Weight</div>
                  <select class="type-conv-select" data-cf="weight">
                    <option value="">—</option>
                    ${weightOptions.map(w => `<option value="${w}">${w}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="type-conv-row-fields" style="margin-top:5px">
                <div>
                  <div class="ef-label" style="font-size:9px;margin-bottom:3px">Line Height</div>
                  <select class="type-conv-select" data-cf="lineHeight">
                    <option value="">—</option>
                    ${lineHeightOptions.map(l => `<option value="${l}">${l}</option>`).join('')}
                  </select>
                </div>
                <div style="grid-column:span 2">
                  <div class="ef-label" style="font-size:9px;margin-bottom:3px">Usage</div>
                  <input class="editor-input" data-cf="usage" type="text" value="" placeholder="e.g. Page headings" style="font-size:11px">
                </div>
              </div>`;
            grid.appendChild(div);
          });
        }
        // Delete convention rows via event delegation
        body.addEventListener('click', e => {
          const delBtn = e.target.closest('.type-conv-del');
          if (delBtn) delBtn.closest('[data-conv-row]')?.remove();
        });
      }
    }
  }

  let _styleRefImage = null; // holds the style reference image during imagery edit session

  function saveEditor(sectionId) {
    const saveBtn = document.querySelector(`[data-save="${sectionId}"]`);
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }

    const col = COLLECTORS[sectionId];
    if (col) col();
    Object.entries(_uploads).forEach(([path, url]) => deepSet(BRAND, path, url));
    _uploads = {};

    const result = persistBrand();

    if (!result.ok) {
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Changes'; }
      const actions = saveBtn?.closest('.editor-topbar-actions');
      if (actions) {
        let err = actions.querySelector('.save-error-msg');
        if (!err) { err = document.createElement('span'); err.className = 'save-error-msg'; actions.prepend(err); }
        err.textContent = '⚠ ' + result.err;
        setTimeout(() => err.remove(), 5000);
      }
      return;
    }

    reRenderSection(sectionId);
  }

  // ── File input wiring ───────────────────
  function wireFiles(sectionId) {
    const body = document.getElementById(`editor-body-${sectionId}`);
    if (!body) return;

    // Logo slots — SVG passthrough, raster compressed to 800px
    body.querySelectorAll('.logo-slot-input').forEach(input => {
      input.addEventListener('change', async function () {
        const file = this.files[0]; if (!file) return;
        const key = this.dataset.key;
        const safeKey = key.replace(/\./g, '-');
        try {
          const url = await compressImage(file, 800, 0.88);
          _uploads[key] = url;
          const prev = document.getElementById(`lp-${safeKey}`);
          if (prev) { prev.innerHTML = `<img src="${url}" style="max-height:60px;max-width:140px;object-fit:contain" alt="">`; prev.classList.add('filled'); }
          this.closest('.logo-slot-bg').querySelector('.logo-slot-cta').textContent = '↺ Replace';
        } catch(e) { console.warn('[Brandbook] logo upload error', e); }
      });
    });

    // Photo slots — compressed to 1100px / 72% quality
    body.querySelectorAll('.photo-slot-input').forEach(input => {
      input.addEventListener('change', async function () {
        const file = this.files[0]; if (!file) return;
        const idx = parseInt(this.dataset.idx);
        try {
          const url = await compressImage(file, 1100, 0.72);
          if (!BRAND.imagery) BRAND.imagery = {};
          if (!BRAND.imagery.photos) BRAND.imagery.photos = [];
          while (BRAND.imagery.photos.length <= idx) BRAND.imagery.photos.push('');
          BRAND.imagery.photos[idx] = url;
          const prev = document.getElementById(`pp-${idx}`);
          if (prev) { prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;display:block" alt="">`;  prev.classList.add('filled'); }
        } catch(e) { console.warn('[Brandbook] photo upload error', e); }
      });
    });

    // Generic section image slots (icons, illustration, patterns)
    body.querySelectorAll('.generic-slot-input').forEach(input => {
      input.addEventListener('change', async function () {
        const file = this.files[0]; if (!file) return;
        const section = this.dataset.section;
        const idx     = parseInt(this.dataset.idx);
        try {
          const url = await compressImage(file, 1100, 0.72);
          if (!BRAND[section]) BRAND[section] = {};
          if (!BRAND[section].images) BRAND[section].images = [];
          while (BRAND[section].images.length <= idx) BRAND[section].images.push('');
          BRAND[section].images[idx] = url;
          const prev = document.getElementById(`ps-${section}-${idx}`);
          if (prev) { prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover" alt="">`; prev.classList.add('filled'); }
        } catch(e) { console.warn('[Brandbook] generic slot upload error', e); }
      });
    });

    // App mockup slots (dynamic rows)
    body.addEventListener('change', async function(e) {
      const input = e.target.closest('.app-file-input');
      if (!input) return;
      const file = input.files[0]; if (!file) return;
      try {
        const url = await compressImage(file, 1100, 0.72);
        input.dataset.dataurl = url;
        const prev = input.closest('.app-img-slot').querySelector('.app-img-preview');
        if (prev) prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover" alt="">`;
      } catch(e) { console.warn('[Brandbook] app mockup upload error', e); }
    });

    // Photo slot v2: toggle generate panel
    body.addEventListener('click', function(e) {
      const toggleBtn = e.target.closest('[data-togglegen]');
      if (!toggleBtn) return;
      const idx = toggleBtn.dataset.togglegen;
      const panel = document.getElementById(`pgi-${idx}`);
      if (!panel) return;
      const open = panel.style.display !== 'none';
      panel.style.display = open ? 'none' : 'flex';
      panel.style.flexDirection = 'column';
      toggleBtn.classList.toggle('active', !open);
    });

    // Photo slot v2: per-slot generate button
    body.addEventListener('click', function(e) {
      const genBtn = e.target.closest('[data-genidx]');
      if (!genBtn) return;
      const idx = parseInt(genBtn.dataset.genidx);
      const panel = document.getElementById(`pgi-${idx}`);
      const mockupSel = panel?.querySelector('.photo-gen-mockup');
      const promptInput = panel?.querySelector('.photo-gen-prompt-custom');
      generateBrandImageSlot(idx, mockupSel?.value || '', promptInput?.value || '', genBtn);
    });
  }

  // ── Editor builder helpers ──────────────
  function eF(id, label, value, ph = '', type = 'text') {
    return `<div class="ef"><label class="ef-label">${label}</label><input id="${id}" class="editor-input" type="${type}" value="${escV(value)}" placeholder="${escV(ph)}"></div>`;
  }

  function eTA(id, label, value, ph = '', rows = 3) {
    return `<div class="ef ef-full"><label class="ef-label">${label}</label><textarea id="${id}" class="editor-textarea" rows="${rows}" placeholder="${escV(ph)}">${escV(value)}</textarea></div>`;
  }

  function eList(listId, label, items = [], ph = '') {
    const rows = items.map(v =>
      `<div class="erow" data-row><input class="erow-input editor-input" type="text" value="${escV(v)}" placeholder="${escV(ph)}"><button class="erow-del" type="button">✕</button></div>`
    ).join('');
    return `<div class="ef ef-full"><label class="ef-label">${label}</label>
      <div class="editor-list" id="${listId}">
        ${rows}
        <button class="erow-add" type="button" data-list="${listId}">+ Add</button>
      </div></div>`;
  }

  function eRows(listId, label, items = [], fieldDefs) {
    const cols = fieldDefs.map(f =>
      `<input class="erow-input editor-input" data-f="${f.k}" type="text" value="${escV(items.reduce ? '' : '')}" placeholder="${escV(f.ph || '')}">`
    );
    const rows = items.map(item =>
      `<div class="erow" data-row>${fieldDefs.map(f => `<input class="erow-input editor-input" data-f="${f.k}" type="text" value="${escV(item[f.k] || '')}" placeholder="${escV(f.ph || '')}">`).join('')}<button class="erow-del" type="button">✕</button></div>`
    ).join('');
    return `<div class="ef ef-full"><label class="ef-label">${label}</label>
      <div class="editor-list editor-list-rows" id="${listId}" data-fields='${JSON.stringify(fieldDefs)}'>
        ${rows}
        <button class="erow-add" type="button" data-list="${listId}" data-complex="1">+ Add</button>
      </div></div>`;
  }

  function eLogoSlot(key, label, bg = '#111110') {
    const safeKey = key.replace(/\./g, '-');
    const cur = key.split('.').reduce((o,k) => o?.[k], BRAND) || '';
    return `<div class="logo-upload-slot">
      <div class="logo-slot-bg" style="background:${bg}">
        <div class="logo-slot-preview ${cur ? 'filled' : ''}" id="lp-${safeKey}">
          ${cur ? `<img src="${cur}" style="max-height:60px;max-width:140px;object-fit:contain" alt="" onerror="this.style.display='none'">` : ''}
        </div>
        <label class="logo-slot-overlay">
          <input type="file" class="logo-slot-input" accept=".svg,.png,.jpg,.jpeg,.webp" data-key="${key}">
          <span class="logo-slot-cta">${cur ? '↺ Replace' : '+ Upload'}</span>
        </label>
      </div>
      <div class="logo-slot-label">${label}</div>
    </div>`;
  }

  function ePhotoSlot(idx) {
    const cur = (BRAND.imagery?.photos || [])[idx] || '';
    const mockupOpts = MOCKUP_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');
    return `<div class="photo-slot-v2" id="ps-wrap-${idx}">
      <div class="photo-slot-img ${cur ? 'filled' : ''}" id="pp-${idx}">
        ${cur ? `<img src="${cur}" style="width:100%;height:100%;object-fit:cover;display:block" alt="">` : '<div class="photo-slot-empty">＋</div>'}
      </div>
      <div class="photo-slot-btns">
        <label class="photo-slot-btn photo-slot-upload-lbl">
          <input type="file" class="photo-slot-input" accept="image/*" data-idx="${idx}" style="display:none">
          ↑ Upload
        </label>
        <button type="button" class="photo-slot-btn photo-slot-gen-toggle" data-togglegen="${idx}">✦ Gen</button>
      </div>
      <div class="photo-gen-inline" id="pgi-${idx}" style="display:none">
        <select class="editor-input photo-gen-mockup" style="font-size:10px">
          <option value="">— Mockup type —</option>
          ${mockupOpts}
        </select>
        <input type="text" class="editor-input photo-gen-prompt-custom" placeholder="Custom prompt…" style="font-size:10px">
        <button type="button" class="editor-ai-btn photo-gen-go" data-genidx="${idx}" style="width:100%;justify-content:center">→ Generate</button>
        <div class="photo-gen-slot-status" id="pgs-${idx}"></div>
      </div>
      <div class="photo-slot-label">Photo ${idx+1}</div>
    </div>`;
  }

  function ePhotoSlotFor(section, idx) {
    // Generic photo slot for icons/illustration/patterns sections
    const cur = ((BRAND[section] || {}).images || [])[idx] || '';
    const slotId = `ps-${section}-${idx}`;
    return `<div class="photo-upload-slot">
      <div class="photo-slot-preview ${cur ? 'filled' : ''}" id="${slotId}">
        ${cur ? `<img src="${cur}" style="width:100%;height:100%;object-fit:cover" alt="">` : ''}
        <label class="photo-slot-overlay">
          <input type="file" class="generic-slot-input" accept="image/*" data-section="${section}" data-idx="${idx}">
          <span class="photo-slot-cta">${cur ? '↺' : '+'}</span>
        </label>
      </div>
      <div class="photo-slot-label">${idx+1}</div>
    </div>`;
  }

  // Copy prompt button delegation
  document.addEventListener('click', e => {
    const btn = e.target.closest('.copy-prompt-btn');
    if (!btn) return;
    try {
      navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copy || ''));
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    } catch(e) {}
  });

  // Delegate add/delete for list editors
  document.addEventListener('click', e => {
    // Delete row
    if (e.target.classList.contains('erow-del')) {
      e.target.closest('[data-row]')?.remove();
      return;
    }
    // Add simple row
    const addBtn = e.target.closest('.erow-add');
    if (!addBtn) return;
    const listId = addBtn.dataset.list;
    const list = document.getElementById(listId);
    if (!list) return;

    const div = document.createElement('div');
    div.className = 'erow';
    div.dataset.row = '1';

    if (addBtn.dataset.complex) {
      const defs = JSON.parse(list.dataset.fields || '[]');
      div.innerHTML = defs.map(f => `<input class="erow-input editor-input" data-f="${f.k}" type="text" placeholder="${escV(f.ph || '')}">`).join('') +
        `<button class="erow-del" type="button">✕</button>`;
    } else if (list.id.startsWith('ed-c-')) {
      div.innerHTML = `<input class="erow-input editor-input" data-f="hex" type="color" value="#000000" style="width:40px;padding:3px 4px;height:32px"><input class="erow-input editor-input" data-f="name" type="text" placeholder="Name"><input class="erow-input editor-input" data-f="usage" type="text" placeholder="Usage"><button class="erow-del" type="button">✕</button>`;
    } else {
      const ph = list.dataset.placeholder || '';
      div.innerHTML = `<input class="erow-input editor-input" type="text" placeholder="${escV(ph)}"><button class="erow-del" type="button">✕</button>`;
    }
    addBtn.before(div);
  });

  // ════════════════════════════════════════
  //  EDITOR RENDERERS (one per section)
  // ════════════════════════════════════════

  const EDITORS = {
    cover() {
      const b = BRAND;
      // Build palette options from brand colors
      const allColors = [
        ...((b.colors?.primary   || []).map(c => ({ hex: c.hex, name: c.name }))),
        ...((b.colors?.secondary || []).map(c => ({ hex: c.hex, name: c.name }))),
      ].filter(c => c.hex);

      const palettePills = allColors.map(c => `
        <button type="button" class="cover-color-pill" data-hex="${c.hex}"
          style="background:${c.hex};border:2px solid ${b.coverBg === c.hex ? '#8B5CF6' : 'transparent'}"
          title="${c.name || c.hex}"></button>`).join('');

      return `<div class="editor-grid">
        ${eF('ed-name','Brand Name', b.name,'e.g. AURA')}
        ${eF('ed-tagline','Tagline', b.tagline,'Short slogan')}
        ${eF('ed-year','Year', b.year,'2025')}
        ${eF('ed-accent','Accent Color', b.accentColor,'#8B5CF6','color')}
        ${eF('ed-accent2','Accent Color 2', b.accentColor2,'#06B6D4','color')}
        ${eTA('ed-desc','Description', b.description,'One-sentence brand description',2)}
        <div class="ef ef-full">
          <label class="ef-label">Cover Background</label>
          <div class="cover-bg-picker">
            <button type="button" class="cover-color-pill cover-color-default ${!b.coverBg ? 'active' : ''}" data-hex="">Default</button>
            ${palettePills}
            <label class="cover-color-custom" title="Custom color">
              <input type="color" id="ed-cover-bg" value="${b.coverBg || '#0A0A0F'}">
              Custom
            </label>
          </div>
          <p class="ef-hint">Pick a palette color or custom color for the cover page background</p>
        </div>
        <div class="ef ef-full">
          <label class="ef-label">Cover Logo</label>
          ${eLogoSlot('logo.primary', 'Primary logo (shown on cover)', b.coverBg || '#111110')}
        </div>
      </div>`;
    },

    story() {
      const s = BRAND.story || {};
      const f = BRAND.foundation || {};
      return `<div class="editor-grid">
        ${eTA('ed-s-narr','Brand Narrative', s.narrative || '',
          '2–3 sentences about the brand origin and purpose', 4)}
        ${eTA('ed-s-strat','Strategy', s.strategy || '',
          'Core strategic positioning statement', 3)}
        ${eTA('ed-s-vis','Vision', s.vision || f.vision || '',
          'Long-term vision statement', 2)}
        ${eTA('ed-s-miss','Mission', s.mission || f.mission || '',
          'Current mission statement', 2)}
      </div>`;
    },

    foundation() {
      const f = BRAND.foundation || {};
      return `<div class="editor-grid">
        ${eTA('ed-f-miss','Mission', f.mission || '', '', 2)}
        ${eTA('ed-f-vis','Vision', f.vision || '', '', 2)}
        ${eTA('ed-f-aud','Target Audience', f.audience || '', '', 2)}
        ${eRows('ed-f-values','Brand Values', f.values || [],
          [{k:'name',ph:'Value name'},{k:'description',ph:'Description'}])}
        ${eRows('ed-f-pers','Personality (We Are / Not)', f.personality || [],
          [{k:'trait',ph:'We are…'},{k:'not',ph:'Not…'}])}
      </div>`;
    },

    logo() {
      const l = BRAND.logo || {};
      const accent  = BRAND.accentColor  || '#8B5CF6';
      const accent2 = BRAND.accentColor2 || '#06B6D4';
      return `<div class="editor-grid">
        <div class="ef ef-full">
          <label class="ef-label">Core Logo Variants</label>
          <div class="logo-upload-grid logo-upload-grid-6">
            ${eLogoSlot('logo.primary',  'Primary (dark bg)',   '#111110')}
            ${eLogoSlot('logo.reversed', 'Reversed (light bg)', '#F0F0F0')}
            ${eLogoSlot('logo.icon',     'Symbol / Icon',       accent)}
            ${eLogoSlot('logo.wordmark', 'Wordmark / Text',     '#18181F')}
            ${eLogoSlot('logo.lockup',   'Full Lockup',         '#0F0F1A')}
            ${eLogoSlot('logo.colorAlt', 'Color Variant',       accent2)}
          </div>
          <p class="ef-hint">SVG recommended · PNG / JPG / WebP accepted · Max 600KB</p>
        </div>
        ${eF('ed-l-cs','Clear Space Rule', l.clearSpace || '', '1× cap-height on all sides')}
        ${eF('ed-l-mp','Min Size — Print', l.minSize?.print || '', '15mm')}
        ${eF('ed-l-md','Min Size — Digital', l.minSize?.digital || '', '60px')}
        ${eList('ed-l-donts',"Logo Don'ts", l.donts || [], 'Do not…')}
        <div class="ef ef-full">
          <label class="ef-label">Additional Custom Variants</label>
          <div class="editor-list editor-list-rows" id="ed-l-variants">
            ${(l.variants || []).map(v => `
              <div class="erow" data-row>
                <input class="erow-input editor-input" data-f="label" type="text" value="${escV(v.label)}" placeholder="Label">
                <input class="erow-input editor-input" data-f="desc"  type="text" value="${escV(v.desc)}"  placeholder="Description">
                <input class="erow-input editor-input color-hex" data-f="bg" type="color" value="${v.bg || '#111110'}">
                <button class="erow-del" type="button">✕</button>
              </div>`).join('')}
            <button class="erow-add" type="button" data-list="ed-l-variants">+ Add Variant</button>
          </div>
          <p class="ef-hint">Upload images for custom variants via the logo slots above after saving</p>
        </div>
      </div>`;
    },

    colors() {
      function colorRows(arr) {
        return (arr || []).map(c =>
          `<div class="erow" data-row>
            <input class="erow-input editor-input color-hex" data-f="hex" type="color" value="${c.hex || '#000000'}">
            <input class="erow-input editor-input" data-f="name" type="text" value="${escV(c.name)}" placeholder="Name">
            <input class="erow-input editor-input" data-f="usage" type="text" value="${escV(c.usage)}" placeholder="Usage note">
            <button class="erow-del" type="button">✕</button>
          </div>`
        ).join('');
      }
      const c = BRAND.colors || {};
      return `<div class="editor-grid">
        <div class="ef ef-full"><label class="ef-label">Primary Palette</label>
          <div class="editor-list editor-list-rows" id="ed-c-primary">
            ${colorRows(c.primary)}
            <button class="erow-add" type="button" data-list="ed-c-primary">+ Add Color</button>
          </div></div>
        <div class="ef ef-full"><label class="ef-label">Secondary Palette</label>
          <div class="editor-list editor-list-rows" id="ed-c-secondary">
            ${colorRows(c.secondary)}
            <button class="erow-add" type="button" data-list="ed-c-secondary">+ Add Color</button>
          </div></div>
        <div class="ef ef-full"><label class="ef-label">Functional Colors</label>
          <div class="editor-list editor-list-rows" id="ed-c-functional">
            ${colorRows(c.functional)}
            <button class="erow-add" type="button" data-list="ed-c-functional">+ Add Color</button>
          </div></div>
      </div>`;
    },

    typography() {
      const t = BRAND.typography || {};
      const d = t.display || {};
      const b = t.body    || {};
      const convs = t.conventions || t.scale || [];

      const sizeOptions = ['10px','11px','12px','13px','14px','15px','16px','18px','20px','22px','24px','28px','32px','36px','40px','48px','56px','64px','72px','80px','96px','112px','128px'];
      const weightOptions = ['100','200','300','400','500','600','700','800','900'];
      const lineHeightOptions = ['1','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','2'];

      function convRow(c = {}) {
        const sizeOpts = sizeOptions.map(s => `<option value="${s}" ${c.size === s ? 'selected' : ''}>${s}</option>`).join('');
        const wtOpts   = weightOptions.map(w => `<option value="${w}" ${(c.weight||'').toString() === w ? 'selected' : ''}>${w}</option>`).join('');
        const lhOpts   = lineHeightOptions.map(l => `<option value="${l}" ${(c.lineHeight||c.leading||'') === l ? 'selected' : ''}>${l}</option>`).join('');
        return `<div class="type-convention-row" data-conv-row>
          <div class="type-convention-row-head">
            <input class="editor-input type-conv-name" data-cf="name" type="text" value="${escV(c.name||'')}" placeholder="Convention name (e.g. H1)">
            <button type="button" class="type-conv-del">✕</button>
          </div>
          <div class="type-conv-row-fields">
            <div>
              <div class="ef-label" style="font-size:9px;margin-bottom:3px">Font</div>
              <select class="type-conv-select" data-cf="font">
                <option value="display" ${c.font === 'display' ? 'selected' : ''}>Display</option>
                <option value="body" ${c.font !== 'display' ? 'selected' : ''}>Body</option>
              </select>
            </div>
            <div>
              <div class="ef-label" style="font-size:9px;margin-bottom:3px">Size</div>
              <select class="type-conv-select" data-cf="size">
                <option value="">—</option>
                ${sizeOpts}
              </select>
            </div>
            <div>
              <div class="ef-label" style="font-size:9px;margin-bottom:3px">Weight</div>
              <select class="type-conv-select" data-cf="weight">
                <option value="">—</option>
                ${wtOpts}
              </select>
            </div>
          </div>
          <div class="type-conv-row-fields" style="margin-top:5px">
            <div>
              <div class="ef-label" style="font-size:9px;margin-bottom:3px">Line Height</div>
              <select class="type-conv-select" data-cf="lineHeight">
                <option value="">—</option>
                ${lhOpts}
              </select>
            </div>
            <div style="grid-column:span 2">
              <div class="ef-label" style="font-size:9px;margin-bottom:3px">Usage</div>
              <input class="editor-input" data-cf="usage" type="text" value="${escV(c.usage||'')}" placeholder="e.g. Page headings" style="font-size:11px">
            </div>
          </div>
        </div>`;
      }

      return `<div class="editor-grid">
        ${eF('ed-t-dn','Display Font Name', d.name || '', 'e.g. Syne')}
        ${eF('ed-t-dw','Display Weights (comma-separated)', (d.weights||[]).join(', '), 'Regular 400, Bold 700')}
        ${eF('ed-t-du','Display Usage', d.usage || '', 'Headlines, display text')}
        ${eF('ed-t-bn','Body Font Name', b.name || '', 'e.g. Inter')}
        ${eF('ed-t-bw','Body Weights (comma-separated)', (b.weights||[]).join(', '), 'Regular 400, Medium 500')}
        ${eF('ed-t-bu','Body Usage', b.usage || '', 'Body copy, UI text')}
        <div class="ef ef-full">
          <div class="ef-row-header">
            <label class="ef-label">Type Conventions / Scale</label>
            <button type="button" class="editor-ai-btn-sm" id="btn-add-conv">+ Add Convention</button>
          </div>
          <div class="type-convention-grid" id="ed-t-convs">
            ${convs.map(c => convRow(c)).join('')}
          </div>
        </div>
      </div>`;
    },

    imagery() {
      const img = BRAND.imagery || {};
      const st  = img.style || {};
      const mockupOpts = MOCKUP_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');
      const hasKey = !!(sessionStorage.getItem('bb_api_key') || sessionStorage.getItem('bb_openai_key'));
      const hasOpenAI = !!sessionStorage.getItem('bb_openai_key');

      return `
        <!-- ① Style Analyzer -->
        <div class="img-editor-section">
          <div class="img-editor-section-head">① Analyze Visual Style</div>
          <div class="style-analyzer-row">
            <div class="style-ref-slot" id="style-ref-slot">
              <div class="style-ref-preview" id="style-ref-preview">
                <label class="style-ref-label">
                  <input type="file" id="style-ref-input" accept="image/*" style="display:none">
                  <span class="style-ref-cta">+ Upload reference image</span>
                </label>
              </div>
              <button type="button" class="style-ref-generate-btn" id="btn-analyze-style"
                style="display:none" ${!hasKey ? 'disabled title="Add API key in intake"' : ''}>
                ✦ Generate Description
              </button>
            </div>
            <div class="style-analyzer-controls">
              <p class="ef-hint" style="margin:0">Upload a brand reference image (photo, mood board, competitor example) and click <strong>Generate Description</strong> to auto-fill the style fields.</p>
              <div id="analyze-status" style="font-size:11px;color:var(--text-muted);margin-top:8px"></div>
            </div>
          </div>
        </div>

        <!-- ② Style Description -->
        <div class="img-editor-section">
          <div class="img-editor-section-head">② Style Description & Prompt</div>
          <div class="editor-grid">
            ${eTA('ed-img-desc','Visual Style Description', st.description || '', 'AI fills this from your reference image, or write manually', 3)}
            <div class="ef ef-full">
              <div class="ef-row-header">
                <label class="ef-label">Style Keywords</label>
                <button type="button" class="editor-ai-btn-sm" id="btn-gen-keywords" ${!hasKey?'disabled':''}>✦ Generate Keywords</button>
              </div>
              <div class="editor-list" id="ed-img-kw">
                ${(st.keywords||[]).map(v => `<div class="erow" data-row><input class="erow-input editor-input" type="text" value="${escV(v)}" placeholder="e.g. Negative space"><button class="erow-del" type="button">✕</button></div>`).join('')}
                <button class="erow-add" type="button" data-list="ed-img-kw">+ Add</button>
              </div>
            </div>
            ${eTA('ed-img-prompt','Image Generation Prompt', img.aiPrompt || '', 'Reusable prompt for generating on-brand visuals', 4)}
            ${eList('ed-img-dos','Photography Dos', img.dos || [], 'Do…')}
            ${eList('ed-img-donts',"Photography Don'ts", img.donts || [], "Don't…")}
          </div>
        </div>

        <!-- ③ Brand Photo Gallery -->
        <div class="img-editor-section">
          <div class="img-editor-section-head">③ Brand Photo Gallery</div>
          <div class="photo-slot-v2-grid" id="img-gen-grid">
            ${[0,1,2,3,4,5,6,7].map(i => ePhotoSlot(i)).join('')}
          </div>
          <p class="ef-hint" style="padding:0 0 var(--sp-4)">Each slot: Upload an image ↑ or Generate with AI ✦</p>
        </div>
      `;
    },

    voice() {
      const v = BRAND.voice || {};
      return `<div class="editor-grid">
        ${eTA('ed-v-desc','Voice Description', v.description || '', '', 3)}
        ${eRows('ed-v-attrs','Voice Attributes', v.attributes || [],
          [{k:'trait',ph:'Trait'},{k:'description',ph:'Description'},{k:'example',ph:'Example copy'}])}
        ${eList('ed-v-weare','We Are', v.weare || [], 'e.g. Clear')}
        ${eList('ed-v-werenot',"We're Not", v.werenot || [], 'e.g. Clinical')}
        ${eRows('ed-v-ch','Tone by Channel', v.channelTones || [],
          [{k:'channel',ph:'Channel'},{k:'tone',ph:'Tone'},{k:'example',ph:'Example'}])}
      </div>`;
    },

    icons() {
      const ic = BRAND.icons || {};
      return `<div class="editor-grid">
        ${eF('ed-ic-fam', 'Icon Family Name', ic.family || '', 'e.g. Heroicons, Phosphor, Lucide')}
        ${eF('ed-ic-sty', 'Icon Style', ic.style || '', 'e.g. Outline, Filled, Duotone')}
        ${eTA('ed-ic-desc', 'Description', ic.description || '', 'Notes on icon usage, sizing, grid…', 2)}
        <div class="ef ef-full">
          <label class="ef-label">Icon Set Images (upload screenshots, sprites, or individual icons)</label>
          <div class="photo-upload-grid">${[0,1,2,3,4,5,6,7].map(i => ePhotoSlotFor('icons', i)).join('')}</div>
        </div>
        <div class="ef ef-full">
          <label class="ef-label">Icon Colors</label>
          <div class="editor-list editor-list-rows" id="ed-ic-colors">
            ${(ic.colors || []).map(h => `<div class="erow" data-row><input class="erow-input editor-input color-hex" data-f="hex" type="color" value="${h}"><input class="erow-input editor-input" data-f="name" type="text" placeholder="Color name"><button class="erow-del" type="button">✕</button></div>`).join('')}
            <button class="erow-add" type="button" data-list="ed-ic-colors">+ Add Color</button>
          </div>
        </div>
      </div>`;
    },

    illustration() {
      const il = BRAND.illustration || {};
      return `<div class="editor-grid">
        ${eTA('ed-il-sty', 'Illustration Style', il.style || '', 'Describe the illustration style, technique, mood…', 3)}
        <div class="ef ef-full">
          <label class="ef-label">Illustration Examples (up to 8)</label>
          <div class="photo-upload-grid">${[0,1,2,3,4,5,6,7].map(i => ePhotoSlotFor('illustration', i)).join('')}</div>
        </div>
        <div class="ef ef-full">
          <label class="ef-label">Illustration Colors</label>
          <div class="editor-list editor-list-rows" id="ed-il-colors">
            ${(il.colors || []).map(h => `<div class="erow" data-row><input class="erow-input editor-input color-hex" data-f="hex" type="color" value="${h}"><input class="erow-input editor-input" data-f="name" type="text" placeholder="Color name"><button class="erow-del" type="button">✕</button></div>`).join('')}
            <button class="erow-add" type="button" data-list="ed-il-colors">+ Add Color</button>
          </div>
        </div>
      </div>`;
    },

    patterns() {
      const pt = BRAND.patterns || {};
      return `<div class="editor-grid">
        ${eTA('ed-pt-desc', 'Patterns & Shapes Description', pt.description || '', 'Describe the pattern system, motifs, shapes used…', 3)}
        <div class="ef ef-full">
          <label class="ef-label">Pattern / Shape Assets (up to 8)</label>
          <div class="photo-upload-grid">${[0,1,2,3,4,5,6,7].map(i => ePhotoSlotFor('patterns', i)).join('')}</div>
        </div>
      </div>`;
    },

    applications() {
      const apps = BRAND.applications || [];
      const rows = apps.map((a, i) => `
        <div class="erow erow-app" data-row>
          <div class="app-img-slot">
            <div class="app-img-preview">${a.image ? `<img src="${a.image}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.style.display='none'">` : ''}</div>
            <label class="app-img-upload"><input type="file" class="app-file-input" accept="image/*"><span>Upload</span></label>
          </div>
          <input class="erow-input editor-input" data-f="name"        type="text" value="${escV(a.name)}"        placeholder="e.g. Business Card">
          <input class="erow-input editor-input" data-f="description" type="text" value="${escV(a.description)}" placeholder="Short description">
          <button class="erow-del" type="button">✕</button>
        </div>`).join('');
      return `<div class="editor-grid">
        <div class="ef ef-full"><label class="ef-label">Brand Applications / Mockups</label>
          <div class="editor-list editor-list-rows" id="ed-apps">
            ${rows}
            <button class="erow-add" type="button" data-list="ed-apps" data-approw="1">+ Add Mockup</button>
          </div></div>
      </div>`;
    },
  };

  // ── Delegate app-row add ─────────────────
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-approw]');
    if (!addBtn) return;
    const list = document.getElementById(addBtn.dataset.list);
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'erow erow-app';
    div.dataset.row = '1';
    div.innerHTML = `
      <div class="app-img-slot">
        <div class="app-img-preview"></div>
        <label class="app-img-upload"><input type="file" class="app-file-input" accept="image/*"><span>Upload</span></label>
      </div>
      <input class="erow-input editor-input" data-f="name"        type="text" placeholder="e.g. Business Card">
      <input class="erow-input editor-input" data-f="description" type="text" placeholder="Short description">
      <button class="erow-del" type="button">✕</button>`;
    addBtn.before(div);
  });

  // ════════════════════════════════════════
  //  COLLECTORS — form → BRAND
  // ════════════════════════════════════════
  const COLLECTORS = {
    cover() {
      BRAND.name        = gv('ed-name');
      BRAND.tagline     = gv('ed-tagline');
      BRAND.year        = gv('ed-year');
      BRAND.description = gv('ed-desc');
      const a1 = gv('ed-accent');  if (a1) BRAND.accentColor  = a1;
      const a2 = gv('ed-accent2'); if (a2) BRAND.accentColor2 = a2;
      if (BRAND.accentColor)  document.documentElement.style.setProperty('--brand-accent',   BRAND.accentColor);
      if (BRAND.accentColor2) document.documentElement.style.setProperty('--brand-accent-2', BRAND.accentColor2);
      // Cover background
      const bgInput = document.getElementById('ed-cover-bg');
      const activePill = document.querySelector('.cover-color-pill.active');
      if (activePill && activePill.classList.contains('cover-color-default')) {
        BRAND.coverBg = '';
      } else if (bgInput) {
        BRAND.coverBg = bgInput.value;
      }
    },
    story() {
      if (!BRAND.story) BRAND.story = {};
      BRAND.story.narrative = gv('ed-s-narr');
      BRAND.story.strategy  = gv('ed-s-strat');
      BRAND.story.vision    = gv('ed-s-vis');
      BRAND.story.mission   = gv('ed-s-miss');
    },
    foundation() {
      if (!BRAND.foundation) BRAND.foundation = {};
      BRAND.foundation.mission  = gv('ed-f-miss');
      BRAND.foundation.vision   = gv('ed-f-vis');
      BRAND.foundation.audience = gv('ed-f-aud');
      BRAND.foundation.values      = getRows('ed-f-values', ['name','description']);
      BRAND.foundation.personality = getRows('ed-f-pers',   ['trait','not']);
    },
    logo() {
      if (!BRAND.logo) BRAND.logo = {};
      BRAND.logo.clearSpace = gv('ed-l-cs');
      if (!BRAND.logo.minSize) BRAND.logo.minSize = {};
      BRAND.logo.minSize.print   = gv('ed-l-mp');
      BRAND.logo.minSize.digital = gv('ed-l-md');
      BRAND.logo.donts    = getList('ed-l-donts');
      BRAND.logo.variants = getRows('ed-l-variants', ['label','desc','bg']);
    },
    colors() {
      function collectColors(listId) {
        const el = document.getElementById(listId);
        if (!el) return [];
        return [...el.querySelectorAll('[data-row]')].map(row => ({
          hex:   row.querySelector('[data-f="hex"]')?.value  || '',
          name:  row.querySelector('[data-f="name"]')?.value  || '',
          usage: row.querySelector('[data-f="usage"]')?.value || '',
        })).filter(c => c.hex || c.name);
      }
      if (!BRAND.colors) BRAND.colors = {};
      BRAND.colors.primary   = collectColors('ed-c-primary');
      BRAND.colors.secondary = collectColors('ed-c-secondary');
      BRAND.colors.functional= collectColors('ed-c-functional');
    },
    typography() {
      if (!BRAND.typography) BRAND.typography = {};
      if (!BRAND.typography.display) BRAND.typography.display = {};
      if (!BRAND.typography.body)    BRAND.typography.body    = {};
      BRAND.typography.display.name    = gv('ed-t-dn');
      BRAND.typography.display.weights = gv('ed-t-dw').split(',').map(s=>s.trim()).filter(Boolean);
      BRAND.typography.display.usage   = gv('ed-t-du');
      BRAND.typography.body.name       = gv('ed-t-bn');
      BRAND.typography.body.weights    = gv('ed-t-bw').split(',').map(s=>s.trim()).filter(Boolean);
      BRAND.typography.body.usage      = gv('ed-t-bu');
      // Collect convention rows
      const convGrid = document.getElementById('ed-t-convs');
      if (convGrid) {
        BRAND.typography.conventions = [...convGrid.querySelectorAll('[data-conv-row]')].map(row => {
          const get = (field) => row.querySelector(`[data-cf="${field}"]`)?.value || '';
          return {
            name:       get('name'),
            font:       get('font') || 'body',
            size:       get('size'),
            weight:     get('weight'),
            lineHeight: get('lineHeight'),
            usage:      get('usage'),
          };
        }).filter(c => c.name || c.size);
      }
    },
    imagery() {
      if (!BRAND.imagery) BRAND.imagery = {};
      if (!BRAND.imagery.style) BRAND.imagery.style = {};
      BRAND.imagery.style.description = gv('ed-img-desc');
      BRAND.imagery.style.keywords    = getList('ed-img-kw');
      BRAND.imagery.aiPrompt          = gv('ed-img-prompt');
      BRAND.imagery.dos   = getList('ed-img-dos');
      BRAND.imagery.donts = getList('ed-img-donts');
      // photos written directly during file selection via wireFiles()
    },
    voice() {
      if (!BRAND.voice) BRAND.voice = {};
      BRAND.voice.description  = gv('ed-v-desc');
      BRAND.voice.attributes   = getRows('ed-v-attrs', ['trait','description','example']);
      BRAND.voice.weare        = getList('ed-v-weare');
      BRAND.voice.werenot      = getList('ed-v-werenot');
      BRAND.voice.channelTones = getRows('ed-v-ch', ['channel','tone','example']);
    },
    applications() {
      const list = document.getElementById('ed-apps');
      if (!list) return;
      BRAND.applications = [...list.querySelectorAll('[data-row]')].map(row => {
        const fileInput = row.querySelector('.app-file-input');
        const dataUrl   = fileInput?.dataset.dataurl || '';
        const existImg  = row.querySelector('.app-img-preview img');
        return {
          image:       dataUrl || existImg?.src || '',
          name:        row.querySelector('[data-f="name"]')?.value        || '',
          description: row.querySelector('[data-f="description"]')?.value || '',
        };
      }).filter(a => a.name);
    },

    icons() {
      if (!BRAND.icons) BRAND.icons = {};
      BRAND.icons.family      = gv('ed-ic-fam');
      BRAND.icons.style       = gv('ed-ic-sty');
      BRAND.icons.description = gv('ed-ic-desc');
      const colorList = document.getElementById('ed-ic-colors');
      BRAND.icons.colors = colorList
        ? [...colorList.querySelectorAll('[data-row]')].map(r => r.querySelector('[data-f="hex"]')?.value).filter(Boolean)
        : BRAND.icons.colors || [];
    },

    illustration() {
      if (!BRAND.illustration) BRAND.illustration = {};
      BRAND.illustration.style  = gv('ed-il-sty');
      const colorList = document.getElementById('ed-il-colors');
      BRAND.illustration.colors = colorList
        ? [...colorList.querySelectorAll('[data-row]')].map(r => r.querySelector('[data-f="hex"]')?.value).filter(Boolean)
        : BRAND.illustration.colors || [];
    },

    patterns() {
      if (!BRAND.patterns) BRAND.patterns = {};
      BRAND.patterns.description = gv('ed-pt-desc');
    },
  };

  // ── AI: Analyze style from reference image ─────────
  async function analyzeImageryStyle() {
    const statusEl = document.getElementById('analyze-status');
    const btn = document.getElementById('btn-analyze-style');
    if (btn) { btn.disabled = true; btn.textContent = '✦ Analyzing…'; }
    if (statusEl) statusEl.textContent = 'Analyzing visual style…';

    // Use the dedicated style reference image, or fall back to first uploaded photo
    const images = [];
    if (_styleRefImage) images.push(_styleRefImage);
    if (!images.length) {
      const photos = (BRAND.imagery?.photos || []).filter(Boolean).slice(0, 3);
      images.push(...photos);
    }
    if (!images.length) {
      if (statusEl) statusEl.textContent = '⚠ Upload a reference image first';
      if (btn) { btn.disabled = false; btn.textContent = '✦ Analyze Style'; }
      return;
    }

    const prompt = `You are a brand visual strategist. Analyze this brand reference image and provide:

1. STYLE DESCRIPTION (2–3 sentences): Describe the visual style, mood, lighting, composition, and emotional tone.
2. STYLE KEYWORDS (5–8 words): e.g. "Negative space, Natural light, Muted palette"
3. IMAGE GENERATION PROMPT (1 detailed paragraph): A reusable prompt for AI image generators (Midjourney/DALL-E) to create new images in this visual style. Include lighting, mood, composition, color palette, and technical details.

Respond with JSON only:
{"description":"...","keywords":["..."],"prompt":"..."}`;

    try {
      const parsed = await callAI({ prompt, images, json: true });

      const descEl   = document.getElementById('ed-img-desc');
      const kwList   = document.getElementById('ed-img-kw');
      const promptEl = document.getElementById('ed-img-prompt');

      if (descEl   && parsed.description) descEl.value = parsed.description;
      if (promptEl && parsed.prompt)      promptEl.value = parsed.prompt;
      if (kwList   && parsed.keywords?.length) {
        kwList.querySelectorAll('[data-row]').forEach(r => r.remove());
        const addBtn = kwList.querySelector('.erow-add');
        parsed.keywords.forEach(kw => {
          const div = document.createElement('div');
          div.className = 'erow'; div.dataset.row = '1';
          div.innerHTML = `<input class="erow-input editor-input" type="text" value="${escV(kw)}"><button class="erow-del" type="button">✕</button>`;
          addBtn?.before(div);
        });
      }
      if (statusEl) statusEl.textContent = '✓ Style analysis complete';
    } catch (err) {
      console.error('[Brandbook] Style analyze error:', err);
      if (statusEl) statusEl.textContent = '⚠ ' + (err.message || 'Analysis failed');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✦ Analyze Style'; }
    }
  }

  // ── Generate brand image via DALL-E 3 ──────────────
  async function generateBrandImage() {
    const genBtn    = document.getElementById('btn-gen-image');
    const genStatus = document.getElementById('gen-status');
    const mockupType = document.getElementById('gen-mockup-type')?.value || '';

    const styleDesc  = document.getElementById('ed-img-desc')?.value  || BRAND.imagery?.style?.description || '';
    const genPrompt  = document.getElementById('ed-img-prompt')?.value || BRAND.imagery?.aiPrompt || '';
    const brandName  = BRAND.name || 'the brand';
    const colors     = [...(BRAND.colors?.primary||[]), ...(BRAND.colors?.secondary||[])].slice(0,3).map(c=>c.hex).join(', ');

    // Build the DALL-E prompt from brand context
    const dallePrompt = [
      mockupType ? `A ${mockupType} mockup for ${brandName} brand.` : `A brand visual for ${brandName}.`,
      genPrompt || styleDesc || '',
      colors ? `Brand colors: ${colors}.` : '',
      'Professional photography. High quality. Clean composition. No text overlays unless part of the mockup.',
    ].filter(Boolean).join(' ');

    const hasOpenAI = !!sessionStorage.getItem('bb_openai_key');

    if (!hasOpenAI) {
      // No key — just show the prompt for external use
      if (genStatus) genStatus.textContent = '';
      const promptBox = document.createElement('div');
      promptBox.className = 'gen-prompt-preview';
      promptBox.innerHTML = `
        <div class="gen-prompt-label">Generation prompt (copy to Midjourney or DALL-E):</div>
        <div class="gen-prompt-text">${escV(dallePrompt)}</div>
        <button type="button" class="copy-prompt-btn" data-copy="${encodeURIComponent(dallePrompt)}">Copy Prompt</button>
      `;
      const existing = document.querySelector('.gen-prompt-preview');
      if (existing) existing.replaceWith(promptBox); else genBtn?.after(promptBox);
      return;
    }

    // Generate with DALL-E 3
    if (genBtn) { genBtn.disabled = true; genBtn.textContent = '✦ Generating…'; }
    if (genStatus) genStatus.textContent = 'Calling DALL-E 3…';

    try {
      const imgUrl = await generateImage(dallePrompt);

      // Find the first empty slot and fill it
      let placed = false;
      const grid = document.getElementById('img-gen-grid');
      if (grid) {
        for (let i = 0; i < 8; i++) {
          if (!(BRAND.imagery?.photos?.[i])) {
            if (!BRAND.imagery) BRAND.imagery = {};
            if (!BRAND.imagery.photos) BRAND.imagery.photos = [];
            while (BRAND.imagery.photos.length <= i) BRAND.imagery.photos.push('');
            BRAND.imagery.photos[i] = imgUrl;
            const prev = document.getElementById(`pp-${i}`);
            if (prev) {
              prev.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover" alt="">
                <label class="photo-slot-overlay"><input type="file" class="photo-slot-input" accept="image/*" data-idx="${i}"><span class="photo-slot-cta">↺</span></label>`;
              prev.classList.add('filled');
            }
            placed = true;
            break;
          }
        }
      }
      if (genStatus) genStatus.textContent = placed ? '✓ Image generated and placed' : '✓ Generated (all slots full — save to see)';
    } catch (err) {
      console.error('[Brandbook] Image generation error:', err);
      if (genStatus) genStatus.textContent = '⚠ ' + (err.message || 'Generation failed');
    } finally {
      if (genBtn) { genBtn.disabled = false; genBtn.textContent = hasOpenAI ? '✦ Generate Image' : '✦ Build Prompt'; }
    }
  }

  // ── Generate image for a specific slot ────────────────────────
  async function generateBrandImageSlot(idx, mockupType, customPrompt, triggerBtn) {
    const statusEl = document.getElementById(`pgs-${idx}`);
    if (triggerBtn) { triggerBtn.disabled = true; triggerBtn.textContent = '↻ Generating…'; }
    if (statusEl) statusEl.textContent = 'Calling DALL-E 3…';

    const styleDesc = document.getElementById('ed-img-desc')?.value  || BRAND.imagery?.style?.description || '';
    const genPrompt = document.getElementById('ed-img-prompt')?.value || BRAND.imagery?.aiPrompt || '';
    const brandName = BRAND.name || 'the brand';
    const colors    = [...(BRAND.colors?.primary||[]), ...(BRAND.colors?.secondary||[])].slice(0,3).map(c=>c.hex).join(', ');

    const dallePrompt = [
      customPrompt || (mockupType ? `A ${mockupType} mockup for ${brandName}.` : `A brand visual for ${brandName}.`),
      !customPrompt && (genPrompt || styleDesc) ? (genPrompt || styleDesc) : '',
      colors ? `Brand colors: ${colors}.` : '',
      'Professional photography. High quality. Clean composition. No text overlays unless part of the mockup.',
    ].filter(Boolean).join(' ');

    const hasOpenAI = !!sessionStorage.getItem('bb_openai_key');
    if (!hasOpenAI) {
      // No key — show the prompt for manual use
      if (statusEl) statusEl.innerHTML = `<span style="color:var(--text-secondary)">Copy prompt:</span><br><em style="font-size:9px;word-break:break-word">${escV(dallePrompt)}</em>`;
      if (triggerBtn) { triggerBtn.disabled = false; triggerBtn.textContent = '→ Generate'; }
      return;
    }

    try {
      const imgUrl = await generateImage(dallePrompt);
      if (!BRAND.imagery) BRAND.imagery = {};
      if (!BRAND.imagery.photos) BRAND.imagery.photos = [];
      while (BRAND.imagery.photos.length <= idx) BRAND.imagery.photos.push('');
      BRAND.imagery.photos[idx] = imgUrl;

      const prev = document.getElementById(`pp-${idx}`);
      if (prev) {
        prev.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block" alt="">`;
        prev.classList.add('filled');
      }
      if (statusEl) statusEl.textContent = '✓ Done';
      // Collapse the panel after success
      const panel = document.getElementById(`pgi-${idx}`);
      if (panel) panel.style.display = 'none';
      const toggleBtn = document.querySelector(`[data-togglegen="${idx}"]`);
      if (toggleBtn) toggleBtn.classList.remove('active');
    } catch (err) {
      console.error('[Brandbook] Slot generate error:', err);
      if (statusEl) statusEl.textContent = '⚠ ' + (err.message || 'Failed');
    } finally {
      if (triggerBtn) { triggerBtn.disabled = false; triggerBtn.textContent = '→ Generate'; }
    }
  }

  // ── Generate keywords from style description ────────────────────
  async function generateKeywords() {
    const kwBtn  = document.getElementById('btn-gen-keywords');
    const kwList = document.getElementById('ed-img-kw');
    const descEl = document.getElementById('ed-img-desc');
    const desc   = descEl?.value || BRAND.imagery?.style?.description || '';

    if (!desc.trim()) {
      alert('Add a style description first (or upload a reference image and use Generate Description).');
      return;
    }

    if (kwBtn) { kwBtn.disabled = true; kwBtn.textContent = '✦ Generating…'; }

    const prompt = `You are a brand visual strategist. Based on this visual style description, generate 6–8 concise style keywords (2–3 words max each) that capture the visual identity.

Description: "${desc}"

Respond with JSON only: {"keywords":["keyword 1","keyword 2","..."]}`;

    try {
      const parsed = await callAI({ prompt, json: true });
      if (kwList && parsed.keywords?.length) {
        // Remove existing rows
        kwList.querySelectorAll('[data-row]').forEach(r => r.remove());
        const addBtn = kwList.querySelector('.erow-add');
        parsed.keywords.forEach(kw => {
          const div = document.createElement('div');
          div.className = 'erow'; div.dataset.row = '1';
          div.innerHTML = `<input class="erow-input editor-input" type="text" value="${escV(kw)}" placeholder="e.g. Negative space"><button class="erow-del" type="button">✕</button>`;
          addBtn?.before(div);
        });
      }
    } catch (err) {
      console.error('[Brandbook] Keyword generation error:', err);
      alert('Could not generate keywords: ' + (err.message || 'Unknown error'));
    } finally {
      if (kwBtn) { kwBtn.disabled = false; kwBtn.textContent = '✦ Generate Keywords'; }
    }
  }

  // ── Export: HTML ──────────────────────────
  function exportHTML() {
    const brandName = (BRAND.name || 'brand').replace(/\s+/g, '-').toLowerCase();
    const clone = document.documentElement.cloneNode(true);
    // Remove script tags except inline styles
    clone.querySelectorAll('script').forEach(s => s.remove());
    clone.querySelectorAll('.section-edit-btn').forEach(b => b.remove());
    clone.querySelectorAll('.editor-shell').forEach(s => s.remove());
    const html = '<!DOCTYPE html>\n' + clone.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${brandName}-brandbook.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  // ── Export: PDF (print) ───────────────────
  function exportPDF() {
    window.print();
  }

  // Expose exports for buttons in brandbook.html
  window.__bbExportHTML = exportHTML;
  window.__bbExportPDF  = exportPDF;

  // ── Boot ─────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
