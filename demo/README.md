# Workspace interaction reference

A fictional task workspace demonstrates the current TesselGUI standard in HTML, CSS, and JavaScript. It runs from static files under the MIT license. Documentation and images use CC BY 4.0. [Master specification](../docs/master-specification.md) · [Live demo](https://seanshaffer88.github.io/TesselGUI/demo/) · [Licenses](../ATTRIBUTION.md)

## Run locally

From the repository root, using the installed Python interpreter:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8000/demo/`. Stop the server with Ctrl+C. This binds to loopback and serves files without writing project files. Python's simple server is for local inspection; it is not a deployment service. Opening index.html through `file:` may block JavaScript modules.

## Controls

- Theme: System, Light, Dark, and High Contrast. System follows OS color preference through CSS.
- Accent color: Carmine by default, with GitHub, Crimson, Blue, Teal, and Graphite alternatives. The preset controls the primary action, selection, focus and progress arc. Forced colors use system highlights.
- Decorative edge: optional neutral masthead edge, off by default.
- Density: Per component (default), Compact, Comfortable or Touch. Data rows default to Compact.
- Grid signature: fine square grid in empty areas, with layout boundaries defined by semantic fills and edges. The [category gallery](categories/index.html) shows eight product types.
- Commands: open with the visible button or Ctrl/⌘+K from the workspace. Filter implemented actions in Search commands. Use the palette's keyboard hints, Tab, or click to select an available action. Escape closes the dialog and returns focus to the invoker.
- Details: open the contextual drawer or dock the inspector where the primary region can still fit. Select a task to update the details.
- Docked divider: drag with pointer capture or use the arrow keys. Home sets 240 pixels and End sets 420. Steps are 10 pixels. Open and close controls remain available.
- Reset layout: a native confirmation dialog restores a 300-pixel inspector width and closes Details. Keep layout and Escape preserve everything. Theme, accent color, density, and effects survive reset.
- Start simulation: begins at zero and shows a labeled radial percentage. Pause freezes progress. Resume continues. Cancel and completion stop the timer. A new start clears old progress.
- Feedback & recovery: select validation, empty, offline, or error examples. Retry is a local demonstration; it never contacts a service. Names validate locally and are not saved.

## Contrast checker

`contrast/index.html` loads `docs/tokens.json`, lists every pairing the standard checks for Dark, Light or High Contrast, and recomputes the ratios as you edit a role. It saves nothing and sends nothing. Its pure helpers in `contrast/contrast.mjs` are covered by `contrast/contrast.test.mjs`.

## Persistence and boundaries

The `tessel.display.v1` localStorage entry contains versioned theme, accent ID, density, effects, inspector width, collapse preference, settings section, and pin preference. Input is bounded to 2 KiB, checked against allowlists and width limits, and unrelated fields are discarded. Older version-1 records retain their choices and gain Carmine, Appearance, and unpinned defaults. Malformed, denied, or unavailable storage falls back to defaults. No task content is persisted. Delete this one key in browser developer tools to clear all display choices. Reset layout only resets geometry.

The inspector uses a native modal when the available space cannot support a docked panel. Native modal behavior provides focus containment and Escape. The script restores focus to the opening control. No service worker, PWA registration, automatic synchronization, or startup job exists.

## Verify

```powershell
node --test
node --check demo/app.js
node --check demo/palette.mjs
```

Node's standard test runner covers hostile preference data and lifecycle invariants. These tests do not establish browser layout, pointer capture, focus containment, assistive technology, or performance. Follow [the runtime checklist](../docs/verification.md) before claiming those behaviors are verified. This is an educational interaction reference, not a certified accessible component library.

## Settings and action layout

Open Settings from navigation. The browser uses window and screen coordinates to choose an in-window drawer edge. Very narrow viewports use the bottom edge and unavailable screen coordinates use the right edge. A modal drawer contains focus. Pin can reserve a nonmodal column when the available width supports it. A saved pin preference resumes when enough space returns. Close and Escape retain the selected section and width draft. Opening focuses Close and dismissal returns focus to the trigger.

Appearance changes immediately. In Layout, edit Details width and choose Apply to commit or Cancel changes to restore the current workspace width. The draft survives section changes and closing for this visit. Reload discards it. Clean drafts track divider changes and confirmed resets. Dirty drafts survive both, and the status identifies the current committed width. Reset confirms width/collapse restoration and returns focus to its Settings control. Only one modal is active at a time. Shortcuts lists the actual native controls and focused divider bindings.

Start simulation, Pause/Resume, and Cancel use an auto-fit grid and stretch to fill each occupied row in source order. Distinct grouped controls retain 8px spacing with a 6px minimum. Related groups use 16px and sections use 24px. Target heights remain 32/40/48px, with at least 44px on narrow or coarse-pointer layouts. [Master specification](../docs/master-specification.md)

Preference migration and field validation have standard-library unit tests. [Verification record](../docs/verification.md)
