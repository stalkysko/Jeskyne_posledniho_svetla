const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('../mobil_v11817.js');
const {measure} = globalThis.lastLightMobile11817;

const cases = [
  // layout, vizuální viewport, offset, původní výška, fokus, klávesnice?
  [760, 760, 0, 760, false, false],
  [760, 760, 0, 760, true, false],
  [760, 380, 0, 760, true, true],   // iPhone Safari
  [760, 430, 42, 760, true, true], // iPhone Safari s posunutým viewportem
  [380, 380, 0, 760, true, true],  // Android s resizes-content
  [760, 695, 0, 760, true, false], // změna lišty Safari, ne klávesnice
  [760, 380, 0, 760, false, false] // zoom/posun bez focuse na vstupu
];

for (const [layout, visual, offset, baseline, focused, expected] of cases) {
  const actual = measure(layout, visual, offset, baseline, focused);
  assert.equal(actual.keyboardOpen, expected, JSON.stringify({layout, visual, offset, baseline, focused}));
  assert.equal(actual.height, visual);
  assert.equal(actual.top, offset);
}

const html = fs.readFileSync(path.join(__dirname, '../HRA.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../hra.css'), 'utf8');
const moduleSource = fs.readFileSync(path.join(__dirname, '../mobil_v11817.js'), 'utf8');

assert.match(html, /mobil_v11817\.js\?v=0\.11\.8\.(?:17|21|22|23|24)/, 'mobilní skript je načtený');
assert.ok(html.includes('manifest.webmanifest'), 'instalace webové aplikace');
assert.ok(css.includes('body.mobile-keyboard-open #form'), 'příkaz zůstává viditelný');
assert.ok(css.includes('body.mobile-keyboard-open #log'), 'historie zůstává čitelná');
assert.ok(css.includes('body.mobile-keyboard-open #mobileNav'), 'ovládání ustoupí klávesnici');
assert.ok(moduleSource.includes("viewport?.addEventListener('resize'"), 'reakce na animaci klávesnice');
assert.ok(moduleSource.includes("window.addEventListener('pageshow'"), 'návrat z pozadí obnoví výšku');
assert.ok(moduleSource.includes("field.addEventListener('input'"), 'psaní aktivuje kontrolu polohy vstupu');
assert.ok(moduleSource.includes('main.requestFullscreen'), 'nativní fullscreen');
assert.ok(moduleSource.includes('setImmersive(true)'), 'viditelný fallback');

console.log(`OK: ${cases.length} variant obrazovky, manifest, CSS a fullscreen`);
