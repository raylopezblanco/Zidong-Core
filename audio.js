/* ==========================================================================
   ZIDONG AUDIO ENGINE 10.0 (WEB AUDIO API NATIVA)
   - Reproducción inmediata en Career Mode (menú de mundos planetarios)
   - Feedback acústico al seleccionar mundos
   - Suspenso tenso para Survivor Mode (+3s)
   - Mario Castle + Tic-Tac para 1v1 Battle
   - Loop espacial en Lobby
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
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

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
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
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
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
    }

    // SONIDO PLANETA / MUNDO INTERACTIVO
    function playPlanetChime() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.38);
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

    // TIC-TAC DE RELOJ (1V1)
    function playClockTick(isTock = false) {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(isTock ? 720 : 1150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // 1. MÚSICA LOBBY / DASHBOARD
    const SPACE_CHORDS = [
        [440, 554.37, 659.25],
        [392, 493.88, 587.33]
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
            gain.gain.linearRampToValueAtTime(0.022, now + 0.4);
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
        osc.frequency.setValueAtTime(isAccent ? 75 : 58, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

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

    // 4. MÚSICA CAREER MODE / MUNDOS PLANETARIOS (ARPEGIO ESPACIAL CÁLIDO)
    const OBERON_CHORDS = [
        [220, 261.63, 329.63, 440],
        [261.63, 329.63, 392.00, 523],
        [196.00, 246.94, 293.66, 392]
    ];
    let oberonStep = 0;

    function playOberonLoop() {
        if (isMuted || document.hidden) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chord = OBERON_CHORDS[oberonStep % OBERON_CHORDS.length];
        oberonStep++;

        chord.forEach(freq => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.025, now + 0.6);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 2.7);
        });
    }

    function switchTrack(trackName) {
        if (currentTrackName === trackName) return;
        stopAllMusic();
        currentTrackName = trackName;

        if (isMuted || document.hidden) return;

        if (trackName === "dashboard") {
            playSpaceShortLoop();
            currentInterval = setInterval(playSpaceShortLoop, 2800);
        } else if (trackName === "career" || trackName === "oberon") {
            playOberonLoop();
            currentInterval = setInterval(playOberonLoop, 2900);
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
            const target = currentTrackName || "dashboard";
            currentTrackName = "";
            switchTrack(target);
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
        playPlanetChime,
        switchTrack,
        stopAllMusic,
        toggleMute,
        isMuted: () => isMuted
    };
})();
