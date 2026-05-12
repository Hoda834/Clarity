/* global React, ReactDOM, Sphere, Cube, CUBE_FACES, Pyramid, Onion, ONION_RINGS, Orbits, MirrorFrame, Emerging, useTweaks, TweaksPanel, TweakSection, TweakRadio */
// ============================================================================
// Clarity — interactive app
// One reducer drives everything. Phone frame on dark canvas, real navigation,
// localStorage history, all four puzzles playable.
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

const VALUES_18 = [
  { id:"v01", label:"Freedom" }, { id:"v02", label:"Stability" }, { id:"v03", label:"Closeness" },
  { id:"v04", label:"Craft" },   { id:"v05", label:"Recognition" }, { id:"v06", label:"Honesty" },
  { id:"v07", label:"Wonder" },  { id:"v08", label:"Service" },     { id:"v09", label:"Order" },
  { id:"v10", label:"Risk" },    { id:"v11", label:"Beauty" },      { id:"v12", label:"Loyalty" },
  { id:"v13", label:"Growth" },  { id:"v14", label:"Privacy" },     { id:"v15", label:"Power" },
  { id:"v16", label:"Quiet" },   { id:"v17", label:"Play" },        { id:"v18", label:"Justice" },
];

// 15 forced-choice pairs of value ids
function buildPairs() {
  const ids = VALUES_18.map(v=>v.id);
  const pairs = [];
  const seen = new Set();
  // deterministic sequence so the run is reproducible
  let i = 0, j = 7;
  while (pairs.length < 15) {
    const a = ids[i % ids.length], b = ids[j % ids.length];
    const key = a < b ? a+b : b+a;
    if (a !== b && !seen.has(key)) { pairs.push([a,b]); seen.add(key); }
    i = (i + 1) % ids.length; j = (j + 3) % ids.length;
  }
  return pairs;
}

/* ───────────────────── state ───────────────────── */

const INITIAL = {
  screen: "entry",
  puzzle: null,
  intake: { q1:null, q2:null, q3:null, q4:null },

  cube: { placed:[], faceOverrides:{}, activeFace:null },
  onion: { layerIdx:0, layers:[[],[],[],[],[]] },
  orbits: { nameA:"", nameB:"", aGives:[], aCosts:[], aSays:[], bGives:[], bCosts:[], bSays:[], align:0.4 },
  mirror: { conscious:[], pairIdx:0, pairs: buildPairs(), wins:{}, revealed:[] },

  history: [],
};

function reducer(s, a) {
  switch (a.type) {
    case "GO": return { ...s, screen: a.screen };
    case "START": return { ...INITIAL, history: s.history, puzzle: a.puzzle, screen: "q1" };
    case "ANSWER":  return { ...s, intake: { ...s.intake, [a.key]: a.value }, screen: a.next };

    case "CUBE_TOGGLE": {
      const placed = s.cube.placed.includes(a.id)
        ? s.cube.placed.filter(x=>x!==a.id)
        : [...s.cube.placed, a.id];
      return { ...s, cube: { ...s.cube, placed } };
    }
    case "CUBE_FACE": return { ...s, cube: { ...s.cube, activeFace: a.face } };

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

    case "MIRROR_RANK_TOGGLE": {
      const c = s.mirror.conscious.includes(a.id)
        ? s.mirror.conscious.filter(x=>x!==a.id)
        : s.mirror.conscious.length < 6 ? [...s.mirror.conscious, a.id] : s.mirror.conscious;
      return { ...s, mirror: { ...s.mirror, conscious: c } };
    }
    case "MIRROR_PICK": {
      const wins = { ...s.mirror.wins, [a.id]: (s.mirror.wins[a.id]||0)+1 };
      const pairIdx = s.mirror.pairIdx + 1;
      // compute revealed at end
      let revealed = s.mirror.revealed;
      if (pairIdx >= s.mirror.pairs.length) {
        revealed = VALUES_18
          .map(v => ({ id:v.id, w: wins[v.id]||0 }))
          .sort((a,b) => b.w - a.w)
          .slice(0,6)
          .map(x => x.id);
      }
      return { ...s, mirror: { ...s.mirror, wins, pairIdx, revealed } };
    }

    case "SAVE_RESULT": {
      const next = [a.entry, ...s.history].slice(0, 50);
      try { localStorage.setItem("clarity:history", JSON.stringify(next)); } catch {}
      return { ...s, history: next };
    }
    case "RESET": return { ...INITIAL, history: s.history };
    case "LOAD_HISTORY": return { ...s, history: a.history };
    default: return s;
  }
}

/* ───────────────────── derived ───────────────────── */

function cubeSummary(state) {
  const placed = CHIPS_CUBE.filter(c => state.cube.placed.includes(c.id));
  const pull = placed.filter(c=>c.side==="pull").length;
  const fear = placed.filter(c=>c.side==="fear").length;
  const facing = {};
  for (const c of placed) facing[c.face] = (facing[c.face]||0)+1;
  const dominant = pull > fear ? "pull" : fear > pull ? "fear" : "even";
  const tint = dominant === "pull" ? "var(--pull)" : dominant === "fear" ? "var(--fear)" : "var(--alignment)";
  return { placed, pull, fear, facing, dominant, tint };
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
      const a = state.orbits.align;
      const A = state.orbits.nameA || "Option A";
      const B = state.orbits.nameB || "Option B";

      if (rev === 3 && a < 0.45) return `Is ${A} an instead-of ${B}, or could one have been a before-${B} if the timing were different?`;
      if (frame === 2) return `You're grieving whichever you don't pick. Which grief tells you who you actually are?`;
      if (a > 0.75) return `Is ${A} really opposing ${B} — or just preceding it?`;
      if (a > 0.45) {
        if (circle >= 2) return `Which side of ${A} is actually about ${B} — and which is about who's watching?`;
        return `Which side of ${A} is actually about ${B}?`;
      }
      if (circle >= 2) return `If no one were watching — would ${A} and ${B} still be the same fight?`;
      return `If you had to choose the regret you could live with — ${A} or ${B}?`;
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

window.__CLARITY = { CHIPS_CUBE, ONION_CHIPS, ORBIT_ATTRS, VALUES_18, cubeSummary, closingQuestion, lensLabels };
