// ─────────────────────────────────────────────────────────────────────────────
//  BRAND CONFIGURATION
//
//  HOW TO USE:
//  1. Edit this file with your brand data
//  2. Drop assets into the correct folders:
//       assets/logo/        → SVG/PNG logo files
//       assets/photography/ → brand photos (photo-01.jpg … photo-06.jpg)
//       assets/mockups/     → application mockups (any JPG/PNG)
//       assets/fonts/       → custom font files (.woff2)
//       assets/docs/        → PDFs for the intake extractor
//
//  3. Colors: only 'hex' is required. Name is required. Everything else optional.
//  4. Typography: only 'name', 'size', 'weight', 'usage' are required per convention.
//
//  TIP: Run intake.html to auto-extract all of this from a PDF, HTML, or image.
// ─────────────────────────────────────────────────────────────────────────────

var BRAND = {

  // ── Core identity ──────────────────────────────────────────────────────────
  name:        'AURA',
  tagline:     'Clarity in Every Direction',
  year:        '2025',
  description: 'A premium wellness technology brand built on the principles of clarity, balance, and intentional design.',

  // Accent colors — only hex needed, names are optional labels
  accentColor:  '#8B5CF6',   // Iris — primary brand accent
  accentColor2: '#06B6D4',   // Aurora — secondary accent

  // ── Brand Foundation ───────────────────────────────────────────────────────
  foundation: {
    mission:  'To help people move through life with greater clarity and intention — through tools that disappear into the background and let living come forward.',
    vision:   'A world where technology serves the human experience, not the other way around.',
    audience: 'Design-conscious professionals aged 28–45 who value quality over quantity, and meaning over noise.',

    values: [
      { name: 'Clarity',   description: 'We cut through noise. Every decision, design, and interaction is stripped to its essential truth.' },
      { name: 'Intention', description: 'Nothing is accidental. Every element has a reason, a role, and a rightful place.' },
      { name: 'Restraint', description: 'We resist the urge to add. The most powerful thing is often what we leave out.' },
      { name: 'Warmth',    description: 'Precision without warmth is cold. We hold space for the human in everything we make.' },
    ],

    personality: [
      { trait: 'Considered', not: 'Overthought' },
      { trait: 'Confident',  not: 'Arrogant' },
      { trait: 'Warm',       not: 'Casual' },
      { trait: 'Precise',    not: 'Clinical' },
    ],
  },

  // ── Logo ───────────────────────────────────────────────────────────────────
  logo: {
    primary:    '',
    reversed:   '',  // white version for dark bgs
    dark:       '',      // dark version for light bgs
    icon:       '',
    clearSpace: '1× the cap-height of the wordmark on all sides',
    minSize: { print: '15mm', digital: '60px' },
    donts: [
      'Do not stretch or distort the logo',
      'Do not add drop shadows or effects',
      'Do not recolor the logomark independently',
      'Do not place on busy or low-contrast imagery',
      'Do not outline or add a border to the wordmark',
      'Do not use unapproved lockup variations',
    ],
  },

  // ── Colors ─────────────────────────────────────────────────────────────────
  //
  //  MINIMUM per color:  { name: 'Iris', hex: '#8B5CF6' }
  //  FULL spec:          add rgb, cmyk, pantone, usage
  //  RGB auto-converts from hex if you leave it blank.
  //
  colors: {
    primary: [
      {
        name:    'Midnight',
        hex:     '#0A0A0F',
        rgb:     '10, 10, 15',      // optional — leave blank to auto-generate
        cmyk:    '33, 33, 0, 94',   // optional
        pantone: 'Black 6 C',       // optional
        usage:   'Primary backgrounds, base surfaces',
      },
      {
        name:    'Void',
        hex:     '#141422',
        rgb:     '20, 20, 34',
        cmyk:    '41, 41, 0, 87',
        pantone: '2767 C',
        usage:   'Cards, elevated surfaces',
      },
    ],

    secondary: [
      { name: 'Iris',   hex: '#8B5CF6', rgb: '139, 92, 246',  pantone: '2665 C', usage: 'Primary accent, CTAs, highlights' },
      { name: 'Aurora', hex: '#06B6D4', rgb: '6, 182, 212',   pantone: '3115 C', usage: 'Secondary accent, data visualization' },
      { name: 'Dusk',   hex: '#F0F0FF', rgb: '240, 240, 255', pantone: 'White',  usage: 'Primary text, light elements' },
    ],

    functional: [
      { name: 'Success', hex: '#10B981', usage: 'Positive states, confirmations' },
      { name: 'Warning', hex: '#F59E0B', usage: 'Caution, attention states' },
      { name: 'Error',   hex: '#EF4444', usage: 'Errors, destructive actions' },
      { name: 'Info',    hex: '#3B82F6', usage: 'Informational, neutral states' },
    ],

    ratios: [
      { name: 'Midnight', hex: '#0A0A0F', percent: 65, note: 'Dominant — backgrounds & large surfaces' },
      { name: 'Iris',     hex: '#8B5CF6', percent: 20, note: 'Secondary — accents & interactions' },
      { name: 'Dusk',     hex: '#F0F0FF', percent: 15, note: 'Supporting — text & fine detail' },
    ],
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  //
  //  Two typefaces max (display + body). Hierarchy comes from size/weight only.
  //  conventions = specific use cases with full specs.
  //
  typography: {

    display: {
      name:    'Syne',
      weights: ['Regular 400', 'Medium 500', 'Bold 700', 'ExtraBold 800'],
      usage:   'Headlines, display text, brand expressions',
      // If using a custom font file, add it to assets/fonts/ and uncomment:
      // src: 'assets/fonts/Syne-Variable.woff2',
    },

    body: {
      name:    'Inter',
      weights: ['Light 300', 'Regular 400', 'Medium 500', 'SemiBold 600'],
      usage:   'Body copy, UI text, captions, labels',
      // src: 'assets/fonts/Inter-Variable.woff2',
    },

    // ── Type conventions ─────────────────────────────────────────────────────
    //  Full specs for every named use case in your design system.
    //  size / sizeMobile = responsive values
    //  weight = numeric (400, 700, 900)
    //  leading = line-height multiplier
    //  tracking = letter-spacing (em)
    //
    conventions: [
      {
        name:       'Hero Display',
        font:       'display',           // 'display' or 'body'
        size:       '80px',
        sizeMobile: '40px',
        weight:     '900',
        leading:    '0.95',
        tracking:   '-0.04em',
        transform:  'none',
        usage:      'Hero sections, cover page, campaign titles',
      },
      {
        name:       'Section Title',
        font:       'display',
        size:       '52px',
        sizeMobile: '32px',
        weight:     '800',
        leading:    '1.05',
        tracking:   '-0.03em',
        transform:  'none',
        usage:      'Main section headings (H1)',
      },
      {
        name:       'Subsection Title',
        font:       'display',
        size:       '32px',
        sizeMobile: '24px',
        weight:     '700',
        leading:    '1.15',
        tracking:   '-0.02em',
        transform:  'none',
        usage:      'Sub-sections, card group titles (H2)',
      },
      {
        name:       'Card Title',
        font:       'body',
        size:       '18px',
        sizeMobile: '16px',
        weight:     '600',
        leading:    '1.3',
        tracking:   '-0.01em',
        transform:  'none',
        usage:      'Card headings, modal titles (H3)',
      },
      {
        name:       'Body Lead',
        font:       'body',
        size:       '18px',
        sizeMobile: '17px',
        weight:     '400',
        leading:    '1.7',
        tracking:   '0',
        transform:  'none',
        usage:      'Opening paragraphs, feature descriptions',
      },
      {
        name:       'Body',
        font:       'body',
        size:       '16px',
        sizeMobile: '16px',
        weight:     '400',
        leading:    '1.65',
        tracking:   '0',
        transform:  'none',
        usage:      'Default body copy',
      },
      {
        name:       'UI Label',
        font:       'body',
        size:       '11px',
        sizeMobile: '11px',
        weight:     '700',
        leading:    '1.4',
        tracking:   '0.10em',
        transform:  'uppercase',
        usage:      'Navigation, button text, form labels, tags',
      },
      {
        name:       'Caption',
        font:       'body',
        size:       '12px',
        sizeMobile: '12px',
        weight:     '500',
        leading:    '1.5',
        tracking:   '0.02em',
        transform:  'none',
        usage:      'Image captions, metadata, helper text',
      },
      {
        name:       'Micro',
        font:       'body',
        size:       '10px',
        sizeMobile: '10px',
        weight:     '600',
        leading:    '1.4',
        tracking:   '0.12em',
        transform:  'uppercase',
        usage:      'Section tags, version numbers, legal copy',
      },
    ],
  },

  // ── Imagery ────────────────────────────────────────────────────────────────
  imagery: {
    style: {
      description: 'Photography should feel like a breath of still air. High contrast, considered framing, with natural light as the primary source. Human presence is implied — never centred.',
      keywords: ['Negative space', 'Natural light', 'Muted palette', 'Quiet emotion', 'Considered composition'],
    },
    dos:   [
      'Use natural, diffused lighting',
      'Embrace negative space and stillness',
      'Choose muted, desaturated palettes',
      'Show context over product close-ups',
      'Prefer candid over staged moments',
    ],
    donts: [
      'Avoid harsh or artificial lighting',
      'Avoid cluttered or busy compositions',
      'Avoid oversaturated or heavily filtered imagery',
      'Avoid stock photography clichés',
      'Avoid direct eye contact with camera',
    ],
    // ↓ Drop JPGs/PNGs in assets/photography/ and list them here
    photos: [],
  },

  // ── Voice & Tone ───────────────────────────────────────────────────────────
  voice: {
    description: 'The AURA voice is measured and clear — like a trusted friend who happens to be brilliant. We speak with warmth, but never at the expense of precision.',
    attributes: [
      {
        trait:       'Clear',
        description: 'We use the simplest word that carries the full meaning. No jargon, no filler.',
        example:     '"Your focus is restored." — not "Our proprietary algorithm optimizes cognitive performance metrics."',
      },
      {
        trait:       'Warm',
        description: 'We speak to a person, not a demographic. We acknowledge the human on the other side.',
        example:     '"We know mornings can be hard. Start here." — not "Initiate your daily protocol."',
      },
      {
        trait:       'Confident',
        description: 'We don\'t hedge or over-qualify. We say what we mean and mean what we say.',
        example:     '"This works." — not "This may potentially help some users in certain situations."',
      },
      {
        trait:       'Considered',
        description: 'Every word is earned. We write with intention and remove anything that doesn\'t carry its weight.',
        example:     '"Less. Better." — not "We believe in a minimalist approach to product design philosophy."',
      },
    ],
    weare:   ['Clear', 'Warm', 'Honest', 'Precise', 'Grounded', 'Intentional'],
    werenot: ['Clinical', 'Cold', 'Salesy', 'Verbose', 'Vague', 'Trendy'],
    channelTones: [
      { channel: 'Product UI', tone: 'Ultra-clear, invisible',   example: '"Done." / "All set." / "Save changes"' },
      { channel: 'Marketing',  tone: 'Evocative, confident',     example: '"Clarity lives here."' },
      { channel: 'Support',    tone: 'Warm, helpful, direct',    example: '"Let\'s fix this together."' },
      { channel: 'Social',     tone: 'Human, considered, quiet', example: 'No forced trends. No hype.' },
    ],
  },

  // ── Applications / Mockups ─────────────────────────────────────────────────
  //  Drop images in assets/mockups/ and list them here.
  applications: [
    { name: 'Business Card',   image: '',  description: 'Clean layout with generous white space.' },
    { name: 'Letterhead',      image: '',     description: 'Minimal header, maximum clarity.' },
    { name: 'Presentation',    image: '',   description: 'Dark-mode slides with clear hierarchy.' },
    { name: 'Social Media',    image: '',         description: 'Square format, bold single message.' },
    { name: 'Email Signature', image: '',      description: 'Minimal, professional, on-brand.' },
    { name: 'Packaging',       image: '',      description: 'Understated luxury with brand restraint.' },
    { name: 'Website',         image: '',        description: 'Digital brand expression.' },
    // Figma embed — paste your Figma share URL here and it renders inline:
    // { name: 'Design System', figma: 'https://www.figma.com/file/YOURFILEID', description: 'Live component library.' },
  ],

};
