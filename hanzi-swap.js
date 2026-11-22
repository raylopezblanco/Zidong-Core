/* ==========================================================================
   ZIDONG CORE - HANZI-SWAP MINIGAME MODULE (PUZZLE + GRAVEDAD + MOVIMIENTOS)
   ========================================================================== */

(() => {
    "use strict";

    const ROWS = 4;
    const COLS = 4;
    const MAX_MOVES_PER_WORD = 10;
    const OBSERVE_DELAY_MS = 1150;

    const SWAP_WORDS = [
        { hanzi: "急停", pinyin: "jí tíng", meaning: "Paro de emergencia", xp: 45 },
        { hanzi: "自动", pinyin: "zì dòng", meaning: "Modo automático", xp: 45 },
        { hanzi: "气缸", pinyin: "qì gāng", meaning: "Cilindro neumático", xp: 50 },
        { hanzi: "电源", pinyin: "diàn yuán", meaning: "Fuente de alimentación", xp: 50 },
        { hanzi: "安全门", pinyin: "ān quán mén", meaning: "Puerta de seguridad", xp: 55 },
        { hanzi: "传感器", pinyin: "chuán gǎn qì", meaning: "Sensor de detección", xp: 60 }
    ];

    const CHAR_POOL = ["急", "停", "自", "动", "气", "缸", "电", "源", "安", "全", "门", "传", "感", "器"];

    let board = [];
    let selected = null;
    let targetWord = SWAP_WORDS[0];
    let swapScore = 0;
    let comboCount = 0;
    let maxComboAchieved = 0;
    let wordsClearedCount = 0;
    let movesLeft = MAX_MOVES_PER_WORD;
    let roundBusy = false;
    let outOfMovesNotice = "";

    function loadSwapStats() {
        const savedBestCombo = Number(localStorage.getItem("zidong_swap_max_combo") || 0);
        const savedCleared = Number(localStorage.getItem("zidong_swap_cleared") || 0);
        maxComboAchieved = Math.max(maxComboAchieved, savedBestCombo);
        wordsClearedCount = Math.max(wordsClearedCount, savedCleared);
    }

    function saveSwapStats() {
        const best = Math.max(maxComboAchieved, comboCount);
        maxComboAchieved = best;
        localStorage.setItem("zidong_swap_max_combo", String(best));
        localStorage.setItem("zidong_swap_cleared", String(wordsClearedCount));
        const prevMaxScore = Number(localStorage.getItem("zidong_swap_max_score") || 0);
        if (swapScore > prevMaxScore) {
            localStorage.setItem("zidong_swap_max_score", String(swapScore));
        }
        if (window.currentUserData) {
            window.currentUserData.swapMaxCombo = best;
            window.currentUserData.swapCleared = wordsClearedCount;
            if (typeof window.updateProfile === "function") window.updateProfile();
        }
    }

    function getComboColor(c) {
        if (c >= 4) return "#ff4fd8"; // Magenta overclock
        if (c === 3) return "#ffc857"; // Dorado
        if (c === 2) return "#00f59b"; // Verde neón
        return "#27d8e8";              // Cian base
    }

    function pickTarget() {
        const candidates = SWAP_WORDS.filter(w => w.hanzi !== targetWord.hanzi);
        targetWord = candidates[Math.floor(Math.random() * candidates.length)] || SWAP_WORDS[0];
    }

    function randomChar(excludeChar = "") {
        const pool = CHAR_POOL.filter(c => c !== excludeChar);
        return pool[Math.floor(Math.random() * pool.length)] || "电";
    }

    function initBoard() {
        board = [];
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push(randomChar());
            }
            board.push(row);
        }
        const chars = targetWord.hanzi.split("");
        chars.forEach((ch, idx) => {
            const r = Math.floor(idx / COLS);
            const c = idx % COLS;
            if (board[r] && typeof board[r][c] !== "undefined") {
                board[r][c] = ch;
            }
        });
    }

    function resetFullGame(reasonMsg = "") {
        selected = null;
        roundBusy = false;
        swapScore = 0;
        comboCount = 0;
        movesLeft = MAX_MOVES_PER_WORD;
        outOfMovesNotice = reasonMsg;
        pickTarget();
        initBoard();
        renderSwapArena();
    }

    function applyGravity() {
        for (let c = 0; c < COLS; c++) {
            const kept = [];
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r][c] !== null) {
                    kept.push(board[r][c]);
                }
            }
            for (let r = ROWS - 1, i = 0; r >= 0; r--, i++) {
                board[r][c] = i < kept.length ? kept[i] : randomChar();
            }
        }
    }

    function checkTargetFormed() {
        const needed = targetWord.hanzi.split("");
        for (let r = 0; r < ROWS; r++) {
            const rowStr = board[r].join("");
            if (rowStr.includes(targetWord.hanzi)) {
                const start = rowStr.indexOf(targetWord.hanzi);
                const coords = [];
                for (let k = 0; k < needed.length; k++) coords.push([r, start + k]);
                return coords;
            }
        }
        for (let c = 0; c < COLS; c++) {
            const colArr = [];
            for (let r = 0; r < ROWS; r++) colArr.push(board[r][c]);
            const colStr = colArr.join("");
            if (colStr.includes(targetWord.hanzi)) {
                const start = colStr.indexOf(targetWord.hanzi);
                const coords = [];
                for (let k = 0; k < needed.length; k++) coords.push([start + k, c]);
                return coords;
            }
        }
        return null;
    }

    function ensureViewSection() {
        let sec = document.getElementById("hanziSwapPage");
        if (sec) return sec;

        const mainEl = document.querySelector("main.app-shell");
        if (!mainEl) return null;

        sec = document.createElement("section");
        sec.id = "hanziSwapPage";
        sec.className = "page";
        sec.innerHTML = `
            <div class="welcome">
                <span class="eyebrow" style="color:var(--cyan);">PUZZLE + GRAVEDAD · OBERON</span>
                <h2>Hanzi-Swap</h2>
            </div>
            <div id="swapArenaRoot" class="swap-arena-card"></div>
            <button type="button" class="level-abandon-btn" onclick="window.abandonHanziSwap()">✕ ABANDONAR NIVEL</button>
        `;
        mainEl.appendChild(sec);
        return sec;
    }

    function renderSwapArena() {
        const root = document.getElementById("swapArenaRoot");
        if (!root) return;

        const neededChars = targetWord.hanzi.split("");
        const comboColor = getComboColor(comboCount);
        const movesColor = movesLeft <= 3 ? "var(--red)" : movesLeft <= 6 ? "var(--gold)" : "var(--cyan)";

        root.innerHTML = `
            <div class="swap-hud-row">
                <div class="swap-hud-pill"><span>XP</span><strong id="swapScoreVal">+${swapScore}</strong></div>
                <div class="swap-hud-pill"><span>MOVIMIENTOS</span><strong id="swapMovesVal" style="color:${movesColor};">${movesLeft}/${MAX_MOVES_PER_WORD}</strong></div>
                <div class="swap-hud-pill"><span>COMBO</span><strong id="swapComboVal" style="color:${comboColor};">x${Math.max(1, comboCount)}</strong></div>
            </div>
            ${outOfMovesNotice ? `<div class="swap-reset-banner">${outOfMovesNotice}</div>` : ""}
            <div class="swap-target-box">
                <small>ARMA LA PALABRA EN ${MAX_MOVES_PER_WORD} MOVIMIENTOS:</small>
                <div class="swap-target-meaning">"${targetWord.meaning}"</div>
                <div class="swap-target-hint">Pinyin: <strong>${targetWord.pinyin}</strong> · Piezas: <strong>${neededChars.length} Hanzi</strong></div>
            </div>
            <div class="swap-grid-4x4" id="swapGrid4x4"></div>
            <div class="swap-actions-bar">
                <button type="button" class="swap-mini-btn" id="swapRestartBtn">🔁 Reiniciar</button>
                <button type="button" class="swap-mini-btn" id="swapSkipBtn">⏭️ Otra palabra</button>
            </div>
        `;

        const gridEl = document.getElementById("swapGrid4x4");
        if (!gridEl) return;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const ch = board[r][c];
                const cell = document.createElement("button");
                cell.type = "button";
                cell.className = "swap-tile-btn";
                if (selected && selected.r === r && selected.c === c) {
                    cell.classList.add("is-selected");
                }
                cell.textContent = ch;
                cell.onclick = () => handleTileClick(r, c, cell);
                gridEl.appendChild(cell);
            }
        }

        const resBtn = document.getElementById("swapRestartBtn");
        if (resBtn) {
            resBtn.onclick = () => {
                if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
                resetFullGame("");
            };
        }

        const skipBtn = document.getElementById("swapSkipBtn");
        if (skipBtn) {
            skipBtn.onclick = () => {
                if (roundBusy) return;
                if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
                selected = null;
                movesLeft = MAX_MOVES_PER_WORD;
                outOfMovesNotice = "";
                pickTarget();
                initBoard();
                renderSwapArena();
            };
        }
    }

    function handleTileClick(r, c, cellEl) {
        if (roundBusy) return;
        outOfMovesNotice = "";

        if (!selected) {
            selected = { r, c };
            if (window.ZidongAudio && typeof window.ZidongAudio.playSwapSelect === "function") {
                window.ZidongAudio.playSwapSelect();
            }
            if (navigator.vibrate) navigator.vibrate(20);
            renderSwapArena();
            return;
        }

        if (selected.r === r && selected.c === c) {
            selected = null;
            renderSwapArena();
            return;
        }

        const dist = Math.abs(selected.r - r) + Math.abs(selected.c - c);
        if (dist !== 1) {
            selected = { r, c };
            if (window.ZidongAudio && typeof window.ZidongAudio.playSwapSelect === "function") {
                window.ZidongAudio.playSwapSelect();
            }
            renderSwapArena();
            return;
        }

        const r1 = selected.r;
        const c1 = selected.c;
        const temp = board[r1][c1];
        board[r1][c1] = board[r][c];
        board[r][c] = temp;
        selected = null;
        movesLeft = Math.max(0, movesLeft - 1);

        if (window.ZidongAudio && typeof window.ZidongAudio.playSwapMove === "function") {
            window.ZidongAudio.playSwapMove();
        }

        const matchedCoords = checkTargetFormed();
        if (matchedCoords) {
            roundBusy = true;
            comboCount++;
            wordsClearedCount++;
            const gained = targetWord.xp + (comboCount - 1) * 15;
            swapScore += gained;

            if (window.currentUserData) {
                window.currentUserData.xp = (window.currentUserData.xp || 0) + gained;
            }
            saveSwapStats();

            if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
            if (window.ZidongAudio && typeof window.ZidongAudio.playSwapClear === "function") {
                window.ZidongAudio.playSwapClear();
            }
            if (typeof window.speakMandarin === "function") window.speakMandarin(targetWord.hanzi);

            // Renderizar con resaltado y tiempo para observar la palabra armada antes de purgarla
            renderSwapArena();
            const gridEl = document.getElementById("swapGrid4x4");
            if (gridEl) {
                matchedCoords.forEach(([mr, mc]) => {
                    const idx = mr * COLS + mc;
                    const tile = gridEl.children[idx];
                    if (tile) {
                        tile.classList.add("is-matched");
                    }
                });
            }

            setTimeout(() => {
                const g = document.getElementById("swapGrid4x4");
                if (g) {
                    matchedCoords.forEach(([mr, mc]) => {
                        const idx = mr * COLS + mc;
                        const tile = g.children[idx];
                        if (tile) tile.classList.add("is-purging");
                    });
                }
            }, Math.max(450, OBSERVE_DELAY_MS - 350));

            setTimeout(() => {
                matchedCoords.forEach(([mr, mc]) => {
                    board[mr][mc] = null;
                });
                applyGravity();
                movesLeft = MAX_MOVES_PER_WORD;
                pickTarget();
                const newChars = targetWord.hanzi.split("");
                newChars.forEach((nch, i) => {
                    board[0][i % COLS] = nch;
                });
                roundBusy = false;
                renderSwapArena();
            }, OBSERVE_DELAY_MS);
        } else if (movesLeft <= 0) {
            roundBusy = true;
            if (typeof window.triggerHaptic === "function") window.triggerHaptic("error");
            renderSwapArena();
            const root = document.getElementById("swapArenaRoot");
            if (root) root.classList.add("career-shake");
            setTimeout(() => {
                if (root) root.classList.remove("career-shake");
                resetFullGame(`⚠️ Sin movimientos (${MAX_MOVES_PER_WORD}). ¡Se reinició la partida de Hanzi-Swap!`);
            }, 650);
        } else {
            renderSwapArena();
            if (cellEl) {
                cellEl.classList.add("is-swapped");
            }
        }
    }

    window.openHanziSwap = function() {
        loadSwapStats();
        ensureViewSection();
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("hanziSwapPage");
        resetFullGame("");
    };

    window.abandonHanziSwap = function() {
        const cleared = wordsClearedCount;
        selected = null;
        roundBusy = false;
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("error");
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        const msg = cleared > 0
            ? `¿Te rajaste en Hanzi-Swap tras armar ${cleared} palabra(s)? Sigue preparándote, renacuajo. 🐸🧩`
            : "¿Te rajaste en Hanzi-Swap sin armar ni una palabra? Sigue preparándote, renacuajo. 🐸🧩";
        if (typeof window.showCyberAlert === "function") {
            window.showCyberAlert("NIVEL ABANDONADO", msg, "🐸");
        }
    };

    window.exitHanziSwap = window.abandonHanziSwap;
})();
