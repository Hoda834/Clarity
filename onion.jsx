/* global React */
// Onion puzzle — exit decisions. 5 concentric rings.
// Demo context: "should I leave this relationship?"

const RING_CHIPS = {
  story:    ["He's just busy", "We're going through a phase", "Everyone's tired in their 30s"],
  feeling:  ["Lonely next to him", "Quietly bored", "Performing patience", "Resenting"],
  fear:     ["Being alone", "Being seen as the one who left", "Wasting the years"],
  core:     ["I'll choose this exact thing again"],
  possible: ["My own quiet", "Real wanting", "Not managing anymore"],
};

function OnionBuildPhase() {
  const active = 2; // we are working on "fear"
  const intensities = [0.4, 0.55, 0.7, 0.0, 0.0];

  return (
    <div className="phone-screen" data-screen-label="10 Onion · Build">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">EXIT · LAYER {active+1} OF 5</div>
            <h2 className="bare-h" style={{marginTop:6}}>{ONION_RINGS[active].label}</h2>
          </div>
          <div className="coord">peel inward</div>
        </div>

        <div className="shape-stage" style={{marginTop: 6, marginBottom: 6, minHeight: 260}}>
          <Onion size={252} active={active} intensities={intensities} />
          {/* layer labels */}
          <div style={{position:"absolute", top: 8, left: 0, right: 0, textAlign:"center"}}>
            <span className="coord">surface</span>
          </div>
          <div style={{position:"absolute", bottom: 8, left: 0, right: 0, textAlign:"center"}}>
            <span className="coord">core</span>
          </div>
        </div>

        {/* legend rings */}
        <div className="col gap-6" style={{marginBottom: 12}}>
          {ONION_RINGS.map((r, i) => {
            const state = i < active ? "done" : i === active ? "active" : "pending";
            return (
              <div key={r.id} style={{
                display:"grid", gridTemplateColumns:"14px 1fr auto", gap: 8, alignItems:"center",
                padding: "6px 10px",
                borderRadius: 8,
                border: "0.5px solid " + (state==="active" ? "var(--border-active)" : "var(--border-subtle)"),
                background: state==="active" ? "var(--bg-1)" : "transparent",
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius:"50%",
                  background: state==="done" ? r.color : "transparent",
                  border: "0.5px solid " + (state==="pending" ? "var(--border-soft)" : r.color),
                  opacity: state==="pending" ? 0.6 : 1
                }}/>
                <span style={{fontSize: 12.5, color: state==="pending" ? "var(--text-3)" : "var(--text-1)"}}>{r.label}</span>
                <span className="coord">{state==="done" ? "—" : state==="active" ? "in" : ""}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: "10px 12px",
          border: "0.5px solid var(--border-active)",
          borderRadius: "var(--r-md)", background: "var(--bg-1)"
        }}>
          <div className="eyebrow" style={{marginBottom: 8, color:"var(--conflict)"}}>WHAT I'M AFRAID OF · 3</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {RING_CHIPS.fear.map((t) => (
              <span key={t} className="chip" style={{borderColor:"rgba(199,125,255,0.4)"}}>
                <span className="dot" style={{background:"var(--conflict)"}}/>{t}
              </span>
            ))}
          </div>
        </div>

        <div className="nav-foot">
          <span className="count">layer 3 / 5</span>
          <button className="btn primary small">Go deeper →</button>
        </div>
      </div>
    </div>
  );
}

function OnionCrossSectionPhase() {
  return (
    <div className="phone-screen" data-screen-label="11 Onion · Cross-section">
      <StatusBar />
      <div className="screen">
        <div className="eyebrow">CROSS-SECTION</div>
        <h2 className="bare-h" style={{marginTop:6, marginBottom: 4}}>All five at once.</h2>
        <p className="muted" style={{fontSize: 12.5, margin: "0 0 8px"}}>Read from outside in. The thinner the ring, the less weight it's carrying.</p>

        <div className="shape-stage" style={{minHeight: 230}}>
          <Onion size={240} active={5} intensities={[0.30, 0.55, 0.75, 0.95, 0.60]} crossSection />
          {/* radial tick lines */}
          <div style={{
            position:"absolute", inset: 0, pointerEvents:"none",
            display:"grid", placeItems:"center"
          }}>
            <svg width="240" height="240" viewBox="0 0 240 240">
              {ONION_RINGS.map((r,i) => {
                const radius = (240/2 - 10) * (1 - i*0.18);
                const angle = (-Math.PI/4) + (i*0.18);
                const x = 120 + Math.cos(angle)*radius;
                const y = 120 + Math.sin(angle)*radius;
                return <line key={i} x1={x} y1={y} x2={x+20} y2={y-6} stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>;
              })}
            </svg>
          </div>
        </div>

        {/* layered legend with intensity bar */}
        <div className="col gap-6">
          {ONION_RINGS.map((r,i) => {
            const intens = [0.30, 0.55, 0.75, 0.95, 0.60][i];
            return (
              <div key={r.id} style={{display:"grid", gridTemplateColumns:"10px 1fr 60px 30px", gap: 8, alignItems:"center"}}>
                <span style={{width:6, height:6, borderRadius:"50%", background:r.color}}/>
                <span style={{fontSize: 12, color:"var(--text-1)"}}>{r.label}</span>
                <span style={{height: 4, borderRadius: 2, background: "var(--bg-2)", position:"relative"}}>
                  <i style={{position:"absolute", left:0, top:0, bottom:0, width: `${intens*100}%`, background: r.color, borderRadius:2}}/>
                </span>
                <span className="coord" style={{textAlign:"right"}}>{Math.round(intens*100)}</span>
              </div>
            );
          })}
        </div>

        <div className="nav-foot">
          <button className="btn ghost small">Re-open layer</button>
          <button className="btn primary small">See the question →</button>
        </div>
      </div>
    </div>
  );
}

window.OnionBuildPhase = OnionBuildPhase;
window.OnionCrossSectionPhase = OnionCrossSectionPhase;
