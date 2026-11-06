/* =========================================
   ZIDONG CORE 2.0 - SYNTHESIZED AUDIO ENGINE
   Web Audio API (Cero archivos MP3 externos)
========================================= */

const ZidongAudio = (() => {
    let ctx = null;

    function getContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                ctx = new AudioCtx();
            }
        }
        if (ctx && ctx.state === "suspended") {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    // Desbloqueo forzado compatible con Chromium / Brave / Safari
    if (typeof window !== "undefined") {
        const unlock = () => {
            const c = getContext();
            if (c) {
                // Genera un micro-tono inaudible para reactivar el bus de audio
                const buffer = c.createBuffer(1, 1, 22050);
                const source = c.createBufferSource();
                source.buffer = buffer;
                source.connect(c.destination);
                source.start(0);
            }
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("click", unlock);
        };
        window.addEventListener("pointerdown", unlock, { passive: true });
        window.addEventListener("touchstart", unlock, { passive: true });
        window.addEventListener("click", unlock, { passive: true });
    }

    function playTap() {
        const c = getContext();
        if (!c || c.state !== "running") return;
        
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now);
        osc.stop(now + 0.04);
    }

    function playSuccess() {
        const c = getContext();
        if (!c || c.state !== "running") return;
        
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);       // Do5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // Mi5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // Sol5

        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    function playError() {
        const c = getContext();
        if (!c || c.state !== "running") return;
        
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.2);

        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    function playVictory() {
        const c = getContext();
        if (!c || c.state !== "running") return;
        
        const now = c.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            const noteTime = now + (idx * 0.08);

            osc.type = "square";
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.cancelScheduledValues(noteTime);
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
