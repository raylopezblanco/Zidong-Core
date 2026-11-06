/* =========================================
   ZIDONG CORE 2.0
   SYNTHESIZED WEB AUDIO ENGINE
========================================= */

const ZidongAudio = (() => {
    let ctx = null;

    // Inicializa el contexto con el primer toque en pantalla
    function getContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                ctx = new AudioCtx();
            }
        }
        if (ctx && ctx.state === "suspended") {
            ctx.resume();
        }
        return ctx;
    }

    // Tono para toque de botón simple (Click táctil sutil)
    function playTap() {
        const c = getContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(400, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.04);

        gain.gain.setValueAtTime(0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.04);
    }

    // Tono de Acierto (Bip ascendente estilo arcade)
    function playSuccess() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;

        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);       // Do5 (C5)
        osc.frequency.setValueAtTime(659.25, now + 0.07); // Mi5 (E5)
        osc.frequency.setValueAtTime(783.99, now + 0.14); // Sol5 (G5)

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(now + 0.28);
    }

    // Tono de Falla / Alarma (Zumbido grave industrial)
    function playError() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;

        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.22);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(now + 0.22);
    }

    // Tono de Fanfarria / Victoria de Nodo
    function playVictory() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do agudo
        notes.forEach((freq, idx) => {
            const osc = c.createOscillator();
            const gain = c.createGain();

            const noteTime = now + (idx * 0.09);
            osc.type = "square";
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.1, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(noteTime);
            osc.stop(noteTime + 0.18);
        });
    }

    return {
        playTap,
        playSuccess,
        playError,
        playVictory
    };
})();

window.ZidongAudio = ZidongAudio;
// Desbloqueo forzado en el primer toque de pantalla
document.addEventListener("pointerdown", () => {
    if (window.ZidongAudio) {
        window.ZidongAudio.playTap();
    }
}, { once: true });
