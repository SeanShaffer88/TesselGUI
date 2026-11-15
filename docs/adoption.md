# Adoption guide

Choose the generated export for your stack and apply the current standard. To change the exports, edit `tokens.json` and run `node tools/build-tokens.mjs`. [Master specification](master-specification.md) · [Source tokens](tokens.json) · [Migration notes](migration.md)

## 1. Pick your export

| Stack | File | Use |
| --- | --- | --- |
| Web, Tauri, webviews | [demo/tokens.css](../demo/tokens.css) | Set `data-theme` (system, light, dark, high-contrast) and `data-accent` (carmine, github, crimson, blue, teal, graphite) on the root element. |
| Rust (Win32, windows-sys) | [dist/tessel.rs](../dist/tessel.rs) | Include as a module. Palettes are `[u8; 3]`. Sizes are CSS-pixel equivalents: scale by DPI. |
| Slint | [dist/Tessel.slint](../dist/Tessel.slint) | Import the `Tessel` global. Bind `dark` to the OS theme from Rust. |
| WPF | [dist/Tessel.Dark.xaml](../dist/Tessel.Dark.xaml), [dist/Tessel.Light.xaml](../dist/Tessel.Light.xaml) | Merge one dictionary and swap it to change theme. Use `SystemColors` when `SystemParameters.HighContrast` is true. |
| WinUI 3 | [dist/Tessel.xaml](../dist/Tessel.xaml) | Merge into `Application.Resources`. Theme dictionaries handle Light and High Contrast. |
| WinForms | [dist/tessel.tokens.json](../dist/tessel.tokens.json) | Read the colors at startup and assign them to controls. Draw lists with owner-draw or a custom grid. |
| Godot 4 | [dist/tessel_tokens.gd](../dist/tessel_tokens.gd) | Use the `TesselTokens` class to build a `Theme` resource. |
| Anything else | [dist/tessel.tokens.json](../dist/tessel.tokens.json) | Design Tokens Community Group format. Convert with your tool of choice. |

## 2. Apply in this order

1. **Color roles.** Use the semantic surface levels, `edge` for structure, `border` for controls, and separate action, focus, selection and progress roles. [Materials](materials.md)
2. **Density.** Give rows, toolbars, trees and primary navigation the Compact rhythm. Use Comfortable for forms and dialogs, and Touch for touch input.
3. **Layout.** Give the active task the available space its content needs. Align shared edges, let supporting modules fill their space, and hide secondary tools behind contextual drawer triggers. Drawers open toward the nearest usable edge with a safe in-window fallback. [Layout protocols](master-specification.md#2-structural--layout-protocols)
4. **Data lists.** Use the [data list pattern](data-lists.md) for every list of records.
5. **Keyboard.** A path for every task, visible shortcuts, Ctrl/⌘+K for commands. Resize and collapse work from the keyboard.
6. **States.** Verify empty, loading, success, error, disabled, offline and confirm. Use a labeled round progress indicator with the real percentage when known and a descriptive status when unknown. [Progress tokens](materials.md#radial-progress)
7. **Themes.** Dark and Light, plus High Contrast and forced colors using native system colors. Offer Graphite for color-critical work.
8. **Background texture.** The [fine square grid](materials.md#grid-signature) shows in empty areas and fades behind code. Dense reading surfaces stay flat.

## 3. Native Windows notes

- Follow the OS theme and respect High Contrast. Do not hard-code colors where a system color should apply.
- Per-Monitor DPI v2. Scale pixel values from the token export by the display scale.
- Prefer native controls and keep their focus behavior. A custom focus outline uses the corresponding focus ring tokens.
- Remember window size, position and splitter positions, and restore them safely when displays or DPI change.
- No telemetry, no required network, and settings stored locally in a readable format.

## 4. Check your work

Use the [verification guide](verification.md). At minimum:

- Contrast of text, boundaries, selection and focus on every surface in Dark, Light and Graphite.
- Keyboard-only run of the core task. Tab order, Esc to cancel, Enter to submit.
- 100% to 200% scaling and 200% text without clipping or main-window scrollbars.
- Populated, empty, error and progress states for every list and form.
- The workspace and supporting regions use the available viewport. Drawers reflow safely when window position or display geometry changes.

## 5. Record deviations

Keep a short list in the project: which token or rule you changed, why, and what you measured. A deviation that helps several projects belongs in [tokens.json](tokens.json) through a pull request, with a row in [rationale](rationale.md).

## 6. Rollout

Apply the standard to a project during its next planned release work, not as a separate restyle. Show screen mockups of the affected views for review before changing UI code.
