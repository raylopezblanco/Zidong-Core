/* ==========================================================================
   ZIDONG AUDIO ENGINE 7.0 (WEB AUDIO API NATIVA)
   - Transiciones limpias entre menús (corta música anterior e inicia la nueva)
   - Música de suspenso tensa (latido/sonar) para Survivor Mode
   - Bowser Castle + Tic-Tac para 1v1
   - Zelda Ocarina para Dashboard
   - Aventura espacial para Sistema OBERON (Career)
   - Detención en segundo plano
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let currentInterval = null;
    let isMuted = false;
    let currentTrackName = "";

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

    function stopAllMusic() {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        }
        currentTrackName = "";
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

    // SONIDO COLAPSO LÍNEA
    function playLineCollapse() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.55);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
    }

    // SONIDO VICTORIA / SUBIDA DE RANGO
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

    // TIC-TAC DE RELOJ SINTETIZADO (1V1)
    function playClockTick(isTock = false) {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(isTock ? 750 : 1150, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // 1. ZELDA OCARINA (DASHBOARD)
    const ZELDA_NOTES = [
        { f: 440, d: 0.35 }, { f: 523.25, d: 0.35 }, { f: 587.33, d: 0.75 },
        { f: 440, d: 0.35 }, { f: 523.25, d: 0.35 }, { f: 587.33, d: 0.75 },
        { f: 659.25, d: 0.35 }, { f: 587.33, d: 0.35 }, { f: 523.25, d: 0.35 },
        { f: 493.88, d: 0.35 }, { f: 523.25, d: 0.75 }
    ];

    function playZeldaPhrase() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        let delay = 0;
        ZELDA_NOTES.forEach(n => {
            const now = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(n.f, now);

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

    // 2. MUSICA DE SUSPENSO TENSO (SURVIVOR MODE - PULSO DE RADAR / LATIDO OSCURO)
    let suspenseBeat = 0;
    function playSuspensePulse() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        suspenseBeat++;
        const isAccent = (suspenseBeat % 4 === 1);

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(isAccent ? 82.41 : 65.41, now); // E2 o C2
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(isAccent ? 350 : 200, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(isAccent ? 0.08 : 0.045, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    }

    // 3. BOWSER CASTLE MARIO BROS (tututututut... PARA 1V1)
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

    // 4. AVENTURA ESPACIAL OBERON (CAREER)
    const OBERON_CHORDS = [
        [220, 261.63, 329.63, 440],   // Am
        [261.63, 329.63, 392.00, 523], // C
        [196.00, 246.94, 293.66, 392], // G
        [164.81, 207.65, 246.94, 329]  // E
    ];
    let oberonChordIdx = 0;
    function playOberonAmbience() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chord = OBERON_CHORDS[oberonChordIdx % OBERON_CHORDS.length];
        oberonChordIdx++;

        chord.forEach(freq => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.022, now + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 3.4);
        });
    }

    // CONTROLADORES DE RUTA (CORTA ANTERIOR E INICIA NUEVA)
    function switchTrack(trackName) {
        if (currentTrackName === trackName) return;
        stopAllMusic();
        currentTrackName = trackName;

        if (isMuted || document.hidden) return;

        if (trackName === "dashboard") {
            playZeldaPhrase();
            currentInterval = setInterval(playZeldaPhrase, 7000);
        } else if (trackName === "survivor") {
            suspenseBeat = 0;
            playSuspensePulse();
            currentInterval = setInterval(playSuspensePulse, 600); // Latido de suspenso cada 0.6s
        } else if (trackName === "vsBattle") {
            castleStep = 0;
            playMarioCastleBeat();
            currentInterval = setInterval(playMarioCastleBeat, 240); // tututututut
        } else if (trackName === "oberon") {
            playOberonAmbience();
            currentInterval = setInterval(playOberonAmbience, 3600);
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
            const current = currentTrackName || "dashboard";
            currentTrackName = "";
            switchTrack(current);
        }
        return isMuted;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAllMusic();
        } else if (!isMuted && currentTrackName) {
            const prev = currentTrackName;
            currentTrackName = "";
            switchTrack(prev);
        }
    });

    window.ZidongAudio = {
        playSuccess,
        playError,
        playLineCollapse,
        playVictory,
        playClockTick,
        switchTrack,
        stopAllMusic,
        toggleMute,
        isMuted: () => isMuted
    };
})();
