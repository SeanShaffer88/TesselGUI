# Revision 4 materials

Use four semantic levels. The editor background uses `--surface-1` (`#1B1B1D`), the secondary base uses `--surface-2` (`#1F1F22`), panels use `--surface-3` (`#232326`), and selected regions use `--surface-4` (`#2A2A2F`). A 1px `--edge` border (`#43434A`) separates compartments and table rows. Solid fills and edges give controls and floating layers a flat finish. [Reusable CSS tokens](../demo/tokens.css) · [Machine-readable values](tokens.json)

The primary action is a Carmine fill in the default scheme (`--action`, `#960018`) with a white label (`--action-foreground`). A lighter hover fill and a deeper pressed fill show feedback while keeping the control in place. The deep fill is bounded by a 1px rim in `--border`, so it never relies on fill-to-surface contrast alone; in the light theme it also reaches 3:1 against every surface. Secondary controls use `--raised` with a `--border`. Disabled controls use Surface, a muted label and a dashed boundary. Focus and selection use dedicated indicators. Error, warning, success and information keep their own semantic colors and labels.

Body typography starts at 16 CSS pixels under default browser settings and follows user font sizing. Smaller labels and metadata retain their contrast. Grouped controls default to 8px gaps with a 6px minimum. Narrow layouts and coarse pointers use a 44 by 44px minimum for standalone interactive controls and their clickable labels. The reference keeps the 180ms drawer entrance and limits nonessential transitions to 200ms. Reduced-motion and forced-color preferences use the browser's corresponding modes.

## Accent roles

<img src="../assets/tessel-accent.svg" alt="Deep accent: Carmine #960018 in both themes" width="96" height="32">

The Carmine family distinguishes the primary action, focus, selection and progress. Pair these colors with an outline, marker and fill, or a progress label and measured value.

| Role | CSS token | Dark | Light | Application |
| --- | --- | --- | --- | --- |
| Primary action | `--action` · `--action-hover` · `--action-pressed` | `#960018` · `#A81226` · `#7E0014` | `#960018` · `#7E0014` · `#660011` | The one primary action in a view. Label in `--action-foreground` (`#FFFFFF`, 9.09:1 at rest). The dark fill carries a 1px `--border` rim; the light fill reaches 3:1 on every surface on its own |
| Deep accent | `--accent` | `#960018` | `#960018` | Large tinted regions, such as a selected row band. Always with a marker and a label. Label in `--accent-foreground` measures 7.12:1 (dark) and 9.09:1 (light) |
| Selection | `--selection-indicator` | `#DF485D` | `#960018` | Selected-item edge, active-tab underline and active-region rule. Include a fill, label or programmatic state |
| Focus | `--focus` | `#FB8A97` | `#C8102E` | Distinct outline using the focus ring geometry |
| Radial progress | `--progress` | `#DF485D` | `#960018` | Circular arc with an operation name and visible percentage when known |

Reserve brand accent roles for the interaction states above. Syntax, data series and status messages use their own roles.

### Other roles

| Role | CSS token | Dark | Light | Application |
| --- | --- | --- | --- | --- |
| Edge | `--edge` | `#43434A` | `#B8B8BD` | 1px compartment and table borders |
| Control boundary | `--border` | `#76767C` | `#676772` | Fields and secondary buttons; also the rim on the dark primary action |
| Viewport surround | `--surround` | `#191919` | `#D6D6D6` | Neutral, chroma-free surround for color-critical viewports, and the near-black status bar fill. Text stays legible on it |
| Grid | `--grid` | `#28282B` | `#F2F2F5` | Fine square grid lines: empty areas, canvases, fading behind code |
| Error | `--danger` | `#E8939F` | `#960018` | A labeled error with the affected input and next action |
| Warning | `--warning` | `#C9A86A` | `#6B4A00` | A named warning with the required action |
| Success | `--success` | `#A3B58A` | `#3C5A2E` | A labeled completion or recovery result |
| Information | `--info` | `#72AAA5` | `#1F4E4A` | An explanatory label or message; the muted teal of syntax keywords |

### Appearance presets

Keep theme and accent color as independent choices. A preset recolors the deep accent, primary action, selection marker, focus outline and radial arc together. The arc takes the preset's selection color. Graphite supplies neutral accents for color-critical work.

| Preset | Dark action | Dark selection | Dark focus | Light action | Light selection | Light focus |
| --- | --- | --- | --- | --- | --- | --- |
| Carmine (default) | `#960018` | `#DF485D` | `#FB8A97` | `#960018` | `#960018` | `#C8102E` |
| GitHub | `#1A7F37` | `#409EFF` | `#71B7FF` | `#1A7F37` | `#0969DA` | `#0550AE` |
| Crimson | `#D02946` | `#DD294B` | `#FF4D73` | `#B40234` | `#9E1534` | `#D61F45` |
| Blue | `#036DCD` | `#5FA8FF` | `#ACD1FF` | `#0059AA` | `#1558A6` | `#327AD1` |
| Teal | `#027B74` | `#37B7AF` | `#8FE4D9` | `#08645E` | `#00665F` | `#13877F` |
| Graphite | `#6D6D74` | `#94949C` | `#DCDCE3` | `#585860` | `#585860` | `#75757D` |

Web consumers set `data-accent` on the document root alongside `data-theme`. The generated CSS resolves Light, Dark and System and uses `Highlight` for both cues in forced colors. Native consumers keep the base dark and light palette API and apply the preset overrides for the effective theme. Store a validated preset ID and fall back to Carmine when it is missing or unknown. Alternate sRGB values are in `color.accentPresets` in the [generated DTCG JSON](../dist/tessel.tokens.json) and as sRGB and OKLCH in the [source tokens](tokens.json).

### State and editing roles

These roles carry the states that need more than `selected`. Columns: Dark, Light, High Contrast.

| Role | CSS token | Dark | Light | High Contrast | Application |
| --- | --- | --- | --- | --- | --- |
| Strong selection | `--selected-strong` | `#33333A` | `#CACAD3` | `#3D444D` | Explorer-style selected row when the list has focus elsewhere, and the active item in a tree |
| Hover | `--hover` | `#28282D` | `#D5D5DD` | `#20242B` | Secondary control and row hover |
| Pressed | `--pressed` | `#2E2E34` | `#C9C9D3` | `#2E333B` | Secondary control while pressed |
| Info fill | `--info-fill` | `#1C2B29` | `#CDE3E0` | `#0C2D6B` | Banner or tag behind `info` text |
| Warning fill | `--warning-fill` | `#2E2617` | `#F0E3BC` | `#3A2A00` | Banner or tag behind `warning` text |
| Success fill | `--success-fill` | `#222B1D` | `#DCE8D2` | `#0A3318` | Banner or tag behind `success` text |
| Error fill | `--danger-fill` | `#3B1B22` | `#F3D9DD` | `#4C1A1A` | Banner or tag behind `danger` text |
| Disabled label | `--disabled-foreground` | `#89868A` | `#7E7E8A` | `#9EA7B3` | Label of a disabled control. At least 3:1 on its fill; WCAG exempts disabled controls |
| Disabled fill | `--disabled-fill` | `#1B1B1D` | `#F2F2F5` | `#0A0C10` | Fill of a disabled control, with a dashed `border` |
| Read-only fill | `--read-only-fill` | `#232326` | `#F4F4F7` | `#11151B` | Fields that show a value but cannot be edited |
| Text selection | `--text-selection` | `#3F3F46` | `#E3C8CC` | `#1F4E8F` | Selected text: a soft gray highlight with a thin Carmine edge. `foreground` stays 4.5:1 on it |
| Find match | `--find-match` | `#4A3E24` | `#FFE97A` | `#5C4A00` | Every match of a find or search |
| Active find match | `--find-match-active` | `#63552F` | `#FFD33D` | `#8A5B00` | The current match |

Status fills pair with their text role: `info` on `infoFill`, `warning` on `warningFill`, `success` on `successFill` and `danger` on `dangerFill`, each at least 4.5:1 (tested). A banner still needs an icon and a label.

## High Contrast theme

The optional High Contrast theme retains its own palette. Text is `#FFFFFF` and `#F0F3F6`, borders are `#F0F3F6`, edges are `#9EA7B3` (at least 5:1 on the three base surfaces), the selection marker is `#79C0FF`, and focus is `#FFD33D`. Text, status, selection, focus and progress reach 7:1 on the four standard surfaces. Set `data-theme="high-contrast"`. Forced colors map the palette roles to system colors.

The primary action cannot reach 7:1 for its label and 3:1 for its fill on black at once, so in High Contrast it keeps a deep green fill (`#0A5A23`, label 8.4:1) and gains a 2px `border` outline. The deep accent is `#0A2A5E`. High Contrast has no OKLCH encoding and reuses the dark syntax colors, which reach 4.5:1 on its background and surface.

## Syntax colors

Code and logs use separate `--syntax-*` roles. Dark keywords use `#72AAA5`, strings `#A3B58A`, functions `#CFC4B8`, constants `#B8AAA0`, comments `#89868A`, variables `#A8C0B8`, tags `#8FAE94`, and type names `#B5C4A8`. The corresponding light values are `#2F6F6A`, `#4C6B3C`, `#6E6259`, `#8A5A13`, `#6A686E`, `#7A5230`, `#3F7057`, and `#556B47`. Each reaches 4.5:1 on the editor background and surface.

## Elevation

Floating layers use semantic fills and a visible edge.

| Level | Fill | Edge | Use |
| --- | --- | --- | --- |
| Popup (z 100) | `raised` | `edge` | Menus, dropdowns, context menus |
| Tooltip (z 200) | `selected` | `border` | Tooltips and hints |
| Dialog (z 300) | `raised` | `border` | Modal dialogs and sheets |

Modal dialogs keep the scrim (`--scrim`, `#000000B3` dark and `#00000066` light). The legacy shadow properties `--material-shadow`, `--elevation-popup`, `--elevation-tooltip`, and `--elevation-dialog` resolve to `none`.

## Accent tints

Quiet region fills come from mixing an accent into the background in OKLab at 8%, 16% and 24%: `--selection-indicator-tint-1..3` and `--action-tint-1..3`. A tint is a fill, never a label color. Body text on every tint stays at least 4.5:1 in all three themes (tested). The DTCG export lists the computed hex values.

## Grid signature

Use 24px square cells with 1px lines in `--grid` in empty areas and canvases. Fade the grid behind code and dense content. Use solid fills behind long reading text. A 2px `--selection-indicator` line marks the active compartment header.

The decorative grid stays within 1.04–1.30:1 of the background, surface and raised surfaces. Text and indicators retain their contrast. In forced colors, keep the underlying surface and all status text.

## Background texture

The fine square grid is the standard background texture. Honor the user's flat preference.

## Radial progress

Use `--radial-size` (3rem), `--radial-stroke` (3px), and the `--progress` arc color. The size corresponds to 48 CSS pixels at the default root font size. Use a neutral track, an operation name and a measured percentage. For unknown values, show an indeterminate arc and descriptive status. Keep the arc static under reduced motion. [Progress tokens](tokens.json)

## Measured palette contract

Dark Background, Surface, and Raised use OKLCH lightness values of 0.223, 0.241, and 0.257. Their relative luminance rises by about 25% and 22%. The dark step range is 15% to 40%. The High Contrast theme uses a different range of 150% to 300%. [CSS Color 4 conversion method](https://www.w3.org/TR/css-color/#color-conversion-code)

| Checked pairing | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Body text on four surfaces | 11.18:1 | 12.02:1 |
| Muted labels on four surfaces and strong selection | 4.83:1 | 4.89:1 |
| Semantic labels on four surfaces | 5.45:1 | 5.77:1 |
| Primary label at rest and pressed (hover) | 9.09:1 (7.56:1) | 9.09:1 (11.07:1) |
| Focus outline on four surfaces and strong selection | 5.48:1 | 3.61:1 |
| Primary fill against background, surface and raised | 1.72:1, bounded by its border rim | 7.17:1 |
| Control boundary on surfaces | 3.16:1 | 4.13:1 |
| Edge against background, surface and raised | 1.60:1 | 1.56:1 |
| Selection marker and progress arc on four surfaces and strong selection | 3.12:1 | 5.58:1 |

The dark Carmine action uses a visible `border` rim. Its white label is 9.09:1 at rest. Use the separate selection, focus and progress colors with their corresponding shape or state cues. [Contrast rules](tokens.json)

Fills that mean different states must also differ from each other. These are fill-to-fill ratios, so they support recognition rather than replace boundaries, markers and labels.

| Distinctness check | Dark | Light | Minimum |
| --- | ---: | ---: | ---: |
| Selected fill against Surface | 1.15:1 | 1.35:1 | 1.10:1 |
| Primary action hover against rest | 1.20:1 | 1.22:1 | 1.05:1 |
| Primary action pressed against rest | 1.22:1 | 1.47:1 | 1.05:1 |
| Grid against surfaces (range) | 1.07–1.17:1 | 1.05–1.13:1 | 1.04–1.30:1 |
| Focus against selection indicator | 1.76:1 | 1.55:1 | 1.30:1 |

Figures are rounded for display. `node --test demo/tokens.test.mjs` compares unrounded ratios in both encodings, checks CSS and JSON agreement, validates the dark surface steps, and enforces the distinctness minimums. `node tools/build-tokens.mjs --check` confirms that generated outputs match `tokens.json`. [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
