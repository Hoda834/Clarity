/* global React, ReactDOM, Sphere, Cube, CUBE_FACES, Pyramid, Onion, ONION_RINGS, Orbits, MirrorFrame, Emerging, useTweaks, TweaksPanel, TweakSection, TweakRadio */

const { useReducer, useState, useEffect, useRef, useMemo } = React;

const ENTRY_CARDS = [
  {
    id: "leap",
    title: "Should I take this leap?",
    sub: "A choice that could expand things — and risks the rest.",
    puzzle: "cube",
    shape: "cube",
  },
  {
    id: "leave",
    title: "Should I walk away?",
    sub: "Something you've outgrown, or are still trying to keep.",
    puzzle: "onion",
    shape: "onion",
  },
  {
    id: "torn",
    title: "I'm torn between two paths.",
    sub: "Two options that won't sit next to each other.",
    puzzle: "orbits",
    shape: "orbits",
  },
  {
    id: "want",
    title: "I don't know what I actually want.",
    sub: "The choice is foggy because the values underneath are.",
    puzzle: "mirror",
    shape: "mirror",
  },
  {
    id: "second",
    title: "I keep changing my mind.",
    sub: "The decision keeps moving. Something underneath isn't sitting still.",
    puzzle: "cube",
    shape: "cube",
  },
];

const QUESTIONS = [
  {
    q: "Is this a door you can re-open, or one that closes behind you?",
    note: "Reversibility · Bezos Type 1/2",
    opts: [
      "I can change course later",
      "I'd have to start over to undo it",
      "The cost of reversing is the point",
      "This is one-way",
    ],
  },
  {
    q: "When you imagine deciding — what shows up first in your body?",
    note: "Loss-vs-gain framing · Prospect Theory",
    opts: [
      "A weight, lifted",
      "A door, opening",
      "A drop in the chest",
      "Static",
    ],
  },
  {
    q: "Who else carries the consequences of this?",
    note: "Construal · stake distance",
    opts: [
      "Just me",
      "One person whose face I see in this",
      "A small circle I'd hurt either way",
      "More than I can hold in my head",
    ],
  },
  {
    q: "A year from today — nothing changed. What's the first feeling?",
    note: "Status-quo projection · 10-10-10",
    opts: [
      "A quiet ache",
      "Numb relief",
      "Honestly okay",
      "I refuse to picture it",
    ],
  },
];

const CHIPS_CUBE = [
  { id: "c1", side: "pull", label: "More money", sphere: [-42, -12] },
  { id: "c2", side: "pull", label: "Bigger problem", sphere: [12, -34] },
  { id: "c3", side: "pull", label: "Closer to what I want", sphere: [58, 8] },
  { id: "c4", side: "pull", label: "Out of stuck", sphere: [-78, 22] },
  { id: "c5", side: "pull", label: "Adventure", sphere: [90, -8] },
  { id: "c6", side: "pull", label: "Real growth", sphere: [-22, 44] },
  { id: "c7", side: "pull", label: "Recognition", sphere: [44, 30] },
  { id: "c8", side: "pull", label: "Better mentors", sphere: [-110, -18] },

  { id: "c9", side: "fear", label: "Lose my people", sphere: [140, -20] },
  { id: "c10", side: "fear", label: "Identity reset", sphere: [-120, 10] },
  { id: "c11", side: "fear", label: "What if I flame out", sphere: [168, 30] },
  { id: "c12", side: "fear", label: "Disappoint people", sphere: [-160, -32] },
  { id: "c13", side: "fear", label: "Outgrow this life", sphere: [150, -50] },
  { id: "c14", side: "fear", label: "Six months alone", sphere: [-100, 40] },
  { id: "c15", side: "fear", label: "I don't know enough", sphere: [20, -60] },

  { id: "c16", side: "pull", label: "Within my control", sphere: [80, 52] },
  { id: "c17", side: "fear", label: "Tied to the markets", sphere: [-30, -58] },
  { id: "c18", side: "fear", label: "Depends on her", sphere: [120, 52] },
];

const ONION_CHIPS = [
  { layer: 0, id: "o01", label: "We're just busy" },
  { layer: 0, id: "o02", label: "It's a phase" },
  { layer: 0, id: "o03", label: "Everyone struggles" },
  { layer: 0, id: "o04", label: "Maybe it's me" },
  { layer: 0, id: "o05", label: "I'm overreacting" },

  { layer: 1, id: "o06", label: "Lonely next to him" },
  { layer: 1, id: "o07", label: "Quietly bored" },
  { layer: 1, id: "o08", label: "Performing patience" },
  { layer: 1, id: "o09", label: "Resenting" },
  { layer: 1, id: "o10", label: "Numb" },

  { layer: 2, id: "o11", label: "Being alone" },
  { layer: 2, id: "o12", label: "Wasted years" },
  { layer: 2, id: "o13", label: "Being the one who left" },
  { layer: 2, id: "o14", label: "Starting over" },

  { layer: 3, id: "o15", label: "I'll choose this again" },
  { layer: 3, id: "o16", label: "I'm not allowed to want more" },
  { layer: 3, id: "o17", label: "I picked wrong" },

  { layer: 4, id: "o18", label: "Real wanting" },
  { layer: 4, id: "o19", label: "My own quiet" },
  { layer: 4, id: "o20", label: "Not managing anymore" },
  { layer: 4, id: "o21", label: "Honesty" },
];

const ORBIT_ATTRS = {
  gives: [
    "Time",
    "Money",
    "Freedom",
    "Stability",
    "Growth",
    "Connection",
    "Purpose",
    "Quiet",
    "Status",
    "Identity",
  ],

  costs: [
    "Energy",
    "Sleep",
    "Relationships",
    "Comfort",
    "Other paths",
    "Years",
    "Public exposure",
    "Old self",
  ],

  says: [
    "I bet on myself",
    "I finish what I start",
    "I choose people",
    "I'm someone who builds",
    "I'm someone who lasts",
    "I want it more than I'm scared",
  ],
};

const VALUES_18 = [
  { id: "v01", label: "Freedom" },
  { id: "v02", label: "Stability" },
  { id: "v03", label: "Closeness" },
  { id: "v04", label: "Craft" },
  { id: "v05", label: "Recognition" },
  { id: "v06", label: "Honesty" },
  { id: "v07", label: "Wonder" },
  { id: "v08", label: "Service" },
  { id: "v09", label: "Order" },
  { id: "v10", label: "Risk" },
  { id: "v11", label: "Beauty" },
  { id: "v12", label: "Loyalty" },
  { id: "v13", label: "Growth" },
  { id: "v14", label: "Privacy" },
  { id: "v15", label: "Power" },
  { id: "v16", label: "Quiet" },
  { id: "v17", label: "Play" },
  { id: "v18", label: "Justice" },
];

function buildPairs() {
  const ids = VALUES_18.map((v) => v.id);
  const pairs = [];

  for (let i = 0; i < ids.length; i++) {
    const pair = [
      ids[i],
      ids[(i + 1) % ids.length],
    ];

    pairs.push(
      i % 2 === 0
        ? pair
        : pair.slice().reverse()
    );
  }

  for (let i = 0; i < ids.length / 2; i++) {
    const pair = [
      ids[i],
      ids[i + ids.length / 2],
    ];

    pairs.push(
      i % 2 === 0
        ? pair.slice().reverse()
        : pair
    );
  }

  return pairs;
}

function mirrorRanking(mirror) {
  return VALUES_18
    .map((v) => {
      const played = mirror.played[v.id] || 0;
      const wins = mirror.wins[v.id] || 0;

      return {
        id: v.id,
        wins,
        played,
        rate: played
          ? wins / played
          : -1,
      };
    })
    .sort(
      (a, b) =>
        (b.rate - a.rate) ||
        (b.wins - a.wins) ||
        a.id.localeCompare(b.id)
    )
    .slice(0, 6)
    .map((x) => x.id);
}

const INITIAL = {
  screen: "entry",
  puzzle: null,

  intake: {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  },

  cube: {
    placed: [],
    faceOverrides: {},
    activeFace: "gain",
  },

  onion: {
    layerIdx: 0,
    layers: [
      [],
      [],
      [],
      [],
      [],
    ],
  },

  orbits: {
    nameA: "",
    nameB: "",
    aGives: [],
    aCosts: [],
    aSays: [],
    bGives: [],
    bCosts: [],
    bSays: [],
    align: 0.4,
  },

  mirror: {
    conscious: [],
    pairIdx: 0,
    pairs: buildPairs(),
    wins: {},
    played: {},
    skipped: 0,
    revealed: [],
  },
};

function reducer(s, a) {
  switch (a.type) {

    case "GO":
      return {
        ...s,
        screen: a.screen,
      };

    case "START":
      return {
        ...INITIAL,
        puzzle: a.puzzle,
        screen: "q1",
      };

    case "ANSWER":
      return {
        ...s,
        intake: {
          ...s.intake,
          [a.key]: a.value,
        },
        screen: a.next,
      };

    case "CUBE_TOGGLE": {
      const removing =
        s.cube.placed.includes(a.id);

      const placed =
        removing
          ? s.cube.placed.filter(
              (x) => x !== a.id
            )
          : [
              ...s.cube.placed,
              a.id,
            ];

      const faceOverrides = {
        ...s.cube.faceOverrides,
      };

      if (removing) {
        delete faceOverrides[a.id];
      }

      return {
        ...s,
        cube: {
          ...s.cube,
          placed,
          faceOverrides,
        },
      };
    }

    case "CUBE_FACE":
      return {
        ...s,
        cube: {
          ...s.cube,
          activeFace: a.face,
        },
      };

    case "CUBE_ASSIGN_FACE": {
      if (!s.cube.placed.includes(a.id)) {
        return s;
      }

      return {
        ...s,
        cube: {
          ...s.cube,
          faceOverrides: {
            ...s.cube.faceOverrides,
            [a.id]: a.face,
          },
        },
      };
    }

    case "ONION_TOGGLE": {
      const layers =
        s.onion.layers.map(
          (layer, i) => {
            if (i !== a.layer) {
              return layer;
            }

            return layer.includes(a.id)
              ? layer.filter(
                  (x) => x !== a.id
                )
              : [
                  ...layer,
                  a.id,
                ];
          }
        );

      return {
        ...s,
        onion: {
          ...s.onion,
          layers,
        },
      };
    }

    case "ONION_NEXT_LAYER":
      return {
        ...s,
        onion: {
          ...s.onion,
          layerIdx: Math.min(
            4,
            s.onion.layerIdx + 1
          ),
        },
      };

    case "ORBIT_NAME":
      return {
        ...s,
        orbits: {
          ...s.orbits,
          [a.key]: a.value,
        },
      };

    case "ORBIT_TOGGLE": {
      const list =
        s.orbits[a.key];

      const next =
        list.includes(a.val)
          ? list.filter(
              (x) => x !== a.val
            )
          : [
              ...list,
              a.val,
            ];

      return {
        ...s,
        orbits: {
          ...s.orbits,
          [a.key]: next,
        },
      };
    }

    case "ORBIT_ALIGN":
      return {
        ...s,
        orbits: {
          ...s.orbits,
          align: a.val,
        },
      };

    case "MIRROR_START_INSTINCT":
      return {
        ...s,
        screen: "mirror/instinct",

        mirror: {
          ...s.mirror,
          pairIdx: 0,
          wins: {},
          played: {},
          skipped: 0,
          revealed: [],
          pairs: buildPairs(),
        },
      };

    case "MIRROR_RANK_TOGGLE": {
      const conscious =
        s.mirror.conscious.includes(a.id)
          ? s.mirror.conscious.filter(
              (x) => x !== a.id
            )
          : s.mirror.conscious.length < 6
            ? [
                ...s.mirror.conscious,
                a.id,
              ]
            : s.mirror.conscious;

      return {
        ...s,
        mirror: {
          ...s.mirror,
          conscious,
        },
      };
    }

    case "MIRROR_PICK": {
      const pair =
        s.mirror.pairs[
          s.mirror.pairIdx
        ];

      if (
        !pair ||
        !pair.includes(a.id)
      ) {
        return s;
      }

      const wins = {
        ...s.mirror.wins,
        [a.id]:
          (s.mirror.wins[a.id] || 0) + 1,
      };

      const played = {
        ...s.mirror.played,
      };

      for (const id of pair) {
        played[id] =
          (played[id] || 0) + 1;
      }

      const pairIdx =
        s.mirror.pairIdx + 1;

      const nextMirror = {
        ...s.mirror,
        wins,
        played,
        pairIdx,
      };

      if (
        pairIdx >=
        s.mirror.pairs.length
      ) {
        nextMirror.revealed =
          mirrorRanking(nextMirror);
      }

      return {
        ...s,
        mirror: nextMirror,
      };
    }

    case "MIRROR_SKIP": {
      const pairIdx =
        s.mirror.pairIdx + 1;

      const nextMirror = {
        ...s.mirror,
        pairIdx,
        skipped:
          s.mirror.skipped + 1,
      };

      if (
        pairIdx >=
        s.mirror.pairs.length
      ) {
        nextMirror.revealed =
          mirrorRanking(nextMirror);
      }

      return {
        ...s,
        mirror: nextMirror,
      };
    }

    case "RESET":
      return {
        ...INITIAL,
        mirror: {
          ...INITIAL.mirror,
          pairs: buildPairs(),
        },
      };

    default:
      return s;
  }
}

function cubeSummary(state) {
  const placed =
    CHIPS_CUBE
      .filter((c) =>
        state.cube.placed.includes(
          c.id
        )
      )
      .map((c) => ({
        ...c,
        face:
          state.cube
            .faceOverrides[
              c.id
            ] || null,
      }));

  const pull =
    placed.filter(
      (c) => c.side === "pull"
    ).length;

  const fear =
    placed.filter(
      (c) => c.side === "fear"
    ).length;

  const facing = {};

  for (const c of placed) {
    if (c.face) {
      facing[c.face] =
        (facing[c.face] || 0) + 1;
    }
  }

  const sortedCount =
    placed.filter(
      (c) => c.face
    ).length;

  const dominant =
    pull > fear
      ? "pull"
      : fear > pull
        ? "fear"
        : "even";

  const tint =
    dominant === "pull"
      ? "var(--pull)"
      : dominant === "fear"
        ? "var(--fear)"
        : "var(--alignment)";

  return {
    placed,
    pull,
    fear,
    facing,
    sortedCount,
    dominant,
    tint,
  };
}

function lensLabels(intake) {
  if (!intake) {
    return [];
  }

  return [
    [
      "Reversible",
      "Mostly reversible",
      "High cost to reverse",
      "Irreversible",
    ][intake.q1],

    [
      "Loss-frame",
      "Gain-frame",
      "Grief-frame",
      "Avoidance",
    ][intake.q2],

    [
      "Solo agent",
      "Dyad",
      "Small circle",
      "Many stakeholders",
    ][intake.q3],

    [
      "Aching no",
      "Numb no",
      "Honest yes",
      "Refusal",
    ][intake.q4],
  ].filter(
    (x) => x != null
  );
}

function closingQuestion(state) {
  const intake =
    state.intake || {};

  const rev =
    intake.q1;

  const frame =
    intake.q2;

  const circle =
    intake.q3;

  const future =
    intake.q4;

  switch (state.puzzle) {

    case "cube": {
      const {
        dominant,
        pull,
        fear,
        placed,
      } =
        cubeSummary(state);

      if (
        placed.length < 3
      ) {
        return "If you only had three reasons — which three would they be?";
      }

      const topFear =
        placed.find(
          (c) =>
            c.side === "fear"
        );

      const ratio =
        pull /
        Math.max(
          1,
          pull + fear
        );

      if (
        future === 3 &&
        ratio >= 0.5
      ) {
        return "You refuse to picture a year of nothing changing. What does that resistance point to?";
      }

      if (
        future === 3 &&
        ratio < 0.5
      ) {
        return "You refuse to picture nothing changing, but the fear is louder than the pull. What sits between those two signals?";
      }

      if (ratio >= 0.75) {
        if (rev === 3) {
          return "If this is one-way, what would have to be true on the other side for the trip to feel worth it?";
        }

        if (frame === 2) {
          return "You feel the cost of choosing this before you've chosen it. Which part of that cost matters most?";
        }

        if (circle >= 2) {
          return "The pull is stronger than the fear, but other people sit inside the decision. Which consequence belongs to you and which belongs to them?";
        }

        return "The pull is stronger than the fear. What part of the decision still needs evidence?";
      }

      if (ratio <= 0.25) {
        if (future === 2) {
          return "The fear is louder than the pull, while another year feels tolerable. What would need to change before you reconsider?";
        }

        if (rev === 3) {
          return "This feels one-way and fear-heavy. What condition would need to change before you could treat it differently?";
        }

        if (topFear) {
          return `"${topFear.label}." If that happened, what would your next move actually be?`;
        }

        return "The fear is loud. Which part is a likely consequence and which part is uncertainty?";
      }

      if (frame === 3) {
        return "The pull and fear are close, but your first reaction is static. What information might make one side clearer?";
      }

      if (frame === 2) {
        return "Both directions appear to carry loss. Which loss changes the decision rather than merely making it painful?";
      }

      if (rev === 0) {
        return "The decision is relatively reversible. What small version could give you more evidence before committing?";
      }

      if (
        dominant === "pull"
      ) {
        return "Which fear would most change the decision if you could test whether it is true?";
      }

      if (
        dominant === "fear"
      ) {
        return "Which pull would need stronger evidence before it could outweigh the fear?";
      }

      return `The pull and fear are even at ${pull}/${fear}. What evidence could separate them?`;
    }

    case "onion": {
      const counts =
        state.onion.layers.map(
          (l) => l.length
        );

      const total =
        counts.reduce(
          (a, b) => a + b,
          0
        );

      const maxI =
        counts.indexOf(
          Math.max(...counts)
        );

      if (total === 0) {
        return "What's the smallest, truest sentence you could write about this?";
      }

      if (future === 3) {
        return "You resist imagining another year with nothing changing. What part of the current situation makes that future difficult to picture?";
      }

      if (maxI === 4) {
        const possible =
          ONION_CHIPS.filter(
            (c) =>
              c.layer === 4 &&
              state.onion.layers[
                4
              ].includes(c.id)
          );

        if (possible[0]) {
          return `"${possible[0].label}" carries weight here. What would a small test of that possibility look like?`;
        }

        return "Possibility is carrying much of the weight. What could you test without treating it as a final decision?";
      }

      if (maxI === 3) {
        const cores =
          ONION_CHIPS.filter(
            (c) =>
              c.layer === 3 &&
              state.onion.layers[
                3
              ].includes(c.id)
          );

        if (cores[0]) {
          if (rev === 3) {
            return `If "${cores[0].label}" were true, what additional evidence would you want before making an irreversible choice?`;
          }

          return `If "${cores[0].label}" were true, what would it change about how you frame the decision?`;
        }

        return "If the belief at the centre were true, what would it change about the decision?";
      }

      if (maxI === 2) {
        if (circle >= 2) {
          return "Fear is carrying much of the weight and other people are part of the decision. Which fear is about the outcome and which is about their reaction?";
        }

        return "Fear is carrying much of the weight. Which fear can be tested against evidence?";
      }

      if (maxI === 1) {
        const feels =
          ONION_CHIPS.filter(
            (c) =>
              c.layer === 1 &&
              state.onion.layers[
                1
              ].includes(c.id)
          );

        if (
          feels[0] &&
          frame === 3
        ) {
          return `"${feels[0].label}" appears alongside a numb first reaction. What would help you tell adaptation apart from avoidance?`;
        }

        if (feels[0]) {
          return `"${feels[0].label}" carries weight here. What does that feeling tell you, and what does it not tell you?`;
        }
      }

      if (future === 1) {
        return "Imagining another year brings relief but also numbness. What part of that reaction deserves closer attention?";
      }

      return "If nothing changed for a year, what would you want to understand better before accepting that outcome?";
    }

    case "orbits": {
      const a =
        state.orbits.align;

      const A =
        state.orbits.nameA ||
        "Option A";

      const B =
        state.orbits.nameB ||
        "Option B";

      if (
        rev === 3 &&
        a < 0.45
      ) {
        return `You currently see ${A} and ${B} as difficult to combine. Is the conflict structural, or mainly about timing?`;
      }

      if (frame === 2) {
        return `Both ${A} and ${B} appear to carry a loss. Which loss changes what is possible later?`;
      }

      if (a > 0.75) {
        return `You see ${A} and ${B} as relatively compatible. What still makes them feel like a choice?`;
      }

      if (a > 0.45) {
        if (circle >= 2) {
          return `Part of the tension between ${A} and ${B} may involve other people. Which constraints belong to the options themselves?`;
        }

        return `Which parts of ${A} and ${B} actually conflict, and which could coexist at different times?`;
      }

      if (circle >= 2) {
        return `If other people's reactions were removed, which conflict between ${A} and ${B} would remain?`;
      }

      return `What exactly becomes impossible if you choose ${A} rather than ${B}?`;
    }

    case "mirror": {
      const C =
        state.mirror.conscious;

      const R =
        state.mirror.revealed;

      if (
        !C.length ||
        !R.length
      ) {
        return "What did the instinct round reveal that your deliberate ranking did not?";
      }

      const rC =
        Object.fromEntries(
          C.map(
            (id, i) => [
              id,
              i,
            ]
          )
        );

      const rR =
        Object.fromEntries(
          R.map(
            (id, i) => [
              id,
              i,
            ]
          )
        );

      let gap = null;

      for (const id of C) {
        const cIdx =
          rC[id];

        const rIdx =
          rR[id];

        if (
          rIdx === undefined
        ) {
          continue;
        }

        const d =
          cIdx - rIdx;

        if (
          !gap ||
          Math.abs(d) >
            Math.abs(gap.d)
        ) {
          gap = {
            id,
            d,
            cIdx,
            rIdx,
          };
        }
      }

      const v =
        gap &&
        VALUES_18.find(
          (x) =>
            x.id === gap.id
        );

      const topC =
        (
          VALUES_18.find(
            (x) =>
              x.id === C[0]
          ) || {}
        ).label;

      const topR =
        (
          VALUES_18.find(
            (x) =>
              x.id === R[0]
          ) || {}
        ).label;

      if (
        future === 3 &&
        v
      ) {
        return `${v.label} appears differently in your deliberate and instinctive choices. How does that relate to your resistance to another year of no change?`;
      }

      if (
        C[0] === R[0]
      ) {
        return `${topC} sits at the top of both rankings. What part of the decision still conflicts with it?`;
      }

      if (
        v &&
        gap.d > 0
      ) {
        if (frame === 0) {
          return `${v.label} ranks higher in your instinctive choices than in your deliberate list. What might explain that gap?`;
        }

        if (frame === 2) {
          return `${v.label} rises in the instinctive ranking while the decision also carries grief. Are those signals connected?`;
        }

        return `${v.label} rises in the instinctive ranking. What might your deliberate ranking be accounting for that instinct does not?`;
      }

      if (
        v &&
        gap.d < 0
      ) {
        if (circle >= 2) {
          return `${v.label} sits higher in your deliberate ranking than in your instinctive choices. How much of that difference involves other people?`;
        }

        return `${v.label} sits higher in your deliberate ranking than in your instinctive choices. What might explain the difference?`;
      }

      return `Your deliberate ranking begins with ${topC}, while your instinctive ranking begins with ${topR}. What does each one protect?`;
    }

    default:
      return "";
  }
}

window.__CLARITY = {
  CHIPS_CUBE,
  ONION_CHIPS,
  ORBIT_ATTRS,
  VALUES_18,
  cubeSummary,
  closingQuestion,
  lensLabels,
};
