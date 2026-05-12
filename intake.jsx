/* global React */
// Intake: entry + 4 routing questions + transition

const { useState: useStateI, useEffect: useEffectI } = React;

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="glyphs">
        <svg viewBox="0 0 16 12" fill="currentColor"><path d="M1 9h2v2H1zM5 7h2v4H5zM9 5h2v6H9zM13 3h2v8h-2z"/></svg>
        <svg viewBox="0 0 16 12" fill="currentColor"><path d="M8 2C4.7 2 1.7 3.3 0 5.4l1.3 1.1C2.7 4.9 5.2 4 8 4s5.3.9 6.7 2.5L16 5.4C14.3 3.3 11.3 2 8 2zm0 4c-2 0-3.7.7-5 1.8l1.3 1C5.3 8.3 6.6 8 8 8s2.7.3 3.7 1l1.3-1.2C11.7 6.7 10 6 8 6zm0 3.5c-.9 0-1.6.3-2.2.7L8 12l2.2-1.8c-.6-.4-1.3-.7-2.2-.7z"/></svg>
        <svg viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1" y="2" width="18" height="8" rx="2"/><rect x="3" y="4" width="14" height="4" rx="1" fill="currentColor"/><path d="M20 5v2" stroke="currentColor"/></svg>
      </span>
    </div>
  );
}

const ENTRY_CARDS = [
  { id: "leap",    title: "Should I take this leap?",      sub: "A choice that could expand things — and risks the rest.",   shape: "cube",   puzzle: "Cube"   },
  { id: "leave",   title: "Should I walk away?",           sub: "Something you've outgrown, or are still trying to keep.",   shape: "onion",  puzzle: "Onion"  },
  { id: "torn",    title: "I'm torn between two paths.",   sub: "Two options that won't sit next to each other.",            shape: "orbits", puzzle: "Orbits" },
  { id: "want",    title: "I don't know what I actually want.", sub: "The choice is foggy because the values underneath are.", shape: "mirror", puzzle: "Mirror" },
  { id: "second",  title: "I keep changing my mind.",      sub: "The decision keeps moving. Something underneath isn't sitting still.", shape: "cube",   puzzle: "Cube" },
];

function EntryScreen({ density }) {
  return (
    <div className="phone-screen" data-screen-label="01 Entry">
      <StatusBar />
      <div className="screen">
        <div className="eyebrow" style={{marginBottom: 14}}>CLARITY · v0.1</div>
        <h1 className="display lg" style={{marginBottom: 6}}>What's on your mind?</h1>
        <p className="muted" style={{margin: "0 0 22px", fontSize: 13, lineHeight: 1.5, maxWidth: 280}}>
          Pick the one that lands first. There's no wrong door — we'll calibrate from here.
        </p>

        <div className="col gap-10" style={{flex: 1}}>
          {ENTRY_CARDS.map((c) => (
            <button key={c.id} className="tap-card">
              <div>
                <h3>{c.title}</h3>
                <p>{c.sub}</p>
              </div>
              <div className="glyph">
                <EntryGlyph kind={c.shape} />
              </div>
            </button>
          ))}
        </div>

        <div className="nav-foot">
          <span className="dim" style={{fontSize: 11, letterSpacing:"0.08em"}}>Everything stays on this device.</span>
          <button className="btn ghost small">History</button>
        </div>
      </div>
    </div>
  );
}

function EntryGlyph({ kind }) {
  // tiny shape echo
  if (kind === "cube") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.85">
      <path d="M3 5 L9 2 L15 5 L9 8 Z M3 5 V13 L9 16 V8 M9 16 L15 13 V5"/>
    </svg>
  );
  if (kind === "onion") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.85">
      <circle cx="9" cy="9" r="7"/><circle cx="9" cy="9" r="5"/><circle cx="9" cy="9" r="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/>
    </svg>
  );
  if (kind === "orbits") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.85">
      <circle cx="6" cy="9" r="3.2"/><circle cx="12" cy="9" r="3.2"/>
    </svg>
  );
  if (kind === "mirror") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.85">
      <rect x="3" y="2" width="12" height="14" rx="1.5"/><path d="M9 2 V16"/>
    </svg>
  );
  return null;
}

/* ----------- Routing questions ----------- */

const QUESTIONS = [
  {
    q: "How long have you been turning this over?",
    opts: ["A few days", "A few weeks", "Months", "Longer than I'd admit"],
    selected: 2,
  },
  {
    q: "When you picture it resolved — which lands harder?",
    opts: ["Relief", "Excitement", "Both, evenly", "Neither yet"],
    selected: 0,
  },
  {
    q: "Who else is in this?",
    opts: ["Just me", "One person I love", "A few people I'm close to", "More than I can count"],
    selected: 1,
  },
  {
    q: "If nothing changed in a year, what would that feel like?",
    opts: ["Quietly painful", "Steadily resigned", "Honestly fine", "I refuse to find out"],
    selected: 3,
  },
];

function RoutingQ({ index = 0 }) {
  const Q = QUESTIONS[index];
  return (
    <div className="phone-screen" data-screen-label={`0${index+2} Q${index+1}`}>
      <StatusBar />
      <div className="screen">
        <div className="qprog">
          {QUESTIONS.map((_, i) => (
            <span key={i} className={i < index ? "is-done" : i === index ? "is-current" : ""} />
          ))}
        </div>
        <div className="eyebrow">QUESTION {index+1} OF 4</div>
        <h2 className="display" style={{marginTop: 10, marginBottom: 22, maxWidth: 300}}>{Q.q}</h2>
        <div className="col" style={{flex: 1}}>
          {Q.opts.map((o, i) => (
            <button key={o} className={"opt" + (i === Q.selected ? " is-selected" : "")}>
              <span>{o}</span>
              <span className="glyph"/>
            </button>
          ))}
        </div>
        <div className="nav-foot">
          <span className="count">{index+1}/4</span>
          <span className="dim" style={{fontSize: 11, letterSpacing:"0.08em"}}>No back button. Trust the first answer.</span>
        </div>
      </div>
    </div>
  );
}

/* ----------- Transition ----------- */
function TransitionScreen({ shape="cube" }) {
  return (
    <div className="phone-screen" data-screen-label="06 Transition">
      <StatusBar />
      <div className="screen center" style={{ alignItems: "center" }}>
        <div style={{
          width: 200, height: 200,
          display:"grid", placeItems:"center",
          animation: "emerge 3s ease-out forwards"
        }}>
          <Emerging size={180} shape={shape} />
        </div>
      </div>
      <style>{`
        @keyframes emerge { 0% { opacity:0; transform: scale(.85);} 60%{opacity:.85;} 100%{ opacity:1; transform: scale(1);} }
        @keyframes breathe { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.015);} }
      `}</style>
    </div>
  );
}

window.EntryScreen = EntryScreen;
window.RoutingQ = RoutingQ;
window.TransitionScreen = TransitionScreen;
window.StatusBar = StatusBar;
