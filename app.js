/* =========================================
   ZIDONG CORE 2.0
   APPLICATION ENGINE & CAREER SYSTEM
========================================= */

(() => {
    "use strict";

    // Audio / Haptic helper unificado (Web Audio + Haptics)
    function triggerHaptic(type) {
        if (type === "success") {
            if (navigator.vibrate) navigator.vibrate(40);
            if (window.ZidongAudio && typeof window.ZidongAudio.playSuccess === "function") {
                window.ZidongAudio.playSuccess();
            }
        } else if (type === "error") {
            if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
            if (window.ZidongAudio && typeof window.ZidongAudio.playError === "function") {
                window.ZidongAudio.playError();
            }
        } else if (type === "win") {
            if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
            if (window.ZidongAudio && typeof window.ZidongAudio.playVictory === "function") {
                window.ZidongAudio.playVictory();
            }
        }
    }

    const STORAGE_KEY = "zidong_core_progress";

    // =====================================
    // 1. CAREER DATA (ÁREA 01: ELÉCTRICA)
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
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!saved) return;

            if (saved.player && typeof data !== "undefined" && data.player) {
                Object.assign(data.player, saved.player);
            }

            if (saved.career) {
                career.completedActivities = Array.isArray(saved.career.completedActivities)
                    ? saved.career.completedActivities
                    : [];
                career.assessmentPassed = Boolean(saved.career.assessmentPassed);
                career.assessmentAttempts = Number(saved.career.assessmentAttempts || 0);
                career.nodeStars = saved.career.nodeStars || {};
            } else if (saved.completedLesson) {
                career.completedActivities = ["hanzi_001"];
            }
        } catch (error) {
            console.error("Could not load saved progress:", error);
        }
    }

    // =====================================
    // 4. SAVE PROGRESS
    // =====================================

    function saveProgress() {
        if (typeof data === "undefined") return;

        const saved = {
            player: {
                xp: data.player?.xp || 0,
                level: data.player?.level || 1,
                streak: data.player?.streak || 1,
                completed: data.player?.completed || 0
            },
            career: {
                completedActivities: career.completedActivities,
                assessmentPassed: career.assessmentPassed,
                assessmentAttempts: career.assessmentAttempts,
                nodeStars: career.nodeStars || {}
            }
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (error) {
            console.error("Could not save progress:", error);
        }
    }

    // =====================================
    // 5. HELPERS
    // =====================================

    const formatNumber = value => Number(value || 0).toLocaleString("en-US");

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
        if (typeof data === "undefined" || !data.player) return;
        const player = data.player;
        player.xp = (player.xp || 0) + reward;
        player.completed = (player.completed || 0) + 1;

        if (Array.isArray(data.players)) {
            const playerRecord = data.players.find(item => item.initials === player.initials);
            if (playerRecord) playerRecord.xp = (playerRecord.xp || 0) + reward;
        }
    }

    // =====================================
    // 7. DAILY MISSION
    // =====================================

    function updateMissionProgress() {
        const completedNewHanzi = activities.filter(activity => {
            return activity.type === "new" && career.completedActivities.includes(activity.id);
        }).length;

        const missionFill = document.querySelector(".daily-mission-card .progress-fill");
        const missionSmall = document.querySelector(".daily-mission-card .mission-footer small");

        if (missionFill) {
            const pct = Math.min((completedNewHanzi / 5) * 100, 100);
            missionFill.style.width = `${pct}%`;
        }
        if (missionSmall) {
            missionSmall.textContent = `${completedNewHanzi} / 5 COMPLETED`;
        }
    }

    // =====================================
    // 8. RENDER CAREER PATH
    // =====================================

    function renderCareerPath() {
        const container = document.querySelector("#career .path-nodes");
        if (!container) return;

        container.replaceChildren();

        // NODO BIENVENIDA
        const welcome = document.createElement("div");
        welcome.className = "path-step left";
        welcome.innerHTML = `
            <div class="path-node completed"><span>✓</span></div>
            <div class="path-label">
                <strong>Bienvenida</strong>
                <small>Conoce tu entrenamiento</small>
            </div>
        `;
        container.appendChild(welcome);

        // NODOS DE ACTIVIDAD
        activities.forEach((activity, index) => {
            const completed = career.completedActivities.includes(activity.id);
            const unlocked = isActivityUnlocked(index);

            const node = document.createElement("div");
            node.className = `path-step ${index % 2 === 0 ? "right" : "left"}`;

            const statusClass = completed ? "completed" : unlocked ? "current" : "locked";
            const nodeText = completed ? "✓" : activity.hanzi;

            const label = activity.type === "review"
                ? `Repaso ${index + 1}`
                : `Hanzi ${String(activities.filter(item => item.type === "new").indexOf(activity) + 1).padStart(3, "0")}`;

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
                        ${completed ? "REPETIR TEST ↺" : unlocked ? "COMENZAR →" : "BLOQUEADO"}
                    </span>
                </div>
            `;

            if (unlocked) {
                node.style.cursor = "pointer";
                node.addEventListener("click", () => openActivity(index));
            }

            container.appendChild(node);
        });

        // NODO EVALUACIÓN FINAL
        const assessment = document.createElement("div");
        const allActivitiesCompleted = getCompletedCount() === activities.length;
        assessment.className = "path-step left";

        const assessmentClass = career.assessmentPassed
            ? "completed"
            : allActivitiesCompleted ? "current" : "locked";

        assessment.innerHTML = `
            <div class="path-node assessment ${assessmentClass}">
                <span>${career.assessmentPassed ? "✓" : "🏅"}</span>
            </div>
            <div class="path-label">
                <strong>Evaluación eléctrica</strong>
                <small>Comisionamiento de estación</small>
                <span class="node-action">
                    ${career.assessmentPassed ? "APROBADA ✓" : allActivitiesCompleted ? "COMENZAR EVALUACIÓN →" : "BLOQUEADA"}
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
    // 9. CAREER OVERVIEW
    // =====================================

    function updateCareerOverview() {
        const completed = getCompletedCount();
        const percentage = career.assessmentPassed ? 100 : Math.round((completed / activities.length) * 100);

        const progressFill = document.querySelector("#career .career-progress .progress-fill");
        const progressText = document.querySelector("#career .career-progress-footer span:last-child");
        const progressDescription = document.querySelector("#career .career-progress-info span");
        const footerText = document.querySelector("#career .career-progress-footer span:first-child");

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
        if (progressDescription) {
            progressDescription.textContent = career.assessmentPassed
                ? "Área completada"
                : completed === 0 ? "En preparación" : "En progreso";
        }
        if (footerText) {
            footerText.textContent = career.assessmentPassed
                ? "¡Área eléctrica dominada!"
                : `${completed} de ${activities.length} actividades`;
        }
    }

    // =====================================
    // 10. UPDATE AREA UNLOCK
    // =====================================

    function updateAreaStatus() {
        const areas = document.querySelectorAll("#career .path-area");
        const electrical = areas[0];
        const mechanical = areas[1];
        if (!electrical || !mechanical) return;

        if (career.assessmentPassed) {
            mechanical.classList.remove("locked-area");
            const status = mechanical.querySelector(".path-status");
            const lockMessage = mechanical.querySelector(".path-lock-message");

            if (status) status.textContent = "UNLOCKED";
            if (lockMessage) lockMessage.textContent = "⚙️ ¡Área desbloqueada! Tu siguiente entrenamiento te espera.";

            const electricalStatus = electrical.querySelector(".path-status");
            if (electricalStatus) electricalStatus.textContent = "COMPLETED";
        }
    }

    // =====================================
    // 11. OPEN ACTIVITY
    // =====================================

    function openActivity(index) {
        if (!isActivityUnlocked(index)) return;
        const activity = activities[index];
        if (!activity) return;

        currentActivity = activity;
        renderLesson(activity);
        if (typeof window.navigateTo === "function") {
            window.navigateTo("level01");
        }
    }

    // =====================================
    // 12. RENDER LESSON (DATA SHEET -> TEST EN CALIENTE)
    // =====================================

    function renderLesson(activity) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const isCompleted = career.completedActivities.includes(activity.id);
        const currentStars = (career.nodeStars && career.nodeStars[activity.id]) || (isCompleted ? 1 : 0);

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

        function startHotTest() {
            let round = 1;
            let errors = 0;
            const startTime = Date.now();

            function renderRound() {
                if (round === 1) {
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
                                triggerHaptic("success");
                                btn.classList.add("btn-correct");
                                setTimeout(() => { round = 2; renderRound(); }, 300);
                            } else {
                                triggerHaptic("error");
                                btn.classList.add("btn-wrong");
                                errors++;
                                card.classList.add("shake-it");
                                setTimeout(() => card.classList.remove("shake-it"), 300);
                            }
                        };
                        grid.appendChild(btn);
                    });

                } else if (round === 2) {
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
                                triggerHaptic("success");
                                btn.classList.add("btn-correct");
                                setTimeout(() => { round = 3; renderRound(); }, 300);
                            } else {
                                triggerHaptic("error");
                                btn.classList.add("btn-wrong");
                                errors++;
                                card.classList.add("shake-it");
                                setTimeout(() => card.classList.remove("shake-it"), 300);
                            }
                        };
                        grid.appendChild(btn);
                    });

                } else if (round === 3) {
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
                                triggerHaptic("success");
                                const slot = card.querySelector("#c-target-slot");
                                slot.textContent = char;
                                slot.classList.add("filled");
                                slot.classList.remove("empty");
                                setTimeout(finishTest, 400);
                            } else {
                                triggerHaptic("error");
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
                let stars = 1;
                if (errors === 0 && totalSeconds <= 12) {
                    stars = 3;
                } else if (errors <= 1) {
                    stars = 2;
                }

                if (!career.nodeStars) career.nodeStars = {};
                career.nodeStars[activity.id] = Math.max(career.nodeStars[activity.id] || 0, stars);

                triggerHaptic("win");

                const starIcons = "⭐".repeat(stars);
                const titleVerdict = stars === 3
                    ? "¡MAESTRÍA OVERCLOCK!"
                    : stars === 2 ? "¡CALIBRACIÓN EXITOSA!" : "¡SISTEMA APROBADO!";

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
                    if (typeof window.navigateTo === "function") {
                        window.navigateTo("career");
                    }
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
    // 13. COMPLETE ACTIVITY
    // =====================================

    function completeActivity(activity, stars) {
        const isNewCompletion = !career.completedActivities.includes(activity.id);
        const reward = isNewCompletion ? activity.reward : 15;

        if (isNewCompletion) {
            career.completedActivities.push(activity.id);
        }

        awardXP(reward);
        updateMissionProgress();
        updateRanking();
        updateProfile();
        renderCareerPath();
        saveProgress();
    }

    // =====================================
    // 14. ASSESSMENT VISIBILITY
    // =====================================

    function updateAssessmentVisibility() {
        const allCompleted = getCompletedCount() === activities.length;
        let assessmentPanel = document.getElementById("electricalAssessment");

        if (!assessmentPanel) {
            assessmentPanel = document.createElement("div");
            assessmentPanel.id = "electricalAssessment";
            assessmentPanel.className = "panel";
            const card = document.querySelector("#level01 .recognition-card");
            if (card) card.insertAdjacentElement("afterend", assessmentPanel);
        }

        assessmentPanel.style.display = "none";
        if (!allCompleted || career.assessmentPassed) return;
        assessmentPanel.style.display = "block";
    }

    // =====================================
    // 15. OPEN ASSESSMENT (BOSS FIGHT)
    // =====================================

    function openAssessment() {
        if (typeof window.navigateTo === "function") {
            window.navigateTo("assessment");
        }

        const panel = document.getElementById("electricalAssessment");
        if (!panel) return;

        panel.style.display = "block";
        renderAssessment();
    }

    // =====================================
    // 16. RENDER ASSESSMENT
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
                <div style="max-width:380px; margin: 0 auto; padding-bottom: 90px; box-sizing: border-box;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                        <span class="tag" style="border-color:#ffc857; color:#ffc857; font-size:10px; margin:0;">
                            PASO ${currentQ + 1} DE ${assessmentQuestions.length}
                        </span>
                        <strong style="color:${integrityColor}; font-size:13px; font-weight:900; letter-spacing:0.5px;">
                            INTEGRIDAD: ${integrity}%
                        </strong>
                    </div>

                    <div style="width:100%; height:7px; background:#142236; border-radius:4px; overflow:hidden; margin-bottom:14px; border:1px solid rgba(255,255,255,0.06);">
                        <div style="width:${integrity}%; height:100%; background:${integrityColor}; transition:width 0.25s ease;"></div>
                    </div>

                    <div style="background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:18px 14px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.35);">
                        <span style="font-size:10px; color:var(--muted); font-weight:bold; letter-spacing:1px; display:block; margin-bottom:6px;">VALIDACIÓN DE LÍNEA</span>
                        <h2 style="font-size:20px; color:#ffffff; margin: 0 0 16px 0; font-weight:700;">${q.question}</h2>
                        
                        <div id="boss-options-grid" style="display:flex; flex-direction:column; gap:10px;"></div>
                    </div>
                </div>
            `;

            const grid = panel.querySelector("#boss-options-grid");
            const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());

            shuffledOptions.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.style.width = "100%";
                btn.style.minHeight = "46px";
                btn.style.padding = "10px 14px";
                btn.style.background = "var(--surface-light)";
                btn.style.border = "1.5px solid var(--border)";
                btn.style.borderRadius = "12px";
                btn.style.color = "#ffffff";
                btn.style.fontSize = "15px";
                btn.style.fontWeight = "600";
                btn.style.cursor = "pointer";
                btn.style.transition = "transform 0.08s ease, background 0.15s, border-color 0.15s";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allBtns = grid.querySelectorAll("button");
                    allBtns.forEach(b => b.style.pointerEvents = "none");

                    if (opt === q.answer) {
                        triggerHaptic("success");
                        btn.style.background = "rgba(0, 245, 155, 0.2)";
                        btn.style.borderColor = "#00f59b";
                        btn.style.color = "#00f59b";
                        correctCount++;
                        setTimeout(() => nextStep(), 320);
                    } else {
                        triggerHaptic("error");
                        btn.style.background = "rgba(255, 68, 68, 0.2)";
                        btn.style.borderColor = "#ff4444";
                        btn.style.color = "#ff4444";
                        integrity = Math.max(0, integrity - 20);
                        panel.classList.add("shake-it");
                        setTimeout(() => {
                            panel.classList.remove("shake-it");
                            nextStep();
                        }, 380);
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
                triggerHaptic("win");
                career.assessmentPassed = true;
                const reward = 100;
                awardXP(reward);

                updateRanking();
                updateProfile();
                renderCareerPath();
                saveProgress();

                panel.innerHTML = `
                    <div style="max-width:380px; margin:0 auto; padding: 20px 10px 90px; text-align:center;">
                        <span style="font-size:48px; display:block; margin-bottom:8px;">⚡</span>
                        <span class="tag" style="border-color:#00f59b; color:#00f59b; margin-bottom:8px;">LÍNEA AUTORIZADA</span>
                        <h2 style="color:#ffffff; font-size:22px; margin: 8px 0 4px;">¡COMISIONAMIENTO EXITOSO!</h2>
                        <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">
                            Integridad: <strong style="color:#00f59b;">${integrity}%</strong> · Aciertos: <strong>${correctCount}/5</strong>
                        </p>
                        <div style="background:rgba(0,245,155,0.08); border:1px solid rgba(0,245,155,0.25); border-radius:12px; padding:12px; margin-bottom:18px;">
                            <strong style="color:#00f59b; display:block; font-size:14px;">⚙️ ÁREA DE MECÁNICA DESBLOQUEADA</strong>
                            <small style="color:var(--muted); font-size:11px;">Has recibido +${reward} XP en tu perfil</small>
                        </div>
                        <button class="reveal-button" style="background:#00f59b; color:#0b1424; font-weight:900; min-height:44px;" onclick="navigateTo('career')">
                            VER MAPA DE CARRERA →
                        </button>
                    </div>
                `;
            } else {
                triggerHaptic("error");
                saveProgress();
                panel.innerHTML = `
                    <div style="max-width:380px; margin:0 auto; padding: 20px 10px 90px; text-align:center;">
                        <span style="font-size:48px; display:block; margin-bottom:8px;">⚠️</span>
                        <span class="tag" style="border-color:#ff4444; color:#ff4444; margin-bottom:8px;">FALLA DE INTEGRIDAD</span>
                        <h2 style="color:#ffffff; font-size:20px; margin: 8px 0 4px;">COMISIONAMIENTO RECHAZADO</h2>
                        <p style="color:var(--muted); font-size:13px; margin-bottom:14px;">
                            Integridad: <strong style="color:#ff4444;">${integrity}%</strong> (Mínimo requerido: 80%)
                        </p>
                        <p style="color:var(--muted); font-size:12px; margin-bottom:18px;">
                            La estación no superó las pruebas de seguridad. Repasa los componentes e inténtalo de nuevo.
                        </p>
                        <button class="reveal-button" style="background:#ffaa00; color:#0b1424; font-weight:900; min-height:44px; margin-bottom:10px;" onclick="renderAssessment()">
                            ↺ REPETIR COMISIONAMIENTO
                        </button>
                        <button class="btn-secondary" style="width:100%; max-width:260px; min-height:40px;" onclick="navigateTo('career')">
                            ← REGRESAR AL MAPA
                        </button>
                    </div>
                `;
            }
        }

        showQuestion();
    }

    // =====================================
    // 17. GLOBAL RANKING
    // =====================================

    function updateRanking() {
        if (typeof data === "undefined" || !data.players) return;
        const individualList = document.getElementById("individualRankingList");
        const teamList = document.getElementById("teamRankingList");
        if (!individualList || !teamList) return;

        const medals = ["🥇", "🥈", "🥉"];
        const sortedPlayers = [...data.players].sort((a, b) => (b.xp || 0) - (a.xp || 0));

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

        if (Array.isArray(data.teams)) {
            const sortedTeams = data.teams.map(team => {
                const members = data.players.filter(player => player.team === team.name);
                const totalXP = members.reduce((total, player) => total + Number(player.xp || 0), 0);
                return { name: team.name, xp: totalXP, members: members.length };
            }).sort((a, b) => b.xp - a.xp);

            teamList.innerHTML = "";
            sortedTeams.forEach((team, index) => {
                const row = document.createElement("div");
                row.className = "team-row";
                const position = medals[index] || `${index + 1}.`;
                row.innerHTML = `
                    <span>${position} ${team.name} <small>(${team.members} players)</small></span>
                    <strong>${formatNumber(team.xp)} XP</strong>
                `;
                teamList.appendChild(row);
            });
        }
    }

    // =====================================
    // 18. PLAYER PROFILE & VITRINA DE MEDALLAS
    // =====================================

    const MEDALS_DB = [
        {
            id: "badge_electric",
            icon: "⚡",
            name: "Comisionado Eléctrico",
            desc: "Insignia desbloqueada: Especialista en potencia y señales",
            isUnlocked: () => true
        },
        {
            id: "badge_dragon",
            icon: "龍",
            name: "Dragón Zìdòng",
            desc: "Insignia desbloqueada: Rango fundador de la academia",
            isUnlocked: () => true
        },
        {
            id: "badge_robot",
            icon: "🤖",
            name: "Maestro Robótico",
            desc: "Insignia desbloqueada: Control de servomotores y celdas",
            isUnlocked: () => true
        },
        {
            id: "badge_overclock",
            icon: "⭐",
            name: "Overclock 3★",
            desc: "Completa un test de planta en menos de 12 segundos",
            isUnlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3)
        },
        {
            id: "badge_first_hanzi",
            icon: "🔌",
            name: "Primer Circuito",
            desc: "Domina tu primer componente técnico",
            isUnlocked: () => career.completedActivities.length >= 1
        },
        {
            id: "badge_arcade",
            icon: "⚠️",
            name: "Rescate Crítico",
            desc: "Supera 1,500 XP en simulaciones HMI",
            isUnlocked: () => (typeof data !== "undefined" && (data.player?.xp || 0) >= 1500)
        }
    ];

    function applyAvatarIcon(icon) {
        const profileAvatar = document.getElementById("profileAvatar");
        const topAvatar = document.getElementById("topAvatar");

        [profileAvatar, topAvatar].forEach(el => {
            if (!el) return;
            el.textContent = icon;
            if (icon !== "RL") {
                el.classList.add("custom-icon");
            } else {
                el.classList.remove("custom-icon");
            }
        });
    }

    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        if (!container) return;

        container.replaceChildren();
        const currentEquipped = localStorage.getItem("zidong_equipped_badge") || "RL";

        MEDALS_DB.forEach(medal => {
            const unlocked = medal.isUnlocked();
            const isEquipped = currentEquipped === medal.icon;

            const badgeEl = document.createElement("div");
            badgeEl.className = `badge-item ${unlocked ? "" : "locked"} ${isEquipped ? "equipped" : ""}`;
            badgeEl.title = unlocked ? `${medal.name}: ${medal.desc}` : `Bloqueada: ${medal.desc}`;

            badgeEl.innerHTML = `
                <span class="badge-icon">${unlocked ? medal.icon : "🔒"}</span>
                <span class="badge-title">${medal.name}</span>
            `;

            if (unlocked) {
                badgeEl.onclick = () => {
                    const newEquip = isEquipped ? "RL" : medal.icon;
                    localStorage.setItem("zidong_equipped_badge", newEquip);
                    triggerHaptic("success");
                    renderBadgesGrid();
                    applyAvatarIcon(newEquip);
                };
            }

            container.appendChild(badgeEl);
        });
    }

    function updateProfile() {
        const player = (typeof data !== "undefined" && data.player) ? data.player : { xp: 0, level: 5, streak: 5 };
        const profileSection = document.querySelector("#profile");
        if (!profileSection) return;

        const xp = profileSection.querySelector("#profileXP");
        const level = profileSection.querySelector("#profileLevel");
        const streak = profileSection.querySelector("#profileStreak");
        const completed = profileSection.querySelector("#profileCompleted");

        if (xp) xp.textContent = formatNumber(player.xp);
        if (level) level.textContent = String(player.level).padStart(2, "0");
        if (streak) streak.textContent = `${player.streak} Días`;
        if (completed) completed.textContent = career.completedActivities.length;

        const savedIcon = localStorage.getItem("zidong_equipped_badge") || "RL";
        applyAvatarIcon(savedIcon);
        renderBadgesGrid();
    }

    // =====================================
    // 19. INITIALIZE
    // =====================================

    function initializeApplication() {
        loadSavedProgress();
        updateMissionProgress();
        updateRanking();
        updateProfile();
        renderCareerPath();
        updateAssessmentVisibility();

        const card = document.querySelector("#level01 .recognition-card");
        if (card) card.style.display = "block";

        console.log("--------------------------------");
        console.log("ZIDONG CORE 2.0: SYSTEM ONLINE");
        console.log("--------------------------------");
    }

    // EXPOSICIÓN GLOBAL PARA ROUTER Y NAVEGACIÓN
    window.updateProfile = updateProfile;
    window.renderBadgesGrid = renderBadgesGrid;
    window.renderCareerPath = renderCareerPath;
    window.updateRanking = updateRanking;
    window.updateMissionProgress = updateMissionProgress;

    window.debugBossFight = () => {
        career.completedActivities = activities.map(a => a.id);
        openAssessment();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();

/* =========================================
   RANKING TABS
========================================= */

function showRankingTab(tab, button) {
    const individual = document.getElementById("individualRanking");
    const teams = document.getElementById("teamRanking");
    if (!individual || !teams || !button) return;

    document.querySelectorAll(".ranking-tab").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    if (tab === "individual") {
        individual.style.display = "block";
        teams.style.display = "none";
    } else {
        individual.style.display = "none";
        teams.style.display = "block";
    }
}
