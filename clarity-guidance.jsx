/* global React, ClarityAudio */

const { useState: useGuidanceState } = React;

function GuidancePanel({ eyebrow, title, intro, instruction, reflection, soundTheme, onContinue }) {
  const [soundOn, setSoundOn] = useGuidanceState(
    Boolean(window.ClarityAudio && window.ClarityAudio.isEnabled())
  );

  const narration = [intro, instruction, reflection].filter(Boolean).join(" ");

  async function toggleSound() {
    if (!window.ClarityAudio) return;
    if (soundOn) {
      window.ClarityAudio.stopAmbient();
      setSoundOn(false);
      return;
    }
    await window.ClarityAudio.startAmbient(soundTheme || "fog");
    setSoundOn(true);
  }

  function replayVoice() {
    if (window.ClarityAudio) window.ClarityAudio.speak(narration);
  }

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

      <div style={{
        marginTop: 24,
        display: "flex",
        justifyContent: "center",
        gap: 10,
        flexWrap: "wrap",
      }}>
        <button className="cta ghost sm" onClick={toggleSound}>
          {soundOn ? "Sound off" : "Sound on"}
        </button>

        <button className="cta ghost sm" onClick={replayVoice}>
          Hear guide
        </button>

        <button className="cta" onClick={onContinue}>
          Enter <span>→</span>
        </button>
      </div>
    </div>
  );
}

window.GuidancePanel = GuidancePanel;
