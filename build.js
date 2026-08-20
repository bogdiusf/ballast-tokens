/**
 * Emits every consumer target from src/tokens.mjs.
 *
 *   dist/theme.css    Tailwind v4 @theme block  → ballast-web, ballast-landing
 *   dist/Tokens.swift Swift constants           → ballast-ios (Phase 2)
 *   dist/tokens.json  raw values                → tooling, design handoff
 *   dist/tokens.js    re-export                 → JS consumers needing raw values
 *
 * The Swift target is generated now although nothing consumes it until Phase 2.
 * Retrofitting a token pipeline is significantly more painful than designing
 * for two consumers from the start.
 */

import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tokens from './src/tokens.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

const GENERATED = 'GENERATED FILE — DO NOT EDIT. Source: src/tokens.mjs';

/* ── Tailwind v4 @theme ──────────────────────────────────────────────────── */

/** Tailwind v4 reads plain CSS custom properties inside @theme. */
function toTailwindTheme(t) {
  const lines = [];
  const push = (name, value) => lines.push(`  ${name}: ${value};`);

  for (const [key, value] of Object.entries(t.background)) {
    push(`--color-bg-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.border)) {
    push(`--color-border-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.text)) {
    push(`--color-text-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.accent)) {
    push(`--color-accent-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.semantic)) {
    push(`--color-${key}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.spacing)) {
    push(`--spacing-${String(key).replace('.', '_')}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.radius)) {
    push(key === 'DEFAULT' ? '--radius' : `--radius-${key}`, value);
  }

  lines.push('');
  push('--font-sans', t.font.sans);
  push('--font-serif', t.font.serif);
  push('--font-mono', t.font.mono);

  lines.push('');
  for (const [key, [size, meta]] of Object.entries(t.fontSize)) {
    push(`--text-${key}`, size);
    push(`--text-${key}--line-height`, meta.lineHeight);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.lineHeight)) {
    push(`--leading-${key}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.fontWeight)) {
    push(`--font-weight-${key}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.shadow)) {
    push(key === 'DEFAULT' ? '--shadow' : `--shadow-${key}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.motion.duration)) {
    push(key === 'DEFAULT' ? '--duration' : `--duration-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.motion.easing)) {
    push(key === 'DEFAULT' ? '--ease' : `--ease-${key}`, value);
  }

  lines.push('');
  for (const [key, value] of Object.entries(t.control.height)) {
    push(key === 'DEFAULT' ? '--height-control' : `--height-control-${key}`, value);
  }
  for (const [key, value] of Object.entries(t.control.row)) {
    push(key === 'DEFAULT' ? '--height-row' : `--height-row-${key}`, value);
  }

  return `/* ${GENERATED} */\n\n@theme {\n${lines.join('\n')}\n}\n`;
}

/* ── Swift ───────────────────────────────────────────────────────────────── */

function hexToSwiftColor(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = (parseInt(full.slice(0, 2), 16) / 255).toFixed(4);
  const g = (parseInt(full.slice(2, 4), 16) / 255).toFixed(4);
  const b = (parseInt(full.slice(4, 6), 16) / 255).toFixed(4);
  return `Color(red: ${r}, green: ${g}, blue: ${b})`;
}

const pxToCG = (v) => `${parseFloat(String(v).replace('px', '')) || 0}`;

/** Swift reserved words that collide with token key names. */
const SWIFT_RESERVED = new Set(['default', 'class', 'static', 'operator', 'protocol', 'extension', 'internal', 'public', 'private', 'true', 'false', 'nil', 'func', 'var', 'let', 'in', 'is', 'as', 'self', 'super', 'type']);

const camel = (k) => {
  const name = String(k).replace(/[-_.](\w)/g, (_, c) => c.toUpperCase());
  // `default` et al. would be a compile error in the Swift target — a failure
  // that would otherwise not surface until Phase 2.
  return SWIFT_RESERVED.has(name) ? `\`${name}\`` : name;
};

function swiftColorGroup(name, group, indent = '        ') {
  const body = Object.entries(group)
    // Non-hex values (e.g. the rgb() overlay scrim) have no direct SwiftUI
    // equivalent here; the native client composes its own scrim.
    .filter(([, v]) => typeof v === 'string' && v.startsWith('#'))
    .map(([k, v]) => `${indent}static let ${camel(k)} = ${hexToSwiftColor(v)}`)
    .join('\n');
  return `    enum ${name} {\n${body}\n    }`;
}

function toSwift(t) {
  const spacing = Object.entries(t.spacing)
    .map(([k, v]) => `        static let s${String(k).replace('.', '_')}: CGFloat = ${pxToCG(v)}`)
    .join('\n');

  const radius = Object.entries(t.radius)
    .map(([k, v]) => {
      const name = k === 'DEFAULT' ? 'medium' : camel(k);
      const value = k === 'full' ? '9999' : pxToCG(v);
      return `        static let ${name}: CGFloat = ${value}`;
    })
    .join('\n');

  const fontSize = Object.entries(t.fontSize)
    .map(([k, [size]]) => `        static let ${camel(k.replace(/^(\d)/, '_$1'))}: CGFloat = ${pxToCG(size)}`)
    .join('\n');

  const control = [
    ...Object.entries(t.control.height).map(
      ([k, v]) => `        static let ${k === 'DEFAULT' ? 'height' : camel(k) + 'Height'}: CGFloat = ${pxToCG(v)}`,
    ),
    ...Object.entries(t.control.row).map(
      ([k, v]) => `        static let ${k === 'DEFAULT' ? 'rowHeight' : camel(k) + 'RowHeight'}: CGFloat = ${pxToCG(v)}`,
    ),
  ].join('\n');

  return `// ${GENERATED}
//
// Phase 2 note: typography here is raw point sizes. The Swift client must map
// these onto system text styles so Dynamic Type scaling still works — do not
// use these as fixed sizes in production views. Layered shadows are the token
// group expected to diverge most between web and native.

import SwiftUI

public enum BallastTokens {
${swiftColorGroup('Background', t.background)}

${swiftColorGroup('Border', t.border)}

${swiftColorGroup('Text', t.text)}

${swiftColorGroup('Accent', t.accent)}

${swiftColorGroup('Semantic', t.semantic)}

    enum Spacing {
${spacing}
    }

    enum Radius {
${radius}
    }

    enum FontSize {
${fontSize}
    }

    enum Control {
${control}
    }

    enum Motion {
        static let instant: Double = ${parseFloat(t.motion.duration.instant) / 1000}
        static let fast: Double = ${parseFloat(t.motion.duration.fast) / 1000}
        static let standard: Double = ${parseFloat(t.motion.duration.DEFAULT) / 1000}
        static let slow: Double = ${parseFloat(t.motion.duration.slow) / 1000}
    }
}
`;
}

/* ── Emit ────────────────────────────────────────────────────────────────── */

writeFileSync(join(dist, 'theme.css'), toTailwindTheme(tokens));
writeFileSync(join(dist, 'Tokens.swift'), toSwift(tokens));
writeFileSync(join(dist, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
copyFileSync(join(root, 'src', 'tokens.mjs'), join(dist, 'tokens.js'));

console.log('tokens: emitted theme.css, Tokens.swift, tokens.json, tokens.js');
