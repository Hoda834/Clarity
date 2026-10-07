/* global React, ReactDOM, Sphere, Cube, CUBE_FACES, Pyramid, Onion, ONION_RINGS, Orbits, MirrorFrame, Emerging, useTweaks, TweaksPanel, TweakSection, TweakRadio */
// ============================================================================
// Clarity — interactive app
// One reducer drives everything. Phone frame on dark canvas, real navigation,
// Session-only state, all four puzzles playable. No user decision data is persisted.
// ============================================================================

const { useReducer, useState, useEffect, useRef, useMemo } = React;

/* ───────────────────── data ───────────────────── */

const ENTRY_CARDS = [
  { id: "leap",   title: "Should I take this leap?",         sub: "A choice that could expand things — and risks the rest.",   puzzle: "cube",   shape: "cube"   },
  { id: "leave",  title: "Should I walk away?",              sub: "Something you've outgrown, or are still trying to keep.",  puzzle: "onion",  shape: "onion"  },
  { id: "torn",   title: "I'm torn between two paths.",      sub: "Two options that won't sit next to each other.",           puzzle: "orbits", shape: "orbits" },
  { id: "want",   title: "I don't know what I actually want.", sub: "The choice is foggy because the values underneath are.", puzzle: "mirror", shape: "mirror" },
  { id: "second", title: "I keep changing my mind.",         sub: "The decision keeps moving. Something underneath isn't sitting still.", puzzle: "cube", shape: "cube" },
];

const QUESTIONS = [
  { q: "Is this a door you can re-open, or one that closes behind you?",
    note: "Reversibility · Bezos Type 1/2",
    opts: [
      "I can change course later",
      "I'd have to start over to undo it",
      "The cost of reversing is the point",
      "This is one-way",
    ] },
  { q: "When you imagine deciding — what shows up first in your body?",
    note: "Loss-vs-gain framing · Prospect Theory",
    opts: [
      "A weight, lifted",
      "A door, opening",
      "A drop in the chest",
      "Static",
    ] },
  { q: "Who else carries the consequences of this?",
    note: "Construal · stake distance",
    opts: [
      "Just me",
      "One person whose face I see in this",
      "A small circle I'd hurt either way",
      "More than I can hold in my head",
    ] },
  { q: "A year from today — nothing changed. What's the first feeling?",
    note: "Status-quo projection · 10-10-10",
    opts: [
      "A quiet ache",
      "Numb relief",
      "Honestly okay",
      "I refuse to picture it",
    ] },
];

// each chip: id, side, label, sphere (theta,phi), face
const CHIPS_CUBE = [
  { id: "c1",  side: "pull", label: "More money",        sphere:[-42,-12], face:"gain" },
  { id: "c2",  side: "pull", label: "Bigger problem",    sphere:[12,-34],  face:"gain" },
  { id: "c3",  side: "pull", label: "Closer to what I want", sphere:[58,8], face:"gain" },
  { id: "c4",  side: "pull", label: "Out of stuck",      sphere:[-78,22],  face:"gain" },
  { id: "c5",  side: "pull", label: "Adventure",         sphere:[90,-8],   face:"gain" },
  { id: "c6",  side: "pull", label: "Real growth",       sphere:[-22,44],  face:"know" },
  { id: "c7",  side: "pull", label: "Recognition",       sphere:[44,30],   face:"know" },
  { id: "c8",  side: "pull", label: "Better mentors",    sphere:[-110,-18],face:"know" },
  { id: "c9",  side: "fear", label: "Lose my people",    sphere:[140,-20], face:"lose" },
  { id: "c10", side: "fear", label: "Identity reset",    sphere:[-120,10], face:"lose" },
  { id: "c11", side: "fear", label: "What if I flame out", sphere:[168,30], face:"unknow" },
  { id: "c12", side: "fear", label: "Disappoint people", sphere:[-160,-32],face:"lose" },
  { id: "c13", side: "fear", label: "Outgrow this life", sphere:[150,-50], face:"unknow" },
  { id: "c14", side: "fear", label: "Six months alone",  sphere:[-100,40], face:"lose" },
  { id: "c15", side: "fear", label: "I don't know enough", sphere:[20,-60],face:"unknow" },
  { id: "c16", side: "pull", label: "Within my control", sphere:[80,52],   face:"ctrl" },
  { id: "c17", side: "fear", label: "Tied to the markets", sphere:[-30,-58],face:"nctrl" },
  { id: "c18", side: "fear", label: "Depends on her",    sphere:[120,52],  face:"nctrl" },
];

const ONION_CHIPS = [
  // layer 0: story
  { layer:0, id:"o01", label:"We're just busy" },
  { layer:0, id:"o02", label:"It's a phase" },
  { layer:0, id:"o03", label:"Everyone struggles" },
  { layer:0, id:"o04", label:"Maybe it's me" },
  { layer:0, id:"o05", label:"I'm overreacting" },
  // layer 1: feeling
  { layer:1, id:"o06", label:"Lonely next to him" },
  { layer:1, id:"o07", label:"Quietly bored" },
  { layer:1, id:"o08", label:"Performing patience" },
  { layer:1, id:"o09", label:"Resenting" },
  { layer:1, id:"o10", label:"Numb" },
  // layer 2: fear
  { layer:2, id:"o11", label:"Being alone" },
  { layer:2, id:"o12", label:"Wasted years" },
  { layer:2, id:"o13", label:"Being the one who left" },
  { layer:2, id:"o14", label:"Starting over" },
  // layer 3: core
  { layer:3, id:"o15", label:"I'll choose this again" },
  { layer:3, id:"o16", label:"I'm not allowed to want more" },
  { layer:3, id:"o17", label:"I picked wrong" },
  // layer 4: possible
  { layer:4, id:"o18", label:"Real wanting" },
  { layer:4, id:"o19", label:"My own quiet" },
  { layer:4, id:"o20", label:"Not managing anymore" },
  { layer:4, id:"o21", label:"Honesty" },
];

const ORBIT_ATTRS = {
  gives: ["Time", "Money", "Freedom", "Stability", "Growth", "Connection", "Purpose", "Quiet", "Status", "Identity"],
  costs: ["Energy", "Sleep", "Relationships", "Comfort", "Other paths", "Years", "Public exposure", "Old self"],
  says:  ["I bet on myself", "I finish what I start", "I choose people", "I'm someone who builds", "I'm someone who lasts", "I want it more than I'm scared"],
};

const ORBIT_CONSTRAINTS = [
  { id:"time", label:"They need the same time" },
  { id:"money", label:"They compete for the same money" },
  { id:"energy", label:"I cannot carry both at once" },
  { id:"place", label:"They require different places" },
  { id:"identity", label:"They ask me to be two different people" },
  { id:"people", label:"Other people make them harder to combine" },
  { id:"door", label:"Choosing one closes the other" },
];

const VALUES_18 = [
  { id:"v01", label:"Freedom" }, { id:"v02", label:"Stability" }, { id:"v03", label:"Closeness" },
  { id:"v04", label:"Craft" },   { id:"v05", label:"Recognition" }, { id:"v06", label:"Honesty" },
  { id:"v07", label:"Wonder" },  { id:"v08", label:"Service" },     { id:"v09", label:"Order" },
  { id:"v10", label:"Risk" },    { id:"v11", label:"Beauty" },      { id:"v12", label:"Loyalty" },
  { id:"v13", label:"Growth" },  { id:"v14", label:"Privacy" },     { id:"v15", label:"Power" },
  { id:"v16", label:"Quiet" },   { id:"v17", label:"Play" },        { id:"v18", label:"Justice" },
];

// Balanced forced-choice pairs. Every value appears exactly three times.
// The first 18 pairs form a cycle; the final 9 compare opposite points in the set.
// Pair order is deterministic, while left/right position alternates to reduce position bias.
function buildPairs() {
  const ids = VALUES_18.map(v=>v.id);
  const pairs = [];

  for (let i = 0; i < ids.length; i++) {
    const pair = [ids[i], ids[(i + 1) % ids.length]];
    pairs.push(i % 2 === 0 ? pair : pair.slice().reverse());
  }

  for (let i = 0; i < ids.length / 2; i++) {
    const pair = [ids[i], ids[i + ids.length / 2]];
    pairs.push(i % 2 === 0 ? pair.slice().reverse() : pair);
  }

  return pairs;
}

function mirrorRanking(mirror) {
  return VALUES_18
    .map(v => {
      const played = mirror.played[v.id] || 0;
      const wins = mirror.wins[v.id] || 0;
      return { id: v.id, wins, played, rate: played ? wins / played : -1 };
    })
    .sort((a, b) => (b.rate - a.rate) || (b.wins - a.wins) || a.id.localeCompare(b.id))
    .slice(0, 6)
    .map(x => x.id);
}


function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function buildDecisionProfile(puzzle, intake) {
  const q1 = intake.q1 == null ? 1 : intake.q1;
  const q2 = intake.q2 == null ? 3 : intake.q2;
  const q3 = intake.q3 == null ? 0 : intake.q3;
  const q4 = intake.q4 == null ? 1 : intake.q4;

  const emotionalMap = [0.28, 0.22, 0.82, 0.62];
  const uncertaintyMap = [0.48, 0.42, 0.24, 0.88];
  const identitySeed = { cube:0.42, onion:0.58, orbits:0.48, mirror:0.78 }[puzzle] || 0.45;
  const externalSeed = { cube:0.45, onion:0.36, orbits:0.72, mirror:0.24 }[puzzle] || 0.4;
  const structure = puzzle === "orbits" ? "two-options"
    : puzzle === "mirror" ? "values-uncertainty"
      : puzzle === "onion" ? "layered-exit"
        : "opportunity-tension";

  return {
    structure,
    reversibility: clamp01(q1 / 3),
    uncertainty: clamp01(uncertaintyMap[q4] + (puzzle === "mirror" ? 0.08 : 0)),
    emotionalConflict: clamp01(emotionalMap[q2] + (q4 === 0 ? 0.08 : 0)),
    identityConflict: clamp01(identitySeed + (q2 === 2 ? 0.14 : 0) + (q3 >= 2 ? 0.08 : 0)),
    externalConstraint: clamp01(externalSeed + (q1 >= 2 ? 0.14 : 0) + (q3 >= 2 ? 0.1 : 0)),
    socialPressure: clamp01(q3 / 3),
    timePressure: clamp01(q4 === 3 ? 0.7 : q4 === 0 ? 0.52 : 0.3),
  };
}

function initialJourney() {
  return {
    currentWorld: null,
    currentScene: 0,
    completedWorlds: [],
    signals: [],
  };
}

/* ───────────────────── state ───────────────────── */

const INITIAL = {
  screen: "entry",
  puzzle: null,
  decisionProfile: buildDecisionProfile(null, {}),
  journey: initialJourney(),
  intake: { q1:null, q2:null, q3:null, q4:null },

  cube: { placed:[], faceOverrides:{}, activeFace:"gain" },
  onion: { layerIdx:0, layers:[[],[],[],[],[]] },
  orbits: { nameA:"", nameB:"", aGives:[], aCosts:[], aSays:[], bGives:[], bCosts:[], bSays:[], align:0.4, collisions:[] },
  mirror: { conscious:[], pairIdx:0, pairs: buildPairs(), wins:{}, played:{}, skipped:0, revealed:[] },
};

function reducer(s, a) {
  switch (a.type) {
    case "GO": return { ...s, screen: a.screen };
    case "START": {
      const profile = buildDecisionProfile(a.puzzle, {});
      return {
        ...INITIAL,
        puzzle: a.puzzle,
        decisionProfile: profile,
        journey: initialJourney(),
        screen: "q1",
      };
    }
    case "ANSWER": {
      const intake = { ...s.intake, [a.key]: a.value };
      if (a.next === "transition") {
        const decisionProfile = buildDecisionProfile(s.puzzle, intake);
        const currentWorld = window.ClarityWorlds
          ? window.ClarityWorlds.selectWorld(decisionProfile, s.puzzle)
          : (s.puzzle === "orbits" ? "orbit" : s.puzzle === "mirror" ? "fog" : "wonderland");
        return {
          ...s,
          intake,
          decisionProfile,
          journey: { ...s.journey, currentWorld, currentScene: 0 },
          screen: a.next,
        };
      }
      return { ...s, intake, screen: a.next };
    }
    case "ENTER_WORLD":
      return {
        ...s,
        screen: a.screen,
        journey: { ...s.journey, currentScene: 1 },
      };
    case "WORLD_SIGNAL":
      return {
        ...s,
        journey: { ...s.journey, signals: [...s.journey.signals, a.signal] },
      };

    case "CUBE_TOGGLE": {
      const removing = s.cube.placed.includes(a.id);
      const placed = removing
        ? s.cube.placed.filter(x=>x!==a.id)
        : [...s.cube.placed, a.id];
      const faceOverrides = { ...s.cube.faceOverrides };
      if (removing) delete faceOverrides[a.id];
      return { ...s, cube: { ...s.cube, placed, faceOverrides } };
    }
    case "CUBE_FACE": return { ...s, cube: { ...s.cube, activeFace: a.face } };
    case "CUBE_ASSIGN_FACE": {
      if (!s.cube.placed.includes(a.id)) return s;
      return { ...s, cube: { ...s.cube, faceOverrides: { ...s.cube.faceOverrides, [a.id]: a.face } } };
    }

    case "ONION_TOGGLE": {
      const layers = s.onion.layers.map((l,i) => {
        if (i !== a.layer) return l;
        return l.includes(a.id) ? l.filter(x=>x!==a.id) : [...l, a.id];
      });
      return { ...s, onion: { ...s.onion, layers } };
    }
    case "ONION_NEXT_LAYER":
      return { ...s, onion: { ...s.onion, layerIdx: Math.min(4, s.onion.layerIdx+1) } };

    case "ORBIT_NAME": return { ...s, orbits: { ...s.orbits, [a.key]: a.value } };
    case "ORBIT_TOGGLE": {
      const list = s.orbits[a.key];
      const next = list.includes(a.val) ? list.filter(x=>x!==a.val) : [...list, a.val];
      return { ...s, orbits: { ...s.orbits, [a.key]: next } };
    }
    case "ORBIT_ALIGN": return { ...s, orbits: { ...s.orbits, align: a.val } };
    case "ORBIT_COLLISION_TOGGLE": {
      const current = s.orbits.collisions || [];
      const collisions = current.includes(a.id)
        ? current.filter(x => x !== a.id)
        : [...current, a.id];
      return { ...s, orbits: { ...s.orbits, collisions } };
    }

    case "MIRROR_START_INSTINCT":
      return { ...s, screen: "mirror/instinct", mirror: { ...s.mirror, pairIdx:0, wins:{}, played:{}, skipped:0, revealed:[], pairs: buildPairs() } };
    case "MIRROR_RANK_TOGGLE": {
      const c = s.mirror.conscious.includes(a.id)
        ? s.mirror.conscious.filter(x=>x!==a.id)
        : s.mirror.conscious.length < 6 ? [...s.mirror.conscious, a.id] : s.mirror.conscious;
      return { ...s, mirror: { ...s.mirror, conscious: c } };
    }
    case "MIRROR_PICK": {
      const pair = s.mirror.pairs[s.mirror.pairIdx];
      if (!pair || !pair.includes(a.id)) return s;
      const wins = { ...s.mirror.wins, [a.id]: (s.mirror.wins[a.id] || 0) + 1 };
      const played = { ...s.mirror.played };
      for (const id of pair) played[id] = (played[id] || 0) + 1;
      const pairIdx = s.mirror.pairIdx + 1;
      const nextMirror = { ...s.mirror, wins, played, pairIdx };
      if (pairIdx >= s.mirror.pairs.length) nextMirror.revealed = mirrorRanking(nextMirror);
      return { ...s, mirror: nextMirror };
    }
    case "MIRROR_SKIP": {
      const pairIdx = s.mirror.pairIdx + 1;
      const nextMirror = { ...s.mirror, pairIdx, skipped: s.mirror.skipped + 1 };
      if (pairIdx >= s.mirror.pairs.length) nextMirror.revealed = mirrorRanking(nextMirror);
      return { ...s, mirror: nextMirror };
    }

    case "RESET": return { ...INITIAL, decisionProfile: buildDecisionProfile(null, {}), journey: initialJourney(), mirror: { ...INITIAL.mirror, pairs: buildPairs() } };
    default: return s;
  }
}

/* ───────────────────── derived ───────────────────── */

function cubeSummary(state) {
  const placed = CHIPS_CUBE
    .filter(c => state.cube.placed.includes(c.id))
    .map(c => ({ ...c, face: state.cube.faceOverrides[c.id] || null }));
  const pull = placed.filter(c=>c.side==="pull").length;
  const fear = placed.filter(c=>c.side==="fear").length;
  const facing = {};
  for (const c of placed) {
    if (c.face) facing[c.face] = (facing[c.face] || 0) + 1;
  }
  const sortedCount = placed.filter(c => c.face).length;
  const dominant = pull > fear ? "pull" : fear > pull ? "fear" : "even";
  const tint = dominant === "pull" ? "var(--pull)" : dominant === "fear" ? "var(--fear)" : "var(--alignment)";
  return { placed, pull, fear, facing, sortedCount, dominant, tint };
}


function orbitAnalysis(state) {
  const o = state.orbits;
  const collisions = o.collisions || [];
  const perceivedCompatibility = o.align;
  const structuralFriction = Math.min(1, collisions.length / 4);
  const structuralCompatibility = 1 - structuralFriction;
  const gap = perceivedCompatibility - structuralCompatibility;

  let label = "MIXED SIGNAL";
  let color = "var(--alignment)";

  if (collisions.length === 0 && perceivedCompatibility < 0.4) {
    label = "FELT CONFLICT";
    color = "var(--alignment)";
  } else if (collisions.length >= 3 && perceivedCompatibility > 0.65) {
    label = "CONSTRAINTS UNDER-RATED";
    color = "var(--conflict)";
  } else if (collisions.length >= 3 && perceivedCompatibility <= 0.65) {
    label = "STRUCTURAL CONFLICT";
    color = "var(--conflict)";
  } else if (collisions.length <= 1 && perceivedCompatibility > 0.65) {
    label = "LOW FRICTION";
    color = "var(--clarity)";
  } else if (Math.abs(gap) >= 0.35) {
    label = gap > 0 ? "CONSTRAINTS UNDER-RATED" : "CONFLICT OVER-FELT";
    color = gap > 0 ? "var(--conflict)" : "var(--alignment)";
  }

  return {
    collisions,
    collisionCount: collisions.length,
    perceivedCompatibility,
    structuralCompatibility,
    structuralFriction,
    gap,
    label,
    color,
  };
}

function lensLabels(intake) {
  if (!intake) return [];
  return [
    ["Reversible","Mostly reversible","High cost to reverse","Irreversible"][intake.q1],
    ["Loss-frame","Gain-frame","Grief-frame","Avoidance"][intake.q2],
    ["Solo agent","Dyad","Small circle","Many stakeholders"][intake.q3],
    ["Aching no","Numb no","Honest yes","Refusal"][intake.q4],
  ].filter(x => x != null);
}

function closingQuestion(state) {
  const intake = state.intake || {};
  const rev   = intake.q1; // 0 reversible … 3 irreversible
  const frame = intake.q2; // 0 relief, 1 excitement, 2 grief, 3 numb
  const circle = intake.q3; // 0 solo … 3 many
  const future = intake.q4; // 0 ache, 1 numb relief, 2 fine, 3 refuse

  switch (state.puzzle) {
    case "cube": {
      const { dominant, pull, fear, placed } = cubeSummary(state);
      if (placed.length < 3) return "If you only had three reasons — which three would they be?";

      const topPull = placed.find(c => c.side === "pull");
      const topFear = placed.find(c => c.side === "fear");
      const ratio = pull / Math.max(1, pull + fear);

      // Diagnostic refusal beats everything
      if (future === 3 && ratio >= 0.5) {
        return "You refuse to picture a year of nothing changing. That isn't a question — it's an answer with the punctuation missing.";
      }
      if (future === 3 && ratio < 0.5) {
        return "You refuse to picture nothing changing, but the fear is louder than the pull. What's between you and saying it out loud?";
      }

      // Strong pull
      if (ratio >= 0.75) {
        if (rev === 3) return `If this is one-way — what would have to be true on the other side for the trip to be worth it?`;
        if (frame === 2) return `You're already grieving what choosing this costs. Doesn't that tell you which side is real?`;
        if (circle >= 2) return `${pull} pulls, ${fear} fears, ${circle === 3 ? "more than you can hold" : "a circle"} inside. Whose voice would you take out first if you could?`;
        return `${pull} pulls, ${fear} fears. What would you do if you trusted the math?`;
      }

      // Strong fear
      if (ratio <= 0.25) {
        if (future === 2) return "The fear is louder than the pull. And another year is honestly okay. Maybe the answer is 'not yet'.";
        if (rev === 3) return `One-way and fear-heavy. What's the specific thing that would have to change before this becomes a yes?`;
        if (topFear) return `"${topFear.label}." If that fear turned out to be true — what would you actually do?`;
        return "The fear is loud. What's underneath the loudest part?";
      }

      // Even-ish
      if (frame === 3) return "Even split, body numb. Decisions like this don't get made until something wakes up. What would it take?";
      if (frame === 2) return `You're grieving both sides already. Which loss could you live with, and which would change who you are?`;
      if (rev === 0)   return `It's roughly even and you can change course. What's stopping you from trying it for 90 days?`;
      if (dominant === "pull") return `Which fear, if it were gone tomorrow, would tip this?`;
      if (dominant === "fear") return `Which pull, if it were one notch stronger, would tip this?`;
      return `Even pull and fear (${pull}/${fear}). What's the smallest version of this you could actually try?`;
    }

    case "onion": {
      const counts = state.onion.layers.map(l => l.length);
      const total = counts.reduce((a, b) => a + b, 0);
      const maxI = counts.indexOf(Math.max(...counts));
      if (total === 0) return "What's the smallest, truest sentence you could write about this?";

      // Refusal is diagnostic
      if (future === 3) return "You refuse to picture another year of it. Whatever the layers say — that's the line.";

      if (maxI === 4) {
        const possible = ONION_CHIPS.filter(c => c.layer === 4 && state.onion.layers[4].includes(c.id));
        if (possible[0]) return `"${possible[0].label}" is louder than what you're afraid of. What does acting on that look like this week?`;
        return "What you imagine being possible is louder than the fear. What's the smallest version of acting on it?";
      }
      if (maxI === 3) {
        const cores = ONION_CHIPS.filter(c => c.layer === 3 && state.onion.layers[3].includes(c.id));
        if (cores[0]) {
          if (rev === 3) return `If "${cores[0].label}" turned out to be true — and you could only choose once — what would you do?`;
          return `If "${cores[0].label}" turned out to be true — what would you actually do?`;
        }
        return "If the core thing were true — what would you actually do?";
      }
      if (maxI === 2) {
        if (circle >= 2) return "Most of the fear is about being seen choosing it. Whose specific disappointment are you working hardest to avoid?";
        return "Most of the weight sits at the fear ring. What would change if the fear were named, not managed?";
      }
      if (maxI === 1) {
        const feels = ONION_CHIPS.filter(c => c.layer === 1 && state.onion.layers[1].includes(c.id));
        if (feels[0] && frame === 3) return `"${feels[0].label}" — and you've gone numb to it. Is that something you can keep absorbing?`;
        if (feels[0]) return `"${feels[0].label}." Can you keep absorbing that?`;
      }
      if (future === 1) return "Numb relief at picturing another year. That's information — what is it telling you?";
      return "If nothing changed for a year — would that be enough?";
    }

    case "orbits": {
      const A = state.orbits.nameA || "Option A";
      const B = state.orbits.nameB || "Option B";
      const analysis = orbitAnalysis(state);
      const collisions = analysis.collisions;
      const firstConstraint = ORBIT_CONSTRAINTS.find(x => x.id === collisions[0]);

      if (analysis.collisionCount === 0 && analysis.perceivedCompatibility < 0.4) {
        if (circle >= 2) return `You experience ${A} and ${B} as incompatible, but you named no concrete collision. What changes if other people's reactions are removed?`;
        return `You experience ${A} and ${B} as incompatible, but you named no concrete collision. What exactly prevents them from coexisting?`;
      }

      if (analysis.label === "CONSTRAINTS UNDER-RATED") {
        return `${A} and ${B} feel more compatible than the constraints you selected suggest. Which constraint would fail first if you tried to carry both?`;
      }

      if (analysis.label === "STRUCTURAL CONFLICT") {
        if (rev === 0) return `Several constraints collide, but the decision is reversible. Which collision could you test before treating ${A} and ${B} as mutually exclusive?`;
        if (firstConstraint) return `"${firstConstraint.label}." Is that collision permanent, or only true under the current setup?`;
        return `Several constraints collide. Which one actually makes ${A} and ${B} mutually exclusive?`;
      }

      if (analysis.label === "LOW FRICTION") {
        return `You see little structural friction between ${A} and ${B}. Why are you still treating them as a single choice?`;
      }

      if (analysis.label === "CONFLICT OVER-FELT") {
        if (circle >= 2) return `The felt conflict is stronger than the constraints you named. How much of the tension belongs to other people rather than ${A} and ${B} themselves?`;
        return `The felt conflict is stronger than the constraints you named. What assumption is making the options feel further apart?`;
      }

      if (frame === 2) return `Both options carry a loss. Which loss changes what remains possible later?`;
      return `Which constraint between ${A} and ${B} is real today, and which one are you assuming will still be real later?`;
    }

    case "mirror": {
      const C = state.mirror.conscious, R = state.mirror.revealed;
      if (!C.length || !R.length) return "What if you trusted the instinct?";

      const rC = Object.fromEntries(C.map((id, i) => [id, i]));
      const rR = Object.fromEntries(R.map((id, i) => [id, i]));
      let gap = null;
      for (const id of C) {
        const cIdx = rC[id], rIdx = rR[id];
        if (rIdx === undefined) continue;
        const d = cIdx - rIdx;
        if (!gap || Math.abs(d) > Math.abs(gap.d)) gap = { id, d, cIdx, rIdx };
      }
      const v = gap && VALUES_18.find(x => x.id === gap.id);
      const topC = (VALUES_18.find(x => x.id === C[0]) || {}).label;
      const topR = (VALUES_18.find(x => x.id === R[0]) || {}).label;

      if (future === 3 && v) return `You refuse to picture another year. ${v.label} keeps showing up in that refusal — what is it asking you to do?`;
      if (C[0] === R[0])     return `You say ${topC}. You choose ${topC}. What would stop apologising for that look like?`;

      if (v && gap.d > 0) {
        // under-rated: ranks low but instinct chooses it
        if (frame === 0) return `You under-rate ${v.label}. Whose voice convinced you it didn't matter?`;
        if (frame === 2) return `You under-rate ${v.label} and you're grieving something. Is the grief about losing it, or about how long you've pretended it didn't matter?`;
        return `You under-rate ${v.label}. What changes if you stop pretending it doesn't matter?`;
      }
      if (v && gap.d < 0) {
        // over-rated: ranks high but instinct ignores it
        if (circle >= 2) return `You over-rate ${v.label}. Whose voice is making it sit so high?`;
        return `You over-rate ${v.label}. If no one were watching, where would it land?`;
      }
      return `You say ${topC}. You choose ${topR}. Which one are you actually grieving?`;
    }

    default: return "";
  }
}

window.__CLARITY = {
  CHIPS_CUBE,
  ONION_CHIPS,
  ORBIT_ATTRS,
  ORBIT_CONSTRAINTS,
  VALUES_18,
  cubeSummary,
  orbitAnalysis,
  buildDecisionProfile,
  closingQuestion,
  lensLabels,
};
