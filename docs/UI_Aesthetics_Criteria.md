# UI Aesthetics Criteria

This document defines deterministic guidelines for evaluating user interface (UI) quality. An AI system can measure each item to determine if a design has "maxed out" quality. Meeting all required thresholds yields a score of 100.

## Checklist

1. **Color Contrast**
   - Text/background contrast ratio must be ≥ 4.5:1 (WCAG AA).
   - Icon/background contrast ratio must be ≥ 3:1.
2. **Readability & Typography**
   - Base font size ≥ 16px.
   - Line height between 1.4 and 1.6.
3. **Layout & Alignment**
   - All components align to a baseline grid (4dp increments).
   - Whitespace ratio (padding/margin area ÷ total screen area) between 20% and 40%.
4. **Touch Targets**
   - Interactive elements have hit areas ≥ 44x44px as recommended by Apple and Google.
5. **Feedback & Haptics**
   - Actions provide visual and haptic feedback within 50ms of interaction.
6. **Consistency**
   - Same component types use identical styles (colors, fonts, spacing).
7. **Performance**
   - Time to first render < 1s on a mid‑range device.
8. **Accessibility**
   - All images have alt text.
   - UI supports screen readers and dynamic type.
9. **Aesthetic Harmony**
   - Color palette follows a complementary or analogous scheme (measured via hue angle difference).
   - No more than 3 font families.

A design is considered **maxed out** when all checklist items are satisfied. Partial compliance yields a proportional score (e.g., 7/9 items → 78%).

## Quantifying Good Aesthetics

"Good" aesthetics mean the design scores 100 on the checklist above **and** achieves a harmony score ≥ 0.8, calculated as:

```
harmony = 1 - (color_variance / max_variance)
```

where `color_variance` is the variance of hue angles between palette colors and `max_variance` is 180°.

## Closed‑Loop Refinement

1. **Measure** – Score the current design using the checklist.
2. **Generate** – Produce variations by adjusting colors, spacing and type.
3. **Evaluate** – Score each variation.
4. **Select** – Keep the highest‑scoring design.
5. **Repeat** – Use the selected design as the new base.

Each cycle increases the chance of achieving higher harmony and full compliance with the checklist. Designs are saved along with their scores, creating an iterative improvement loop.

