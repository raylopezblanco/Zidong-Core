/* =========================================
   ZIDONG CORE 2.0 - SYNTHESIZED AUDIO ENGINE
   Web Audio API (Cero archivos MP3 externos)
========================================= */

const ZidongAudio = (() => {
    let ctx = null;

    function getContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) ctx = new AudioCtx();
        }
        if (ctx && ctx.state === "suspended") {
            ctx.resume();
        }
        return ctx;
    }

    // Desbloqueo forzado en el primer toque de pantalla en móviles
    if (typeof window !== "undefined") {
        const unlock = () => {
            getContext();
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("pointerdown", unlock, { passive: true });
        window.addEventListener("touchstart", unlock, { passive: true });
    }

    function playTap() {
        const c = getContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(420, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, c.currentTime + 0.04);

        gain.gain.setValueAtTime(0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.04);
    }

    function playSuccess() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);       // Do5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // Mi5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // Sol5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(now + 0.25);
    }

    function playError() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.2);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(now + 0.2);
    }

    function playVictory() {
        const c = getContext();
        if (!c) return;
        const now = c.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            const noteTime = now + (idx * 0.08);

            osc.type = "square";
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.09, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.16);

            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(noteTime);
            osc.stop(noteTime + 0.16);
        });
    }

    return { playTap, playSuccess, playError, playVictory };
})();

window.ZidongAudio = ZidongAudio;
