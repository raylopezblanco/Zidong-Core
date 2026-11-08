/* ==========================================================================
   ZIDONG AUDIO ENGINE 5.0 (WEB AUDIO API)
   - Pausa automática en segundo plano / pantalla minimizada (visibilitychange)
   - Melodía Zelda Ocarina para Inicio / Dashboard
   - Melodía Bowser Castle Mario Bros ("tututututut...") + Tic-Tac para 1v1
   - Melodía Aventura para Career
   - Sonidos de acierto, error y colapso
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let marioInterval = null;
    let ocarinaInterval = null;
    let careerInterval = null;
    let isMuted = false;
    let activePage = "dashboard";

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
        if (isMuted || document.hidden) return;
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

    // SONIDO ERROR
    function playError() {
        if (isMuted || document.hidden) return;
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

    // SONIDO COLAPSO LÍNEA / DERROTA
    function playLineCollapse() {
        if (isMuted || document.hidden) return;
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
        if (isMuted || document.hidden) return;
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

    // TIC-TAC DE RELOJ
    function playClockTick(isTock = false) {
        if (isMuted || document.hidden) return;
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

    // 1. ZELDA OCARINA
    const ZELDA_NOTES = [
        { f: 440, d: 0.35 }, { f: 523.25, d: 0.35 }, { f: 587.33, d: 0.75 },
        { f: 440, d: 0.35 }, { f: 523.25, d: 0.35 }, { f: 587.33, d: 0.75 },
        { f: 659.25, d: 0.35 }, { f: 587.33, d: 0.35 }, { f: 523.25, d: 0.35 },
        { f: 493.88, d: 0.35 }, { f: 523.25, d: 0.75 }
    ];

    function playZeldaOcarina() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        let delay = 0;
        ZELDA_NOTES.forEach(n => {
            const now = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(n.f, now);

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

    // 2. MARIO BROS CASTILLO (tututututut...)
    const MARIO_CASTLE_RIFF = [155.56, 155.56, 146.83, 146.83, 138.59, 138.59, 130.81, 130.81];
    let castleStep = 0;

    function playMarioCastleBeat() {
        if (isMuted || document.hidden) return;
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

    // 3. CAREER AMBIENCE
    const CAREER_CHORDS = [
        [329.63, 392.00, 493.88], [293.66, 369.99, 440.00],
        [261.63, 329.63, 392.00], [246.94, 311.13, 369.99]
    ];
    let careerChordIdx = 0;

    function playCareerAmbience() {
        if (isMuted || document.hidden) return;
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
        activePage = "dashboard";
        stopAllMusic();
        if (!isMuted && !document.hidden) {
            playZeldaOcarina();
            ocarinaInterval = setInterval(playZeldaOcarina, 7000);
        }
    }

    function start1v1MarioCastle() {
        activePage = "vsBattle";
        stopAllMusic();
        if (!isMuted && !document.hidden) {
            castleStep = 0;
            playMarioCastleBeat();
            marioInterval = setInterval(playMarioCastleBeat, 240);
        }
    }

    function startCareerAmbience() {
        activePage = "career";
        stopAllMusic();
        if (!isMuted && !document.hidden) {
            playCareerAmbience();
            careerInterval = setInterval(playCareerAmbience, 3600);
        }
    }

    function toggleMute() {
        isMuted = !isMuted;
        const btn = document.getElementById("musicToggleBtn");
        if (isMuted) {
            stopAllMusic();
            if (btn) btn.textContent = "🔈";
        } else {
            if (btn) btn.textContent = "🔊";
            if (activePage === "dashboard") startDashboardZelda();
            else if (activePage === "vsBattle") start1v1MarioCastle();
            else if (activePage === "career") startCareerAmbience();
        }
        return isMuted;
    }

    // PAUSA AUTOMÁTICA AL MINIMIZAR / SEGUNDO PLANO
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAllMusic();
        } else {
            if (!isMuted) {
                if (activePage === "dashboard") startDashboardZelda();
                else if (activePage === "vsBattle") start1v1MarioCastle();
                else if (activePage === "career") startCareerAmbience();
            }
        }
    });

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
