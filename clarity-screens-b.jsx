/* global React, Onion, ONION_RINGS, Orbits, MirrorFrame, Pyramid */
// Onion + Orbits + Mirror + Result + History — website layout.

const { useEffect: useEffectB, useRef: useRefB, useState: useStateB } = React;

/* ───────── ONION ───────── */
function ScreenOnionBuild({ state, dispatch }) {
  const idx = state.onion.layerIdx;
  const meta = ONION_RINGS[idx];
  const chips = ONION_CHIPS.filter(c => c.layer === idx);
  const picked = state.onion.layers[idx];
  const intensities = state.onion.layers.map(l => Math.min(0.95, 0.15 + l.length * 0.18));

  const isLast = idx >= 4;
  const next = () => {
    if (isLast) dispatch({ type: "GO", screen: "onion/cross" });
    else dispatch({ type: "ONION_NEXT_LAYER" });
  };

  return (
    <div className="page page-fade" data-screen-label="Onion · Build">
      <div className="page-inner">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 12 }}>
          <span className="eyebrow-lg" style={{ color: meta.color }}>● {meta.label.toLowerCase()}</span>
        </div>

        <div className="onion-center" style={{ marginTop: 4 }}>
          <Onion size={360} active={idx} intensities={intensities} />
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <h2 className="prompt-lg" style={{ marginBottom: 22 }}>
            {idx === 0 && "What's the story you've been telling about this?"}
            {idx === 1 && "What does it actually feel like, day to day?"}
            {idx === 2 && "What are you afraid of?"}
            {idx === 3 && "Underneath the fear — what's the thing you don't want to be true?"}
            {idx === 4 && "If you let yourself want it, what becomes possible?"}
          </h2>

          <div className="chip-rail" style={{ justifyContent: "center" }}>
            {chips.map(c => {
              const on = picked.includes(c.id);
              return (
                <button
                  key={c.id}
                  className="chip"
                  onClick={() => dispatch({ type: "ONION_TOGGLE", layer: idx, id: c.id })}
                  style={{
                    borderColor: on ? meta.color : undefined,
                    background: on ? `color-mix(in srgb, ${meta.color} 16%, var(--bg-1))` : undefined,
                  }}
                >
                  <span className="dot" style={on ? { background: meta.color } : {}} />{c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="page-actions">
          <span className="eyebrow-lg">{picked.length === 0 ? "tap what resonates" : `${picked.length} chosen`}</span>
          <button className="cta" onClick={next}>
            {isLast ? "See cross-section" : "Go deeper"} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenOnionCross({ state, dispatch }) {
  const intensities = state.onion.layers.map(l => Math.min(0.95, 0.15 + l.length * 0.18));
  return (
    <div className="page page-fade" data-screen-label="Onion · Cross-section">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="prompt-lg">All five at once.</h2>
          <span className="eyebrow-lg">cross-section</span>
        </div>

        <div className="puzzle-grid duo" style={{ marginTop: 20 }}>
          <div className="puzzle-shape">
            <Onion size={340} active={5} intensities={intensities} crossSection />
          </div>

          <div className="col gap-10" style={{ alignSelf: "center" }}>
            <p className="sub" style={{ marginBottom: 14 }}>Read outside in. The thicker the ring, the more weight it's carrying.</p>
            {ONION_RINGS.map((r, i) => {
              const intens = intensities[i];
              return (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "12px 120px 1fr 40px", gap: 14, alignItems: "center" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                  <span style={{ fontSize: 13.5, color: "var(--text-1)" }}>{r.label}</span>
                  <span style={{ height: 4, borderRadius: 2, background: "var(--bg-2)", position: "relative" }}>
                    <i style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${intens * 100}%`, background: r.color, borderRadius: 2 }} />
                  </span>
                  <span className="coord" style={{ textAlign: "right" }}>{Math.round(intens * 100)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="page-actions">
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "onion/build" })}>← Re-open</button>
          <button className="cta" onClick={() => dispatch({ type: "GO", screen: "result" })}>See the question <span>→</span></button>
        </div>
      </div>
    </div>
  );
}

/* ───────── ORBITS ───────── */
function ScreenOrbitsName({ state, dispatch }) {
  const { nameA, nameB } = state.orbits;
  const ready = nameA.trim() && nameB.trim();
  const inputA = useRefB(null);
  useEffectB(() => { inputA.current && inputA.current.focus(); }, []);

  return (
    <div className="page page-fade" data-screen-label="Orbits · Name">
      <div className="page-inner">
        <h2 className="prompt-lg" style={{ textAlign: "center", marginBottom: 4 }}>Give each one a name.</h2>
        <p className="sub" style={{ textAlign: "center", margin: "0 auto" }}>The only typing you'll do. Short. Honest.</p>

        <div className="puzzle-shape" style={{ margin: "24px 0 8px" }}>
          <Orbits size={300} alignment={0.18} nameA={nameA || "Option A"} nameB={nameB || "Option B"} />
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", width: "100%", display: "grid", gap: 12 }}>
          <NameField color="var(--pull)" label="OPTION A" placeholder="Stay senior IC" value={nameA}
            inputRef={inputA}
            onChange={v => dispatch({ type: "ORBIT_NAME", key: "nameA", value: v })} />
          <NameField color="var(--alignment)" label="OPTION B" placeholder="Start the studio" value={nameB}
            onChange={v => dispatch({ type: "ORBIT_NAME", key: "nameB", value: v })} />
        </div>

        <div className="page-actions">
          <span className="eyebrow-lg">{ready ? "ready" : "name both"}</span>
          <button className="cta" disabled={!ready} onClick={() => ready && dispatch({ type: "GO", screen: "orbits/build" })}>
            Begin <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NameField({ color, label, value, onChange, inputRef, placeholder }) {
  return (
    <label style={{
      display: "grid", gridTemplateColumns: "12px 1fr", gap: 16, alignItems: "center",
      padding: "18px 20px",
      border: "0.5px solid var(--border-active)",
      borderRadius: "var(--r-md)",
      background: "var(--bg-1)",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <div>
        <div className="eyebrow-lg" style={{ marginBottom: 4, fontSize: 10 }}>{label}</div>
        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", border: 0, background: "transparent",
            fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22,
            color: "var(--text-1)", outline: "none", letterSpacing: "-0.008em",
          }}
        />
      </div>
    </label>
  );
}

function ScreenOrbitsBuild({ state, dispatch }) {
  const o = state.orbits;
  const [side, setSide] = useStateB("A");
  const which = side === "A"
    ? { name: o.nameA, gives: "aGives", costs: "aCosts", says: "aSays", color: "var(--pull)" }
    : { name: o.nameB, gives: "bGives", costs: "bCosts", says: "bSays", color: "var(--alignment)" };
  const total = o.aGives.length + o.aCosts.length + o.aSays.length + o.bGives.length + o.bCosts.length + o.bSays.length;

  return (
    <div className="page page-fade" data-screen-label="Orbits · Build">
      <div className="page-inner">
        <h2 className="prompt-lg" style={{ marginBottom: 22 }}>What does each one give, cost, say about you?</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          {["A", "B"].map(letter => {
            const isOn = side === letter;
            const c = letter === "A" ? "var(--pull)" : "var(--alignment)";
            const name = letter === "A" ? o.nameA : o.nameB;
            return (
              <button key={letter} onClick={() => setSide(letter)} style={{
                padding: "16px 22px", textAlign: "left",
                border: "0.5px solid " + (isOn ? "var(--border-strong)" : "var(--border-active)"),
                background: isOn ? "var(--bg-2)" : "var(--bg-1)",
                borderRadius: "var(--r-md)",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                  <span className="eyebrow-lg" style={{ color: "var(--text-3)", fontSize: 10 }}>OPTION {letter}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--text-1)", letterSpacing: "-0.008em" }}>{name || "—"}</div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          <AttrGroup title="gives" color={which.color} pool={ORBIT_ATTRS.gives}
            picked={o[which.gives]} onToggle={(v) => dispatch({ type: "ORBIT_TOGGLE", key: which.gives, val: v })} />
          <AttrGroup title="costs" color={which.color} pool={ORBIT_ATTRS.costs}
            picked={o[which.costs]} onToggle={(v) => dispatch({ type: "ORBIT_TOGGLE", key: which.costs, val: v })} />
          <AttrGroup title="says about who I am" color={which.color} pool={ORBIT_ATTRS.says}
            picked={o[which.says]} onToggle={(v) => dispatch({ type: "ORBIT_TOGGLE", key: which.says, val: v })} />
        </div>

        <div className="page-actions">
          <span className="eyebrow-lg">{total === 0 ? "tap what's true for each" : `${total} placed`}</span>
          <button className="cta" disabled={total < 4} onClick={() => total >= 4 && dispatch({ type: "GO", screen: "orbits/align" })}>
            Align <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AttrGroup({ title, color, pool, picked, onToggle }) {
  return (
    <div>
      <div className="section-eyebrow">{title}</div>
      <div className="chip-rail">
        {pool.map(p => {
          const on = picked.includes(p);
          return (
            <button key={p} className="chip" onClick={() => onToggle(p)} style={{
              borderColor: on ? color : undefined,
              background: on ? `color-mix(in srgb, ${color} 16%, var(--bg-1))` : undefined,
            }}>
              <span className="dot" style={on ? { background: color } : {}} />{p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScreenOrbitsAlign({ state, dispatch }) {
  const align = state.orbits.align;
  const onDrag = (e, track) => {
    const t = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - t.left) / t.width));
    dispatch({ type: "ORBIT_ALIGN", val: x });
  };
  const onPointerDown = (e) => {
    const track = e.currentTarget;
    onDrag(e, track);
    const move = (ev) => onDrag(ev, track);
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const label = align > 0.7 ? "false conflict" : align > 0.4 ? "sequentially possible" : "genuine conflict";
  const lc = align > 0.7 ? "var(--clarity)" : align > 0.4 ? "var(--alignment)" : "var(--conflict)";

  return (
    <div className="page page-fade" data-screen-label="Orbits · Align">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="prompt-lg">Drag them closer. Or further.</h2>
          <span className="eyebrow-lg" style={{ color: lc }}>● {label}</span>
        </div>

        <div className="puzzle-shape" style={{ margin: "24px 0 8px", minHeight: 360 }}>
          <Orbits size={400} alignment={align}
            nameA={state.orbits.nameA || "A"} nameB={state.orbits.nameB || "B"}
            rotation={28} />
        </div>

        <div onPointerDown={onPointerDown} style={{ maxWidth: 700, margin: "8px auto 0", width: "100%", padding: "18px 0", cursor: "pointer" }}>
          <div style={{ position: "relative", height: 34 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 16, height: 2, background: "var(--bg-2)", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 0, top: 16, width: `${align * 100}%`, height: 2, background: lc, borderRadius: 2 }} />
            <div style={{
              position: "absolute", left: `calc(${align * 100}% - 10px)`, top: 7,
              width: 20, height: 20, borderRadius: "50%", background: "var(--text-1)",
              boxShadow: `0 0 0 5px color-mix(in srgb, ${lc} 18%, transparent)`
            }} />
            <span className="eyebrow-lg" style={{ position: "absolute", left: 0, top: 26, fontSize: 10 }}>incompatible</span>
            <span className="eyebrow-lg" style={{ position: "absolute", right: 0, top: 26, fontSize: 10 }}>compatible</span>
          </div>
        </div>

        <div className="page-actions">
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "orbits/build" })}>← Back to attributes</button>
          <button className="cta" onClick={() => dispatch({ type: "GO", screen: "result" })}>See the question <span>→</span></button>
        </div>
      </div>
    </div>
  );
}

/* ───────── MIRROR ───────── */
function ScreenMirrorRank({ state, dispatch }) {
  const ranked = state.mirror.conscious;
  const ready = ranked.length >= 6;
  const unranked = VALUES_18.filter(v => !ranked.includes(v.id));

  return (
    <div className="page page-fade" data-screen-label="Mirror · Rank">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="prompt-lg">Pick your six. In order.</h2>
          <span className="eyebrow-lg">conscious column</span>
        </div>

        <div className="mirror-layout" style={{ marginTop: 22, gridTemplateColumns: "1fr 1fr" }}>
          <div className="mirror-col">
            <div className="mirror-col-head">YOUR SIX</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const id = ranked[i];
                const v = id ? VALUES_18.find(x => x.id === id) : null;
                return (
                  <button
                    key={i}
                    onClick={() => v && dispatch({ type: "MIRROR_RANK_TOGGLE", id: v.id })}
                    style={{
                      display: "grid", gridTemplateColumns: "28px 1fr 28px", alignItems: "center",
                      padding: "14px 16px",
                      border: "0.5px solid " + (v ? "var(--border-active)" : "var(--border-subtle)"),
                      borderRadius: "var(--r-md)",
                      background: v ? "var(--bg-1)" : "transparent",
                      textAlign: "left",
                      borderStyle: v ? "solid" : "dashed",
                      cursor: v ? "pointer" : "default",
                    }}
                  >
                    <span className="eyebrow-lg" style={{ fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: v ? "var(--text-1)" : "var(--text-3)", letterSpacing: "-0.005em" }}>
                      {v ? v.label : "—"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{v ? "✕" : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mirror-col">
            <div className="mirror-col-head">UNRANKED</div>
            <div className="chip-rail">
              {unranked.map(v => (
                <button key={v.id} className="chip"
                  onClick={() => dispatch({ type: "MIRROR_RANK_TOGGLE", id: v.id })}
                  disabled={ranked.length >= 6}
                  style={ranked.length >= 6 ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                >{v.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="page-actions">
          <span className="eyebrow-lg">{ranked.length === 0 ? "tap to add" : ready ? "ready" : `${6 - ranked.length} more`}</span>
          <button className="cta" disabled={!ready} onClick={() => ready && dispatch({ type: "GO", screen: "mirror/instinct" })}>
            Now the instinct round <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenMirrorInstinct({ state, dispatch }) {
  const i = state.mirror.pairIdx;
  const total = state.mirror.pairs.length;
  const done = i >= total;
  const pair = !done ? state.mirror.pairs[i] : null;
  const [, setTick] = useStateB(0);
  const startedAt = useRefB(Date.now());

  useEffectB(() => {
    if (done) {
      const t = setTimeout(() => dispatch({ type: "GO", screen: "mirror/reveal" }), 900);
      return () => clearTimeout(t);
    }
    startedAt.current = Date.now();
    const interval = setInterval(() => setTick(t => t + 1), 60);
    const timeout = setTimeout(() => {
      if (pair) dispatch({ type: "MIRROR_PICK", id: pair[0] });
    }, 2200);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [i, done]);

  if (done) {
    return (
      <div className="page page-fade" data-screen-label="Mirror · Computing">
        <div className="page-inner" style={{ display: "grid", placeItems: "center" }}>
          <span className="eyebrow-lg">reading the reflection…</span>
        </div>
      </div>
    );
  }

  const pct = Math.min(1, (Date.now() - startedAt.current) / 2000);
  const A = VALUES_18.find(v => v.id === pair[0]);
  const B = VALUES_18.find(v => v.id === pair[1]);
  const onPick = (id) => dispatch({ type: "MIRROR_PICK", id });

  return (
    <div className="page page-fade" data-screen-label="Mirror · Instinct">
      <div className="page-inner" style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 32 }}>
        {/* progress bar only — no n/15 */}
        <div style={{ maxWidth: 540, margin: "0 auto", width: "100%", height: 2, background: "var(--bg-2)", borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct * 100}%`, background: "var(--alignment)", borderRadius: 2, transition: "width .06s linear" }} />
        </div>

        <div style={{ display: "grid", gridTemplateRows: "1fr auto 1fr", gap: 18, alignSelf: "center", width: "100%", maxWidth: 760, margin: "0 auto" }}>
          <PickButton letter="A" label={A.label} color="var(--pull)" onClick={() => onPick(A.id)} />
          <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 11, letterSpacing: "0.3em" }}>OR</div>
          <PickButton letter="B" label={B.label} color="var(--alignment)" onClick={() => onPick(B.id)} />
        </div>

        <div style={{ textAlign: "center" }}>
          <span className="eyebrow-lg">don't think · tap what feels true now</span>
        </div>
      </div>
    </div>
  );
}

function PickButton({ letter, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "32px 1fr", alignItems: "center", gap: 18,
      padding: "40px 36px",
      border: "0.5px solid var(--border-active)",
      borderRadius: "var(--r-lg)",
      background: "var(--bg-1)",
      textAlign: "left", width: "100%", cursor: "pointer",
      transition: "background .15s, border-color .15s",
    }}>
      <span className="eyebrow-lg" style={{ color: "var(--text-3)" }}>{letter}</span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 44, color: "var(--text-1)", letterSpacing: "-0.018em" }}>{label}</span>
    </button>
  );
}

function ScreenMirrorReveal({ state, dispatch }) {
  const conscious = state.mirror.conscious.map(id => VALUES_18.find(v => v.id === id));
  const revealed = state.mirror.revealed.map(id => VALUES_18.find(v => v.id === id));

  const rC = Object.fromEntries(state.mirror.conscious.map((id, i) => [id, i]));
  const rR = Object.fromEntries(state.mirror.revealed.map((id, i) => [id, i]));
  let biggest = null;
  for (const id of state.mirror.conscious) {
    const c = rC[id], r = rR[id];
    if (r === undefined) continue;
    const diff = Math.abs(c - r);
    if (!biggest || diff > biggest.diff) biggest = { id, diff, c, r };
  }
  const v = biggest ? VALUES_18.find(x => x.id === biggest.id) : null;
  const dir = biggest ? (biggest.r > biggest.c ? "lower" : biggest.r < biggest.c ? "higher" : "match") : "match";
  const dirColor = dir === "match" ? "var(--clarity)" : dir === "lower" ? "var(--fear)" : "var(--alignment)";
  const dirCopy = dir === "match" ? "matches itself across both columns"
    : dir === "higher" ? `but it ranks higher in instinct (#${biggest.c + 1} → #${biggest.r + 1})`
      : `but you choose it less than you say (#${biggest.c + 1} → #${biggest.r + 1})`;

  return (
    <div className="page page-fade" data-screen-label="Mirror · Reveal">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="prompt-lg">What you say. What you choose.</h2>
          <span className="eyebrow-lg" style={{ color: dirColor }}>● biggest gap</span>
        </div>

        <div className="puzzle-shape" style={{ margin: "20px 0 8px", minHeight: 380 }}>
          <MirrorFrame width={480} height={380} conscious={conscious} revealed={revealed} />
        </div>

        <div style={{
          padding: "20px 22px",
          border: "0.5px solid var(--border-active)",
          borderRadius: "var(--r-lg)",
          background: "var(--bg-1)",
          maxWidth: 760, margin: "0 auto", width: "100%",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.28, margin: 0, color: "var(--text-1)", textWrap: "balance" }}>
            You name <em style={{ fontStyle: "normal", color: dirColor }}>{v ? v.label : "—"}</em> — {dirCopy}.
          </p>
        </div>

        <div className="page-actions">
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "mirror/rank" })}>← Re-rank</button>
          <button className="cta" onClick={() => dispatch({ type: "GO", screen: "result" })}>See the question <span>→</span></button>
        </div>
      </div>
    </div>
  );
}

/* ───────── RESULT ───────── */
function ScreenResult({ state, dispatch }) {
  const q = window.__CLARITY.closingQuestion(state);
  const tag = state.puzzle === "cube" ? "OPPORTUNITY"
    : state.puzzle === "onion" ? "EXIT"
      : state.puzzle === "orbits" ? "CONFLICT"
        : "VALUES";
  const opposites = computeOpposites(state);
  const accentColor = opposites.themeColor;

  const save = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      puzzle: state.puzzle,
      type: tag,
      color: accentColor,
      question: q,
      tag: opposites.tag,
    };
    dispatch({ type: "SAVE_RESULT", entry });
    dispatch({ type: "RESET" });
  };

  return (
    <div className="result-page page-fade" data-screen-label="Result">
      {/* hero */}
      <div className="result-shape">
        <ResultShape state={state} color={accentColor} />
      </div>

      {/* the question — center stage */}
      <div style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
        <span className="eyebrow-lg" style={{ color: accentColor, marginBottom: 18 }}>● {tag} · {opposites.label}</span>
        <h1 className="result-question">{q}</h1>

        {/* calibration lenses */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 28, maxWidth: 720 }}>
          {window.__CLARITY.lensLabels(state.intake).map((label, i) => (
            <span key={i} style={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "5px 10px", border: "0.5px solid var(--border-subtle)",
              borderRadius: 999, color: "var(--text-3)", fontFamily: "var(--font-body)",
            }}>{label}</span>
          ))}
        </div>

        <div style={{ marginTop: 32, maxWidth: 880, width: "100%" }}>
          <div className="opp-row">
            <div className="opp-quote" style={{ "--qc": opposites.aColor }}>
              <span className="lbl">{opposites.aLabel}</span>
              <p className="body">{opposites.aText}</p>
            </div>
            <span className="vs">BUT</span>
            <div className="opp-quote" style={{ "--qc": opposites.bColor }}>
              <span className="lbl">{opposites.bLabel}</span>
              <p className="body">{opposites.bText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <button className="cta ghost sm" onClick={() => dispatch({ type: "RESET" })}>Start over</button>
        <button className="cta" onClick={save}>Save & sit with it</button>
      </div>
    </div>
  );
}

function ResultShape({ state, color }) {
  if (state.puzzle === "cube") return <Pyramid size={280} tint={color} subtle="var(--conflict)" />;
  if (state.puzzle === "onion") {
    const intensities = state.onion.layers.map(l => Math.min(0.95, 0.15 + l.length * 0.18));
    return <Onion size={260} active={5} intensities={intensities} crossSection />;
  }
  if (state.puzzle === "orbits") return <Orbits size={280} alignment={state.orbits.align} nameA={state.orbits.nameA} nameB={state.orbits.nameB} />;
  if (state.puzzle === "mirror") {
    const C = state.mirror.conscious.map(id => VALUES_18.find(v => v.id === id));
    const R = state.mirror.revealed.map(id => VALUES_18.find(v => v.id === id));
    return <MirrorFrame width={340} height={260} conscious={C} revealed={R} />;
  }
  return null;
}

function computeOpposites(state) {
  if (state.puzzle === "cube") {
    const s = window.__CLARITY.cubeSummary(state);
    const pulls = s.placed.filter(c => c.side === "pull").slice(0, 2).map(c => c.label);
    const fears = s.placed.filter(c => c.side === "fear").slice(0, 2).map(c => c.label);
    return {
      label: s.dominant === "pull" ? "PULL-DOMINANT" : s.dominant === "fear" ? "FEAR-DOMINANT" : "EVENLY MATCHED",
      themeColor: s.tint,
      tag: `${s.placed.length} placed · ${s.pull} pull, ${s.fear} fear`,
      aColor: "var(--pull)", aLabel: "WHAT PULLS",
      aText: pulls.length ? `"${pulls.join(". ")}."` : "—",
      bColor: "var(--fear)", bLabel: "WHAT HOLDS BACK",
      bText: fears.length ? `"${fears.join(". ")}."` : "—",
    };
  }
  if (state.puzzle === "onion") {
    const layers = state.onion.layers;
    const intens = layers.map(l => l.length);
    const dom = intens.indexOf(Math.max(...intens));
    const inner = ONION_RINGS[Math.max(0, Math.min(4, dom))];
    const surface = ONION_CHIPS.filter(c => c.layer === 0 && layers[0].includes(c.id)).slice(0, 2).map(c => c.label);
    const core = ONION_CHIPS.filter(c => c.layer === dom && layers[dom].includes(c.id)).slice(0, 2).map(c => c.label);
    return {
      label: `${inner.label.toUpperCase()} HEAVIEST`,
      themeColor: inner.color,
      tag: `${intens.reduce((a, b) => a + b, 0)} placed across 5 layers`,
      aColor: "var(--neutral)", aLabel: "ON THE SURFACE",
      aText: surface.length ? `"${surface.join(". ")}."` : "—",
      bColor: inner.color, bLabel: inner.label.toUpperCase(),
      bText: core.length ? `"${core.join(". ")}."` : "—",
    };
  }
  if (state.puzzle === "orbits") {
    const a = state.orbits.align;
    const label = a > 0.7 ? "FALSE CONFLICT" : a > 0.4 ? "SEQUENTIALLY POSSIBLE" : "GENUINE CONFLICT";
    const color = a > 0.7 ? "var(--clarity)" : a > 0.4 ? "var(--alignment)" : "var(--conflict)";
    const aGives = state.orbits.aGives.slice(0, 2).join(", ");
    const bCosts = state.orbits.bCosts.slice(0, 2).join(", ");
    return {
      label, themeColor: color,
      tag: `${state.orbits.nameA} vs. ${state.orbits.nameB}`,
      aColor: "var(--pull)", aLabel: (state.orbits.nameA || "A").toUpperCase(),
      aText: aGives ? `"Gives me ${aGives}."` : "—",
      bColor: "var(--alignment)", bLabel: (state.orbits.nameB || "B").toUpperCase(),
      bText: bCosts ? `"Costs me ${bCosts}."` : "—",
    };
  }
  if (state.puzzle === "mirror") {
    const C = state.mirror.conscious, R = state.mirror.revealed;
    const top = C[0] && VALUES_18.find(v => v.id === C[0]);
    const choose = R[0] && VALUES_18.find(v => v.id === R[0]);
    return {
      label: "BIGGEST GAP",
      themeColor: "var(--alignment)",
      tag: `${C.length} ranked · ${R.length} revealed`,
      aColor: "var(--pull)", aLabel: "YOU SAY",
      aText: top ? `"${top.label} matters most."` : "—",
      bColor: "var(--alignment)", bLabel: "YOU CHOOSE",
      bText: choose ? `"${choose.label}."` : "—",
    };
  }
  return { label: "", themeColor: "var(--text-1)", tag: "", aColor: "#fff", aLabel: "", aText: "", bColor: "#fff", bLabel: "", bText: "" };
}

/* ───────── HISTORY ───────── */
function ScreenHistory({ state, dispatch }) {
  return (
    <div className="page page-fade" data-screen-label="History">
      <div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <div>
            <h2 className="prompt-lg">{state.history.length} {state.history.length === 1 ? "session" : "sessions"}</h2>
            <span className="eyebrow-lg">on this device only</span>
          </div>
          <button className="cta ghost sm" onClick={() => dispatch({ type: "GO", screen: "entry" })}>← Back</button>
        </div>

        {state.history.length === 0 ? (
          <div style={{
            padding: "56px 24px", textAlign: "center", color: "var(--text-3)",
            border: "0.5px dashed var(--border-soft)", borderRadius: "var(--r-md)",
            fontSize: 14, lineHeight: 1.5, maxWidth: 600, margin: "48px auto",
          }}>
            No saved sessions yet.<br />Finish a puzzle and tap <em style={{ color: "var(--text-2)", fontStyle: "normal" }}>Save & sit with it</em>.
          </div>
        ) : (
          <div className="history-grid">
            {state.history.map((h) => (
              <div key={h.id} className="history-card">
                <span className="history-card-strip" style={{ background: h.color }} />
                <div className="history-card-body">
                  <div className="history-card-meta">
                    <span>{h.puzzle} · {h.type}</span>
                    <span>{h.date}</span>
                  </div>
                  <p className="history-card-q">{h.question}</p>
                  <div className="history-card-tag">
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: h.color, marginRight: 8, verticalAlign: "middle" }} />
                    {h.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenOnionBuild, ScreenOnionCross,
  ScreenOrbitsName, ScreenOrbitsBuild, ScreenOrbitsAlign,
  ScreenMirrorRank, ScreenMirrorInstinct, ScreenMirrorReveal,
  ScreenResult, ScreenHistory,
});
