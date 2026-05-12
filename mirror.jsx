/* global React */
// Mirror puzzle — values decisions. 18 chips. Three phases.

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

const CONSCIOUS_ORDER = [
  "v06", "v13", "v03", "v04", "v02", "v07", "v01", "v05",
];
const REVEALED_ORDER = [
  "v01", "v04", "v07", "v13", "v06", "v05", "v03", "v02",
];

function MirrorDragPhase() {
  const ordered = CONSCIOUS_ORDER.slice(0, 6).map(id => VALUES_18.find(v=>v.id===id));
  const unordered = VALUES_18.filter(v => !CONSCIOUS_ORDER.slice(0,6).includes(v.id)).slice(0, 8);

  return (
    <div className="phone-screen" data-screen-label="14 Mirror · Order">
      <StatusBar />
      <div className="screen">
        <div className="eyebrow">VALUES · CONSCIOUS</div>
        <h2 className="bare-h" style={{marginTop:6, marginBottom:4}}>Drag what matters most to the top.</h2>
        <p className="muted" style={{fontSize:12.5, margin:"0 0 14px"}}>Six is enough. We'll surface the rest later.</p>

        {/* ordered column */}
        <div className="col gap-6">
          {ordered.map((v, i) => (
            <div key={v.id} style={{
              display:"grid", gridTemplateColumns:"22px 1fr 28px", alignItems:"center",
              padding:"10px 12px",
              border:"0.5px solid var(--border-active)",
              borderRadius: "var(--r-md)",
              background: "var(--bg-1)"
            }}>
              <span className="coord" style={{fontVariantNumeric:"tabular-nums"}}>{String(i+1).padStart(2,"0")}</span>
              <span style={{fontFamily:"var(--font-display)", fontSize:14, color:"var(--text-1)"}}>{v.label}</span>
              <span style={{display:"flex", flexDirection:"column", gap:2, opacity:0.4}}>
                <span style={{height:1, background:"var(--text-2)"}}/>
                <span style={{height:1, background:"var(--text-2)"}}/>
                <span style={{height:1, background:"var(--text-2)"}}/>
              </span>
            </div>
          ))}
        </div>

        {/* unordered chips */}
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: "0.5px dashed var(--border-subtle)"
        }}>
          <div className="eyebrow" style={{marginBottom: 8}}>UNRANKED · 12</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {unordered.map((v) => (
              <span key={v.id} className="chip">{v.label}</span>
            ))}
            <span className="chip" style={{borderStyle:"dashed", color:"var(--text-3)"}}>+ 4 more</span>
          </div>
        </div>

        <div className="nav-foot">
          <span className="count">6 / 6 ranked</span>
          <button className="btn primary small">Now the instinct round →</button>
        </div>
      </div>
    </div>
  );
}

function MirrorMicroPhase() {
  // 2-second pair tap
  return (
    <div className="phone-screen" data-screen-label="15 Mirror · Instinct">
      <StatusBar />
      <div className="screen" style={{justifyContent:"space-between"}}>
        <div>
          <div className="row" style={{justifyContent:"space-between", alignItems:"baseline"}}>
            <div className="eyebrow">INSTINCT · 7 / 15</div>
            <div className="coord">2.0s</div>
          </div>
          {/* progress bar */}
          <div style={{height: 2, background: "var(--bg-2)", borderRadius: 2, marginTop: 8, position:"relative"}}>
            <div style={{position:"absolute", left:0, top:0, bottom:0, width: "46%", background:"var(--alignment)", borderRadius: 2}}/>
          </div>
        </div>

        <div style={{display:"grid", gridTemplateRows:"1fr auto 1fr", gap: 14, padding:"40px 0"}}>
          <button style={pickStyle("var(--pull)")}>
            <span className="eyebrow" style={{color:"var(--text-3)"}}>A</span>
            <span style={{fontFamily:"var(--font-display)", fontWeight:500, fontSize: 32, color:"var(--text-1)", letterSpacing:"-0.01em"}}>Freedom</span>
          </button>
          <div style={{textAlign:"center", color:"var(--text-3)", fontSize:10, letterSpacing:"0.3em"}}>OR</div>
          <button style={pickStyle("var(--alignment)")}>
            <span className="eyebrow" style={{color:"var(--text-3)"}}>B</span>
            <span style={{fontFamily:"var(--font-display)", fontWeight:500, fontSize: 32, color:"var(--text-1)", letterSpacing:"-0.01em"}}>Stability</span>
          </button>
        </div>

        <div style={{textAlign:"center"}}>
          <span className="dim" style={{fontSize:11, letterSpacing:"0.08em"}}>Don't think. Tap what feels true now.</span>
        </div>
      </div>
    </div>
  );
}

function pickStyle(color) {
  return {
    display: "grid", gridTemplateColumns:"24px 1fr", alignItems:"center", gap: 14,
    padding: "26px 22px",
    border: "0.5px solid var(--border-active)",
    borderRadius: "var(--r-lg)",
    background: "var(--bg-1)",
    textAlign: "left",
    width: "100%",
  };
}

function MirrorRevealPhase() {
  const conscious = CONSCIOUS_ORDER.slice(0,6).map(id => VALUES_18.find(v=>v.id===id));
  const revealed  = REVEALED_ORDER.slice(0,6).map(id => VALUES_18.find(v=>v.id===id));

  return (
    <div className="phone-screen" data-screen-label="16 Mirror · Reveal">
      <StatusBar />
      <div className="screen">
        <div className="eyebrow">MIRROR · ALIGNMENT</div>
        <h2 className="bare-h" style={{marginTop:6, marginBottom: 4}}>What you say. What you choose.</h2>

        <div className="shape-stage" style={{minHeight: 280, marginTop: 8, marginBottom: 8}}>
          <MirrorFrame width={310} height={290} conscious={conscious} revealed={revealed} />
        </div>

        <div style={{
          padding:"14px 14px",
          border:"0.5px solid var(--border-active)",
          borderRadius:"var(--r-lg)",
          background:"var(--bg-1)"
        }}>
          <div className="eyebrow" style={{color:"var(--fear)", marginBottom: 6}}>BIGGEST GAP</div>
          <p style={{fontFamily:"var(--font-display)", fontSize: 16, lineHeight: 1.3, margin: 0, color:"var(--text-1)"}}>
            You rank <em style={{fontStyle:"normal", color:"var(--fear)"}}>Stability</em> fifth — but choose it like it's first.
          </p>
          <p className="muted" style={{fontSize: 11.5, lineHeight:1.5, margin:"8px 0 0"}}>
            <span style={{color:"var(--clarity)"}}>●</span> 3 aligned ·
            <span style={{color:"var(--alignment)"}}> ●</span> 2 undervalued ·
            <span style={{color:"var(--fear)"}}> ●</span> 1 overvalued
          </p>
        </div>

        <div className="nav-foot">
          <button className="btn ghost small">Re-run instinct</button>
          <button className="btn primary small">See the question →</button>
        </div>
      </div>
    </div>
  );
}

window.MirrorDragPhase = MirrorDragPhase;
window.MirrorMicroPhase = MirrorMicroPhase;
window.MirrorRevealPhase = MirrorRevealPhase;
