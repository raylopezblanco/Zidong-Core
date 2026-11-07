/* ==========================================================================
   ZIDONG AUDIO ENGINE 3.0 (SYNTHESIZED & WEB AUDIO API)
   - Sin archivos pesados MP3
   - Alarma de Survivor suave (sin asustar)
   - Tic-Tac de reloj para el 1v1
   - Música ambiental de fondo relajante / lo-fi cyberpunk
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let bgMusicPlaying = false;
    let ambientInterval = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // SONIDO DE ACIERTO (SUAVE Y POSITIVO)
    function playSuccess() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // SONIDO DE ERROR / FALLA SUAVE (TONO BAJO CÁLIDO, NO ASUSTA)
    function playError() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
    }

    // SONIDO VICTORIA / SUBIDA DE RANGO
    function playVictory() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
            const now = ctx.currentTime + (idx * 0.09);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        });
    }

    // TIC-TAC DE RELOJ SINTETIZADO PARA EL 1V1 (PRECISIÓN Y PRESIÓN)
    function playClockTick(isTock = false) {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        // El 'tic' es ligeramente más agudo que el 'tac'
        osc.frequency.setValueAtTime(isTock ? 800 : 1200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // MÚSICA AMBIENTAL RELAJANTE SINTETIZADA (LO-FI CYBERPUNK / INDUSTRIAL CHILL)
    const AMBIENT_CHORDS = [
        [220, 261.63, 329.63, 392.00], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G
        [164.81, 196.00, 246.94, 293.66]  // Em7
    ];
    let chordIndex = 0;

    function playAmbientChord() {
        if (!bgMusicPlaying) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chord = AMBIENT_CHORDS[chordIndex % AMBIENT_CHORDS.length];
        chordIndex++;

        chord.forEach(freq => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(650, now);

            // Ataque suave y decaimiento largo tipo pad
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.0005, now + 3.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 4.0);
        });
    }

    function toggleBackgroundMusic() {
        const btn = document.getElementById("musicToggleBtn");
        if (bgMusicPlaying) {
            bgMusicPlaying = false;
            clearInterval(ambientInterval);
            if (btn) btn.textContent = "🔈";
        } else {
            bgMusicPlaying = true;
            getAudioContext();
            playAmbientChord();
            ambientInterval = setInterval(playAmbientChord, 3500);
            if (btn) btn.textContent = "🔊";
        }
        return bgMusicPlaying;
    }

    window.ZidongAudio = {
        playSuccess,
        playError,
        playVictory,
        playClockTick,
        toggleBackgroundMusic,
        isMusicActive: () => bgMusicPlaying
    };
})();
