/* global React, GuidancePanel */

const { useState: useWorldState, useMemo: useWorldMemo } = React;

const WORLD_DEFS = {
  orbit: {
    id: "orbit",
    label: "Two paths",
    purpose: "option-conflict",
    accent: "var(--alignment)",
    entryByPuzzle: {
      orbits: "orbits/name",
      cube: "cube/sphere",
      onion: "onion/build",
      mirror: "mirror/rank",
    },
    guidance: {
      title: "Two things can feel further apart than they are.",
      intro: "Before comparing them, test the distance you feel between them.",
      instruction: "Move the two bodies. Put them where the choice feels right now.",
      reflection: "This is your felt distance. Next we test what actually keeps them apart.",
    },
  },

  fog: {
    id: "fog",
    label: "The fog",
    purpose: "uncertainty",
    accent: "var(--neutral)",
    entryByPuzzle: {
      mirror: "mirror/rank",
      onion: "onion/build",
      cube: "cube/sphere",
      orbits: "orbits/name",
    },
    guidance: {
      title: "You do not need to see the whole decision yet.",
      intro: "When everything is unclear, every part starts to look equally important.",
      instruction: "Touch the fog. Clear only enough space to see what is closest.",
      reflection: "Clarity starts when one thing becomes distinguishable from the rest.",
    },
  },

  wonderland: {
    id: "wonderland",
    label: "The distorted room",
    purpose: "distorted-importance",
    accent: "var(--pull)",
    entryByPuzzle: {
      cube: "cube/sphere",
      onion: "onion/build",
      orbits: "orbits/name",
      mirror: "mirror/rank",
    },
    guidance: {
      title: "Some parts of the decision may have changed size in your head.",
      intro: "Fear, hope and pressure can make one consequence fill the room while another almost disappears.",
      instruction: "Open a door. Notice what grows and what shrinks when you change perspective.",
      reflection: "The question is not which door is correct. It is what your mind has made too large or too small.",
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

function OrbitWorld({ value, onChange }) {
  const left = 30 + value * 18;
  const right = 70 - value * 18;

  return (
    <div style={{ width: "100%", maxWidth: 760, margin: "0 auto 28px" }}>
      <div style={{ height: 290, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: "20px 0",
          borderRadius: "50%",
          border: "1px solid var(--border-subtle)",
          transform: "perspective(700px) rotateX(65deg)",
          opacity: 0.55,
        }} />

        <div style={{
          position: "absolute",
          left: `calc(${left}% - 58px)`,
          top: 86,
          width: 116,
          height: 116,
          borderRadius: "50%",
          border: "1px solid var(--pull)",
          background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--pull) 30%, transparent), transparent 68%)",
          boxShadow: "0 0 70px color-mix(in srgb, var(--pull) 16%, transparent)",
          transition: "left .18s ease",
        }} />

        <div style={{
          position: "absolute",
          left: `calc(${right}% - 58px)`,
          top: 86,
          width: 116,
          height: 116,
          borderRadius: "50%",
          border: "1px solid var(--alignment)",
          background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--alignment) 28%, transparent), transparent 68%)",
          boxShadow: "0 0 70px color-mix(in srgb, var(--alignment) 16%, transparent)",
          transition: "left .18s ease",
        }} />
      </div>

      <input
        aria-label="Felt distance between options"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span className="eyebrow-lg">far apart</span>
        <span className="eyebrow-lg">can coexist</span>
      </div>
    </div>
  );
}

function FogWorld({ cleared, onClear }) {
  const rings = useWorldMemo(() => [280, 220, 166, 116], []);
  const opacity = Math.max(0.1, 0.86 - cleared * 0.18);

  return (
    <button
      onClick={onClear}
      aria-label="Clear some fog"
      style={{
        width: "100%",
        maxWidth: 760,
        height: 330,
        margin: "0 auto 28px",
        position: "relative",
        display: "grid",
        placeItems: "center",
        border: 0,
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {rings.map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: size + cleared * (i + 1) * 11,
            height: size + cleared * (i + 1) * 11,
            borderRadius: "50%",
            border: `1px solid color-mix(in srgb, var(--text-2) ${22 + i * 8}%, transparent)`,
            filter: `blur(${9 - i}px)`,
            opacity: opacity - i * 0.06,
            transition: "all .45s ease",
          }}
        />
      ))}

      <div style={{
        width: 18 + cleared * 9,
        height: 18 + cleared * 9,
        borderRadius: "50%",
        background: "var(--text-1)",
        boxShadow: "0 0 48px color-mix(in srgb, var(--text-1) 32%, transparent)",
        transition: "all .45s ease",
      }} />

      <span className="eyebrow-lg" style={{ position: "absolute", bottom: 18 }}>
        {cleared === 0 ? "touch the fog" : cleared < 4 ? "a little clearer" : "something is visible"}
      </span>
    </button>
  );
}

function WonderlandWorld({ activeDoor, onDoor }) {
  const doors = [
    { id: 0, label: "What feels huge", scale: activeDoor === 0 ? 1.32 : 0.88, h: 170, rotate: -6 },
    { id: 1, label: "What feels small", scale: activeDoor === 1 ? 1.32 : 0.88, h: 118, rotate: 4 },
    { id: 2, label: "What keeps moving", scale: activeDoor === 2 ? 1.32 : 0.88, h: 208, rotate: 8 },
  ];

  return (
    <div style={{
      width: "100%",
      maxWidth: 820,
      height: 360,
      margin: "0 auto 28px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 44,
      perspective: 900,
      overflow: "hidden",
      paddingBottom: 20,
    }}>
      {doors.map((door, i) => (
        <button
          key={door.id}
          onClick={() => onDoor(door.id)}
          style={{
            width: 110,
            height: door.h,
            border: `1px solid ${i === 0 ? "var(--pull)" : i === 1 ? "var(--alignment)" : "var(--fear)"}`,
            borderRadius: "58px 58px 8px 8px",
            background: activeDoor === door.id
              ? "color-mix(in srgb, var(--bg-2) 78%, transparent)"
              : "transparent",
            transform: `rotate(${door.rotate}deg) scale(${door.scale}) translateZ(${activeDoor === door.id ? 35 : 0}px)`,
            transformOrigin: "bottom center",
            transition: "transform .45s cubic-bezier(.2,.8,.2,1), background .35s ease",
            cursor: "pointer",
            color: "var(--text-1)",
            display: "grid",
            placeItems: "center",
            padding: 12,
          }}
        >
          <span className="eyebrow-lg" style={{ lineHeight: 1.5 }}>{door.label}</span>
        </button>
      ))}
    </div>
  );
}

function WorldRenderer({ state, dispatch }) {
  const worldId = state.journey.currentWorld || selectWorld(state.decisionProfile, state.puzzle);
  const world = WORLD_DEFS[worldId] || WORLD_DEFS.wonderland;
  const nextScreen = worldEntryScreen(world.id, state.puzzle);

  const [orbitDistance, setOrbitDistance] = useWorldState(0.22);
  const [fogCleared, setFogCleared] = useWorldState(0);
  const [activeDoor, setActiveDoor] = useWorldState(0);

  let interaction = null;
  let continueLabel = "Continue";

  if (world.id === "orbit") {
    interaction = <OrbitWorld value={orbitDistance} onChange={setOrbitDistance} />;
    continueLabel = "Test the distance";
  } else if (world.id === "fog") {
    interaction = <FogWorld cleared={fogCleared} onClear={() => setFogCleared((v) => Math.min(4, v + 1))} />;
    continueLabel = "Follow what appeared";
  } else {
    interaction = <WonderlandWorld activeDoor={activeDoor} onDoor={setActiveDoor} />;
    continueLabel = "Step through";
  }

  return (
    <div
      className="page page-fade"
      data-screen-label={`World · ${world.label}`}
      style={{
        background: world.id === "fog"
          ? "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--text-2) 8%, transparent), transparent 52%)"
          : world.id === "wonderland"
            ? "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--pull) 8%, transparent), transparent 56%)"
            : "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--alignment) 7%, transparent), transparent 58%)",
      }}
    >
      <div className="page-inner" style={{ display: "grid", alignContent: "center", minHeight: "78vh" }}>
        {interaction}

        <GuidancePanel
          eyebrow={`WORLD 01 · ${world.label.toUpperCase()}`}
          title={world.guidance.title}
          intro={world.guidance.intro}
          instruction={world.guidance.instruction}
          reflection={world.guidance.reflection}
          continueLabel={continueLabel}
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
