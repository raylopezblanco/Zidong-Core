/* ==========================================================================
   ZIDONG AUDIO ENGINE 4.0 (SYNTHESIZED & WEB AUDIO API)
   - Sin archivos externos MP3
   - Melodía Zelda Ocarina para Inicio / Dashboard
   - Melodía Aventura para Career Mode
   - Melodía Castillo Bowser Mario Bros ("tututututut...") + Tic-Tac para 1v1
   - Manejo estricto de parada al salir de pantalla (Cero sonidos fantasma)
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let marioInterval = null;
    let ocarinaInterval = null;
    let careerInterval = null;
    let isMuted = false;

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

    // SONIDO ACIERTO
    function playSuccess() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // SONIDO ERROR / FALLA SUAVE
    function playError() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
    }

    // SONIDO COLAPSO LÍNEA (SURVIVOR PERDIDO)
    function playLineCollapse() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.55);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
    }

    // SONIDO VICTORIA
    function playVictory() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [440, 554.37, 659.25, 880];
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

    // TIC-TAC DE RELOJ SINTETIZADO (1V1)
    function playClockTick(isTock = false) {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(isTock ? 750 : 1100, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // 1. MELODÍA TIPO ZELDA OCARINA (DASHBOARD)
    // Zelda's Lullaby / Song of Time arpegio con onda sine y vibrato dulce
    const ZELDA_NOTES = [
        { f: 440, d: 0.35 },   // A4
        { f: 523.25, d: 0.35 },// C5
        { f: 587.33, d: 0.75 },// D5
        { f: 440, d: 0.35 },   // A4
        { f: 523.25, d: 0.35 },// C5
        { f: 587.33, d: 0.75 },// D5
        { f: 659.25, d: 0.35 },// E5
        { f: 587.33, d: 0.35 },// D5
        { f: 523.25, d: 0.35 },// C5
        { f: 493.88, d: 0.35 },// B4
        { f: 523.25, d: 0.75 } // C5
    ];

    function playZeldaOcarina() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        let delay = 0;
        ZELDA_NOTES.forEach(n => {
            const now = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(n.f, now);

            // Vibrato sutil tipo ocarina
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(5, now);
            lfoGain.gain.setValueAtTime(3.5, now);
            lfo.connect(osc.frequency);
            lfo.start(now);
            lfo.stop(now + n.d);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + n.d);

            delay += n.d + 0.05;
        });
    }

    // 2. MELODÍA CASTILLO DE MARIO BROS ("tututututut..." TEMA DE CASTILLO)
    // Clásico bajo cromático staccato tenso: D# - D - C# - C...
    const MARIO_CASTLE_RIFF = [
        155.56, 155.56, 146.83, 146.83, 138.59, 138.59, 130.81, 130.81
    ];
    let castleStep = 0;

    function playMarioCastleBeat() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = MARIO_CASTLE_RIFF[castleStep % MARIO_CASTLE_RIFF.length];
        castleStep++;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // 3. MELODÍA DE AVENTURA PARA CAREER MODE
    const CAREER_CHORDS = [
        [329.63, 392.00, 493.88], // Em
        [293.66, 369.99, 440.00], // D
        [261.63, 329.63, 392.00], // C
        [246.94, 311.13, 369.99]  // Bm
    ];
    let careerChordIdx = 0;

    function playCareerAmbience() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chord = CAREER_CHORDS[careerChordIdx % CAREER_CHORDS.length];
        careerChordIdx++;

        chord.forEach(freq => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.025, now + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 3.4);
        });
    }

    // CONTROLADORES DE DETENCIÓN ESTRICTA (CERO SONIDOS FANTASMA)
    function stopAllMusic() {
        clearInterval(marioInterval);
        clearInterval(ocarinaInterval);
        clearInterval(careerInterval);
        marioInterval = null;
        ocarinaInterval = null;
        careerInterval = null;
        castleStep = 0;
    }

    function startDashboardZelda() {
        stopAllMusic();
        playZeldaOcarina();
        ocarinaInterval = setInterval(playZeldaOcarina, 7000);
    }

    function start1v1MarioCastle() {
        stopAllMusic();
        castleStep = 0;
        playMarioCastleBeat();
        marioInterval = setInterval(playMarioCastleBeat, 240); // Rápido estilo 8-bit tutututut
    }

    function startCareerAmbience() {
        stopAllMusic();
        playCareerAmbience();
        careerInterval = setInterval(playCareerAmbience, 3600);
    }

    function toggleMute() {
        isMuted = !isMuted;
        const btn = document.getElementById("musicToggleBtn");
        if (isMuted) {
            stopAllMusic();
            if (btn) btn.textContent = "🔈";
        } else {
            if (btn) btn.textContent = "🔊";
            startDashboardZelda();
        }
        return isMuted;
    }

    window.ZidongAudio = {
        playSuccess,
        playError,
        playLineCollapse,
        playVictory,
        playClockTick,
        startDashboardZelda,
        start1v1MarioCastle,
        startCareerAmbience,
        stopAllMusic,
        toggleMute,
        isMuted: () => isMuted
    };
})();
