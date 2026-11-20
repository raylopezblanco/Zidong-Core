/* ==========================================================================
   ZIDONG CORE - 1V1 BATTLE MODULE (DUELO CONTRA IA EN 3 NIVELES)
   ========================================================================== */


window.VS_DIFFICULTIES = {
    EASY: {
        name: "Simulador de Enlace",
        badge: "NIVEL 1 · HANZI SIMPLE",
        prob: 0.82,
        points: 100,
        winBonus: 100
    },
    MEDIUM: {
        name: "Servocontrolador Overclock",
        badge: "NIVEL 2 · PALABRAS INDUSTRIALES",
        prob: 0.85,
        points: 100,
        winBonus: 150
    },
    HARD: {
        name: "Protocolo Centinela IA",
        badge: "NIVEL 3 · ORDENAR PALABRAS",
        prob: 0.88,
        points: 100,
        winBonus: 250
    }
};

window.selectedVsDiffKey = "MEDIUM";
window.vsTimer = null;
window.vsTimeLeft = 20;
window.myVsPoints = 0;
window.rivalVsPoints = 0;
window.vsCurrentQuestion = null;
window.vsSelectedChars = [];
window.vsRoundLocked = false;
window.vsSessionActive = false;

window.VS_HANZI_DATA = [
    { hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Eléctrico" },
    { hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cable" },
    { hanzi: "模", pinyin: "mó", meaning: "Molde / Módulo" },
    { hanzi: "组", pinyin: "zǔ", meaning: "Grupo / Ensamble" },
    { hanzi: "机", pinyin: "jī", meaning: "Máquina" },
    { hanzi: "动", pinyin: "dòng", meaning: "Movimiento / Automático" },
    { hanzi: "停", pinyin: "tíng", meaning: "Parada / Detener" },
    { hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática" }
];

window.VS_WORD_DATA = [
    { hanzi: "急停", pinyin: "jí tíng", meaning: "Paro de emergencia" },
    { hanzi: "自动", pinyin: "zì dòng", meaning: "Modo automático" },
    { hanzi: "机器人", pinyin: "jī qì rén", meaning: "Robot industrial" },
    { hanzi: "传感器", pinyin: "chuán gǎn qì", meaning: "Sensor de detección" },
    { hanzi: "电源", pinyin: "diàn yuán", meaning: "Fuente de alimentación" },
    { hanzi: "气缸", pinyin: "qì gāng", meaning: "Cilindro neumático" },
    { hanzi: "安全门", pinyin: "ān quán mén", meaning: "Puerta de seguridad" }
];

window.vsShuffle = function(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

window.vsRandomItem = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

window.vsUpdateScores = function() {
    const myScoreEl = document.getElementById("vsMyScore");
    const rivalScoreEl = document.getElementById("vsRivalScore");
    if (myScoreEl) myScoreEl.textContent = `${window.myVsPoints} PTS`;
    if (rivalScoreEl) rivalScoreEl.textContent = `${window.rivalVsPoints} PTS`;
};

window.vsGetInstruction = function() {
    const stage = document.getElementById("vsStageCard");
    if (!stage) return null;
    let instruction = document.getElementById("vsInstruction");
    if (!instruction) {
        instruction = document.createElement("p");
        instruction.id = "vsInstruction";
        instruction.style.fontSize = "11px";
        instruction.style.color = "var(--muted)";
        instruction.style.marginBottom = "8px";
        const hanziEl = document.getElementById("vsHanziDisplay");
        if (hanziEl) {
            stage.insertBefore(instruction, hanziEl);
        } else {
            stage.appendChild(instruction);
        }
    }
    return instruction;
};

window.stopVsSession = function() {
    window.vsSessionActive = false;
    if (window.vsTimer) {
        clearInterval(window.vsTimer);
        window.vsTimer = null;
    }
};

window.openVsMode = function() {
    window.stopVsSession();

    if (typeof triggerHaptic === "function") {
        triggerHaptic("success");
    }

    if (typeof window.navigateTo === "function") {
        window.navigateTo("vsBattle");
    }

    const diffSelector = document.getElementById("vsDifficultySelector");
    const arena = document.getElementById("vsBattleArenaContainer");
    const defeat = document.getElementById("vsDefeatScreen");

    if (diffSelector) diffSelector.style.setProperty("display", "block", "important");
    if (arena) arena.style.setProperty("display", "none", "important");
    if (defeat) defeat.style.setProperty("display", "none", "important");
};

window.start1v1WithDifficulty = function(diffKey) {
    const diff = window.VS_DIFFICULTIES[diffKey];
    if (!diff) {
        console.error("Dificultad 1v1 desconocida:", diffKey);
        return;
    }

    window.stopVsSession();

    window.selectedVsDiffKey = diffKey;

    const selector = document.getElementById("vsDifficultySelector");
    const arena = document.getElementById("vsBattleArenaContainer");
    const defeat = document.getElementById("vsDefeatScreen");

    if (selector) selector.style.setProperty("display", "none", "important");
    if (defeat) defeat.style.setProperty("display", "none", "important");
    if (arena) arena.style.setProperty("display", "block", "important");

    const rivalName = document.getElementById("vsRivalName");
    const rivalAvatar = document.getElementById("vsRivalAvatar");
    const badge = document.getElementById("vsDiffBadge");

    if (rivalName) rivalName.textContent = diff.name;
    if (rivalAvatar) {
        rivalAvatar.textContent = diffKey === "HARD" ? "⚡" : diffKey === "MEDIUM" ? "🤖" : "⚙️";
    }
    if (badge) badge.textContent = diff.badge;

    window.myVsPoints = 0;
    window.rivalVsPoints = 0;
    window.vsTimeLeft = 20;
    window.vsSessionActive = true;
    window.vsRoundLocked = false;

    window.vsUpdateScores();

    const seconds = document.getElementById("vsSeconds");
    if (seconds) seconds.textContent = window.vsTimeLeft;

    const timerBar = document.getElementById("vsTimerBar");
    if (timerBar) timerBar.style.width = "100%";

    window.startVsRound();
    window.startVsTimer();
};

window.startVsRound = function() {
    if (!window.vsSessionActive || window.vsTimeLeft <= 0) return;
    window.vsRoundLocked = false;
    window.vsSelectedChars = [];

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    if (!display || !grid) return;

    grid.replaceChildren();

    if (window.selectedVsDiffKey === "EASY") {
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "1fr 1fr";
        window.loadVsLevel1SingleHanzi();
    } else if (window.selectedVsDiffKey === "MEDIUM") {
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "1fr 1fr";
        window.loadVsLevel2CompoundWord();
    } else if (window.selectedVsDiffKey === "HARD") {
        grid.style.display = "flex";
        grid.style.flexDirection = "column";
        window.loadVsLevel3OrderHanzi();
    }
};

window.loadVsLevel1SingleHanzi = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();
    if (!display || !grid) return;

    const correct = window.vsRandomItem(window.VS_HANZI_DATA);
    const wrongOptions = window.vsShuffle(
        window.VS_HANZI_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = window.vsShuffle([correct, ...wrongOptions]);
    window.vsCurrentQuestion = correct;

    display.textContent = correct.hanzi;
    if (instruction) instruction.textContent = `¿Qué significa este Hanzi? (${correct.pinyin})`;

    options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reveal-button";
        button.style.background = "var(--surface-light)";
        button.style.color = "#fff";
        button.style.border = "1px solid var(--border)";
        button.style.padding = "12px 8px";
        button.style.fontWeight = "800";
        button.style.fontSize = "11.5px";
        button.style.lineHeight = "1.25";
        button.textContent = option.meaning;

        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (window.vsRoundLocked || !window.vsSessionActive) return;
            window.submitVsAnswer(option.hanzi === correct.hanzi, button);
        });
        grid.appendChild(button);
    });
};

window.loadVsLevel2CompoundWord = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();
    if (!display || !grid) return;

    const correct = window.vsRandomItem(window.VS_WORD_DATA);
    const wrongOptions = window.vsShuffle(
        window.VS_WORD_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = window.vsShuffle([correct, ...wrongOptions]);
    window.vsCurrentQuestion = correct;

    display.textContent = correct.hanzi;
    if (instruction) instruction.textContent = `Selecciona el significado de la palabra (${correct.pinyin}):`;

    options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reveal-button";
        button.style.background = "var(--surface-light)";
        button.style.color = "#fff";
        button.style.border = "1px solid var(--border)";
        button.style.padding = "12px 8px";
        button.style.fontWeight = "800";
        button.style.fontSize = "11.5px";
        button.style.lineHeight = "1.25";
        button.textContent = option.meaning;

        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (window.vsRoundLocked || !window.vsSessionActive) return;
            window.submitVsAnswer(option.hanzi === correct.hanzi, button);
        });
        grid.appendChild(button);
    });
};

window.loadVsLevel3OrderHanzi = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();
    if (!display || !grid) return;

    const correct = window.vsRandomItem(window.VS_WORD_DATA);
    window.vsCurrentQuestion = correct;

    const correctChars = correct.hanzi.split("");
    display.textContent = "🧩";
    if (instruction) instruction.textContent = `Ordena los ${correctChars.length} caracteres para armar la palabra:`;

    const extraChars = ["电", "线", "模", "组", "机", "动", "停", "自", "气", "门"];
    const pool = [
        ...correctChars,
        ...window.vsShuffle(extraChars).filter(ch => !correctChars.includes(ch)).slice(0, Math.max(2, 6 - correctChars.length))
    ];
    const shuffledChars = window.vsShuffle(pool);

    grid.replaceChildren();

    const containerBox = document.createElement("div");
    containerBox.style.display = "flex";
    containerBox.style.flexDirection = "column";
    containerBox.style.gap = "12px";
    containerBox.style.width = "100%";

    const targetCard = document.createElement("div");
    targetCard.style.background = "rgba(39, 216, 232, 0.08)";
    targetCard.style.border = "1px solid rgba(39, 216, 232, 0.3)";
    targetCard.style.borderRadius = "12px";
    targetCard.style.padding = "10px";
    targetCard.style.textAlign = "center";
    targetCard.innerHTML = `
        <span style="font-size:9px; color:var(--cyan); font-weight:800; letter-spacing:1px; display:block;">OBJETIVO TÉCNICO</span>
        <strong style="color:#fff; font-size:15px; display:block; margin-top:2px;">"${correct.meaning}"</strong>
    `;
    containerBox.appendChild(targetCard);

    const answerBox = document.createElement("div");
    answerBox.id = "vsBuildAnswer";
    answerBox.style.background = "rgba(5, 11, 20, 0.85)";
    answerBox.style.border = "2px solid var(--cyan)";
    answerBox.style.borderRadius = "12px";
    answerBox.style.padding = "12px";
    answerBox.style.fontSize = "28px";
    answerBox.style.fontFamily = "'Noto Sans SC'";
    answerBox.style.letterSpacing = "8px";
    answerBox.style.color = "var(--green)";
    answerBox.style.minHeight = "60px";
    answerBox.style.display = "flex";
    answerBox.style.alignItems = "center";
    answerBox.style.justifyContent = "center";
    answerBox.textContent = "—";
    containerBox.appendChild(answerBox);

    const chipsGrid = document.createElement("div");
    chipsGrid.style.display = "grid";
    chipsGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
    chipsGrid.style.gap = "10px";
    chipsGrid.style.width = "100%";

    shuffledChars.forEach(char => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "reveal-button";
        chip.style.background = "var(--surface-light)";
        chip.style.color = "#fff";
        chip.style.border = "1px solid var(--border)";
        chip.style.borderRadius = "12px";
        chip.style.padding = "14px 8px";
        chip.style.fontSize = "22px";
        chip.style.fontFamily = "'Noto Sans SC'";
        chip.style.fontWeight = "900";
        chip.style.cursor = "pointer";
        chip.textContent = char;

        chip.addEventListener("click", (e) => {
            e.preventDefault();
            if (window.vsRoundLocked || !window.vsSessionActive) return;

            if (typeof triggerHaptic === "function") triggerHaptic("success");
            window.vsSelectedChars.push(char);
            answerBox.textContent = window.vsSelectedChars.join("");

            chip.style.opacity = "0.3";
            chip.style.pointerEvents = "none";

            if (window.vsSelectedChars.length === correctChars.length) {
                const assembled = window.vsSelectedChars.join("");
                const ok = assembled === correct.hanzi;
                if (ok) {
                    answerBox.style.borderColor = "var(--green)";
                } else {
                    answerBox.style.borderColor = "var(--red)";
                    answerBox.style.color = "var(--red)";
                }
                window.submitVsAnswer(ok);
            }
        });

        chipsGrid.appendChild(chip);
    });
    containerBox.appendChild(chipsGrid);

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "back-button";
    clearBtn.style.fontSize = "11px";
    clearBtn.style.padding = "10px";
    clearBtn.style.borderColor = "rgba(255, 68, 68, 0.4)";
    clearBtn.style.color = "#ff4444";
    clearBtn.style.fontWeight = "800";
    clearBtn.style.borderRadius = "10px";
    clearBtn.textContent = "🔄 Borrar selección";

    clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.vsRoundLocked || !window.vsSessionActive) return;
        if (typeof triggerHaptic === "function") triggerHaptic("error");
        window.vsSelectedChars = [];
        answerBox.textContent = "—";
        answerBox.style.borderColor = "var(--cyan)";
        answerBox.style.color = "var(--green)";
        Array.from(chipsGrid.children).forEach(ch => {
            ch.style.opacity = "1";
            ch.style.pointerEvents = "auto";
        });
    });

    containerBox.appendChild(clearBtn);
    grid.appendChild(containerBox);
};

window.submitVsAnswer = function(isCorrect, selectedButton = null) {
    if (!window.vsSessionActive || window.vsRoundLocked) return;
    window.vsRoundLocked = true;

    const diff = window.VS_DIFFICULTIES[window.selectedVsDiffKey];

    if (isCorrect) {
        if (selectedButton) {
            selectedButton.style.background = "var(--green)";
            selectedButton.style.color = "#0b1424";
        }
        window.myVsPoints += diff.points;
        if (typeof triggerHaptic === "function") triggerHaptic("success");
    } else {
        if (selectedButton) {
            selectedButton.style.background = "var(--red)";
            selectedButton.style.color = "#fff";
        }
        window.rivalVsPoints += 50;
        if (typeof triggerHaptic === "function") triggerHaptic("error");
    }

    window.vsUpdateScores();

    setTimeout(() => {
        if (!window.vsSessionActive || window.vsTimeLeft <= 0) return;
        window.startVsRound();
    }, 450);
};

window.startVsTimer = function() {
    if (window.vsTimer) {
        clearInterval(window.vsTimer);
        window.vsTimer = null;
    }
    window.vsTimer = setInterval(() => {
        if (!window.vsSessionActive) return;
        window.vsTimeLeft--;

        const seconds = document.getElementById("vsSeconds");
        const timerBar = document.getElementById("vsTimerBar");

        if (seconds) seconds.textContent = Math.max(0, window.vsTimeLeft);
        if (timerBar) {
            timerBar.style.width = `${Math.max(0, (window.vsTimeLeft / 20) * 100)}%`;
        }

        if (window.vsTimeLeft > 0 && window.vsTimeLeft % 5 === 0) {
            const diff = window.VS_DIFFICULTIES[window.selectedVsDiffKey];
            window.rivalVsPoints += Math.round(diff.points * 0.8);
            window.vsUpdateScores();
        }

        if (window.vsTimeLeft <= 0) {
            window.finishVsBattle();
        }
    }, 1000);
};

window.finishVsBattle = function() {
    if (!window.vsSessionActive) return;
    window.stopVsSession();

    const diff = window.VS_DIFFICULTIES[window.selectedVsDiffKey];
    const win = window.myVsPoints >= window.rivalVsPoints;

    if (win) {
        if (typeof triggerHaptic === "function") triggerHaptic("win");
        const earnedXp = diff.winBonus;

        if (typeof currentUserData !== "undefined" && currentUserData) {
            currentUserData.xp = (currentUserData.xp || 0) + earnedXp;
            if (typeof updateProfile === "function") updateProfile();
        }

        const currentWins = Number(localStorage.getItem("zidong_vs_wins") || 0) + 1;
        localStorage.setItem("zidong_vs_wins", currentWins);

        window.showCyberAlert(
            "VICTORIA EN DUELO",
            `¡VICTORIA EN DUELO 1V1!\nHas derrotado a ${diff.name}.\n\nPuntuación: Tú ${window.myVsPoints} PTS vs IA ${window.rivalVsPoints} PTS\nRecompensa: +${earnedXp} XP ⚡`,
            "⚔️"
        );
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    } else {
        if (typeof triggerHaptic === "function") triggerHaptic("error");

        const arena = document.getElementById("vsBattleArenaContainer");
        const defeat = document.getElementById("vsDefeatScreen");
        const scores = document.getElementById("vsDefeatScores");

        if (arena) arena.style.setProperty("display", "none", "important");
        if (defeat) defeat.style.setProperty("display", "block", "important");

        if (scores) {
            scores.textContent = `Tú: ${window.myVsPoints} PTS vs ${diff.name}: ${window.rivalVsPoints} PTS`;
        }
    }
};
