/* global React, Sphere, Cube, CUBE_FACES, Pyramid, Onion, ONION_RINGS, Orbits, MirrorFrame, Emerging */
// Clarity — interactive screen components, website layout.

const { useEffect: useEffectS, useRef: useRefS, useState: useStateS } = React;

/* tiny shape echo glyph for entry rows */
function EntryGlyphSm({ kind }) {
  const common = { width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 0.75 };
  if (kind === "cube")   return <svg {...common} viewBox="0 0 18 18"><path d="M3 5 L9 2 L15 5 L9 8 Z M3 5 V13 L9 16 V8 M9 16 L15 13 V5"/></svg>;
  if (kind === "onion")  return <svg {...common} viewBox="0 0 18 18"><circle cx="9" cy="9" r="7"/><circle cx="9" cy="9" r="5"/><circle cx="9" cy="9" r="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg>;
  if (kind === "orbits") return <svg {...common} viewBox="0 0 18 18"><circle cx="6" cy="9" r="3.2"/><circle cx="12" cy="9" r="3.2"/></svg>;
  if (kind === "mirror") return <svg {...common} viewBox="0 0 18 18"><rect x="3" y="2" width="12" height="14" rx="1.5"/><path d="M9 2 V16"/></svg>;
  return null;
}

/* ───────── ENTRY ───────── */
function ScreenEntry({ dispatch }) {
  return (
    <div className="page page-fade" data-screen-label="Entry">
      <div className="page-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920, marginTop: 28 }}>
          <h1 className="prompt-xxl">What's on your mind?</h1>
          <p className="sub">Pick the one that lands first. No wrong door — we'll calibrate from your answer.</p>
        </div>

        <div className="entry-list">
          {ENTRY_CARDS.map((c, i) => (
            <button key={c.id} className="entry-row" onClick={() => dispatch({ type: "START", puzzle: c.puzzle })}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div className="title">{c.title}</div>
              <div className="sub">{c.sub}</div>
              <span className="arrow"><EntryGlyphSm kind={c.shape} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── ROUTING QUESTIONS ───────── */
function ScreenQuestion({ idx, state, dispatch }) {
  const Q = QUESTIONS[idx];
  const key = `q${idx + 1}`;
  const next = idx < 3 ? `q${idx + 2}` : "transition";
  const selected = state.intake[key];

  return (
    <div className="page page-fade" data-screen-label={`Q${idx + 1}`}>
      <div className="q-stack">
        <div>
          <h2 className="prompt-xl">{Q.q}</h2>
          <div className="q-options">
            {Q.opts.map((o, i) => (
              <button
                key={o}
                className={"q-option" + (i === selected ? " is-selected" : "")}
                onClick={() => dispatch({ type: "ANSWER", key, value: i, next })}
              >
                <span>{o}</span>
                <span className="glyph" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── TRANSITION ───────── */
function ScreenTransition({ state, dispatch }) {
  const shape = state.puzzle;
  const world = state.journey && state.journey.currentWorld;
  useEffectS(() => {
    const t = setTimeout(() => {
      dispatch({ type: "GO", screen: world ? "world/intro" : "entry" });
    }, 2200);
    return () => clearTimeout(t);
  }, [shape, world]);
  return (
    <div className="page" data-screen-label="Transition">
      <div className="page-inner" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ width: 320, height: 320, display: "grid", placeItems: "center", animation: "emerge 2.4s ease-out forwards" }}>
          <Emerging size={280} shape={shape} />
        </div>
      </div>
    </div>
  );
}

/* ───────── CUBE phases ───────── */
function ScreenCubeSphere({ state, dispatch, density }) {
  const placedIds = state.cube.placed;
  const placedChips = CHIPS_CUBE.filter(c => placedIds.includes(c.id))
    .map(c => ({ id: c.id, side: c.side, theta: c.sphere[0], phi: c.sphere[1] }));
  const pullN = placedChips.filter(c => c.side === "pull").length;
  const fearN = placedChips.filter(c => c.side === "fear").length;
  const canAdvance = placedChips.length >= 4;

  const pullChips = CHIPS_CUBE.filter(c => c.side === "pull");
  const fearChips = CHIPS_CUBE.filter(c => c.side === "fear");

  return (
    <div className="page page-fade" data-screen-label="Cube · Surface">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 className="prompt-lg">What's on the surface?</h2>
          <span className="eyebrow-lg">{placedChips.length} placed</span>
        </div>

        <div className="puzzle-grid split" style={{ marginTop: 12 }}>
          {/* PULL column */}
          <div>
            <div className="section-eyebrow" style={{ color: "var(--pull)" }}>● pulls toward · {pullN}</div>
            <div className="chip-rail">
              {pullChips.map(c => {
                const on = placedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    className={`chip pull ${on ? "is-placed" : ""}`}
                    onClick={() => dispatch({ type: "CUBE_TOGGLE", id: c.id })}
                    style={on ? { opacity: 0.4, borderStyle: "dashed" } : {}}
                  >
                    <span className="dot" />{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sphere */}
          <div className="puzzle-shape">
            <Sphere size={360} chips={placedChips} />
          </div>

          {/* FEAR column */}
          <div>
            <div className="section-eyebrow" style={{ color: "var(--fear)", textAlign: "right" }}>{fearN} · holds back ●</div>
            <div className="chip-rail" style={{ justifyContent: "flex-end" }}>
              {fearChips.map(c => {
                const on = placedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    className={`chip fear ${on ? "is-placed" : ""}`}
                    onClick={() => dispatch({ type: "CUBE_TOGGLE", id: c.id })}
                    style={on ? { opacity: 0.4, borderStyle: "dashed" } : {}}
                  >
                    <span className="dot" />{c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="page-actions">
          <span className="eyebrow-lg">{canAdvance ? "ready to crystallise" : `tap ${4 - placedChips.length} more`}</span>
          <button className="cta" disabled={!canAdvance} onClick={() => canAdvance && dispatch({ type: "GO", screen: "cube/faces" })}>
            Crystallise <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenCubeFaces({ state, dispatch }) {
  const summary = window.__CLARITY.cubeSummary(state);
  const counts = {};
  for (const f of CUBE_FACES) counts[f.id] = summary.facing[f.id] || 0;
  const activeFace = state.cube.activeFace || "gain";
  const activeFaceMeta = CUBE_FACES.find(f => f.id === activeFace);
  const activeItems = summary.placed.filter(c => c.face === activeFace);
  const canAdvance = summary.placed.length > 0 && summary.sortedCount === summary.placed.length;

  return (
    <div className="page page-fade" data-screen-label="Cube · Faces">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 className="prompt-lg">Choose a face, then place each thought.</h2>
          <span className="eyebrow-lg">{summary.sortedCount}/{summary.placed.length} sorted</span>
        </div>

        <div className="puzzle-grid duo" style={{ marginTop: 12 }}>
          <div className="puzzle-shape">
            <Cube size={340} activeFace={activeFace} counts={counts} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CUBE_FACES.map(f => (
                <button
                  key={f.id}
                  className="face-plate"
                  onClick={() => dispatch({ type: "CUBE_FACE", face: f.id })}
                  style={{
                    cursor: "pointer", textAlign: "left",
                    padding: "14px 16px",
                    borderColor: f.id === activeFace ? "var(--border-strong)" : undefined,
                    background: f.id === activeFace ? "var(--bg-2)" : undefined,
                  }}
                >
                  <div className="ftitle" style={{ fontSize: 14 }}>
                    <span className="swatch" style={{ background: f.color }} />{f.title}
                  </div>
                  <div className="meta">{counts[f.id]} {counts[f.id] === 1 ? "item" : "items"}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 10, padding: "16px 18px", border: "0.5px solid var(--border-active)", borderRadius: "var(--r-md)", background: "var(--bg-1)", minHeight: 90 }}>
              <div className="eyebrow-lg" style={{ color: activeFaceMeta.color, marginBottom: 10 }}>{activeFaceMeta.title}</div>
              <div className="chip-rail">
                {activeItems.length === 0 && <span className="dim" style={{ fontSize: 13 }}>Choose a thought below to place it here.</span>}
                {activeItems.map(c => (
                  <span key={c.id} className={`chip ${c.side}`}><span className="dot" />{c.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="eyebrow-lg" style={{ marginBottom: 10 }}>YOUR THOUGHTS · select a face above, then tap a thought</div>
          <div className="chip-rail">
            {summary.placed.map(c => {
              const face = c.face ? CUBE_FACES.find(f => f.id === c.face) : null;
              return (
                <button
                  key={c.id}
                  className={`chip ${c.side}`}
                  onClick={() => dispatch({ type: "CUBE_ASSIGN_FACE", id: c.id, face: activeFace })}
                  title={`Place in ${activeFaceMeta.title}`}
                  style={{
                    cursor: "pointer",
                    borderColor: face ? face.color : undefined,
                    opacity: face ? 1 : 0.82,
                  }}
                >
                  <span className="dot" />{c.label}
                  <span style={{ marginLeft: 6, color: face ? face.color : "var(--text-3)", fontSize: 10 }}>
                    {face ? `· ${face.title}` : "· unsorted"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="page-actions">
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "cube/sphere" })}>← Re-gather</button>
          <button className="cta" disabled={!canAdvance} onClick={() => canAdvance && dispatch({ type: "GO", screen: "cube/pyramid" })}>
            {canAdvance ? "Compress" : `Sort ${summary.placed.length - summary.sortedCount} more`} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenCubePyramid({ state, dispatch }) {
  const s = window.__CLARITY.cubeSummary(state);
  const subtle = s.dominant === "pull" ? "var(--conflict)" : "var(--clarity)";
  const themeLabel = s.dominant === "pull" ? "Pull-dominant" : s.dominant === "fear" ? "Fear-dominant" : "Evenly matched";
  const story = s.dominant === "pull"
    ? `${s.pull} of ${s.pull + s.fear} are pulls. The fear is loud, but it's smaller than the pull.`
    : s.dominant === "fear"
      ? `${s.fear} of ${s.pull + s.fear} are fears. Notice how loud the resistance is — that's information.`
      : `${s.pull} pull, ${s.fear} fear. You're not arguing — you're weighing.`;

  return (
    <div className="page page-fade" data-screen-label="Cube · Pyramid">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <h2 className="prompt-lg">The shape your thinking made.</h2>
          <span className="eyebrow-lg" style={{ color: s.tint }}>● {themeLabel}</span>
        </div>

        <div className="puzzle-grid" style={{ marginTop: 20 }}>
          <div className="puzzle-shape">
            <Pyramid size={380} tint={s.tint} subtle={subtle} />
          </div>
        </div>

        <div style={{ padding: "22px 24px", border: "0.5px solid var(--border-active)", borderRadius: "var(--r-lg)", background: "var(--bg-1)", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.28, margin: 0, color: "var(--text-1)", textWrap: "balance" }}>
            {story}
          </p>
        </div>

        <div className="page-actions">
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "cube/faces" })}>← Re-sort</button>
          <button className="cta" onClick={() => dispatch({ type: "GO", screen: "result" })}>See the question <span>→</span></button>
        </div>
      </div>
    </div>
  );
}

window.ScreenEntry = ScreenEntry;
window.ScreenQuestion = ScreenQuestion;
window.ScreenTransition = ScreenTransition;
window.ScreenCubeSphere = ScreenCubeSphere;
window.ScreenCubeFaces = ScreenCubeFaces;
window.ScreenCubePyramid = ScreenCubePyramid;
