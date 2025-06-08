const fs = require('fs');

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const l1 = luminance(r1, g1, b1) + 0.05;
  const l2 = luminance(r2, g2, b2) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function hue(rgb) {
  const [r, g, b] = rgb.map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  if (max === min) h = 0;
  else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
  else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
  else h = 60 * ((r - g) / (max - min)) + 240;
  return h;
}

function variance(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
}

function scoreDesign(design) {
  let score = 0;
  const fg = hexToRgb(design.colors.text);
  const bg = hexToRgb(design.colors.background);
  const contrastScore = contrast(fg, bg);
  if (contrastScore >= 4.5) score += 1;

  const hues = Object.values(design.colors).map(c => hue(hexToRgb(c)));
  const harmony = 1 - variance(hues) / 180;
  if (harmony >= 0.8) score += 1;

  if (design.fontSize >= 16) score += 1;
  if (design.lineHeight >= 1.4 && design.lineHeight <= 1.6) score += 1;
  if (design.whitespace >= 0.2 && design.whitespace <= 0.4) score += 1;
  if (design.touchSize >= 44) score += 1;

  return { score, harmony };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function mutateColor(hex, baseHue) {
  const [r, g, b] = hexToRgb(hex);
  let [h, s, l] = rgbToHsl(r, g, b);
  // Move hue toward baseHue for better harmony
  const delta = (Math.random() * 20 - 10);
  h = (baseHue + delta + 360) % 360;
  const [nr, ng, nb] = hslToRgb(h, s, l);
  return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('');
}

function mutateDesign(design) {
  const baseHue = hue(hexToRgb(design.colors.primary));
  return {
    ...design,
    colors: {
      background: mutateColor(design.colors.background, baseHue),
      text: mutateColor(design.colors.text, baseHue),
      primary: mutateColor(design.colors.primary, baseHue)
    },
    whitespace: Math.min(0.4, Math.max(0.2, design.whitespace + (Math.random() * 0.1 - 0.05))),
    fontSize: Math.max(16, design.fontSize + Math.round(Math.random() * 2 - 1)),
    lineHeight: Math.min(1.6, Math.max(1.4, design.lineHeight + (Math.random() * 0.1 - 0.05))),
    touchSize: Math.max(44, design.touchSize + Math.round(Math.random() * 2 - 1))
  };
}

function refine(design, iterations = 10) {
  let best = design;
  let { score: bestScore } = scoreDesign(best);
  for (let i = 0; i < iterations; i++) {
    const variant = mutateDesign(best);
    const { score } = scoreDesign(variant);
    if (score > bestScore) {
      best = variant;
      bestScore = score;
    }
  }
  return best;
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node designRefinement.js design.json');
    process.exit(1);
  }
  const design = JSON.parse(fs.readFileSync(input));
  const refined = refine(design, 200);
  fs.writeFileSync('refined_design.json', JSON.stringify(refined, null, 2));
  const { score, harmony } = scoreDesign(refined);
  console.log(`Refined score: ${score}, harmony: ${harmony.toFixed(2)}`);
}

module.exports = { scoreDesign, refine };
