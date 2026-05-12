# Changelog

All notable changes to Clarity will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — May 2026

### Initial release

**Four puzzle types, fully playable:**

- The Cube (opportunity decisions) — sphere → cube → pyramid with real 3D rotation, drag-to-rotate with momentum, auto-spin when idle
- The Onion (exit decisions) — five concentric rings, layer-by-layer build, cross-section result view
- Orbiting Shapes (conflict decisions) — named circles, three attribute categories per shape, alignment slider with merge-type detection
- The Mirror (values decisions) — conscious ranking, timed instinct pairs, revealed order, gap visualisation

**Intake flow:**

- Five entry options routing silently to four puzzle types
- Four calibration questions per puzzle with ambiguous-route handling
- Animated 3D transition between intake and puzzle

**Closing question engine:**

- Nine variants for the Cube based on pull/fear ratio, reversibility, emotional frame, and circle size
- Six variants for the Onion based on layer weight and dominant ring
- Four variants for Orbiting Shapes based on alignment position and reversibility
- Four variants for the Mirror based on gap direction and biggest mismatch

**Design system:**

- Two design directions: Instrument and Ritual
- Dark mode primary, light mode secondary
- Tweaks panel: direction, mode, chip density, prompt weight, result panel style
- Syne (display) + DM Sans (body)
- Full CSS custom property token system

**3D shapes:**

- Real spherical-to-cartesian projection with yaw/pitch matrix rotation
- Drag-to-rotate gesture with momentum
- Auto-spin with 2.4-second idle detection
- CSS 3D cube with six real faces and physical depth
- CSS 3D pyramid with four triangular faces and gradient surfaces
- Onion with CSS 3D tilt and cross-section mode
- Orbits with 3D plane and alignment-responsive positioning
- Mirror frame (2D intentional — spatial reading works better flat)

**Infrastructure:**

- No build step, no bundler, no npm
- React 18 + Babel standalone from CDN
- localStorage history (up to 50 sessions)
- GitHub Pages deployment

---

## Planned for [0.2.0]

- Orbiting Shapes full taxonomy (currently using condensed version)
- Mirror full micro-choice pair library (15 pairs complete, calibration refinement needed)
- Accessibility: pattern mode for colour-blind users
- Light mode visual polish
- Mobile viewport optimisation

## Planned for [0.3.0]

- Taxonomy JSON files extracted from inline state
- Session export (JSON download, stays local)
- Print/save result as image

## Planned for [1.0.0]

- Native iOS app (Swift / SwiftUI / SceneKit)
- On-device Core ML for Mirror synthesis
- iCloud sync via user's own Apple account
