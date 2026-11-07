/* ==========================================================================
   ZIDONG AUDIO ENGINE 8.0 (WEB AUDIO API)
   - Loop espacial de lobby ultracorto (3s) para corte instantáneo al cambiar de menú
   - Suspenso tenso para Survivor Mode (+3s por alarma)
   - Mario Castle + Tic-Tac para 1v1
   - Pausa estricta en segundo plano / corte inmediato
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let currentInterval = null;
    let isMuted = false;
    let currentTrack = "";

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
        currentTrack = "";
    }

    // SONIDO ACIERTO / BONO +3S
    function playSuccess() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.24);
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
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // SONIDO COLAPSO
    function playLineCollapse() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
    }

    // SONIDO VICTORIA
    function playVictory() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const now = ctx.currentTime + (idx * 0.08);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        });
    }

    // RELOJ TIC-TAC PARA 1V1
    function playClockTick(isTock = false) {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(isTock ? 700 : 1100, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // 1. MÚSICA DE LOBBY ESPACIAL CORTA (3s LOOP PARA CORTE INSTANTÁNEO)
    const SPACE_CHORDS = [
        [440, 554.37, 659.25], // A major
        [392, 493.88, 587.33]  // G major
    ];
    let spaceStep = 0;

    function playSpaceShortLoop() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chord = SPACE_CHORDS[spaceStep % SPACE_CHORDS.length];
        spaceStep++;

        chord.forEach(freq => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.025, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 2.0);
        });
    }

    // 2. MÚSICA DE SUSPENSO (SURVIVOR MODE)
    let suspenseBeat = 0;
    function playSuspenseBeat() {
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
        osc.frequency.setValueAtTime(isAccent ? 78 : 60, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(isAccent ? 320 : 180, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(isAccent ? 0.08 : 0.04, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    // 3. BOWSER CASTLE (1V1)
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

    // CAMBIAR PISTA AL NAVEGAR (CORTE LIMPIO E INMEDIATO)
    function switchTrack(trackName) {
        if (currentTrack === trackName) return;
        stopAllMusic();
        currentTrack = trackName;

        if (isMuted || document.hidden) return;

        if (trackName === "dashboard") {
            playSpaceShortLoop();
            currentInterval = setInterval(playSpaceShortLoop, 2800); // Bucle corto de 2.8s
        } else if (trackName === "survivor") {
            suspenseBeat = 0;
            playSuspenseBeat();
            currentInterval = setInterval(playSuspenseBeat, 550);
        } else if (trackName === "vsBattle") {
            castleStep = 0;
            playMarioCastleBeat();
            currentInterval = setInterval(playMarioCastleBeat, 240);
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
            const target = currentTrack || "dashboard";
            currentTrack = "";
            switchTrack(target);
        }
        return isMuted;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAllMusic();
        } else if (!isMuted && currentTrack) {
            const prev = currentTrack;
            currentTrack = "";
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
