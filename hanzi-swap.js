/* ==========================================================================
   ZIDONG CORE - HANZI-SWAP MINIGAME MODULE (PUZZLE + GRAVEDAD + PALABRAS)
   ========================================================================== */

(() => {
    "use strict";

    const ROWS = 4;
    const COLS = 4;

    const SWAP_WORDS = [
        { hanzi: "急停", pinyin: "jí tíng", meaning: "Paro de emergencia", xp: 40 },
        { hanzi: "自动", pinyin: "zì dòng", meaning: "Modo automático", xp: 40 },
        { hanzi: "气缸", pinyin: "qì gāng", meaning: "Cilindro neumático", xp: 45 },
        { hanzi: "电源", pinyin: "diàn yuán", meaning: "Fuente de alimentación", xp: 45 },
        { hanzi: "安全门", pinyin: "ān quán mén", meaning: "Puerta de seguridad", xp: 50 },
        { hanzi: "传感器", pinyin: "chuán gǎn qì", meaning: "Sensor de detección", xp: 55 }
    ];

    const CHAR_POOL = ["急", "停", "自", "动", "气", "缸", "电", "源", "安", "全", "门", "传", "感", "器"];

    let board = [];
    let selected = null;
    let targetWord = SWAP_WORDS[0];
    let swapScore = 0;
    let comboCount = 0;

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
            <button type="button" class="back-button" onclick="window.exitHanziSwap()" style="margin-top: 14px;">← REGRESAR AL DASHBOARD</button>
        `;
        mainEl.appendChild(sec);
        return sec;
    }

    function renderSwapArena() {
        const root = document.getElementById("swapArenaRoot");
        if (!root) return;

        const neededChars = targetWord.hanzi.split("");

        root.innerHTML = `
            <div class="swap-hud-row">
                <div class="swap-hud-pill"><span>PUNTAJE</span><strong id="swapScoreVal">${swapScore} XP</strong></div>
                <div class="swap-hud-pill"><span>COMBO</span><strong id="swapComboVal" style="color:var(--gold);">x${Math.max(1, comboCount)}</strong></div>
            </div>
            <div class="swap-target-box">
                <small>FORMA EN FILA O COLUMNA:</small>
                <div class="swap-target-meaning">"${targetWord.meaning}"</div>
                <div class="swap-target-hint">Pinyin: <strong>${targetWord.pinyin}</strong> · Piezas: <strong>${neededChars.length} Hanzi</strong></div>
            </div>
            <div class="swap-grid-4x4" id="swapGrid4x4"></div>
            <div class="swap-actions-bar">
                <button type="button" class="swap-mini-btn" id="swapShuffleBtn">🔄 Reacomodar</button>
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

        const shufBtn = document.getElementById("swapShuffleBtn");
        if (shufBtn) {
            shufBtn.onclick = () => {
                if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
                selected = null;
                comboCount = 0;
                initBoard();
                renderSwapArena();
            };
        }

        const skipBtn = document.getElementById("swapSkipBtn");
        if (skipBtn) {
            skipBtn.onclick = () => {
                if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
                selected = null;
                pickTarget();
                initBoard();
                renderSwapArena();
            };
        }
    }

    function handleTileClick(r, c, cellEl) {
        if (!selected) {
            selected = { r, c };
            if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
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
            if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
            renderSwapArena();
            return;
        }

        const r1 = selected.r;
        const c1 = selected.c;
        const temp = board[r1][c1];
        board[r1][c1] = board[r][c];
        board[r][c] = temp;
        selected = null;

        const matchedCoords = checkTargetFormed();
        if (matchedCoords) {
            comboCount++;
            const gained = targetWord.xp + (comboCount - 1) * 10;
            swapScore += gained;

            if (window.currentUserData) {
                window.currentUserData.xp = (window.currentUserData.xp || 0) + gained;
                if (typeof window.updateProfile === "function") window.updateProfile();
            }

            if (typeof window.triggerHaptic === "function") window.triggerHaptic("win");
            if (typeof window.speakMandarin === "function") window.speakMandarin(targetWord.hanzi);

            matchedCoords.forEach(([mr, mc]) => {
                board[mr][mc] = null;
            });
            renderSwapArena();

            const gridEl = document.getElementById("swapGrid4x4");
            if (gridEl) {
                matchedCoords.forEach(([mr, mc]) => {
                    const idx = mr * COLS + mc;
                    if (gridEl.children[idx]) {
                        gridEl.children[idx].classList.add("is-matched");
                    }
                });
            }

            setTimeout(() => {
                applyGravity();
                pickTarget();
                const newChars = targetWord.hanzi.split("");
                newChars.forEach((nch, i) => {
                    board[0][i % COLS] = nch;
                });
                renderSwapArena();
            }, 360);
        } else {
            comboCount = 0;
            if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
            renderSwapArena();
            if (cellEl) {
                cellEl.classList.add("is-swapped");
            }
        }
    }

    window.openHanziSwap = function() {
        ensureViewSection();
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        if (typeof window.navigateTo === "function") window.navigateTo("hanziSwapPage");
        selected = null;
        comboCount = 0;
        pickTarget();
        initBoard();
        renderSwapArena();
    };

    window.exitHanziSwap = function() {
        selected = null;
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    };
})();
