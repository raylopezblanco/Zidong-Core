/* =========================================
   ZIDONG CORE 2.0
   CRITICAL FAIL - ARCADE ENGINE
   Levels 1 to 4 Full Mechanic
========================================= */

(() => {
    "use strict";

    // Data for all 4 Critical Fail levels
    const CF_DATA = {
        level1: [
            { prompt: "Identifica: Eléctrico", pinyin: "diàn", answer: "电", options: ["电", "气", "水", "光"] },
            { prompt: "Identifica: Máquina", pinyin: "jī", answer: "机", options: ["机", "门", "车", "手"] },
            { prompt: "Identifica: Paro / Detener", pinyin: "tíng", answer: "停", options: ["停", "开", "关", "动"] },
            { prompt: "Identifica: Puerta / Acceso", pinyin: "mén", answer: "门", options: ["门", "刀", "光", "气"] },
            { prompt: "Identifica: Presión / Aire", pinyin: "qì", answer: "气", options: ["气", "水", "火", "土"] }
        ],
        level2: [
            {
                term: "Cable eléctrico",
                pinyin: "diàn lǎn",
                solution: ["电", "缆"],
                blocks: ["金", "缆", "口", "电", "马"]
            },
            {
                term: "Cilindro neumático",
                pinyin: "qì gāng",
                solution: ["气", "缸"],
                blocks: ["水", "缸", "火", "气", "木"]
            },
            {
                term: "Servomotor",
                pinyin: "sì fú",
                solution: ["伺", "服"],
                blocks: ["机", "伺", "门", "动", "服"]
            },
            {
                term: "Paro de emergencia",
                pinyin: "jí tíng",
                solution: ["急", "停"],
                blocks: ["慢", "急", "开", "停", "力"]
            }
        ],
        level3: [
            {
                fullSentence: "门已锁，请释放紧急停止按钮",
                pinyin: "Mén yǐ suǒ, qǐng shìfàng jǐnjí tíngzhǐ ànniǔ",
                prompt: "Identifica el segmento: 'Puerta bloqueada'",
                segments: [
                    { text: "门已锁", meaning: "Puerta bloqueada", isCorrect: true },
                    { text: "请释放", meaning: "Por favor libere", isCorrect: false },
                    { text: "紧急停止按钮", meaning: "Botón de paro de emergencia", isCorrect: false }
                ]
            },
            {
                fullSentence: "门已锁，请释放紧急停止按钮",
                pinyin: "Mén yǐ suǒ, qǐng shìfàng jǐnjí tíngzhǐ ànniǔ",
                prompt: "Identifica el segmento: 'Paro de emergencia'",
                segments: [
                    { text: "门已锁", meaning: "Puerta bloqueada", isCorrect: false },
                    { text: "请释放", meaning: "Por favor libere", isCorrect: false },
                    { text: "紧急停止按钮", meaning: "Botón de paro de emergencia", isCorrect: true }
                ]
            },
            {
                fullSentence: "气压不足，请检查主气源阀门",
                pinyin: "Qìyā bùzú, qǐng jiǎnchá zhǔ qìyuán fámén",
                prompt: "Identifica el segmento: 'Presión de aire insuficiente'",
                segments: [
                    { text: "气压不足", meaning: "Presión insuficiente", isCorrect: true },
                    { text: "请检查", meaning: "Por favor revise", isCorrect: false },
                    { text: "主气源阀门", meaning: "Válvula principal de aire", isCorrect: false }
                ]
            }
        ],
        level4: [
            {
                alarm: "解除紧急停电，等待系统复位",
                pinyin: "Jiěchú jǐnjí tíngdiàn, děngdài xìtǒng fùwèi",
                system: "ESTACIÓN DE POTENCIA 01",
                correct: "Restablecer paro de emergencia eléctrico y presionar Reset",
                options: [
                    "Restablecer paro de emergencia eléctrico y presionar Reset",
                    "Alinear cortina óptica de seguridad de puerta principal",
                    "Purgar electroválvula del acumulador neumático"
                ]
            },
            {
                alarm: "伺服驱动器过载报警，轴1堵转",
                pinyin: "Sìfú qūdòngqì guòzǎi bàojǐng, zhóu 1 dǔzhuàn",
                system: "ROBOT ARTICULADO",
                correct: "Inspeccionar sobrecarga mecánica y enfriamiento en driver del eje 1",
                options: [
                    "Inspeccionar sobrecarga mecánica y enfriamiento en driver del eje 1",
                    "Rellenar tanque de refrigerante del cabezal",
                    "Calibrar sensor fotoeléctrico de fin de carrera"
                ]
            }
        ]
    };

    let currentLevel = 1;
    let roundIndex = 0;
    let score = 0;
    let timeLeft = 60;
    let timerId = null;
    let lvl2Selected = []; // slots for Level 2

    // Audio / Haptic helpers
    function triggerHaptic(type) {
        if (!navigator.vibrate) return;
        if (type === "success") navigator.vibrate(40);
        else if (type === "error") navigator.vibrate([80, 50, 80]);
        else if (type === "win") navigator.vibrate([60, 40, 100]);
    }

    // Navigation into Critical Fail
    window.openCriticalMode = function() {
        if (window.navigateTo) {
            window.navigateTo("free");
        }
        showSelector();
    };

    function showSelector() {
        clearInterval(timerId);
        document.getElementById("cf-selector").style.display = "block";
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "none";
    }

    window.startCriticalLevel = function(lvl) {
        currentLevel = lvl;
        roundIndex = 0;
        score = 0;
        timeLeft = 60;
        lvl2Selected = [];

        document.getElementById("cf-selector").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "none";
        document.getElementById("cf-game-arena").style.display = "block";

        document.getElementById("cf-current-level-tag").textContent = `CRITICAL LEVEL 0${lvl}`;
        document.getElementById("cf-score").textContent = score;
        document.getElementById("cf-timer").textContent = timeLeft;

        clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            document.getElementById("cf-timer").textContent = timeLeft;
            const progress = (timeLeft / 60) * 100;
            const bar = document.getElementById("cf-timer-bar");
            if (bar) bar.style.width = `${progress}%`;

            if (timeLeft <= 0) {
                endGameSession();
            }
        }, 1000);

        renderRound();
    };

    function renderRound() {
        const stageArea = document.getElementById("cf-stage-content");
        stageArea.innerHTML = "";

        if (currentLevel === 1) renderLevel1(stageArea);
        else if (currentLevel === 2) renderLevel2(stageArea);
        else if (currentLevel === 3) renderLevel3(stageArea);
        else if (currentLevel === 4) renderLevel4(stageArea);
    }

    // --- LEVEL 1: Reconocimiento Rápido ---
    function renderLevel1(container) {
        const pool = CF_DATA.level1;
        const item = pool[roundIndex % pool.length];

        const card = document.createElement("div");
        card.className = "cf-card";
        card.innerHTML = `
            <span class="cf-sub">${item.pinyin}</span>
            <h2 class="cf-title">${item.prompt}</h2>
            <div class="cf-grid-4" id="lvl1-options"></div>
        `;
        container.appendChild(card);

        const grid = card.querySelector("#lvl1-options");
        const shuffled = [...item.options].sort(() => 0.5 - Math.random());

        shuffled.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === item.answer) {
                    btn.classList.add("btn-correct");
                    triggerHaptic("success");
                    score += 100;
                    document.getElementById("cf-score").textContent = score;
                    setTimeout(() => {
                        roundIndex++;
                        renderRound();
                    }, 250);
                } else {
                    btn.classList.add("btn-wrong");
                    triggerHaptic("error");
                    card.classList.add("shake-it");
                    setTimeout(() => card.classList.remove("shake-it"), 300);
                }
            };
            grid.appendChild(btn);
        });
    }

    // --- LEVEL 2: Ensamble con 5 Bloques ---
    function renderLevel2(container) {
        const pool = CF_DATA.level2;
        const item = pool[roundIndex % pool.length];
        lvl2Selected = [];

        const card = document.createElement("div");
        card.className = "cf-card";
        card.innerHTML = `
            <span class="cf-sub">ENSAMBLA LA REFACCIÓN: ${item.pinyin}</span>
            <h2 class="cf-title">${item.term}</h2>
            
            <div class="cf-slots-dock" id="lvl2-dock">
                <div class="cf-slot empty" id="slot-0">_</div>
                <div class="cf-slot empty" id="slot-1">_</div>
            </div>

            <div class="cf-parts-rack" id="lvl2-parts"></div>

            <button class="cf-btn-tool" id="btn-reset-assembly">↺ DESMONTAR PIEZAS</button>
        `;
        container.appendChild(card);

        const dock = card.querySelector("#lvl2-dock");
        const partsRack = card.querySelector("#lvl2-parts");
        const shuffled = [...item.blocks].sort(() => 0.5 - Math.random());

        function updateSlots() {
            for (let i = 0; i < 2; i++) {
                const s = card.querySelector(`#slot-${i}`);
                if (lvl2Selected[i]) {
                    s.textContent = lvl2Selected[i];
                    s.classList.add("filled");
                    s.classList.remove("empty");
                } else {
                    s.textContent = "_";
                    s.classList.remove("filled");
                    s.classList.add("empty");
                }
            }

            // Validar cuando se llenan ambos slots
            if (lvl2Selected.length === 2) {
                if (lvl2Selected[0] === item.solution[0] && lvl2Selected[1] === item.solution[1]) {
                    triggerHaptic("success");
                    dock.classList.add("slot-success");
                    score += 250;
                    document.getElementById("cf-score").textContent = score;
                    setTimeout(() => {
                        roundIndex++;
                        renderRound();
                    }, 350);
                } else {
                    triggerHaptic("error");
                    dock.classList.add("slot-error");
                    setTimeout(() => {
                        dock.classList.remove("slot-error");
                        clearAssembly();
                    }, 400);
                }
            }
        }

        function clearAssembly() {
            lvl2Selected = [];
            dock.classList.remove("slot-error", "slot-success");
            const allBtns = partsRack.querySelectorAll(".cf-part-btn");
            allBtns.forEach(b => b.classList.remove("used"));
            updateSlots();
        }

        card.querySelector("#btn-reset-assembly").onclick = clearAssembly;

        shuffled.forEach((char, idx) => {
            const btn = document.createElement("button");
            btn.className = "cf-part-btn";
            btn.textContent = char;
            btn.onclick = () => {
                if (lvl2Selected.length < 2 && !btn.classList.contains("used")) {
                    btn.classList.add("used");
                    lvl2Selected.push(char);
                    triggerHaptic("success");
                    updateSlots();
                }
            };
            partsRack.appendChild(btn);
        });
    }

    // --- LEVEL 3: Segmentación de Oración de Alarma ---
    function renderLevel3(container) {
        const pool = CF_DATA.level3;
        const item = pool[roundIndex % pool.length];

        const card = document.createElement("div");
        card.className = "cf-card";
        card.innerHTML = `
            <span class="cf-sub">ANALIZADOR DE MENSAJE HMI</span>
            <h3 class="cf-prompt-text">${item.prompt}</h3>
            
            <div class="cf-sentence-banner">
                <span class="cf-full-alarm">${item.fullSentence}</span>
                <small class="cf-pinyin-line">${item.pinyin}</small>
            </div>

            <div class="cf-segments-list" id="lvl3-segments"></div>
        `;
        container.appendChild(card);

        const list = card.querySelector("#lvl3-segments");
        item.segments.forEach(seg => {
            const btn = document.createElement("button");
            btn.className = "cf-segment-btn";
            btn.innerHTML = `<strong>${seg.text}</strong><span>${seg.meaning}</span>`;
            btn.onclick = () => {
                if (seg.isCorrect) {
                    btn.classList.add("btn-correct");
                    triggerHaptic("success");
                    score += 300;
                    document.getElementById("cf-score").textContent = score;
                    setTimeout(() => {
                        roundIndex++;
                        renderRound();
                    }, 300);
                } else {
                    btn.classList.add("btn-wrong");
                    triggerHaptic("error");
                    card.classList.add("shake-it");
                    setTimeout(() => card.classList.remove("shake-it"), 300);
                }
            };
            list.appendChild(btn);
        });
    }

    // --- LEVEL 4: Diagnóstico y Acción Correctiva Real ---
    function renderLevel4(container) {
        const pool = CF_DATA.level4;
        const item = pool[roundIndex % pool.length];

        const card = document.createElement("div");
        card.className = "cf-card";
        card.innerHTML = `
            <div class="hmi-alarm-box">
                <div class="hmi-badge">⚠️ ALARMA HMI · ${item.system}</div>
                <h2 class="hmi-alarm-text">${item.alarm}</h2>
                <span class="hmi-pinyin">${item.pinyin}</span>
            </div>

            <p class="cf-action-label">Selecciona la intervención correcta en estación:</p>
            <div class="cf-actions-list" id="lvl4-actions"></div>
        `;
        container.appendChild(card);

        const list = card.querySelector("#lvl4-actions");
        const shuffled = [...item.options].sort(() => 0.5 - Math.random());

        shuffled.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-action-btn";
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === item.correct) {
                    btn.classList.add("btn-correct");
                    triggerHaptic("win");
                    score += 500;
                    document.getElementById("cf-score").textContent = score;
                    setTimeout(() => {
                        roundIndex++;
                        renderRound();
                    }, 350);
                } else {
                    btn.classList.add("btn-wrong");
                    triggerHaptic("error");
                    card.classList.add("shake-it");
                    setTimeout(() => card.classList.remove("shake-it"), 300);
                }
            };
            list.appendChild(btn);
        });
    }

    function endGameSession() {
        clearInterval(timerId);
        triggerHaptic("win");
        document.getElementById("cf-game-arena").style.display = "none";
        const resultScreen = document.getElementById("cf-result-screen");
        resultScreen.style.display = "block";

        document.getElementById("cf-final-score").textContent = `${score} XP`;

        // Otorgar XP a jugador principal si está disponible el motor
        if (window.ZIDONG_DEMO && window.ZIDONG_DEMO.player) {
            window.ZIDONG_DEMO.player.xp += score;
            const xpDisplay = document.getElementById("profileXP");
            if (xpDisplay) xpDisplay.textContent = Number(window.ZIDONG_DEMO.player.xp).toLocaleString("en-US");
        }
    }

    window.exitCriticalFail = function() {
        clearInterval(timerId);
        showSelector();
    };

    console.log("CRITICAL FAIL ENGINE: READY");
})();
