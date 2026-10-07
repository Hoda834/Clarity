/* global React, GuidancePanel */

const WORLD_DEFS = {
  orbit: {
    id: "orbit",
    label: "Two paths",
    purpose: "option-conflict",
    soundTheme: "orbit",
    accent: "var(--alignment)",
    entryByPuzzle: {
      orbits: "orbits/name",
      cube: "cube/sphere",
      onion: "onion/build",
      mirror: "mirror/rank",
    },
    guidance: {
      title: "Put the answer aside for a moment.",
      intro: "Two options can feel mutually exclusive before we have checked what actually collides.",
      instruction: "We will separate what each option gives you, what it costs, and the constraints that make carrying both difficult.",
      reflection: "For now, notice the distance you feel between the options. We will test whether the structure supports that feeling.",
    },
  },

  fog: {
    id: "fog",
    label: "The fog",
    purpose: "uncertainty",
    soundTheme: "fog",
    accent: "var(--neutral)",
    entryByPuzzle: {
      mirror: "mirror/rank",
      onion: "onion/build",
      cube: "cube/sphere",
      orbits: "orbits/name",
    },
    guidance: {
      title: "You do not need to see the whole decision yet.",
      intro: "Uncertainty often makes every part of a decision look equally important.",
      instruction: "We will clear one layer at a time. Choose only what feels true now. You can leave the rest untouched.",
      reflection: "The aim is not certainty. It is to discover what kind of uncertainty you are dealing with.",
    },
  },

  wonderland: {
    id: "wonderland",
    label: "The distorted room",
    purpose: "distorted-importance",
    soundTheme: "wonder",
    accent: "var(--pull)",
    entryByPuzzle: {
      cube: "cube/sphere",
      onion: "onion/build",
      orbits: "orbits/name",
      mirror: "mirror/rank",
    },
    guidance: {
      title: "Some parts of the decision may have changed size in your head.",
      intro: "When fear, hope and pressure arrive together, a small consequence can fill the room while a large one becomes hard to see.",
      instruction: "We will move through the decision slowly and let each part take up only the space it earns.",
      reflection: "Pay attention to what becomes larger, smaller, closer or further away as you make choices.",
    },
  },
};

function selectWorld(profile, puzzle) {
  if (puzzle === "orbits" || profile.structure === "two-options") return "orbit";
  if (profile.uncertainty >= 0.72) return "fog";
  if (profile.identityConflict >= 0.68 && profile.emotionalConflict >= 0.55) return "wonderland";
  if (puzzle === "mirror") return "fog";
  if (puzzle === "onion" && profile.uncertainty >= 0.5) return "fog";
  return "wonderland";
}

function worldEntryScreen(worldId, puzzle) {
  const world = WORLD_DEFS[worldId] || WORLD_DEFS.wonderland;
  return world.entryByPuzzle[puzzle] || "entry";
}

function WorldGlyph({ worldId }) {
  const base = {
    width: 330,
    height: 240,
    margin: "0 auto 30px",
    position: "relative",
    display: "grid",
    placeItems: "center",
  };

  if (worldId === "orbit") {
    return (
      <div style={base} aria-hidden="true">
        <div style={{
          position: "absolute", width: 150, height: 150, borderRadius: "50%",
          border: "1px solid var(--pull)", transform: "translateX(-52px)",
          boxShadow: "0 0 48px color-mix(in srgb, var(--pull) 12%, transparent)",
        }} />
        <div style={{
          position: "absolute", width: 150, height: 150, borderRadius: "50%",
          border: "1px solid var(--alignment)", transform: "translateX(52px)",
          boxShadow: "0 0 48px color-mix(in srgb, var(--alignment) 12%, transparent)",
        }} />
        <div className="eyebrow-lg">distance is a claim</div>
      </div>
    );
  }

  if (worldId === "fog") {
    return (
      <div style={base} aria-hidden="true">
        {[190, 142, 94].map((size, i) => (
          <div key={size} style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px solid color-mix(in srgb, var(--text-2) ${24 + i * 12}%, transparent)`,
            filter: `blur(${5 - i}px)`,
            opacity: 0.72,
          }} />
        ))}
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--text-1)" }} />
      </div>
    );
  }

  return (
    <div style={base} aria-hidden="true">
      <div style={{
        position: "absolute", left: 62, bottom: 34, width: 68, height: 138,
        border: "1px solid var(--pull)", borderRadius: "36px 36px 4px 4px",
        transform: "rotate(-8deg)",
      }} />
      <div style={{
        position: "absolute", right: 58, top: 24, width: 92, height: 184,
        border: "1px solid var(--alignment)", borderRadius: "48px 48px 5px 5px",
        transform: "rotate(7deg)",
      }} />
      <div style={{
        position: "absolute", width: 34, height: 34, borderRadius: "50%",
        background: "color-mix(in srgb, var(--fear) 30%, transparent)",
        transform: "translate(8px, -26px)",
      }} />
      <div className="eyebrow-lg" style={{ transform: "translateY(88px)" }}>
        what has changed size?
      </div>
    </div>
  );
}

function WorldRenderer({ state, dispatch }) {
  const worldId = state.journey.currentWorld || selectWorld(state.decisionProfile, state.puzzle);
  const world = WORLD_DEFS[worldId] || WORLD_DEFS.wonderland;
  const nextScreen = worldEntryScreen(world.id, state.puzzle);

  return (
    <div className="page page-fade" data-screen-label={`World · ${world.label}`}>
      <div className="page-inner" style={{ display: "grid", alignContent: "center", minHeight: "72vh" }}>
        <WorldGlyph worldId={world.id} />

        <GuidancePanel
          eyebrow={`WORLD 01 · ${world.label.toUpperCase()}`}
          title={world.guidance.title}
          intro={world.guidance.intro}
          instruction={world.guidance.instruction}
          reflection={world.guidance.reflection}
          soundTheme={world.soundTheme}
          onContinue={() => dispatch({ type: "ENTER_WORLD", screen: nextScreen })}
        />
      </div>
    </div>
  );
}

window.ClarityWorlds = {
  defs: WORLD_DEFS,
  selectWorld,
  worldEntryScreen,
};

window.WorldRenderer = WorldRenderer;
