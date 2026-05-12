# Clarity

**A visual decision tool for hard decisions.**

Clarity is not a journaling app. Not a chatbot. Not a pros and cons list.

It is a structured, interactive puzzle that externalises your thinking and helps you find your own answer. You describe your situation through taps and drags, build your thinking visually across four puzzle types, and arrive at one precise question — the question your own thinking built.

---

## Live App

**[clarity app →](https://hoda834.github.io/Clarity/)**

---

## What it does

When you open Clarity you choose from five entry points. Each one routes silently to the right puzzle for your kind of stuck.

| Entry | Puzzle | What it addresses |
|---|---|---|
| Should I take this leap? | **The Cube** | Ambiguity — opportunity decisions |
| Should I walk away? | **The Onion** | Avoidance — exit decisions |
| I'm torn between two paths | **Orbiting Shapes** | Conflict — competing options |
| I don't know what I want | **The Mirror** | Values misalignment |
| I keep changing my mind | **The Cube** | Decision paralysis |

Four routing questions calibrate the puzzle before it starts. Then the puzzle begins.

### The Cube — opportunity decisions

A glowing sphere where you place what pulls you toward something and what holds you back. The sphere crystallises into a rotating cube with six faces: What You Gain, What You Lose, What You Know, What You Don't Know, What You Control, What You Don't Control. The cube compresses into a pyramid whose apex colour reflects the dominant theme of your whole interaction.

### The Onion — exit decisions

Five concentric rings. Working inward from the surface story to the core fear to what becomes possible on the other side. Each layer peels back as you complete it. The final cross-section shows all five layers simultaneously — their proportions tell the story without words.

### Orbiting Shapes — conflict decisions

Two named circles orbiting each other. You build attributes on each across three categories: what it gives you, what it costs you, and what choosing it says about who you are. A slider lets you drag the shapes together or apart. The result reveals whether the options are genuinely incompatible, sequentially possible, or a false conflict.

### The Mirror — values decisions

Eighteen value chips you rank consciously. Then fifteen rapid timed pairs — two seconds each, tap instinctively. The revealed order emerges on the right side of the mirror. Colour lines connect matching values across both columns, showing where your stated values and your actual choices align and where they diverge. The biggest gap surfaces as one sentence.

---

## The result

Every puzzle ends with one thing: a closing question. Not an answer. Not a recommendation. The one question your own thinking built — specific to your inputs, your routing answers, and what the puzzle found. This is the product.

---

## Design principles

**No writing required.** Every input is a tap, drag, or slider. The only text entry in the whole app is naming your two options in the Orbiting Shapes puzzle.

**No verdict.** The app never tells you what to do. It shows you your own thinking more clearly than you could see it in your head.

**No data collection.** Everything stays in your browser. Nothing is sent anywhere. No account, no server, no tracking.

**Two design directions.** Toggle between Instrument (maximum restraint, precision tool) and Ritual (same dark palette, slightly warmer feel) using the Tweaks panel.

---

## Technical overview

Pure browser app. No build step. No framework dependencies beyond React loaded from CDN.

```
index.html              ← entry point (rename from 'front' if needed)
styles.css              ← complete design system
tweaks-panel.jsx        ← design direction toggles
shapes.jsx              ← 3D shapes: Sphere, Cube, Pyramid, Onion, Orbits, Mirror
clarity-state.jsx       ← reducer, all data, closing question logic
clarity-screens-a.jsx   ← Entry, Routing, Transition, Cube screens
clarity-screens-b.jsx   ← Onion, Orbits, Mirror, Result, History screens
clarity-app-main.jsx    ← root component, navigation router
intake.jsx              ← design review: intake screens
cube.jsx                ← design review: cube phases
onion.jsx               ← design review: onion phases
mirror.jsx              ← design review: mirror phases
orbits.jsx              ← design review: orbits phases
result.jsx              ← design review: result + history
app.jsx                 ← design review: sidebar rail, phone frame
```

**Stack:** React 18 · Babel standalone · no bundler · no npm · no build

**3D shapes:** Real rotation math using spherical-to-cartesian conversion with yaw/pitch matrix rotation. Drag-to-rotate with momentum. Auto-spin when idle. All shapes respond to touch.

**State:** Single reducer in `clarity-state.jsx`. localStorage for session history.

**Fonts:** Syne (display) + DM Sans (body) from Google Fonts.

---

## Running locally

No installation needed. Just open `index.html` in Chrome.

If Chrome blocks local file imports due to CORS, run a simple server:

```bash
# Python (usually already installed)
python -m http.server 8000

# Then open: http://localhost:8000
```

Or with Node:

```bash
npx serve .
# Then open: http://localhost:3000
```

---

## Design review mode

Open `design-review.html` (or `app.jsx` entry) to see the sidebar rail with all 18 screens listed, a phone frame showing each screen, and the Tweaks panel for toggling design directions, dark/light mode, chip density, prompt weight, and result panel style.

---

## Decision science foundations

The four puzzle frameworks are grounded in real research:

- **Prospect Theory** (Kahneman & Tversky) — loss aversion visible in cube face proportions
- **GOFER Model** (Leon Mann) — the six cube faces map directly to Goals, Options, Facts, Effects, Review
- **Recognition Primed Decision** (Gary Klein) — structure over information for better decisions
- **Push-Pull Theory** — the onion's dual-direction reading of exit decisions
- **Identity Based Motivation** (Oyserman) — the identity layer in the onion
- **Ruth Chang** — self-authorship phrases in orbiting shapes; hard choices resolved by who you choose to become
- **Cognitive Dissonance Theory** (Festinger) — the orbiting shapes alignment mechanic
- **Strangers to Ourselves** (Timothy Wilson) — the mirror's revealed vs stated values split
- **Moral Foundations Theory** (Haidt) — values taxonomy underlying the mirror pairs
- **Motivational Interviewing** (Miller & Rollnick) — the intake flow design philosophy
- **Cognitive Load Theory** (Sweller) — routing questions: one at a time, no back button

---

## The closing question

The most important part of the codebase is the `closingQuestion` function in `clarity-state.jsx`. It generates a different question for every combination of puzzle type and all four intake answers. For the Cube alone there are nine distinct variants based on the pull/fear ratio, reversibility answer, emotional frame, and circle size. This function is the intellectual core of the product.

---

## Roadmap

- [ ] Orbiting Shapes and Mirror taxonomy expansion
- [ ] Full taxonomy JSON files (currently inline in clarity-state.jsx)
- [ ] Native iOS app (Swift / SwiftUI / SceneKit)
- [ ] Core ML on-device Mirror synthesis
- [ ] iCloud sync via user's own Apple account
- [ ] Light mode refinement
- [ ] Accessibility: pattern mode for colour-blind users

---

## Author

**Hoda Rezvanjoo**
Decision Systems Architect · DBA Researcher
Co-founder & CDSO, Heagital · London

Research focus: decision quality and BI adoption in UK SMEs. Clarity is the consumer translation of that work.

---

## Licence

MIT — see [LICENSE](LICENSE)

---

## Privacy

Clarity collects nothing. There is no server. There is no account. Your decisions stay in your browser and nowhere else.
