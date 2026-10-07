/* global React */

function GuidancePanel({ eyebrow, title, intro, instruction, reflection, onContinue, continueLabel = "Continue" }) {
  return (
    <div style={{ width: "100%", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
      {eyebrow && (
        <div className="eyebrow-lg" style={{ marginBottom: 14 }}>
          {eyebrow}
        </div>
      )}

      <h1 className="prompt-xl" style={{ marginBottom: 18 }}>
        {title}
      </h1>

      {intro && (
        <p className="sub" style={{ maxWidth: 620, margin: "0 auto 14px", textAlign: "center" }}>
          {intro}
        </p>
      )}

      {instruction && (
        <p style={{
          maxWidth: 620,
          margin: "0 auto",
          fontFamily: "var(--font-display)",
          color: "var(--text-1)",
          fontSize: 18,
          lineHeight: 1.45,
        }}>
          {instruction}
        </p>
      )}

      {reflection && (
        <p className="sub" style={{ maxWidth: 620, margin: "14px auto 0", textAlign: "center" }}>
          {reflection}
        </p>
      )}

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <button className="cta" onClick={onContinue}>
          {continueLabel} <span>→</span>
        </button>
      </div>
    </div>
  );
}

window.GuidancePanel = GuidancePanel;
