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

function mutateColor(hex) {
  const rgb = hexToRgb(hex).map(v => Math.min(255, Math.max(0, v + (Math.random() * 20 - 10))));
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

function mutateDesign(design) {
  return {
    ...design,
    colors: {
      background: mutateColor(design.colors.background),
      text: mutateColor(design.colors.text),
      primary: mutateColor(design.colors.primary)
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
  const refined = refine(design, 50);
  fs.writeFileSync('refined_design.json', JSON.stringify(refined, null, 2));
  const { score, harmony } = scoreDesign(refined);
  console.log(`Refined score: ${score}, harmony: ${harmony.toFixed(2)}`);
}

module.exports = { scoreDesign, refine };
