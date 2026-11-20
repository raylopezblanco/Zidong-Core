/* ==========================================================================
   ZIDONG AUDIO ENGINE 11.0 (WEB AUDIO API NATIVA - BGM POR MODO + CORTE SECO)
   - Home: Espacial suave y relajante (sin estresar)
   - Career (mundos, niveles, fases, boss): Estilo Zelda Ocarina cálido
   - Endless / Survivor: Pulso contra reloj tenso
   - 1v1 Battle: Suspenso atmosférico
   - Corte abrupto al cambiar de modo/menú
   - Ladrido sintetizado al tocar el Cyberdog
   ========================================================================== */

(() => {
    "use strict";

    let audioCtx = null;
    let loopTimer = null;
    let isMuted = false;
    let activeTrack = "";
    let stepIndex = 0;

    function getCtx() {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    // Corte seco inmediato de cualquier loop o nota programada
    function stopAllMusic() {
        if (loopTimer) {
            clearInterval(loopTimer);
            loopTimer = null;
        }
        activeTrack = "";
        stepIndex = 0;
    }

    function playTone(freq, duration, type = "sine", volume = 0.05, delay = 0, slideTo = null) {
        if (isMuted || document.hidden) return;
        const ctx = getCtx();
        if (!ctx) return;

        const now = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + Math.min(0.04, duration * 0.25));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
    }

    // SFX: Acierto
    function playSuccess() {
        if (isMuted || document.hidden) return;
        playTone(587.33, 0.14, "sine", 0.11, 0, 880);
    }

    // SFX: Error
    function playError() {
        if (isMuted || document.hidden) return;
        playTone(165, 0.18, "triangle", 0.13, 0, 82);
    }

    // SFX: Victoria
    function playVictory() {
        if (isMuted || document.hidden) return;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => playTone(f, 0.18, "sine", 0.11, i * 0.08));
    }

    // SFX: Ladrido del Cyberdog ("¡Guau!")
    function playBark() {
        if (isMuted || document.hidden) return;
        const ctx = getCtx();
        if (!ctx) return;

        // Doble ladrido corto y juguetón
        [0, 0.19].forEach((offset, idx) => {
            const now = ctx.currentTime + offset;
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = "sawtooth";
            const baseFreq = idx === 0 ? 230 : 265;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.045);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.68, now + 0.13);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(780, now);
            filter.Q.setValueAtTime(2.2, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.16, now + 0.018);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        });
    }

    // SFX casuales para Hanzi-Swap
    function playSwapSelect() {
        if (isMuted || document.hidden) return;
        playTone(520, 0.06, "sine", 0.075, 0, 680);
    }

    function playSwapMove() {
        if (isMuted || document.hidden) return;
        playTone(340, 0.08, "triangle", 0.085, 0, 490);
    }

    // Sonido casual tipo papelera / purga suave al limpiar palabra (sin fanfarrias)
    function playSwapClear() {
        if (isMuted || document.hidden) return;
        const ctx = getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(920, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.16);
        filter.Q.setValueAtTime(1.8, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.17);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // 5. HANZI-SWAP BGM: Ritmo puzzle ciber-técnico ligero
    const SWAP_MELODY = [329.63, 440.00, 493.88, 587.33, 493.88, 440.00];
    function tickSwapPuzzle() {
        const note = SWAP_MELODY[stepIndex % SWAP_MELODY.length];
        stepIndex++;
        playTone(note, 0.22, "triangle", 0.028, 0);
        if (stepIndex % 2 === 0) {
            playTone(note * 0.5, 0.28, "sine", 0.02, 0.04);
        }
    }

    // 1. HOME: Espacial suave y relajante (pad + arpegio ligero)
    const HOME_PADS = [
        [220, 277.18, 329.63],
        [196.00, 246.94, 293.66],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 329.63]
    ];
    function tickHomeSpace() {
        const chord = HOME_PADS[stepIndex % HOME_PADS.length];
        stepIndex++;
        chord.forEach((f, idx) => {
            playTone(f, 2.1, "sine", 0.018, idx * 0.18);
        });
    }

    // 2. CAREER MODE: Estilo Zelda Ocarina (melodía suave tipo flauta de ocarina + arpegio)
    // Frase lírica inspirada en melodías de ocarina (D5, A4, F#5, E5, D5, B4, A4...)
    const OCARINA_NOTES = [
        { f: 587.33, d: 0.42, t: "sine", v: 0.045 },  // D5
        { f: 440.00, d: 0.35, t: "sine", v: 0.035 },  // A4
        { f: 739.99, d: 0.45, t: "sine", v: 0.045 },  // F#5
        { f: 659.25, d: 0.35, t: "sine", v: 0.04 },   // E5
        { f: 587.33, d: 0.48, t: "sine", v: 0.045 },  // D5
        { f: 493.88, d: 0.35, t: "sine", v: 0.035 },  // B4
        { f: 440.00, d: 0.50, t: "sine", v: 0.04 }    // A4
    ];
    function tickCareerOcarina() {
        const n = OCARINA_NOTES[stepIndex % OCARINA_NOTES.length];
        stepIndex++;
        // Pequeño vibrato sutil de ocarina mediante ligadura de frecuencia
        playTone(n.f * 0.992, n.d, n.t, n.v, 0, n.f * 1.008);
    }

    // 3. ENDLESS / SURVIVOR: Pulso contra reloj (tic-tac acelerado)
    function tickEndlessClock() {
        stepIndex++;
        const urgent = stepIndex % 2 === 1;
        playTone(urgent ? 980 : 660, 0.07, "square", 0.045, 0, urgent ? 520 : 380);
    }

    // 4. 1V1 BATTLE: Suspenso grave y tenso
    const VS_TENSION_NOTES = [110, 116.54, 103.83, 123.47];
    function tickVsSuspense() {
        const base = VS_TENSION_NOTES[stepIndex % VS_TENSION_NOTES.length];
        stepIndex++;
        playTone(base, 0.52, "sawtooth", 0.032, 0, base * 0.92);
        playTone(base * 1.5, 0.35, "triangle", 0.022, 0.15);
    }

    function switchTrack(trackName) {
        if (!trackName) return;
        const ctx = getCtx();
        if (ctx && ctx.state === "suspended") {
            ctx.resume().catch(() => {});
        }
        stopAllMusic();
        activeTrack = trackName;

        if (isMuted || document.hidden) return;

        if (trackName === "home") {
            tickHomeSpace();
            loopTimer = setInterval(tickHomeSpace, 2400);
        } else if (trackName === "career") {
            tickCareerOcarina();
            loopTimer = setInterval(tickCareerOcarina, 480);
        } else if (trackName === "endless") {
            tickEndlessClock();
            loopTimer = setInterval(tickEndlessClock, 500);
        } else if (trackName === "vs") {
            tickVsSuspense();
            loopTimer = setInterval(tickVsSuspense, 620);
        } else if (trackName === "swap") {
            tickSwapPuzzle();
            loopTimer = setInterval(tickSwapPuzzle, 360);
        }
    }

    function syncTrackWithPage(pageId) {
        if (pageId === "career" || pageId === "worldDetailsView" || pageId === "level01") {
            switchTrack("career");
        } else if (pageId === "arcade") {
            switchTrack("endless");
        } else if (pageId === "vsBattle") {
            switchTrack("vs");
        } else if (pageId === "hanziSwapPage") {
            switchTrack("swap");
        } else {
            switchTrack("home");
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
            const target = activeTrack || "home";
            activeTrack = "";
            switchTrack(target);
        }
        return isMuted;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (loopTimer) {
                clearInterval(loopTimer);
                loopTimer = null;
            }
        } else if (!isMuted && activeTrack) {
            const prev = activeTrack;
            activeTrack = "";
            switchTrack(prev);
        }
    });

    window.ZidongAudio = {
        playSuccess,
        playError,
        playVictory,
        playBark,
        playSwapSelect,
        playSwapMove,
        playSwapClear,
        switchTrack,
        syncTrackWithPage,
        stopAllMusic,
        toggleMute,
        isMuted: () => isMuted
    };
})();
