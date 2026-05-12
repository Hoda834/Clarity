/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor */
const { useState, useEffect, useMemo } = React;

const SCREENS = [
  { section: "INTAKE",   id: "01-entry",       label: "Entry",                meta: "5 cards",    render: (t) => <EntryScreen density={t.chipDensity} /> },
  { section: "INTAKE",   id: "02-q1",          label: "Routing Q1",           meta: "Timeframe",  render: () => <RoutingQ index={0} /> },
  { section: "INTAKE",   id: "03-q2",          label: "Routing Q2",           meta: "Feeling",    render: () => <RoutingQ index={1} /> },
  { section: "INTAKE",   id: "04-q3",          label: "Routing Q3",           meta: "Others",     render: () => <RoutingQ index={2} /> },
  { section: "INTAKE",   id: "05-q4",          label: "Routing Q4",           meta: "Stakes",     render: () => <RoutingQ index={3} /> },
  { section: "INTAKE",   id: "06-transition",  label: "Transition",           meta: "3.0s",       render: (t) => <TransitionScreen shape={t.transitionShape} /> },

  { section: "CUBE — opportunity",     id: "07-cube-sphere",   label: "Phase 1 · Sphere",  meta: "place",   render: (t) => <CubeSpherePhase density={t.chipDensity} /> },
  { section: "CUBE — opportunity",     id: "08-cube-faces",    label: "Phase 2 · Cube",    meta: "sort",    render: () => <CubeFacesPhase /> },
  { section: "CUBE — opportunity",     id: "09-cube-pyramid",  label: "Phase 3 · Pyramid", meta: "compress",render: () => <CubePyramidPhase /> },

  { section: "ONION — exit",           id: "10-onion-build",   label: "Phase 1 · Build",   meta: "layers",  render: () => <OnionBuildPhase /> },
  { section: "ONION — exit",           id: "11-onion-cross",   label: "Phase 2 · Cross-section", meta:"read",render: () => <OnionCrossSectionPhase /> },

  { section: "ORBITS — conflict",      id: "12-orbits-name",   label: "Phase 1 · Name",    meta: "2 inputs",render: () => <OrbitsNamePhase /> },
  { section: "ORBITS — conflict",      id: "13-orbits-align",  label: "Phase 2 · Align",   meta: "slider",  render: () => <OrbitsAlignPhase /> },

  { section: "MIRROR — values",        id: "14-mirror-order",  label: "Phase 1 · Order",   meta: "drag",    render: () => <MirrorDragPhase /> },
  { section: "MIRROR — values",        id: "15-mirror-micro",  label: "Phase 2 · Instinct",meta: "2.0s/pair",render: () => <MirrorMicroPhase /> },
  { section: "MIRROR — values",        id: "16-mirror-reveal", label: "Phase 3 · Reveal",  meta: "gap",     render: () => <MirrorRevealPhase /> },

  { section: "OUTPUT",                 id: "17-result",        label: "Result",            meta: "the question", render: (t) => <ResultScreen resultPanel={t.resultPanel} /> },
  { section: "OUTPUT",                 id: "18-history",       label: "History",           meta: "5 items", render: () => <HistoryScreen /> },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "instrument",
  "mode": "dark",
  "chipDensity": "standard",
  "resultPanel": "sheet",
  "promptWeight": "500",
  "transitionShape": "cube"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screenId, setScreenId] = useState(() => {
    const fromHash = (location.hash || "").replace(/^#/, "");
    return SCREENS.find(s => s.id === fromHash)?.id || "01-entry";
  });

  useEffect(() => { location.hash = screenId; }, [screenId]);

  // group screens by section
  const grouped = useMemo(() => {
    const g = {};
    for (const s of SCREENS) (g[s.section] ||= []).push(s);
    return g;
  }, []);

  const current = SCREENS.find(s => s.id === screenId) || SCREENS[0];

  // attach direction & mode to root
  useEffect(() => {
    document.documentElement.dataset.direction = t.direction;
    document.documentElement.dataset.mode = t.mode;
    document.documentElement.style.setProperty("--prompt-weight", t.promptWeight);
  }, [t.direction, t.mode, t.promptWeight]);

  // sync transitionShape to selected puzzle for Transition screen
  useEffect(() => {
    if (screenId.startsWith("07")||screenId.startsWith("08")||screenId.startsWith("09")) setTweak("transitionShape","cube");
    else if (screenId.startsWith("10")||screenId.startsWith("11")) setTweak("transitionShape","onion");
    else if (screenId.startsWith("12")||screenId.startsWith("13")) setTweak("transitionShape","orbits");
    else if (screenId.startsWith("14")||screenId.startsWith("15")||screenId.startsWith("16")) setTweak("transitionShape","mirror");
  }, [screenId]);

  return (
    <div className="app">
      {/* RAIL */}
      <aside className="rail">
        <div className="rail-brand">
          <div className="mark"/>
          <div className="word">Clarity</div>
          <div className="ver">v0.1</div>
        </div>

        {Object.entries(grouped).map(([section, items]) => (
          <div key={section}>
            <div className="rail-section">{section}</div>
            <ul>
              {items.map((s) => (
                <li key={s.id}>
                  <button
                    className={s.id === screenId ? "is-active" : ""}
                    onClick={() => setScreenId(s.id)}
                  >
                    <span className="num">{s.id.slice(0,2)}</span>
                    <span>{s.label}</span>
                    <span className="meta">{s.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{padding: "16px 24px", borderTop: "0.5px solid rgba(255,255,255,0.06)", marginTop: 14}}>
          <div className="eyebrow" style={{marginBottom: 6}}>NEXT</div>
          <p style={{fontSize: 11.5, color:"var(--text-3)", margin:0, lineHeight: 1.5}}>
            Toggle <em style={{color:"var(--text-2)", fontStyle:"normal"}}>Tweaks</em> in the toolbar to compare Instrument vs Ritual, mode, and result-panel variants.
          </p>
        </div>
      </aside>

      {/* CANVAS */}
      <main className="stage">
        <div className="canvas-meta">
          <div className="crumbs">
            <span>{current.section.replace(/ — .+/,"")}</span>
            <span className="sep">/</span>
            <em>{current.label}</em>
          </div>
          <div className="crumbs">
            <span>{t.direction === "instrument" ? "INSTRUMENT" : "RITUAL"}</span>
            <span className="sep">/</span>
            <span>{t.mode.toUpperCase()}</span>
            <span className="sep">/</span>
            <span>390 × 844</span>
          </div>
        </div>

        <div className="phone">
          <div className="notch"/>
          {current.render(t)}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Design language" />
        <TweakRadio
          label="Direction"
          value={t.direction}
          onChange={(v) => setTweak("direction", v)}
          options={[
            { value: "instrument", label: "Instrument" },
            { value: "ritual",     label: "Ritual" },
          ]}
        />
        <TweakRadio
          label="Mode"
          value={t.mode}
          onChange={(v) => setTweak("mode", v)}
          options={[
            { value: "dark",  label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />

        <TweakSection label="Density & weight" />
        <TweakRadio
          label="Chip density"
          value={t.chipDensity}
          onChange={(v) => setTweak("chipDensity", v)}
          options={[
            { value: "standard", label: "Standard" },
            { value: "compact",  label: "Compact" },
          ]}
        />
        <TweakRadio
          label="Prompt weight"
          value={t.promptWeight}
          onChange={(v) => setTweak("promptWeight", v)}
          options={[
            { value: "400", label: "Syne 400" },
            { value: "500", label: "Syne 500" },
          ]}
        />

        <TweakSection label="Result panel" />
        <TweakRadio
          label="Style"
          value={t.resultPanel}
          onChange={(v) => setTweak("resultPanel", v)}
          options={[
            { value: "sheet",    label: "Slide-up" },
            { value: "takeover", label: "Takeover" },
          ]}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
