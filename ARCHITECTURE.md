# Architecture

A technical reference for anyone reading or modifying the codebase.

---

## The big picture

Clarity is a single-page app with no build step. React and Babel load from CDN. All files are plain `.jsx` text files served directly by GitHub Pages. The browser compiles JSX at runtime via Babel standalone.

There is no router library. Navigation is a string in React state. There is no state management library. A single reducer handles all application state. There is no backend. Everything runs in the browser.

---

## File responsibilities

### `tweaks-panel.jsx`

Loads first. Exports `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakRadio` and other controls to `window`. The Tweaks panel is a floating UI for toggling design direction, colour mode, and variant options. It communicates with a host frame via `postMessage` when embedded in a design tool but works standalone too.

Must load before any other file because everything else calls `useTweaks`.

### `shapes.jsx`

Exports six 3D shape components to `window`: `Sphere`, `Cube`, `Pyramid`, `Onion`, `Orbits`, `MirrorFrame`, and `Emerging`.

All shapes except `MirrorFrame` support drag-to-rotate via the shared `useDragRotate` hook. This hook maintains yaw and pitch state, handles pointer events for drag, and runs a `requestAnimationFrame` loop for auto-spin when idle.

The `Sphere` uses real 3D projection: spherical coordinates (theta, phi) are converted to Cartesian (x, y, z), then rotated by yaw (Y-axis matrix) and pitch (X-axis matrix), then projected to 2D screen coordinates.

The `Cube` and `Pyramid` use CSS `perspective` and `transform-style: preserve-3d` with absolute-positioned face elements, each transformed with `translateZ` and `rotateY/X`.

Also exports `CUBE_FACES` and `ONION_RINGS` arrays which are referenced by the screen components.

Must load before the screen files.

### `clarity-state.jsx`

The data layer. Exports everything to `window.__CLARITY` and to `window` directly.

Contains:
- All data arrays: `ENTRY_CARDS`, `QUESTIONS`, `CHIPS_CUBE`, `ONION_CHIPS`, `ORBIT_ATTRS`, `VALUES_18`
- The initial state object `INITIAL`
- The `reducer` function — handles all state transitions
- `cubeSummary(state)` — derives dominant theme, placed items, pull/fear counts
- `closingQuestion(state)` — the closing question generator (most important function)
- `lensLabels(intake)` — derives readable intake calibration labels for the result screen

The `closingQuestion` function is the intellectual core of the app. It receives the full state and returns a string. For the Cube it uses the pull/fear ratio, reversibility answer (q1), emotional frame (q2), social circle (q3), and future projection (q4) to select from nine variants. Read this function carefully before changing it.

### `clarity-screens-a.jsx`

Entry, routing questions, transition, and all three Cube screens.

All screen components receive `{ state, dispatch }` from the router. They call `dispatch({ type: "ACTION", ...payload })` for all state changes. No screen component modifies state directly.

Exports all components to `window` for the router to access.

### `clarity-screens-b.jsx`

Onion build, Onion cross-section, Orbits naming, Orbits build, Orbits alignment, Mirror rank, Mirror instinct, Mirror reveal, Result, and History.

References `VALUES_18`, `ONION_CHIPS`, `ORBIT_ATTRS` from `window` (set by `clarity-state.jsx`). If these are undefined at runtime it means `clarity-state.jsx` loaded in the wrong order or failed to expose them.

### `clarity-app-main.jsx`

Root component `AppRoot`. Holds the Tweaks state and the app state. Renders the `Router` component which maps `state.screen` to the correct screen component. Renders the `TweaksPanel`.

Also renders the top bar, history button, and start-over link.

### `index.html`

Entry point for the interactive app. Loads all scripts in dependency order via Babel standalone. Scripts must load in this order:

```html
tweaks-panel.jsx   (no deps)
shapes.jsx         (no deps)
clarity-state.jsx  (no deps)
clarity-screens-a.jsx  (needs shapes, clarity-state)
clarity-screens-b.jsx  (needs shapes, clarity-state)
clarity-app-main.jsx   (needs all above)
```

### `app.jsx` and design review files

A separate entry point for the design review prototype. Shows all 18 screens in a sidebar rail with a phone frame. The design review files (`intake.jsx`, `cube.jsx`, `onion.jsx`, `orbits.jsx`, `mirror.jsx`, `result.jsx`) contain static/fixed-state versions of each screen for design inspection.

---

## State shape

```js
{
  screen: string,           // current screen id
  puzzle: string | null,    // 'cube' | 'onion' | 'orbits' | 'mirror'
  intake: {
    q1: number | null,      // 0–3 index into question options
    q2: number | null,
    q3: number | null,
    q4: number | null,
  },

  cube: {
    placed: string[],       // chip ids placed on sphere/cube
    faceOverrides: {},       // manual face assignments (unused in v0.1)
    activeFace: string | null,
  },

  onion: {
    layerIdx: number,        // 0–4 current layer
    layers: string[][],      // 5 arrays of chip ids, one per layer
  },

  orbits: {
    nameA: string,
    nameB: string,
    aGives: string[],        // attribute values placed on shape A
    aCosts: string[],
    aSays: string[],
    bGives: string[],
    bCosts: string[],
    bSays: string[],
    align: number,           // 0.0–1.0 slider position
  },

  mirror: {
    conscious: string[],     // value ids in user's ranked order (max 6)
    pairIdx: number,         // current instinct pair index
    pairs: [string,string][], // 15 pairs of value ids
    wins: {},                // value id → win count from instinct round
    revealed: string[],      // value ids in revealed order (computed at end)
  },

  history: Array<{
    id: number,
    date: string,
    puzzle: string,
    type: string,
    color: string,
    question: string,
    tag: string,
  }>,
}
```

---

## Reducer actions

| Action | Effect |
|---|---|
| `GO` | Navigate to a screen |
| `START` | Begin a puzzle (resets puzzle state, keeps history) |
| `ANSWER` | Record a routing answer and navigate |
| `CUBE_TOGGLE` | Toggle a chip placed on the cube sphere |
| `CUBE_FACE` | Set the active face in the cube |
| `ONION_TOGGLE` | Toggle a chip in a specific onion layer |
| `ONION_NEXT_LAYER` | Advance to the next onion layer |
| `ORBIT_NAME` | Set a shape name |
| `ORBIT_TOGGLE` | Toggle an attribute on a shape |
| `ORBIT_ALIGN` | Set the alignment slider value |
| `MIRROR_RANK_TOGGLE` | Add or remove a value from the conscious ranking |
| `MIRROR_PICK` | Record an instinct pair choice |
| `SAVE_RESULT` | Append a result to history and persist to localStorage |
| `RESET` | Return to entry screen (keeps history) |
| `LOAD_HISTORY` | Load history from localStorage on mount |

---

## The closing question — how it works

`closingQuestion(state)` in `clarity-state.jsx` is the most important function. Here is how to read it:

```
intake.q1  → reversibility (0=reversible, 3=irreversible)
intake.q2  → emotional frame (0=relief/loss, 1=excitement/gain, 2=grief, 3=numb)
intake.q3  → social circle (0=solo, 1=one person, 2=small circle, 3=many)
intake.q4  → future projection (0=quiet ache, 1=numb relief, 2=honestly fine, 3=refuse)
```

For each puzzle type the function:
1. Computes a derived measure (e.g. for Cube: pull/fear ratio from cubeSummary)
2. Checks intake answers in priority order (most diagnostic first)
3. Returns the most specific matching question string

The `future === 3` (refusal) branch is checked first for Cube and Onion because it is the strongest signal — someone who refuses to imagine another year of no change has already answered the question.

Template literals reference actual chip labels where available (e.g. `topFear.label`) to make the question feel specific to the user's actual inputs.

---

## Adding a new puzzle type

1. Add a new entry card to `ENTRY_CARDS` in `clarity-state.jsx`
2. Add routing questions to `QUESTIONS` (or reuse existing)
3. Add initial state to `INITIAL`
4. Add reducer cases for the puzzle's actions
5. Add a closing question branch to `closingQuestion`
6. Create screen component(s) and export to `window`
7. Add route to the `Router` in `clarity-app-main.jsx`
8. Add a transition shape to `Emerging` in `shapes.jsx`
