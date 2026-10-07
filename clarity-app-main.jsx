/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, WorldRenderer */

const { useReducer: useReducerM, useEffect: useEffectM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "instrument",
  "mode": "dark",
  "chipDensity": "standard",
  "resultPanel": "sheet",
  "promptWeight": "500"
}/*EDITMODE-END*/;

function AppRoot() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, dispatch] = useReducerM(reducer, INITIAL);

  useEffectM(() => {
    document.documentElement.dataset.direction = t.direction;
    document.documentElement.dataset.mode = t.mode;
    document.documentElement.style.setProperty("--prompt-weight", t.promptWeight);
  }, [t.direction, t.mode, t.promptWeight]);

  const tint = state.puzzle && /^(cube|onion|orbits|mirror)/.test(state.screen)
    ? state.puzzle
    : "";

  const showRestart = state.screen !== "entry";
  const worldLabel = state.journey && state.journey.currentWorld && window.ClarityWorlds
    ? window.ClarityWorlds.defs[state.journey.currentWorld]?.label
    : null;

  return (
    <div className="stagepage" data-tint={tint}>
      <header className="topbar">
        <div className="brand" onClick={() => dispatch({ type: "RESET" })}>
          <span className="mark" />
          <span className="word">Clarity</span>
        </div>

        <div className="topbar-right">
          {worldLabel && <span className="link dim" style={{ cursor: "default" }}>{worldLabel}</span>}
          {showRestart && (
            <button className="link" onClick={() => dispatch({ type: "RESET" })}>
              ↩ Start over
            </button>
          )}
        </div>
      </header>

      <main>
        <Router state={state} dispatch={dispatch} t={t} />
      </main>

      <footer className="footnote">
        <span>Your answers exist only in this open session</span>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Design language" />
        <TweakRadio
          label="Direction"
          value={t.direction}
          onChange={(v) => setTweak("direction", v)}
          options={[
            { value: "instrument", label: "Instrument" },
            { value: "ritual", label: "Ritual" },
          ]}
        />
        <TweakRadio
          label="Mode"
          value={t.mode}
          onChange={(v) => setTweak("mode", v)}
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />

        <TweakSection label="Detail" />
        <TweakRadio
          label="Chip density"
          value={t.chipDensity}
          onChange={(v) => setTweak("chipDensity", v)}
          options={[
            { value: "standard", label: "Standard" },
            { value: "compact", label: "Compact" },
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
            { value: "sheet", label: "Slide-up" },
            { value: "takeover", label: "Takeover" },
          ]}
        />
      </TweaksPanel>

      <style>{`
        @keyframes emerge {
          0% { opacity:0; transform:scale(.85); }
          60% { opacity:.85; }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes breathe {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.015); }
        }
      `}</style>
    </div>
  );
}

function Router({ state, dispatch, t }) {
  const s = state.screen;

  if (s === "entry") return <ScreenEntry dispatch={dispatch} />;
  if (s === "q1") return <ScreenQuestion idx={0} state={state} dispatch={dispatch} />;
  if (s === "q2") return <ScreenQuestion idx={1} state={state} dispatch={dispatch} />;
  if (s === "q3") return <ScreenQuestion idx={2} state={state} dispatch={dispatch} />;
  if (s === "q4") return <ScreenQuestion idx={3} state={state} dispatch={dispatch} />;
  if (s === "transition") return <ScreenTransition state={state} dispatch={dispatch} />;
  if (s === "world/intro") return <WorldRenderer state={state} dispatch={dispatch} />;

  if (s === "cube/sphere") return <ScreenCubeSphere state={state} dispatch={dispatch} density={t.chipDensity} />;
  if (s === "cube/faces") return <ScreenCubeFaces state={state} dispatch={dispatch} />;
  if (s === "cube/pyramid") return <ScreenCubePyramid state={state} dispatch={dispatch} />;

  if (s === "onion/build") return <ScreenOnionBuild state={state} dispatch={dispatch} />;
  if (s === "onion/cross") return <ScreenOnionCross state={state} dispatch={dispatch} />;

  if (s === "orbits/name") return <ScreenOrbitsName state={state} dispatch={dispatch} />;
  if (s === "orbits/build") return <ScreenOrbitsBuild state={state} dispatch={dispatch} />;
  if (s === "orbits/align") return <ScreenOrbitsAlign state={state} dispatch={dispatch} />;

  if (s === "mirror/rank") return <ScreenMirrorRank state={state} dispatch={dispatch} />;
  if (s === "mirror/instinct") return <ScreenMirrorInstinct state={state} dispatch={dispatch} />;
  if (s === "mirror/reveal") return <ScreenMirrorReveal state={state} dispatch={dispatch} />;

  if (s === "result") return <ScreenResult state={state} dispatch={dispatch} resultPanel={t.resultPanel} />;

  return <div style={{ padding: 24, color: "var(--text-3)" }}>unknown screen: {s}</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppRoot />);
