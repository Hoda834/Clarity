/* global React */
// Orbiting Shapes — conflict decisions. Two named circles.
// Demo context: "Stay senior IC" vs "Start the studio"

const ORBIT_DATA = {
  A: {
    name: "Stay senior IC",
    color: "var(--pull)",
    gives:  ["Deep craft time", "Quiet income", "A team I trust"],
    costs:  ["A ceiling I see", "The 'what if' growing"],
    says:   ["I'm someone who finishes things"],
  },
  B: {
    name: "Start the studio",
    color: "var(--alignment)",
    gives:  ["Full ownership", "Choosing the work", "Building it my way"],
    costs:  ["12 months of unpaid", "Identity in public", "Less time at home"],
    says:   ["I'm someone who bets on myself"],
  },
};

function OrbitsNamePhase() {
  return (
    <div className="phone-screen" data-screen-label="12 Orbits · Name">
      <StatusBar />
      <div className="screen">
        <div className="eyebrow">CONFLICT · NAMING</div>
        <h2 className="bare-h" style={{marginTop:6, marginBottom: 4}}>Give each one a name.</h2>
        <p className="muted" style={{fontSize:12.5, margin:"0 0 14px"}}>The only typing you'll do. Short. Honest.</p>

        <div className="shape-stage" style={{minHeight: 220}}>
          <Orbits size={220} alignment={0.15} nameA={ORBIT_DATA.A.name} nameB={ORBIT_DATA.B.name} />
        </div>

        <div className="col gap-10">
          <NamedField color="var(--pull)" label="OPTION A" value={ORBIT_DATA.A.name} focus />
          <NamedField color="var(--alignment)" label="OPTION B" value={ORBIT_DATA.B.name} />
        </div>

        <div className="nav-foot">
          <span className="count">2 / 2 named</span>
          <button className="btn primary small">Begin →</button>
        </div>
      </div>
    </div>
  );
}

function NamedField({ color, label, value, focus }) {
  return (
    <label style={{
      display:"grid", gridTemplateColumns:"10px 1fr", gap: 12, alignItems:"center",
      padding:"12px 14px",
      border:"0.5px solid " + (focus ? "var(--border-strong)" : "var(--border-active)"),
      borderRadius:"var(--r-md)",
      background:"var(--bg-1)"
    }}>
      <span style={{width:6, height:6, borderRadius:"50%", background:color}}/>
      <div>
        <div className="eyebrow" style={{marginBottom:4}}>{label}</div>
        <div style={{fontFamily:"var(--font-display)", fontSize:16, color:"var(--text-1)", letterSpacing:"-0.005em"}}>{value}<span style={{display: focus?"inline-block":"none", width:1, height:18, background:"var(--text-1)", verticalAlign:"middle", marginLeft:3, animation:"blink 1s infinite"}}/></div>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </label>
  );
}

function OrbitsAlignPhase() {
  const align = 0.62;
  return (
    <div className="phone-screen" data-screen-label="13 Orbits · Align">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">CONFLICT · ALIGN</div>
            <h2 className="bare-h" style={{marginTop:6}}>Drag them closer. Or further.</h2>
          </div>
          <div className="coord">align · {Math.round(align*100)}</div>
        </div>

        <div className="shape-stage" style={{minHeight: 230}}>
          <Orbits size={240} alignment={align} nameA="Stay" nameB="Studio" rotation={28}/>
        </div>

        {/* alignment slider */}
        <div style={{margin:"4px 4px 10px"}}>
          <div style={{position:"relative", height: 30}}>
            <div style={{position:"absolute", left:0, right:0, top:14, height:2, background:"var(--bg-2)", borderRadius:2}}/>
            <div style={{position:"absolute", left:0, top:14, width:`${align*100}%`, height:2, background:"var(--alignment)", borderRadius:2}}/>
            <div style={{position:"absolute", left:`calc(${align*100}% - 8px)`, top: 7, width:16, height:16, borderRadius:"50%", background:"var(--text-1)", boxShadow:"0 0 0 4px rgba(247,220,111,0.18)"}}/>
            <span className="coord" style={{position:"absolute", left:0, top:22}}>incompatible</span>
            <span className="coord" style={{position:"absolute", right:0, top:22}}>compatible</span>
          </div>
        </div>

        {/* attribute summary */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8}}>
          <OrbitColumn opt={ORBIT_DATA.A} color="var(--pull)" />
          <OrbitColumn opt={ORBIT_DATA.B} color="var(--alignment)" />
        </div>

        <div className="nav-foot">
          <span style={{fontSize:11, color:"var(--alignment)", letterSpacing:"0.06em"}}>Reads as: sequentially possible</span>
          <button className="btn primary small">Compress →</button>
        </div>
      </div>
    </div>
  );
}

function OrbitColumn({ opt, color }) {
  return (
    <div style={{
      padding:"10px 12px",
      border:"0.5px solid var(--border-active)",
      borderRadius:"var(--r-md)",
      background:"var(--bg-1)"
    }}>
      <div style={{display:"flex", alignItems:"center", gap:6, marginBottom: 8}}>
        <span style={{width:6, height:6, borderRadius:"50%", background:color}}/>
        <span style={{fontFamily:"var(--font-display)", fontSize:12, color:"var(--text-1)"}}>{opt.name}</span>
      </div>
      <div className="col gap-6">
        <Row label="gives" items={opt.gives.slice(0,2)} />
        <Row label="costs" items={opt.costs.slice(0,2)} />
        <Row label="says" items={opt.says.slice(0,1)} />
      </div>
    </div>
  );
}

function Row({ label, items }) {
  return (
    <div>
      <div className="coord" style={{marginBottom: 3}}>{label}</div>
      {items.map(t => (
        <div key={t} style={{fontSize: 11, color:"var(--text-2)", lineHeight:1.45}}>· {t}</div>
      ))}
    </div>
  );
}

window.OrbitsNamePhase = OrbitsNamePhase;
window.OrbitsAlignPhase = OrbitsAlignPhase;
