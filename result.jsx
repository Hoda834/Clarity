/* global React */
// Result + History.

function ResultScreen({ resultPanel = "sheet" }) {
  // sheet = slide-up keeps shape visible; takeover = full screen
  if (resultPanel === "takeover") {
    return (
      <div className="phone-screen" data-screen-label="17 Result · Takeover">
        <StatusBar />
        <div className="screen" style={{justifyContent:"space-between", paddingTop:18}}>
          <div>
            <div className="row" style={{alignItems:"center", gap: 8}}>
              <span style={{width:7,height:7,borderRadius:"50%", background:"var(--pull)"}}/>
              <span className="eyebrow">OPPORTUNITY · PULL-DOMINANT</span>
            </div>

            <div style={{marginTop: 18, marginBottom: 22}}>
              <div className="eyebrow" style={{color:"var(--text-3)"}}>BERLIN OFFER · 12 MAY 2026</div>
            </div>

            {/* the two opposing items */}
            <div className="col gap-10" style={{marginBottom: 26}}>
              <Quote color="var(--pull)" side="pull">
                "Out of stuck. Bigger problem. Closer to her."
              </Quote>
              <div style={{textAlign:"center", color:"var(--text-3)", fontSize:10, letterSpacing:"0.3em"}}>BUT</div>
              <Quote color="var(--fear)" side="fear">
                "Disappoint Dad. Outgrow this life. Six months alone."
              </Quote>
            </div>
          </div>

          {/* the question */}
          <div style={{paddingBottom: 4}}>
            <div className="eyebrow" style={{color:"var(--text-3)", marginBottom: 18}}>THE QUESTION</div>
            <h1 className="display xl" style={{
              fontFamily:"var(--font-display)", fontWeight: 400,
              fontSize: 32, lineHeight: 1.18, letterSpacing:"-0.015em",
              margin: 0, maxWidth: 320,
            }}>
              If the people stayed exactly who they are — would Berlin still call you?
            </h1>
          </div>

          <div className="nav-foot">
            <button className="btn ghost small">Save</button>
            <button className="btn small">Sit with it</button>
          </div>
        </div>
      </div>
    );
  }

  // sheet variant — shape sits above panel
  return (
    <div className="phone-screen" data-screen-label="17 Result · Sheet">
      <StatusBar />
      <div className="screen" style={{paddingBottom: 0}}>
        <div className="row" style={{alignItems:"center", gap: 8, marginBottom: 4}}>
          <span style={{width:7,height:7,borderRadius:"50%", background:"var(--pull)"}}/>
          <span className="eyebrow">OPPORTUNITY · PULL-DOMINANT · 12 MAY</span>
        </div>

        <div className="shape-stage" style={{minHeight: 160, marginTop: 6, marginBottom: 8}}>
          <Pyramid size={180} tint="var(--pull)" subtle="var(--conflict)"/>
        </div>
      </div>

      {/* sheet */}
      <div className="result-panel" style={{position:"absolute", left:0, right:0, bottom: 0, paddingBottom: 24}}>
        <div className="grab"/>
        <div className="col gap-10" style={{marginBottom: 22}}>
          <Quote color="var(--pull)" side="pull">"Out of stuck. Closer to her."</Quote>
          <div style={{textAlign:"center", color:"var(--text-3)", fontSize:10, letterSpacing:"0.3em"}}>BUT</div>
          <Quote color="var(--fear)" side="fear">"Disappoint Dad. Outgrow this life."</Quote>
        </div>

        <div className="eyebrow" style={{color:"var(--text-3)", marginBottom: 14}}>THE QUESTION</div>
        <h1 style={{
          fontFamily:"var(--font-display)", fontWeight: 400,
          fontSize: 26, lineHeight: 1.22, letterSpacing:"-0.012em",
          margin: 0, color: "var(--text-1)", textWrap: "balance"
        }}>
          If the people stayed exactly who they are — would Berlin still call you?
        </h1>

        <div className="nav-foot" style={{marginTop: 22}}>
          <button className="btn ghost small">Save</button>
          <button className="btn small">Sit with it</button>
        </div>
      </div>
    </div>
  );
}

function Quote({ color, side, children }) {
  return (
    <div style={{
      padding: "12px 14px",
      borderLeft: `2px solid ${color}`,
      background: side==="pull" ? "var(--pull-dim)" : "var(--fear-dim)",
      borderRadius: 4,
      fontFamily: "var(--font-display)",
      fontSize: 13.5, lineHeight: 1.4,
      color: "var(--text-1)",
    }}>
      <span style={{
        fontSize: 9, letterSpacing:"0.18em",
        color: color, opacity: 0.85, display:"block", marginBottom: 4
      }}>{side === "pull" ? "PULL" : "FEAR"}</span>
      {children}
    </div>
  );
}

/* ---------- History ---------- */
const HISTORY_ITEMS = [
  {
    date: "12 May 2026", puzzle: "Cube",  type: "Opportunity", color: "var(--pull)",
    question: "If the people stayed exactly who they are — would Berlin still call you?",
    tag: "Berlin offer"
  },
  {
    date: "28 Apr 2026", puzzle: "Onion", type: "Exit", color: "var(--accent)",
    question: "If you knew the next year would feel exactly like this — would that be enough?",
    tag: "The us question"
  },
  {
    date: "11 Apr 2026", puzzle: "Mirror", type: "Values", color: "var(--alignment)",
    question: "You say freedom, you choose stability. Which one are you actually grieving?",
    tag: "What I want"
  },
  {
    date: "02 Apr 2026", puzzle: "Orbits", type: "Conflict", color: "var(--conflict)",
    question: "Is this an 'instead of', or a 'before'?",
    tag: "Studio vs. staff"
  },
  {
    date: "16 Mar 2026", puzzle: "Cube",  type: "Opportunity", color: "var(--clarity)",
    question: "What would you do if no one was watching this one?",
    tag: "The class"
  },
];

function HistoryScreen() {
  return (
    <div className="phone-screen" data-screen-label="18 History">
      <StatusBar />
      <div className="screen">
        <div className="row" style={{justifyContent:"space-between", alignItems:"baseline", marginBottom: 14}}>
          <div>
            <div className="eyebrow">RECORD</div>
            <h2 className="bare-h" style={{marginTop: 4, fontSize: 22}}>5 sessions</h2>
          </div>
          <span className="coord">on this device only</span>
        </div>

        <div className="col gap-10" style={{flex: 1, overflow:"auto"}}>
          {HISTORY_ITEMS.map((h, i) => (
            <div key={i} style={{
              display:"grid",
              gridTemplateColumns: "3px 1fr",
              borderRadius: "var(--r-md)",
              border: "0.5px solid var(--border-active)",
              overflow: "hidden",
              background: "var(--bg-1)",
            }}>
              <span style={{background: h.color}}/>
              <div style={{padding: "12px 14px"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 6}}>
                  <span style={{fontSize: 10, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--text-3)"}}>
                    {h.puzzle} · {h.type}
                  </span>
                  <span className="coord">{h.date}</span>
                </div>
                <div style={{display:"flex", alignItems:"center", gap: 8, marginBottom: 8}}>
                  <span style={{width:6,height:6,borderRadius:"50%", background:h.color}}/>
                  <span style={{fontSize: 11, color:"var(--text-2)"}}>{h.tag}</span>
                </div>
                <p style={{
                  fontFamily:"var(--font-display)", fontWeight: 400,
                  fontSize: 13.5, lineHeight: 1.35, color:"var(--text-1)",
                  margin: 0, textWrap:"balance"
                }}>
                  {h.question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ResultScreen = ResultScreen;
window.HistoryScreen = HistoryScreen;
