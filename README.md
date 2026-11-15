# TesselGUI

TesselGUI is a design standard for dense desktop interfaces. It pairs near-black charcoal surfaces and a deep red accent with a task-sized workspace, contextual drawers, and radial progress.

[Master Specification & AI Implementation Prompt](docs/master-specification.md) · [Design mockup](assets/mockups/tessel-master-spec.svg) · Docs [CC BY 4.0](LICENSE) · Code and tokens [MIT](LICENSE-CODE)

> [!NOTE]
> Tessel is for engineers and designers building desktop-class editors,
> data tools, media tools, monitors, utilities, communication apps, CAD tools
> and system settings. It specifies the tokens, regions, density and behavior
> needed for long sessions in high-density interfaces.

**Contents** · [Design standard](#design-standard) · [Reference demos](#reference-demos) · [Any category](#any-category) · [Adopt Tessel](#adopt-tessel)

## Design standard

Use a High Contrast VS Code baseline with a bespoke deep red accent. Give the active task the space it needs and let supporting modules fill the viewport along balanced alignment axes. Keep secondary tools in drawers that open toward the nearest usable screen edge. Use a fine grid in empty areas, tokenized surface levels, compact type, and radial progress with a visible percentage when known.

![Concept showing the editor with the settings drawer closed and open, with a labeled radial progress indicator in both states.](assets/mockups/tessel-master-spec.svg)

## Reference demos

The live demos, token exports, and example layouts below reflect the Revision 3 implementation. The master specification governs new implementations. [Live demo](https://seanshaffer88.github.io/TesselGUI/demo/) · [Contrast checker](https://seanshaffer88.github.io/TesselGUI/demo/contrast/) · [Revision 3 quick reference](docs/quick-reference.md) · [Validation status](https://github.com/SeanShaffer88/TesselGUI/actions/workflows/validate.yml)

<p align="center">
  <img src="assets/tessel-workspace.png" alt="The Tessel reference workspace in the dark theme: navigation, task table with a selected row, details inspector, segmented progress and a Start simulation button" width="100%">
</p>

*Revision 3 dark-theme screenshot of the running [reference workspace](https://seanshaffer88.github.io/TesselGUI/demo/).*

## Any category

<p align="center">
  <img src="assets/tessel-categories.png" alt="Eight dark-theme layouts built from the same tokens: data, editor, media, monitoring, wizard, communication, CAD, settings" width="70%">
</p>

*Revision 3 screenshot of the [category demo](https://seanshaffer88.github.io/TesselGUI/demo/categories/).* The same tokens and rules cover data and records, editors, media, monitoring, wizards, communication, CAD and system tools. Only the dominant region changes. See [category layouts](docs/categories.md).

## Applied to different programs

<p align="center">
  <img src="assets/mockups/tessel-slideshow.gif" alt="Slideshow of eight dark-theme Tessel mockups: a spreadsheet, a file and folder compare tool, a music production suite, an image editor, a video editor, a code editor, an installed-programs manager and a monitoring console" width="90%">
</p>

*Slideshow of the Revision 3 mockups below, 3 seconds each. Click any entry to open its full-size image. All programs, names and data are fictional.*

| Program type | What the design does | Mockup |
| --- | --- | --- |
| Spreadsheet | Dominant grid with row and column gridlines, frozen headers, tabular figures, formula bar, one accent Save | [View](assets/mockups/tessel-spreadsheet.png) |
| File and folder compare | Two synchronized panes, a state list, a differences table, markers that do not rely on color alone, one accent Merge | [View](assets/mockups/tessel-file-compare.png) |
| Music production | Browser, arrangement with clips, mixer with segmented meters, value controls, one accent Record | [View](assets/mockups/tessel-music-production.png) |
| Image editor | Neutral viewport around the canvas, tool rail, layers, adjustments, history, one accent Export | [View](assets/mockups/tessel-image-editor.png) |
| Video editor | Media bin, preview, inspector, multi-track timeline with a playhead, one accent Export | [View](assets/mockups/tessel-video-editor.png) |
| Code editor | Explorer, editor, symbols, problems table and terminal, status with icon and text, one accent Run | [View](assets/mockups/tessel-code-editor.png) |
| Program manager | Gridded list of installed programs, filters, details, one accent Uninstall | [View](assets/mockups/tessel-program-manager.png) |
| Monitoring console | Metric tiles, a chart with a table alternative, events, a node table, one accent Acknowledge | [View](assets/mockups/tessel-monitoring.png) |

Every mockup follows the same rules: regions fill their space, data lists are gridded, one accent element per region, edges for structure, a single active-region rule per window.

### Light theme

<p align="center">
  <img src="assets/mockups/tessel-slideshow-light.gif" alt="Slideshow of the same eight programs in the light theme" width="90%">
</p>

*The same eight programs in the light theme, 3 seconds each. Full-size images are in [assets/mockups/light](assets/mockups/light/).*

### Graphite preset for color-critical work

Image and video tools use the Graphite preset so no tinted chrome sits next to the work. The primary action, selection marker and focus ring are neutral, and the viewport surround stays neutral gray.

| Image editor | Video editor |
| --- | --- |
| [![Image editor with the Graphite preset](assets/mockups/graphite/tessel-image-editor-graphite.png)](assets/mockups/graphite/tessel-image-editor-graphite.png) | [![Video editor with the Graphite preset](assets/mockups/graphite/tessel-video-editor-graphite.png)](assets/mockups/graphite/tessel-video-editor-graphite.png) |

## Creative and multi-mode tools

See [workspace patterns](docs/workspaces.md) for modes, panels, value controls, timelines and meters.

Cross-cutting rules: [motion](docs/motion.md), [typography](docs/typography.md), [shortcuts and the command palette](docs/shortcuts.md), [feedback patterns](docs/feedback.md), [focus rings](docs/focus-rings.md), [tabs, trees and breadcrumbs](docs/navigation.md), [status bar](docs/status-bar.md), [empty, loading and error states](docs/states.md), [command palette registry](docs/command-palette.md), [layouts and docking](docs/layouts.md), [infinite canvas](docs/canvas.md) and [undo and inline feedback](docs/undo-and-feedback.md).


## Accessibility

Tessel targets [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), including 4.5:1
contrast for normal text. The 44 × 44 CSS px touch policy is separate from AA's
24 × 24 target-size criterion. Consult the [verification record](docs/verification.md)
for the checks run and their limits. Static images and unit tests do not replace
keyboard, screen-reader and reduced-motion testing in your application.

## Adopt Tessel

- Start with the [master specification](docs/master-specification.md). Check layout and keyboard behavior in the target application. [Verification guide](docs/verification.md)
- Refer to the Revision 3 descriptions for prior component and category examples. [Adoption guide](docs/adoption.md) · [Design guidelines](docs/design-guidelines.md) · [Component usage](docs/components.md)
- Existing Revision 3 integrations can use the [CSS custom properties](demo/tokens.css), [JSON tokens](docs/tokens.json), [native exports](dist/), [npm package](packages/npm/), or [Rust crate](packages/rust/).
- Explore the Revision 3 [compact workflow recipes](docs/workflow-recipes.md), try the [PortableForge reference](https://seanshaffer88.github.io/TesselGUI/demo/portableforge/), or run the [demos locally](demo/README.md).
- [Audit](AUDIT.md) · [Contributing](CONTRIBUTING.md) · [Credits](CREDITS.md) · [Attribution](ATTRIBUTION.md)

For the maintainer's projects, plan adoption for the next scheduled release and
show project-specific mockups for review before implementation.
