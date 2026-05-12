/* global React */
// Cube puzzle — 3 phases.
// Context for the demo: "The Berlin offer" (a job that could change everything).

const PULL_CHIPS = [
  { id: "p1", label: "More money",       theta: -42, phi: -12 },
  { id: "p2", label: "Bigger problem",   theta:  12, phi: -34 },
  { id: "p3", label: "New city",         theta:  58, phi:  8  },
  { id: "p4", label: "Proves something", theta: -78, phi:  22 },
  { id: "p5", label: "Out of stuck",     theta:  90, phi:  -8 },
  { id: "p6", label: "Closer to her",    theta: -22, phi:  44 },
];

const FEAR_CHIPS = [
  { id: "f1", label: "Lose my people",   theta:  140, phi: -20 },
  { id: "f2", label: "Identity reset",   theta: -120, phi:  10 },
  { id: "f3", label: "What if I flame out", theta: 168, phi: 30 },
  { id: "f4", label: "Disappoint Dad",   theta: -160, phi: -32 },
  { id: "f5", label: "Outgrow this life",theta:  150, phi: -50 },
  { id: "f6", label: "Six months alone", theta: -100, phi:  40 },
];

const UNPLACED = [
  { id: "u1", label: "Healthcare", side: "pull" },
  { id: "u2", label: "Visa", side: "fear" },
  { id: "u3", label: "Mom getting older", side: "fear" },
  { id: "u4", label: "Real winter", side: "fear" },
  { id: "u5", label: "My own apartment", side: "pull" },
  { id: "u6", label: "Better mentors", side: "pull" },
];

function CubeSpherePhase({ density = "standard" }) {
  const allChips = [...PULL_CHIPS.map(c=>({...c, side:"pull"})), ...FEAR_CHIPS.map(c=>({...c, side:"fear"}))];

  return (
    <div className="phone-screen" data-screen-label="07 Cube · Sphere">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <div className="eyebrow">PUZZLE 1 OF 3 · GATHER</div>
            <h2 className="bare-h" style={{marginTop:6}}>What's on the surface?</h2>
          </div>
          <div className="coord">{(PULL_CHIPS.length + FEAR_CHIPS.length).toString().padStart(2,"0")}/24</div>
        </div>

        <div className="shape-stage" style={{marginTop: 6, marginBottom: 6}}>
          <Sphere size={236} chips={allChips} />
          <div style={{
            position:"absolute", bottom: 6, left: 0, right: 0,
            display:"flex", justifyContent:"center", gap: 18,
            fontSize: 10, color: "var(--text-3)", letterSpacing:"0.14em", textTransform:"uppercase"
          }}>
            <span style={{display:"flex", alignItems:"center", gap:6}}><i style={{width:6,height:6,borderRadius:"50%",background:"var(--pull)", boxShadow:"0 0 6px rgba(77,166,255,0.7)"}}/> pull · {PULL_CHIPS.length}</span>
            <span style={{display:"flex", alignItems:"center", gap:6}}><i style={{width:6,height:6,borderRadius:"50%",background:"var(--fear)", boxShadow:"0 0 6px rgba(255,107,53,0.7)"}}/> fear · {FEAR_CHIPS.length}</span>
          </div>
        </div>

        <div style={{marginTop: 4}}>
          <div className="eyebrow" style={{marginBottom: 8}}>TAP TO PLACE — no labels, no ranking, just what's true.</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6, maxHeight: density==="compact" ? 130 : 110, overflow:"hidden"}}>
            {UNPLACED.slice(0, density==="compact" ? 12 : 8).map((c) => (
              <span key={c.id} className={`chip ${c.side} ${density==="compact"?"compact":""}`}>
                <span className="dot"/>{c.label}
              </span>
            ))}
            {UNPLACED.length > 8 && (
              <span className="chip" style={{borderStyle:"dashed", color:"var(--text-3)"}}>+ {UNPLACED.length-8} more</span>
            )}
          </div>
        </div>

        <div className="nav-foot">
          <button className="btn ghost small">Add more</button>
          <button className="btn primary small">Crystallise →</button>
        </div>
      </div>
    </div>
  );
}

function CubeFacesPhase() {
  const counts = { gain: 4, lose: 3, know: 2, unknow: 5, ctrl: 2, nctrl: 4 };
  const active = "unknow";
  const faceItems = {
    unknow: ["Whether I'll thrive in winter", "If she'll visit", "Tax on the bonus", "If I'll regret it", "What 'enough' means"],
  };

  return (
    <div className="phone-screen" data-screen-label="08 Cube · Faces">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">PUZZLE 2 OF 3 · SORT</div>
            <h2 className="bare-h" style={{marginTop:6}}>Six faces. Each holds part of the truth.</h2>
          </div>
          <div className="coord">20/20</div>
        </div>

        <div className="shape-stage" style={{marginTop: 8, marginBottom: 8, minHeight: 220}}>
          <Cube size={210} activeFace={active} counts={counts} />
        </div>

        <div style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: 8}}>
          {CUBE_FACES.slice(0,4).map((f) => (
            <div key={f.id} className="face-plate" style={{borderColor: f.id===active ? "var(--border-strong)" : undefined}}>
              <div className="ftitle">
                <span className="swatch" style={{background: f.color}}/>
                {f.title}
              </div>
              <div className="meta">{counts[f.id]} items</div>
            </div>
          ))}
        </div>

        {/* preview of active face */}
        <div style={{
          marginTop: 10, padding: "12px 14px",
          border: "0.5px solid var(--border-active)",
          borderRadius: "var(--r-md)", background: "var(--bg-1)"
        }}>
          <div className="eyebrow" style={{marginBottom: 8, color: "var(--conflict)"}}>WHAT YOU DON'T KNOW · 5</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {faceItems.unknow.slice(0, 4).map((t) => (
              <span key={t} className="chip" style={{borderColor:"rgba(199,125,255,0.4)"}}>
                <span className="dot" style={{background:"var(--conflict)"}}/>{t}
              </span>
            ))}
            <span className="chip" style={{borderStyle:"dashed", color:"var(--text-3)"}}>+1</span>
          </div>
        </div>

        <div className="nav-foot">
          <button className="btn ghost small">Rotate</button>
          <button className="btn primary small">Compress →</button>
        </div>
      </div>
    </div>
  );
}

function CubePyramidPhase() {
  return (
    <div className="phone-screen" data-screen-label="09 Cube · Pyramid">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">PUZZLE 3 OF 3 · COMPRESS</div>
            <h2 className="bare-h" style={{marginTop:6}}>The shape your thinking made.</h2>
          </div>
          <div className="coord">— · —</div>
        </div>

        <div className="shape-stage" style={{marginTop: 14, marginBottom: 0}}>
          <Pyramid size={230} tint="var(--pull)" subtle="var(--conflict)"/>
          <div className="tag-label" style={{top: "16%", left: "50%"}}>apex · pull-dominant</div>
        </div>

        <div style={{
          padding: "16px 16px 18px",
          border: "0.5px solid var(--border-active)",
          borderRadius: "var(--r-lg)",
          background: "var(--bg-1)"
        }}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom: 10}}>
            <span style={{width:7, height:7, borderRadius:"50%", background:"var(--pull)"}}/>
            <span className="eyebrow" style={{color:"var(--text-2)"}}>DOMINANT · OPPORTUNITY OVER FEAR</span>
          </div>
          <p className="display" style={{fontSize: 19, lineHeight: 1.25, margin: "0 0 14px"}}>
            The pull is real. The fear is loud, but it's mostly about people, not the work.
          </p>
          <p className="muted" style={{fontSize: 12.5, margin: 0, lineHeight: 1.55}}>
            5 of 6 fears trace back to relationships left behind, not the role itself. The faces don't disagree about Berlin — they disagree about goodbye.
          </p>
        </div>

        <div className="nav-foot">
          <button className="btn ghost small">Re-sort</button>
          <button className="btn primary small">See the question →</button>
        </div>
      </div>
    </div>
  );
}

window.CubeSpherePhase = CubeSpherePhase;
window.CubeFacesPhase = CubeFacesPhase;
window.CubePyramidPhase = CubePyramidPhase;
