/**
 * Ballast design tokens — single source of truth.
 *
 * This file is the ONLY place design values are defined. It emits:
 *   - a Tailwind v4 `@theme` block for ballast-web and ballast-landing
 *   - a Swift file for ballast-ios (Phase 2, generated but unused)
 *
 * Never hand-write CSS or hardcode a hex value in a client. If a value is
 * needed and missing here, add it here.
 *
 * Visual direction: Zed IDE. Values below are taken from Zed's own One Dark
 * theme (assets/themes/one/one.json) and zed.dev's compiled CSS, not invented.
 *
 * The six traits that make it read as Zed:
 *   1. Micro-radius — 2-4px nearly everywhere. Never pills, never 12px cards.
 *   2. Hairline separation, not shadow. Surfaces carry NO shadow at all;
 *      only popovers and modals do, at <=12% opacity.
 *   3. A three-step background ramp with tiny deltas (~7-12 lightness points).
 *      Elevation is a background shift, and the data canvas is the extreme.
 *   4. Tinted neutrals — blue-grey and warm cream, never pure #808080.
 *   5. Dense small type — 10-15px working range; 15px is the *code* size.
 *   6. Desaturated earthy accents. No neon, no vivid saturation.
 *
 * The edge: money is rendered in monospace and coloured like syntax, so a
 * price increase reads like a diff.
 */

/**
 * Background ramp, from Zed One Dark.
 *
 * NOTE THE DIRECTION: in dark mode Zed's panels are *lighter* than the editor
 * and chrome is lighter still. The editor is the extreme value; chrome recedes
 * toward mid-grey. This is the reverse of most dark IDEs and is the single
 * trait that most makes an interface read as Zed. Do not "fix" it.
 */
export const background = {
  base: '#282c33',      // the data canvas — deepest, = editor.background
  surface: '#2f343e',   // cards, panels, lists
  elevated: '#3b414d',  // header, nav, chrome — lightest
  input: '#2e343e',     // form controls = element.background
  hover: '#363c46',     // element.hover
  active: '#454a56',    // element.selected
  overlay: 'rgb(0 0 0 / 0.50)',
};

/**
 * Two border weights, as Zed uses: `default` structural, `subtle` for internal
 * dividers like table rows. Borders do the separation work here — shadows
 * almost never do.
 */
export const border = {
  subtle: '#363c46',    // border.variant — row dividers
  default: '#464b57',   // border — structural
  strong: '#545963',
  focus: '#47679e',     // border.focused
};

/**
 * Contrast against bg.base (#282c33), measured:
 *   primary   10.57  AA
 *   secondary  6.37  AA
 *   muted      4.08  AA-large only — 11px+ or secondary text, never body copy
 *   disabled   2.32  FAILS — decorative only (line numbers, aria-hidden marks)
 *
 * `accent.comment` shares the disabled value and the same restriction. It is
 * right for gutter line numbers and wrong for anything meant to be read.
 * On bg.elevated everything drops ~1.4 points; muted fails there entirely.
 */
export const text = {
  primary: '#dce0e5',
  secondary: '#a9afbc',  // text.muted — labels
  muted: '#878a98',      // text.placeholder
  disabled: '#5d636f',
  inverse: '#282c33',
};

/**
 * Zed's One Dark syntax colours, verbatim. These carry the palette's character
 * and are what make money-as-code legible: amounts, increases and states
 * borrow semantics the eye is already trained to read in an editor.
 *
 * They are deliberately desaturated and earthy. Saturating them breaks it.
 */
export const accent = {
  primary: '#74ade8',   // text.accent — links, primary actions
  keyword: '#b477cf',   // purple
  string: '#a1c181',    // green
  function: '#73ade9',  // blue
  number: '#bf956a',    // amber — the money colour
  type: '#6eb4bf',      // teal
  constant: '#dfc184',
  property: '#d07277',  // red
  comment: '#5d636f',   // grey
};

/**
 * Semantic roles mapped onto the syntax accents, so the app's meaning and the
 * editor's meaning stay one system.
 */
export const semantic = {
  increase: '#d07277',  // price went up — the bad one, reads like a diff
  decrease: '#a1c181',  // price went down
  warning: '#bf956a',   // trial converting, needs attention
  danger: '#d07277',    // failed charge
  success: '#a1c181',   // confirmed as expected
  neutral: '#6eb4bf',   // paused, cancelling
  money: '#bf956a',     // amounts — syntax "number"
};

/**
 * Spacing scale, 4px base. Zed is dense — the lower steps do most of the work
 * and generous whitespace is the exception, not the default.
 */
export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

/**
 * Radii. Measured from zed.dev's markup, where 2-4px accounts for ~350 uses
 * and 6-8px for four. Large radii are the fastest way to break the look, so
 * `lg` exists only for the rare modal and should almost never be reached for.
 */
export const radius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  DEFAULT: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px',  // only for dots, avatars, status pips — never containers
};

/**
 * zed.dev pairs IBM Plex Sans for UI with Lilex for code, plus IBM Plex Serif
 * for editorial headings — the serif is what gives the site an editorial voice
 * rather than a SaaS one, and it is worth keeping.
 *
 * ".ZedMono" resolves to Lilex; the old Zed Plex Mono was discontinued for an
 * OFL naming violation. All three families are open licensed.
 */
export const font = {
  sans: "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
  serif: "'IBM Plex Serif', Georgia, serif",
  mono: "'Lilex', ui-monospace, 'SF Mono', Menlo, monospace",
};

/**
 * Type scale. Zed's working range is 10-15px; 15px is the *code* size and the
 * largest thing in normal UI. The scale below 16px is where nearly all product
 * chrome lives — anything above is landing-page display type only.
 */
export const fontSize = {
  '2xs': ['10px', { lineHeight: '14px' }],
  xs: ['11px', { lineHeight: '16px' }],
  sm: ['12px', { lineHeight: '18px' }],
  base: ['13px', { lineHeight: '20px' }],
  md: ['14px', { lineHeight: '21px' }],
  code: ['15px', { lineHeight: '24px' }],  // buffer_font_size
  lg: ['16px', { lineHeight: '24px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['32px', { lineHeight: '38px' }],
  '4xl': ['40px', { lineHeight: '46px' }],
  '5xl': ['56px', { lineHeight: '60px' }],
};

/** Zed uses the golden ratio for prose and code line height. */
export const lineHeight = {
  tight: '1.3',        // "standard" — dense UI
  comfortable: '1.618', // Zed's default for buffers and prose
};

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Shadows, from Zed's elevation.rs.
 *
 * IMPORTANT: surfaces and the data canvas carry NO shadow — `surface` is
 * literally an empty vec in Zed's source. Cards, panels and lists get their
 * separation from the background ramp and a 1px border, never from elevation.
 * Only popovers and modals get a shadow, and even then max opacity is 0.12.
 *
 * Reaching for a shadow on a card is the most likely way to break the look.
 *
 * This is also the group the roadmap flags as diverging most between web and
 * Swift — Phase 2 budgets for remapping rather than discovering it.
 */
export const shadow = {
  none: 'none',
  surface: 'none',
  popover: '0 2px 3px 0 rgb(0 0 0 / 0.12), 0 1px 1px 0 rgb(0 0 0 / 0.08)',
  modal:
    '0 2px 3px 0 rgb(0 0 0 / 0.12), 0 3px 6px 0 rgb(0 0 0 / 0.08), ' +
    '0 6px 12px 0 rgb(0 0 0 / 0.04), 0 1px 1px 0 rgb(0 0 0 / 0.08)',
};

/**
 * Motion. zed.dev's default transition is 150ms on a standard material curve.
 * Nothing bounces, nothing springs — anything over ~150ms on an interaction
 * reads as sluggish and un-Zed-like.
 */
export const motion = {
  duration: {
    instant: '80ms',
    fast: '120ms',
    DEFAULT: '150ms',
    slow: '240ms',
  },
  easing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

/**
 * Control heights, from Zed's ButtonSize. A 22px default button is very
 * compact — most systems default to 36-40px — and that density is central to
 * the feel. Table rows sit in the same register.
 */
export const control = {
  height: {
    compact: '18px',
    DEFAULT: '22px',
    md: '28px',
    lg: '32px',
  },
  row: {
    DEFAULT: '28px',
    comfortable: '32px',
  },
};

export const tokens = {
  background,
  border,
  text,
  accent,
  semantic,
  spacing,
  radius,
  font,
  fontSize,
  lineHeight,
  fontWeight,
  shadow,
  motion,
  control,
};

export default tokens;
