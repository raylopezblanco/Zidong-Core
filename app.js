/* =========================================
   ZIDONG CORE 2.0
   APPLICATION ENGINE
   CAREER PROGRESSION SYSTEM
========================================= */

(() => {

    "use strict";

    // Audio / Haptic helper global para app.js
    function triggerHaptic(type) {
        if (type === "success") {
            if (navigator.vibrate) navigator.vibrate(40);
            if (window.ZidongAudio) window.ZidongAudio.playSuccess();
        } else if (type === "error") {
            if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
            if (window.ZidongAudio) window.ZidongAudio.playError();
        } else if (type === "win") {
            if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
            if (window.ZidongAudio) window.ZidongAudio.playVictory();
        }
    }
    const STORAGE_KEY = "zidong_core_progress";

    // =====================================
    // 1. CAREER DATA
    // =====================================

    const activities = [
        {
            id: "hanzi_001",
            type: "new",
            hanzi: "电",
            pinyin: "diàn",
            meaning: "Electricidad",
            example: "电缆",
            exampleMeaning: "Cable eléctrico",
            reward: 50
        },
        {
            id: "hanzi_002",
            type: "new",
            hanzi: "机",
            pinyin: "jī",
            meaning: "Máquina",
            example: "机器",
            exampleMeaning: "Máquina",
            reward: 50
        },
        {
            id: "review_001",
            type: "review",
            hanzi: "电",
            pinyin: "diàn",
            meaning: "Electricidad",
            example: "电源",
            exampleMeaning: "Fuente de alimentación",
            reward: 20
        },
        {
            id: "hanzi_003",
            type: "new",
            hanzi: "线",
            pinyin: "xiàn",
            meaning: "Línea / cable",
            example: "电线",
            exampleMeaning: "Cable eléctrico",
            reward: 50
        },
        {
            id: "hanzi_004",
            type: "new",
            hanzi: "力",
            pinyin: "lì",
            meaning: "Fuerza",
            example: "动力",
            exampleMeaning: "Potencia",
            reward: 50
        },
        {
            id: "review_002",
            type: "review",
            hanzi: "机",
            pinyin: "jī",
            meaning: "Máquina",
            example: "机器",
            exampleMeaning: "Máquina",
            reward: 20
        },
        {
            id: "hanzi_005",
            type: "new",
            hanzi: "控",
            pinyin: "kòng",
            meaning: "Control",
            example: "控制",
            exampleMeaning: "Controlar",
            reward: 50
        }
    ];

    const assessmentQuestions = [
        {
            question: "¿Qué significa 电?",
            options: ["Máquina", "Electricidad", "Fuerza"],
            answer: "Electricidad"
        },
        {
            question: "¿Qué significa 机?",
            options: ["Control", "Cable", "Máquina"],
            answer: "Máquina"
        },
        {
            question: "¿Qué significa 线?",
            options: ["Línea / cable", "Fuerza", "Electricidad"],
            answer: "Línea / cable"
        },
        {
            question: "¿Qué significa 力?",
            options: ["Máquina", "Fuerza", "Control"],
            answer: "Fuerza"
        },
        {
            question: "¿Qué significa 控?",
            options: ["Control", "Cable", "Electricidad"],
            answer: "Control"
        }
    ];

    // =====================================
    // 2. PROGRESS STATE
    // =====================================

    const career = {
        completedActivities: [],
        assessmentPassed: false,
        assessmentAttempts: 0,
        nodeStars: {}
    };

    let currentActivity = null;

    // =====================================
    // 3. LOAD SAVED PROGRESS
    // =====================================

    function loadSavedProgress() {

        try {

            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (!saved) return;

            if (saved.player) {
                Object.assign(data.player, saved.player);
            }

            if (Array.isArray(saved.activity)) {

                const demoActivities = [
                    "you recognized 5 characters",
                    "completed a training activity",
                    "discovered new components"
                ];

                data.activity = saved.activity.filter(item => {

                    return !demoActivities.includes(
                        item.detail?.trim().toLowerCase()
                    );

                });

            }

            if (saved.missionDetail && data.missions[0]) {
                data.missions[0].detail = saved.missionDetail;
            }

            if (Array.isArray(saved.teams)) {

                saved.teams.forEach(savedTeam => {

                    const team = data.teams.find(
                        item => item.name === savedTeam.name
                    );

                    if (team) team.xp = savedTeam.xp;

                });

            }

            if (Array.isArray(saved.players)) {

                saved.players.forEach(savedPlayer => {

                    const player = data.players.find(
                        item => item.initials === savedPlayer.initials
                    );

                    if (player) player.xp = savedPlayer.xp;

                });

            }

            // NEW CAREER PROGRESS

            if (saved.career) {

                career.completedActivities =
                    Array.isArray(saved.career.completedActivities)
                        ? saved.career.completedActivities
                        : [];

                career.assessmentPassed =
                    Boolean(saved.career.assessmentPassed);

                career.assessmentAttempts =
                    Number(saved.career.assessmentAttempts || 0);

                career.nodeStars = saved.career.nodeStars || {};

            } else if (saved.completedLesson) {

                // Compatibility with previous version

                career.completedActivities = ["hanzi_001"];

            }

            console.log("Saved progress: LOADED");

        } catch (error) {

            console.error("Could not load saved progress:", error);

        }

    }

    // =====================================
    // 4. SAVE PROGRESS
    // =====================================

    function saveProgress() {

        const saved = {

            player: {
                xp: data.player.xp,
                level: data.player.level,
                streak: data.player.streak,
                completed: data.player.completed
            },

            activity: data.activity,

            missionDetail: data.missions[0]?.detail,

            teams: data.teams.map(team => ({
                name: team.name,
                xp: team.xp
            })),

            players: data.players.map(player => ({
                initials: player.initials,
                xp: player.xp
            })),

            career: {
                completedActivities: career.completedActivities,
                assessmentPassed: career.assessmentPassed,
                assessmentAttempts: career.assessmentAttempts,
                nodeStars: career.nodeStars || {}
            },

            completedLesson:
                career.completedActivities.includes("hanzi_001")

        };

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(saved)
            );

            console.log("Progress: SAVED");

        } catch (error) {

            console.error("Could not save progress:", error);

        }

    }

    // =====================================
    // 5. HELPERS
    // =====================================

    const formatNumber = value => {
        return Number(value).toLocaleString("en-US");
    };

    function getCompletedCount() {
        return career.completedActivities.length;
    }

    function getNextActivityIndex() {

        return activities.findIndex(activity => {

            return !career.completedActivities.includes(activity.id);

        });

    }

    function isActivityUnlocked(index) {

        const nextIndex = getNextActivityIndex();

        return index <= nextIndex || nextIndex === -1;

    }

    // =====================================
    // 6. UPDATE XP
    // =====================================

    function awardXP(reward) {

        const player = data.player;

        player.xp += reward;
        player.completed += 1;

        const playerRecord = data.players.find(
            item => item.initials === player.initials
        );

        if (playerRecord) {

            playerRecord.xp += reward;

            const team = data.teams.find(
                item =>
                    item.name.trim().toLowerCase() ===
                    playerRecord.team.trim().toLowerCase()
            );

            if (team) {
                team.xp += reward;
            }

        }

    }

    // =====================================
    // 7. REGISTER ACTIVITY
    // =====================================

    function registerActivity(title, detail, reward) {

        data.activity.unshift({

            icon: "✓",
            title: title,
            detail: detail,
            xp: `+${reward} XP`

        });

    }

    // =====================================
    // 8. DAILY MISSION
    // =====================================

    function updateMissionProgress() {

        const completedNewHanzi = activities.filter(activity => {

            return activity.type === "new" &&
                career.completedActivities.includes(activity.id);

        }).length;

        const mission = data.missions[0];

        if (mission) {

            mission.detail =
                `Recognize 5 Chinese characters (${completedNewHanzi}/5)`;

        }

        updateDailyMission();

    }

    function updateDailyMission() {

        const mission = data.missions[0];

        if (!mission) return;

        const panels = document.querySelectorAll(
            "#dashboard .panel"
        );

        const missionPanel = Array.from(panels).find(panel => {

            const heading = panel.querySelector(
                ".panel-heading h3"
            );

            return heading &&
                heading.textContent.trim() === "DAILY MISSION";

        });

        if (!missionPanel) return;

        const description = missionPanel.querySelector("p");
        const progress = missionPanel.querySelector(".progress-fill");
        const progressText = missionPanel.querySelector("small");

        const match = mission.detail.match(/(\d+)\s*\/\s*(\d+)/);

        if (description) {
            description.textContent = "Reconoce 5 caracteres Hanzi";
        }

        if (match) {

            const completed = Number(match[1]);
            const total = Number(match[2]);

            const percentage = total > 0
                ? Math.min((completed / total) * 100, 100)
                : 0;

            if (progress) {
                progress.style.width = `${percentage}%`;
            }

            if (progressText) {
                progressText.textContent =
                    `${completed} / ${total} COMPLETED`;
            }

        }

    }

    // =====================================
    // 9. RENDER CAREER PATH
    // =====================================

    function renderCareerPath() {

        const container = document.querySelector(
            "#career .path-nodes"
        );

        if (!container) return;

        container.replaceChildren();

        // WELCOME NODE

        const welcome = document.createElement("div");

        welcome.className = "path-step left";

        welcome.innerHTML = `
            <div class="path-node completed">
                <span>✓</span>
            </div>

            <div class="path-label">
                <strong>Bienvenida</strong>
                <small>Conoce tu entrenamiento</small>
            </div>
        `;

        container.appendChild(welcome);

        // ACTIVITY NODES

        activities.forEach((activity, index) => {

            const completed =
                career.completedActivities.includes(activity.id);

            const unlocked = isActivityUnlocked(index);

            const node = document.createElement("div");

            node.className =
                `path-step ${index % 2 === 0 ? "right" : "left"}`;

            const statusClass = completed
                ? "completed"
                : unlocked
                    ? "current"
                    : "locked";

            const nodeText = completed
                ? "✓"
                : activity.hanzi;

            const label = activity.type === "review"
                ? `Repaso ${index + 1}`
                : `Hanzi ${String(
                    activities
                        .filter(item => item.type === "new")
                        .indexOf(activity) + 1
                ).padStart(3, "0")}`;

            const starsCount = (career.nodeStars && career.nodeStars[activity.id]) || (completed ? 1 : 0);
            const starsDisplay = completed ? "⭐".repeat(starsCount) : "";

            node.innerHTML = `
                <div class="path-node ${statusClass}">
                    <span>${nodeText}</span>
                </div>

                <div class="path-label">
                    <strong>${label} ${starsDisplay}</strong>
                    <small>${activity.meaning} · ${activity.pinyin}</small>
                    <span class="node-action">
                        ${completed ? "REPETIR TEST ↺" :
                            unlocked ? "COMENZAR →" : "BLOQUEADO"}
                    </span>
                </div>
            `;

            if (unlocked) {

                node.style.cursor = "pointer";

                node.addEventListener("click", () => {
                    openActivity(index);
                });

            }

            container.appendChild(node);

        });

        // ASSESSMENT NODE

        const assessment = document.createElement("div");

        const allActivitiesCompleted =
            getCompletedCount() === activities.length;

        assessment.className = "path-step left";

        const assessmentClass = career.assessmentPassed
            ? "completed"
            : allActivitiesCompleted
                ? "current"
                : "locked";

        assessment.innerHTML = `
            <div class="path-node assessment ${assessmentClass}">
                <span>${career.assessmentPassed ? "✓" : "🏅"}</span>
            </div>

            <div class="path-label">
                <strong>Evaluación eléctrica</strong>
                <small>Demuestra lo aprendido</small>
                <span class="node-action">
                    ${career.assessmentPassed
                        ? "APROBADA ✓"
                        : allActivitiesCompleted
                            ? "COMENZAR EVALUACIÓN →"
                            : "BLOQUEADA"}
                </span>
            </div>
        `;

        if (allActivitiesCompleted && !career.assessmentPassed) {

            assessment.style.cursor = "pointer";

            assessment.addEventListener("click", openAssessment);

        }

        container.appendChild(assessment);

        updateCareerOverview();

        updateAreaStatus();

    }

    // =====================================
    // 10. CAREER OVERVIEW
    // =====================================

    function updateCareerOverview() {

        const completed = getCompletedCount();

        const percentage = career.assessmentPassed
            ? 100
            : Math.round((completed / activities.length) * 100);

        const progressFill = document.querySelector(
            "#career .career-progress .progress-fill"
        );

        const progressText = document.querySelector(
            "#career .career-progress-footer span:last-child"
        );

        const progressDescription = document.querySelector(
            "#career .career-progress-info span"
        );

        const footerText = document.querySelector(
            "#career .career-progress-footer span:first-child"
        );

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }

        if (progressDescription) {

            progressDescription.textContent =
                career.assessmentPassed
                    ? "Área completada"
                    : completed === 0
                        ? "En preparación"
                        : "En progreso";

        }

        if (footerText) {

            footerText.textContent =
                career.assessmentPassed
                    ? "¡Área eléctrica dominada!"
                    : `${completed} de ${activities.length} actividades`;

        }

    }

    // =====================================
    // 11. UPDATE AREA UNLOCK
    // =====================================

    function updateAreaStatus() {

        const areas = document.querySelectorAll(
            "#career .path-area"
        );

        const electrical = areas[0];
        const mechanical = areas[1];

        if (!electrical || !mechanical) return;

        if (career.assessmentPassed) {

            mechanical.classList.remove("locked-area");

            const status = mechanical.querySelector(".path-status");
            const lockMessage = mechanical.querySelector(".path-lock-message");

            if (status) status.textContent = "UNLOCKED";

            if (lockMessage) {
                lockMessage.textContent =
                    "⚙️ ¡Área desbloqueada! Tu siguiente entrenamiento te espera.";
            }

            const electricalStatus =
                electrical.querySelector(".path-status");

            if (electricalStatus) {
                electricalStatus.textContent = "COMPLETED";
            }

        }

    }

    // =====================================
    // 12. OPEN ACTIVITY
    // =====================================

    function openActivity(index) {

        if (!isActivityUnlocked(index)) return;

        const activity = activities[index];

        if (!activity) return;

        currentActivity = activity;

        renderLesson(activity);

        navigateTo("level01");

    }

    // =====================================
    // 13. RENDER LESSON (DATA SHEET -> TEST EN CALIENTE)
    // =====================================

    function renderLesson(activity) {

        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const isCompleted = career.completedActivities.includes(activity.id);
        const currentStars = (career.nodeStars && career.nodeStars[activity.id]) || (isCompleted ? 1 : 0);

// MOMENTO A: DATA SHEET TÉCNICO (Sin presión de tiempo)
        function renderDataSheet() {
            const title = activity.type === "review"
                ? "REPASO DE COMPONENTE"
                : `DATA SHEET · HANZI ${String(
                    activities.filter(item => item.type === "new").indexOf(activity) + 1
                ).padStart(3, "0")}`;

            const starBadges = isCompleted ? ` · ${"⭐".repeat(currentStars)}` : "";

            card.innerHTML = `
                <span class="tag" style="border-color:var(--cyan); color:var(--cyan); margin-bottom:8px;">${title}${starBadges}</span>

                <div class="recognition-hanzi">${activity.hanzi}</div>

                <div style="background:rgba(39, 216, 232, 0.08); border:1px solid rgba(39, 216, 232, 0.2); border-radius:14px; padding:12px 14px; width:100%; max-width:340px; margin-bottom:14px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:10px; color:var(--muted); font-weight:bold; letter-spacing:1px;">SIGNIFICADO:</span>
                        <strong style="color:var(--cyan); font-size:16px;">${activity.meaning}</strong>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:10px; color:var(--muted); font-weight:bold; letter-spacing:1px;">PINYIN / TONO:</span>
                        <span style="color:#ffffff; font-weight:bold; font-size:15px;">${activity.pinyin}</span>
                    </div>

                    <!-- CAJA DESTACADA: APLICACIÓN EN PLANTA -->
                    <div style="border-top:1px solid rgba(255,255,255,0.12); padding-top:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.25); margin: 0 -14px -12px -14px; padding:10px 14px; border-radius:0 0 13px 13px;">
                        <div>
                            <span style="font-size:9px; color:#ffc857; font-weight:900; letter-spacing:1px; display:block;">REFACCIÓN / EN PLANTA</span>
                            <small style="color:var(--muted); font-size:12px;">${activity.exampleMeaning}</small>
                        </div>
                        <div style="font-size:24px; font-weight:bold; color:#00f59b; letter-spacing:3px; font-family:'Noto Sans SC', sans-serif;">
                            ${activity.example}
                        </div>
                    </div>
                </div>

                <button id="btn-start-evaluation" class="reveal-button" type="button" style="background:#00f59b; color:#0b1424; font-weight:900; min-height:44px;">
                    ${isCompleted ? "REPETIR TEST (MEJORAR ⭐)" : "PROBAR SISTEMA (TEST) ⚡"}
                </button>
            `;

            document.getElementById("btn-start-evaluation").onclick = startHotTest;
        }

        // MOMENTO B: TEST EN CALIENTE (3 RONDAS SIN ACORDEÓN)
        function startHotTest() {
            let round = 1;
            let errors = 0;
            const startTime = Date.now();

            function renderRound() {
                if (round === 1) {
                    // RONDA 1: Significado (3 opciones)
                    const otherMeanings = activities
                        .filter(a => a.meaning !== activity.meaning)
                        .map(a => a.meaning);
                    const shuffled = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 2);
                    const opts = [activity.meaning, ...shuffled].sort(() => 0.5 - Math.random());

                    card.innerHTML = `
                        <span class="tag" style="border-color:#ffaa00; color:#ffaa00;">RONDA 1 / 3 · SIGNIFICADO</span>
                        <div class="recognition-hanzi" style="width:120px; height:120px; font-size:70px; margin: 15px auto;">
                            ${activity.hanzi}
                        </div>
                        <h3 style="font-size:15px; margin-bottom:14px;">¿Cuál es el significado técnico correcto?</h3>
                        <div class="career-quiz-grid" id="round1-options"></div>
                    `;

                    const grid = card.querySelector("#round1-options");
                    opts.forEach(opt => {
                        const btn = document.createElement("button");
                        btn.className = "cf-btn-option";
                        btn.style.fontSize = "15px";
                        btn.style.padding = "14px 10px";
                        btn.textContent = opt;

                        btn.onclick = () => {
                            if (opt === activity.meaning) {
                                if (navigator.vibrate) navigator.vibrate(40);
                                btn.classList.add("btn-correct");
                                setTimeout(() => { round = 2; renderRound(); }, 300);
                            } else {
                                if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
                                btn.classList.add("btn-wrong");
                                errors++;
                                card.classList.add("shake-it");
                                setTimeout(() => card.classList.remove("shake-it"), 300);
                            }
                        };
                        grid.appendChild(btn);
                    });

                } else if (round === 2) {
                    // RONDA 2: Pinyin y Tono (3 opciones)
                    const otherPinyins = activities
                        .filter(a => a.pinyin !== activity.pinyin)
                        .map(a => a.pinyin);
                    const shuffledP = otherPinyins.sort(() => 0.5 - Math.random()).slice(0, 2);
                    const opts = [activity.pinyin, ...shuffledP].sort(() => 0.5 - Math.random());

                    card.innerHTML = `
                        <span class="tag" style="border-color:#a78bfa; color:#a78bfa;">RONDA 2 / 3 · LECTURA & TONO</span>
                        <div class="recognition-hanzi" style="width:120px; height:120px; font-size:70px; margin: 15px auto;">
                            ${activity.hanzi}
                        </div>
                        <h3 style="font-size:15px; margin-bottom:14px;">¿Cuál es la pronunciación (Pinyin)?</h3>
                        <div class="career-quiz-grid" id="round2-options"></div>
                    `;

                    const grid = card.querySelector("#round2-options");
                    opts.forEach(opt => {
                        const btn = document.createElement("button");
                        btn.className = "cf-btn-option";
                        btn.style.fontSize = "17px";
                        btn.style.padding = "14px 10px";
                        btn.textContent = opt;

                        btn.onclick = () => {
                            if (opt === activity.pinyin) {
                                if (navigator.vibrate) navigator.vibrate(40);
                                btn.classList.add("btn-correct");
                                setTimeout(() => { round = 3; renderRound(); }, 300);
                            } else {
                                if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
                                btn.classList.add("btn-wrong");
                                errors++;
                                card.classList.add("shake-it");
                                setTimeout(() => card.classList.remove("shake-it"), 300);
                            }
                        };
                        grid.appendChild(btn);
                    });

                } else if (round === 3) {
                    // RONDA 3: Ensamble del Componente
                    const exampleChars = activity.example.split("");
                    const mainChar = activity.hanzi;
                    const targetChar = exampleChars.find(c => c !== mainChar) || mainChar;
                    const dummyPool = ["气", "机", "线", "门", "开", "压", "力", "金", "水"].filter(c => c !== targetChar);
                    const dummyOptions = dummyPool.sort(() => 0.5 - Math.random()).slice(0, 2);
                    const blockOptions = [targetChar, ...dummyOptions].sort(() => 0.5 - Math.random());

                    card.innerHTML = `
                        <span class="tag" style="border-color:#00f59b; color:#00f59b;">RONDA 3 / 3 · ENSAMBLE DE PLANTA</span>
                        <p style="color:var(--muted); font-size:11px; margin:12px 0 4px;">COMPLETA LA PIEZA TÉCNICA:</p>
                        <h2 style="color:var(--cyan); margin-bottom:12px;">${activity.exampleMeaning}</h2>
                        
                        <div class="cf-slots-dock" style="margin: 15px auto;">
                            <div class="cf-slot filled">${mainChar}</div>
                            <div class="cf-slot empty" id="c-target-slot">_</div>
                        </div>

                        <p style="font-size:12px; color:var(--text); margin-bottom:12px;">Selecciona el carácter complementario:</p>
                        <div style="display:flex; justify-content:center; gap:12px;" id="c-blocks-grid"></div>
                    `;

                    const bGrid = card.querySelector("#c-blocks-grid");
                    blockOptions.forEach(char => {
                        const b = document.createElement("button");
                        b.className = "cf-part-btn";
                        b.style.width = "64px";
                        b.textContent = char;

                        b.onclick = () => {
                            if (char === targetChar) {
                                if (navigator.vibrate) navigator.vibrate([50, 40, 90]);
                                const slot = card.querySelector("#c-target-slot");
                                slot.textContent = char;
                                slot.classList.add("filled");
                                slot.classList.remove("empty");
                                setTimeout(finishTest, 400);
                            } else {
                                if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
                                b.style.opacity = "0.2";
                                b.style.pointerEvents = "none";
                                errors++;
                                card.classList.add("shake-it");
                                setTimeout(() => card.classList.remove("shake-it"), 300);
                            }
                        };
                        bGrid.appendChild(b);
                    });
                }
            }

            function finishTest() {
                const totalSeconds = Math.round((Date.now() - startTime) / 1000);
                
                // Cálculo de estrellas:
                // 3 Estrellas: 0 errores y <= 12s
                // 2 Estrellas: <= 1 error
                // 1 Estrella: > 1 error pero completado
                let stars = 1;
                if (errors === 0 && totalSeconds <= 12) {
                    stars = 3;
                } else if (errors <= 1) {
                    stars = 2;
                }

                // Guardar mejor puntuación de estrellas
                if (!career.nodeStars) career.nodeStars = {};
                career.nodeStars[activity.id] = Math.max(career.nodeStars[activity.id] || 0, stars);

                const starIcons = "⭐".repeat(stars);
                const titleVerdict = stars === 3
                    ? "¡MAESTRÍA OVERCLOCK!"
                    : stars === 2
                        ? "¡CALIBRACIÓN EXITOSA!"
                        : "¡SISTEMA APROBADO!";

                card.innerHTML = `
                    <span class="tag" style="border-color:#ffc857; color:#ffc857;">TEST FINALIZADO</span>
                    <div style="font-size:46px; margin: 15px 0;">${starIcons}</div>
                    <h2 style="color:#ffffff; font-size:22px; margin-bottom:4px;">${titleVerdict}</h2>
                    <p style="color:var(--muted); font-size:12px; margin-bottom:16px;">
                        Tiempo total: <strong>${totalSeconds}s</strong> · Errores: <strong>${errors}</strong>
                    </p>

                    <button id="btn-save-and-return" class="reveal-button" style="margin-bottom:10px;">
                        REGISTRAR AVANCE (+${activity.reward} XP) →
                    </button>
                    <button id="btn-retry-test" class="btn-secondary" style="width:100%; max-width:260px;">
                        ↺ REPETIR PARA MEJORAR ⭐
                    </button>
                `;

                document.getElementById("btn-save-and-return").onclick = () => {
                    completeActivity(activity, stars);
                    navigateTo("career");
                };

                document.getElementById("btn-retry-test").onclick = () => {
                    renderLesson(activity);
                };
            }

            renderRound();
        }

        renderDataSheet();
        updateAssessmentVisibility();
    }

    // =====================================
    // 14. COMPLETE ACTIVITY
    // =====================================

    function completeActivity(activity, stars) {

        const isNewCompletion = !career.completedActivities.includes(activity.id);
        const reward = isNewCompletion ? activity.reward : 15; // Bono de 15 XP por repetir

        if (isNewCompletion) {
            career.completedActivities.push(activity.id);
        }

        awardXP(reward);

        registerActivity(
            activity.type === "review"
                ? "Repaso de Hanzi Calibrado"
                : "Hanzi Dominado con Éxito",
            `${activity.hanzi} (${activity.meaning}) completado con ${"⭐".repeat(stars || 1)}`,
            reward
        );

        updateMissionProgress();
        updateRanking();
        updateProfile();
        updateActivity();
        renderCareerPath();
        saveProgress();

        console.log(`Activity finished: ${activity.id} with ${stars} stars`);
    }    // =====================================
    // 15. ASSESSMENT VISIBILITY
    // =====================================

    function updateAssessmentVisibility() {

        const allCompleted =
            getCompletedCount() === activities.length;

        let assessmentPanel = document.getElementById(
            "electricalAssessment"
        );

        if (!assessmentPanel) {

            assessmentPanel = document.createElement("div");

            assessmentPanel.id = "electricalAssessment";
            assessmentPanel.className = "panel";

            const card = document.querySelector(
                "#level01 .recognition-card"
            );

            if (card) {
                card.insertAdjacentElement(
                    "afterend",
                    assessmentPanel
                );
            }

        }

        assessmentPanel.style.display = "none";

        if (!allCompleted || career.assessmentPassed) return;

        assessmentPanel.style.display = "block";

    }

    // =====================================
    // 16. OPEN ASSESSMENT
    // =====================================

    function openAssessment() {

        if (getCompletedCount() !== activities.length) return;

        navigateTo("level01");

        const card = document.querySelector(
            "#level01 .recognition-card"
        );

        if (card) {
            card.style.display = "none";
        }

        const panel = document.getElementById(
            "electricalAssessment"
        );

        if (!panel) return;

        panel.style.display = "block";

        renderAssessment();

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

 // =====================================
    // 17. RENDER ASSESSMENT (BOSS FIGHT / COMISIONAMIENTO)
    // =====================================

    function renderAssessment() {

        const panel = document.getElementById("electricalAssessment");
        if (!panel) return;

        let currentQ = 0;
        let integrity = 100;
        let correctCount = 0;

        function showQuestion() {
            const q = assessmentQuestions[currentQ];
            const integrityColor = integrity >= 80 ? "#00f59b" : integrity >= 60 ? "#ffaa00" : "#ff4444";

            panel.innerHTML = `
                <!-- HUD DEL COMISIONAMIENTO -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span class="tag" style="border-color:#ffc857; color:#ffc857;">CERTIFICACIÓN · PASO ${currentQ + 1} DE ${assessmentQuestions.length}</span>
                    <strong style="color:${integrityColor}; font-size:14px; font-weight:900;">
                        INTEGRIDAD: ${integrity}%
                    </strong>
                </div>

                <!-- BARRA DE INTEGRIDAD DEL SISTEMA -->
                <div style="width:100%; height:8px; background:#19273c; border-radius:4px; overflow:hidden; margin-bottom:18px;">
                    <div style="width:${integrity}%; height:100%; background:${integrityColor}; transition:width 0.3s ease;"></div>
                </div>

                <!-- PREGUNTA ARCADE -->
                <div style="background:#0e1726; border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:18px 14px; text-align:center; margin-bottom:16px;">
                    <span style="font-size:11px; color:var(--muted); font-weight:bold; letter-spacing:1px; display:block; margin-bottom:6px;">VALIDACIÓN DE SEÑAL</span>
                    <h2 style="font-size:22px; color:#ffffff; margin-bottom:12px;">${q.question}</h2>
                    <div class="career-quiz-grid" id="boss-options-grid"></div>
                </div>
            `;

            const grid = panel.querySelector("#boss-options-grid");
            const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());

            shuffledOptions.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "cf-btn-option";
                btn.style.fontSize = "15px";
                btn.style.padding = "14px 10px";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allBtns = grid.querySelectorAll(".cf-btn-option");
                    allBtns.forEach(b => b.style.pointerEvents = "none");

                    if (opt === q.answer) {
                        btn.classList.add("btn-correct");
                        correctCount++;
                        setTimeout(() => nextStep(), 350);
                    } else {
                        btn.classList.add("btn-wrong");
                        integrity = Math.max(0, integrity - 20);
                        panel.classList.add("shake-it");
                        setTimeout(() => {
                            panel.classList.remove("shake-it");
                            nextStep();
                        }, 400);
                    }
                };
                grid.appendChild(btn);
            });
        }

        function nextStep() {
            currentQ++;
            if (currentQ < assessmentQuestions.length) {
                showQuestion();
            } else {
                finishAssessment();
            }
        }

        function finishAssessment() {
            const passed = integrity >= 80;
            career.assessmentAttempts++;

            if (passed) {
                career.assessmentPassed = true;
                const reward = 100;
                awardXP(reward);

                registerActivity(
                    "Área Eléctrica Certificada",
                    `Comisionamiento aprobado con ${integrity}% de integridad`,
                    reward
                );

                updateRanking();
                updateProfile();
                updateActivity();
                renderCareerPath();
                saveProgress();

                panel.innerHTML = `
                    <div style="text-align:center; padding:20px 10px;">
                        <span style="font-size:52px; display:block; margin-bottom:10px;">⚡</span>
                        <span class="tag" style="border-color:#00f59b; color:#00f59b; margin-bottom:8px;">LÍNEA AUTORIZADA</span>
                        <h2 style="color:#ffffff; font-size:22px; margin: 8px 0 4px;">¡COMISIONAMIENTO EXITOSO!</h2>
                        <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">
                            Integridad final: <strong style="color:#00f59b;">${integrity}%</strong> · Respuestas: <strong>${correctCount}/5</strong>
                        </p>
                        <div style="background:rgba(0,245,155,0.1); border:1px solid rgba(0,245,155,0.3); border-radius:12px; padding:12px; margin-bottom:20px;">
                            <strong style="color:#00f59b; display:block;">⚙️ ÁREA DE MECÁNICA DESBLOQUEADA</strong>
                            <small style="color:var(--muted);">Has recibido +${reward} XP en tu perfil técnico</small>
                        </div>
                        <button class="reveal-button" style="background:#00f59b; color:#0b1424; font-weight:900;" onclick="navigateTo('career')">
                            VER MAPA DE CARRERA →
                        </button>
                    </div>
                `;
            } else {
                saveProgress();
                panel.innerHTML = `
                    <div style="text-align:center; padding:20px 10px;">
                        <span style="font-size:52px; display:block; margin-bottom:10px;">⚠️</span>
                        <span class="tag" style="border-color:#ff4444; color:#ff4444; margin-bottom:8px;">FALLA DE INTEGRIDAD</span>
                        <h2 style="color:#ffffff; font-size:20px; margin: 8px 0 4px;">COMISIONAMIENTO RECHAZADO</h2>
                        <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">
                            Integridad: <strong style="color:#ff4444;">${integrity}%</strong> (Mínimo requerido: 80%)
                        </p>
                        <p style="color:var(--muted); font-size:12px; margin-bottom:20px;">
                            La estación no superó las pruebas de seguridad. Repasa los componentes e inténtalo de nuevo.
                        </p>
                        <button class="reveal-button" style="background:#ffaa00; color:#0b1424; font-weight:900; margin-bottom:10px;" onclick="renderAssessment()">
                            ↺ REPETIR COMISIONAMIENTO
                        </button>
                        <button class="btn-secondary" style="width:100%; max-width:260px;" onclick="navigateTo('career')">
                            ← REGRESAR AL MAPA
                        </button>
                    </div>
                `;
            }
        }

        showQuestion();
    }

    // =====================================
    // 19. RETURN TO CAREER
    // =====================================

    function connectCareerBackButton() {

        const buttons = document.querySelectorAll(
            "#level01 .back-button"
        );

        buttons.forEach(button => {

            if (button.dataset.careerConnected) return;

            button.dataset.careerConnected = "true";

            button.addEventListener("click", () => {

                const card = document.querySelector(
                    "#level01 .recognition-card"
                );

                if (card) {
                    card.style.display = "block";
                }

                const panel = document.getElementById(
                    "electricalAssessment"
                );

                if (panel) {
                    panel.style.display = "none";
                }

            });

        });

    }

    // =====================================
    // 20. GLOBAL RANKING
    // =====================================

    function updateRanking() {

        const individualList = document.getElementById(
            "individualRankingList"
        );

        const teamList = document.getElementById(
            "teamRankingList"
        );

        if (!individualList || !teamList) return;

        const medals = ["🥇", "🥈", "🥉"];

        const sortedPlayers = [...data.players].sort(
            (a, b) => b.xp - a.xp
        );

        individualList.innerHTML = "";

        sortedPlayers.forEach((player, index) => {

            const row = document.createElement("div");

            row.className = "team-row";

            const position = medals[index] || `${index + 1}.`;

            row.innerHTML = `
                <span>${position} ${player.name}</span>
                <strong>${formatNumber(player.xp)} XP</strong>
            `;

            individualList.appendChild(row);

        });

        const sortedTeams = data.teams.map(team => {

            const members = data.players.filter(
                player => player.team === team.name
            );

            const totalXP = members.reduce(
                (total, player) => total + Number(player.xp || 0),
                0
            );

            return {
                name: team.name,
                xp: totalXP,
                members: members.length
            };

        }).sort((a, b) => b.xp - a.xp);

        teamList.innerHTML = "";

        sortedTeams.forEach((team, index) => {

            const row = document.createElement("div");

            row.className = "team-row";

            const position = medals[index] || `${index + 1}.`;

            row.innerHTML = `
                <span>
                    ${position} ${team.name}
                    <small>(${team.members} players)</small>
                </span>

                <strong>${formatNumber(team.xp)} XP</strong>
            `;

            teamList.appendChild(row);

        });

    }

    // =====================================
    // 21. PLAYER PROFILE
    // =====================================

    function updateProfile() {

        const player = data.player;

        const profileSection = document.querySelector("#profile");

        if (!profileSection) return;

        const initials = profileSection.querySelector("#profileInitials");
        const name = profileSection.querySelector("#profileName");
        const xp = profileSection.querySelector("#profileXP");
        const level = profileSection.querySelector("#profileLevel");
        const streak = profileSection.querySelector("#profileStreak");
        const completed = profileSection.querySelector("#profileCompleted");

        if (initials) initials.textContent = player.initials;

        if (name) name.textContent = player.name;

        if (xp) xp.textContent = formatNumber(player.xp);

        if (level) {
            level.textContent = String(player.level).padStart(2, "0");
        }

        if (streak) {
            streak.textContent = `${player.streak} Days`;
        }

        if (completed) {
            completed.textContent = player.completed;
        }

        const missionContainer = profileSection.querySelector(
            "#profileMissions"
        );

        if (missionContainer) {

            missionContainer.replaceChildren();

            data.missions.forEach(mission => {

                const row = document.createElement("div");
                row.className = "team-row";

                const title = document.createElement("span");
                title.textContent = mission.title;

                const reward = document.createElement("strong");
                reward.textContent = mission.xp;

                row.append(title, reward);

                missionContainer.appendChild(row);

            });

        }

        const playerRecord = data.players.find(
            item => item.initials === player.initials
        );

        const teamName = profileSection.querySelector("#profileTeam");
        const teamXP = profileSection.querySelector("#profileTeamXP");

        if (playerRecord) {

            const team = data.teams.find(
                item =>
                    item.name.trim().toLowerCase() ===
                    playerRecord.team.trim().toLowerCase()
            );

            if (teamName) {

                teamName.textContent = team
                    ? `${team.icon} ${team.name}`
                    : `🏆 ${playerRecord.team}`;

            }

            if (teamXP) {

                teamXP.textContent = team
                    ? `${formatNumber(team.xp)} XP`
                    : `${formatNumber(playerRecord.xp)} XP`;

            }

        }

    }

    // =====================================
    // 22. ACTIVITY HISTORY
    // =====================================

    function updateActivity() {

        const activityList = document.querySelector("#activityList");

        if (!activityList) return;

        activityList.replaceChildren();

        data.activity.forEach(item => {

            const row = document.createElement("div");
            row.className = "team-row";

            const information = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = `${item.icon} ${item.title}`;

            const detail = document.createElement("p");
            detail.textContent = item.detail;

            information.append(title, detail);

            const reward = document.createElement("strong");
            reward.textContent = item.xp;

            row.append(information, reward);

            activityList.appendChild(row);

        });

    }

    // =====================================
    // 23. INITIALIZE
    // =====================================

    function initializeApplication() {

        loadSavedProgress();

        updateMissionProgress();

        updateRanking();

        updateProfile();

        updateActivity();

        renderCareerPath();

        updateAssessmentVisibility();

        connectCareerBackButton();

        console.log("--------------------------------");
        console.log("ZIDONG CORE 2.0: READY");
        console.log("Career Progression: CONNECTED");
        console.log("Hanzi Activities: CONNECTED");
        console.log("Assessment System: CONNECTED");
        console.log("Ranking: CONNECTED");
        console.log("Profile: CONNECTED");
        console.log("Activity: CONNECTED");
        console.log("--------------------------------");

    }
// Justo antes de terminar app.js
    window.debugBossFight = () => {
        career.completedActivities = activities.map(a => a.id);
        openAssessment();
    };



})();


/* =========================================
   RANKING TABS
========================================= */

function showRankingTab(tab, button) {

    const individual = document.getElementById("individualRanking");
    const teams = document.getElementById("teamRanking");

    if (!individual || !teams || !button) return;

    document.querySelectorAll(".ranking-tab").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (tab === "individual") {

        individual.style.display = "block";
        teams.style.display = "none";

    } else {

        individual.style.display = "none";
        teams.style.display = "block";

    }

}
