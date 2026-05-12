# Contributing to Clarity

Thank you for your interest. Clarity is a focused, opinionated product with a clear design philosophy. Contributions that align with that philosophy are very welcome.

---

## Before you contribute

Read the README fully. The most important things to understand before touching any code:

**The closing question is sacred.** The `closingQuestion` function in `clarity-state.jsx` is the intellectual core of the app. Every variant matters. Changes here need the most care and the clearest reasoning.

**The design has a point of view.** Clarity is a precision instrument, not a wellness app. Changes that make it warmer, friendlier, or more encouraging go against the grain. Changes that make it more precise, more honest, or more useful are welcome.

**No verdicts.** The app never tells the user what to do. Any feature that edges toward recommendation or advice is out of scope.

---

## What makes a good contribution

**Bug fixes** — always welcome. If something is broken, file an issue or open a PR.

**Taxonomy improvements** — the phrase libraries that users tap to place on shapes. Good phrases are precise, colloquial, non-judgmental, and resonant. If you have phrases that are better than what is there, propose them.

**Closing question improvements** — the question generation logic. Good closing questions are specific (not generic), open rather than closed, and derived from the user's actual inputs rather than boilerplate.

**Accessibility** — the colour-blind pattern mode described in the design documents is not yet built. This is a meaningful contribution.

**Performance** — the 3D shapes should run at 60fps on modest hardware. If you have profiling data showing a bottleneck, that is useful.

**Light mode** — currently secondary. Refinements welcome.

---

## What is out of scope

- Features that require a server or external API
- User accounts or authentication
- Analytics or tracking of any kind
- Social sharing that sends data anywhere
- Features that tell users what to decide
- Gamification (streaks, badges, scores presented as achievements)
- Illustration or decorative visual elements

---

## How to contribute

**For bugs:**
1. Open an issue describing what you expected and what happened
2. Include the browser and OS
3. If possible, identify which file and which function is involved

**For features or improvements:**
1. Open an issue first to discuss
2. Wait for a response before writing code — this avoids wasted effort
3. Keep PRs focused on one thing
4. Do not reformat files you are not changing

**For taxonomy additions:**
1. Open an issue with the proposed phrases
2. Explain which puzzle, which cluster, and why the phrases are better or additional
3. Phrases that survive the question "does this carry a hidden verdict?" are good candidates

---

## Code style

There is no linter or formatter configured. Follow the patterns already in the file you are editing. Specifically:

- Phrase strings use straight quotes, not curly quotes
- Template literals for multi-line strings
- `const` for everything that does not change
- No semicolons at end of JSX files (follow existing convention per file)
- Comments explain why, not what

---

## Decision science grounding

If you are proposing a change to how a puzzle works, a framework change, or a new puzzle type, ground it in research. The existing puzzles are built on Kahneman, Chang, Wilson, Haidt, Oyserman, Mann, and others. New mechanics should have equivalent grounding. This is not academic gatekeeping — it is what makes the app trustworthy to users making real decisions.

---

## Questions

Open an issue. Label it `question`.
