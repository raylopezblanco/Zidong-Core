/* ==========================================================================
   ZIDONG CORE 3.0
   APPLICATION ENGINE, CAREER SYSTEM, 1V1 DUEL & XBOX ACHIEVEMENTS
   ========================================================================== */

(() => {
    "use strict";

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
    // 1. COMPONENTES Y ACTIVIDADES
    // =====================================

    const activities = [
        {
            id: "hanzi_001",
            type: "new",
            hanzi: "电",
            pinyin: "diàn",
            meaning: "Electricidad / Señal",
            example: "电缆 (diànlǎn)",
            exampleMeaning: "Cable eléctrico",
            reward: 50
        },
        {
            id: "hanzi_002",
            type: "new",
            hanzi: "机",
            pinyin: "jī",
            meaning: "Máquina / Mecanismo",
            example: "机器 (jīqì)",
            exampleMeaning: "Máquina industrial",
            reward: 50
        },
        {
            id: "review_001",
            type: "review",
            hanzi: "电",
            pinyin: "diàn",
            meaning: "Electricidad",
            example: "电源 (diànyuán)",
            exampleMeaning: "Fuente de alimentación",
            reward: 20
        },
        {
            id: "hanzi_003",
            type: "new",
            hanzi: "线",
            pinyin: "xiàn",
            meaning: "Línea / Cable",
            example: "电线 (diànxiàn)",
            exampleMeaning: "Cableado de control",
            reward: 50
        },
        {
            id: "hanzi_004",
            type: "new",
            hanzi: "力",
            pinyin: "lì",
            meaning: "Fuerza / Potencia",
            example: "动力 (dònglì)",
            exampleMeaning: "Potencia motriz",
            reward: 50
        },
        {
            id: "review_002",
            type: "review",
            hanzi: "机",
            pinyin: "jī",
            meaning: "Máquina",
            example: "电机 (diànjī)",
            exampleMeaning: "Motor eléctrico",
            reward: 20
        },
        {
            id: "hanzi_005",
            type: "new",
            hanzi: "控",
            pinyin: "kòng",
            meaning: "Control / Mando",
            example: "控制 (kòngzhì)",
            exampleMeaning: "Controlador PLC",
            reward: 50
        }
    ];

    // BANCO EXPANDIDO PARA EL LABORATORIO (LAB)
    const LAB_COMPONENTS = [
        { hanzi: "电", pinyin: "diàn", es: "Electricidad", cat: "Potencia", part: "电缆 (Cable)" },
        { hanzi: "机", pinyin: "jī", es: "Máquina / Motor", cat: "Mecánica", part: "电机 (Motor)" },
        { hanzi: "线", pinyin: "xiàn", es: "Línea / Cable", cat: "Conexión", part: "电线 (Cableado)" },
        { hanzi: "力", pinyin: "lì", es: "Fuerza / Torque", cat: "Física", part: "动力 (Potencia)" },
        { hanzi: "控", pinyin: "kòng", es: "Control / PLC", cat: "Automatización", part: "控制 (Control)" },
        { hanzi: "气", pinyin: "qì", es: "Neumática / Aire", cat: "Neumática", part: "气缸 (Cilindro)" },
        { hanzi: "门", pinyin: "mén", es: "Puerta de Seguridad", cat: "Seguridad", part: "安全门 (Puerta)" },
        { hanzi: "光", pinyin: "guāng", es: "Sensor Óptico", cat: "Sensores", part: "光电 (Fotoeléctrico)" },
        { hanzi: "压", pinyin: "yā", es: "Presión", cat: "Neumática", part: "压力 (Presión Bar)" },
        { hanzi: "急", pinyin: "jí", es: "Emergencia", cat: "Seguridad", part: "急停 (E-Stop)" }
    ];

    // LOGROS TIPO XBOX (ACHIEVEMENTS CON GAMERSCORE G)
    const XBOX_ACHIEVEMENTS = [
        {
            id: "ach_welcome",
            title: "Técnico en Planta",
            desc: "Inicia tu primer turno e interactúa con el Cyberdog.",
            score: 50,
            icon: "🤖",
            unlocked: () => true
        },
        {
            id: "ach_first_circuit",
            title: "Primer Circuito Energizado",
            desc: "Domina tu primer componente eléctrico en Career Mode.",
            score: 100,
            icon: "⚡",
            unlocked: () => career.completedActivities.length >= 1
        },
        {
            id: "ach_overclock",
            title: "Calibración Overclock",
            desc: "Consigue 3 estrellas ⭐⭐⭐ en cualquier test de planta.",
            score: 150,
            icon: "⭐",
            unlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3)
        },
        {
            id: "ach_survivor",
            title: "Héroe de Mantenimiento",
            desc: "Intervén y soluciona una alarma HMI crítica en Survivor Mode.",
            score: 150,
            icon: "🚨",
            unlocked: () => localStorage.getItem("zidong_survivor_won") === "true"
        },
        {
            id: "ach_duel_master",
            title: "Duelo de Alta Velocidad",
            desc: "Vence a un oponente en la arena de Duelo 1v1.",
            score: 200,
            icon: "⚔️",
            unlocked: () => localStorage.getItem("zidong_vs_won") === "true"
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

    function updateMissionProgress() {
        const completedCount = career.completedActivities.length;
        const missionFill = document.querySelector(".daily-mission-card .progress-fill");
        const missionSmall = document.getElementById("dashboardMissionStatus");

        if (missionFill) {
            const pct = Math.min(((completedCount + 1) / 4) * 100, 100);
            missionFill.style.width = `${pct}%`;
        }
        if (missionSmall) {
            missionSmall.textContent = `${Math.min(completedCount + 1, 4)} / 4 COMPLETADAS`;
        }

        const mCount = document.getElementById("mCountHanzi");
        if (mCount) mCount.textContent = completedCount;
    }

    function renderCareerPath() {
        const container = document.querySelector("#career .path-nodes");
        if (!container) return;

        container.replaceChildren();

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
    }

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

    function openActivity(index) {
        if (!isActivityUnlocked(index)) return;
        const activity = activities[index];
        if (!activity) return;

        renderLesson(activity);
        if (typeof window.navigateTo === "function") {
            window.navigateTo("level01");
        }
    }

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
                    const exampleChars = activity.example.split(" ")[0].split("");
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

    function completeActivity(activity, stars) {
        const isNewCompletion = !career.completedActivities.includes(activity.id);
        const reward = isNewCompletion ? activity.reward : 15;

        if (isNewCompletion) {
            career.completedActivities.push(activity.id);
        }

        awardXP(reward);
        updateMissionProgress();
        renderAchievements();
        renderCareerPath();
        saveProgress();
    }

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

    function openAssessment() {
        if (typeof window.navigateTo === "function") {
            window.navigateTo("assessment");
        }
        renderAssessment();
    }

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

                    <div style="width:100%; height:7px; background:#142236; border-radius:4px; overflow:hidden; margin-bottom:14px;">
                        <div style="width:${integrity}%; height:100%; background:${integrityColor}; transition:width 0.25s ease;"></div>
                    </div>

                    <div style="background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:18px 14px; text-align:center;">
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
                        setTimeout(nextStep, 320);
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

                renderCareerPath();
                renderAchievements();
                saveProgress();

                panel.innerHTML = `
                    <div style="max-width:380px; margin:0 auto; padding: 20px 10px 90px; text-align:center;">
                        <span style="font-size:48px; display:block; margin-bottom:8px;">⚡</span>
                        <span class="tag" style="border-color:#00f59b; color:#00f59b; margin-bottom:8px;">LÍNEA AUTORIZADA</span>
                        <h2 style="color:#ffffff; font-size:22px; margin: 8px 0 4px;">¡COMISIONAMIENTO EXITOSO!</h2>
                        <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">
                            Integridad: <strong style="color:#00f59b;">${integrity}%</strong> · Aciertos: <strong>${correctCount}/5</strong>
                        </p>
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
                        <p style="color:var(--muted); font-size:13px; margin-bottom:18px;">
                            Integridad: <strong style="color:#ff4444;">${integrity}%</strong> (Mínimo: 80%)
                        </p>
                        <button class="reveal-button" style="background:#ffaa00; color:#0b1424; font-weight:900; min-height:44px;" onclick="renderAssessment()">
                            ↺ REPETIR COMISIONAMIENTO
                        </button>
                    </div>
                `;
            }
        }

        showQuestion();
    }

    // =====================================
    // 3. LABORATORIO (LAB) - GLOSARIO TÉCNICO
    // =====================================

    function renderLabComponents(filteredList = LAB_COMPONENTS) {
        const container = document.getElementById("labComponentsContainer");
        if (!container) return;

        container.replaceChildren();

        filteredList.forEach(comp => {
            const card = document.createElement("div");
            card.className = "comp-card";
            card.innerHTML = `
                <div class="comp-header">
                    <span class="comp-hanzi">${comp.hanzi}</span>
                    <span class="comp-pinyin">${comp.pinyin}</span>
                </div>
                <strong>${comp.es}</strong>
                <small>${comp.part} · ${comp.cat}</small>
            `;

            card.onclick = () => {
                triggerHaptic("success");
                alert(`🔬 Componente: ${comp.hanzi} (${comp.pinyin})\nSignificado: ${comp.es}\nAplicación en planta: ${comp.part}\nCategoría: ${comp.cat}`);
            };

            container.appendChild(card);
        });
    }

    window.filterLabComponents = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            renderLabComponents(LAB_COMPONENTS);
            return;
        }
        const filtered = LAB_COMPONENTS.filter(c => 
            c.hanzi.includes(q) || c.pinyin.toLowerCase().includes(q) || c.es.toLowerCase().includes(q) || c.part.toLowerCase().includes(q)
        );
        renderLabComponents(filtered);
    };

    // =====================================
    // 4. SISTEMA DE LOGROS TIPO XBOX (ACHIEVEMENTS)
    // =====================================

    function renderAchievements() {
        const container = document.getElementById("achievementsListContainer");
        const totalScoreEl = document.getElementById("totalGamerscore");
        if (!container) return;

        container.replaceChildren();

        let currentTotalG = 0;

        XBOX_ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = ach.unlocked();
            if (isUnlocked) currentTotalG += ach.score;

            const card = document.createElement("div");
            card.className = `achieve-card ${isUnlocked ? "unlocked" : "locked"}`;
            card.innerHTML = `
                <div class="achieve-icon">${isUnlocked ? ach.icon : "🔒"}</div>
                <div class="achieve-details">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                </div>
                <div class="achieve-score">
                    <span>${ach.score}</span>
                    <strong>G</strong>
                </div>
            `;
            container.appendChild(card);
        });

        if (totalScoreEl) totalScoreEl.textContent = `${currentTotalG} G`;
    }

    // =====================================
    // 5. COMPANION INTERACTION (SOLO AL TOCAR - NUNCA EN AUTOMÁTICO)
    // =====================================

    const COMPANION_MESSAGES = [
        "¡Línea lista! Modo Survivor en espera. ⚡",
        "Tip de planta: 电 (diàn) representa la potencia en gabinetes.",
        "Sensores fotoeléctricos calibrados. Cero falso rechazo. 👁️",
        "Modo 1v1 listo: ¿Podrás ganarle al Servocontrolador IA? ⚔️",
        "Presión neumática en 6 bar. Cilindros en posición HOME. 💨",
        "Alerta HMI: Revisa siempre el paro de emergencia antes de resetear. ⚠️",
        "¡Gran racha técnico! Estás a poco de certificar Área 02. 🏅",
        "Intervención de emergencia: Cada segundo cuenta en la línea."
    ];

    let lastMsgIndex = -1;

    function interactWithCompanion() {
        const bubbleText = document.getElementById("companionText");
        const dogImg = document.getElementById("companionVisual");

        triggerHaptic("success");

        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * COMPANION_MESSAGES.length);
        } while (nextIndex === lastMsgIndex);
        
        lastMsgIndex = nextIndex;

        if (bubbleText) {
            bubbleText.style.opacity = "0";
            setTimeout(() => {
                bubbleText.textContent = COMPANION_MESSAGES[nextIndex];
                bubbleText.style.opacity = "1";
            }, 120);
        }

        if (dogImg) {
            dogImg.style.transform = "scale(0.92) translateY(4px)";
            setTimeout(() => {
                dogImg.style.transform = "scale(1) translateY(0)";
            }, 180);
        }
    }

    // ELIMINADO setInterval AUTOMÁTICO: El texto SOLO cambia al tocar el tubo del Cyberdog.

    // =====================================
    // 6. ARENA 1V1 BATTLE
    // =====================================

    let vsTimer = null;
    let vsTimeLeft = 20;
    let myVsPoints = 0;
    let rivalVsPoints = 0;

    window.openVsMode = () => {
        triggerHaptic("success");
        if (typeof window.navigateTo === "function") {
            window.navigateTo("vsBattle");
        }

        const opponents = (typeof data !== "undefined" && data.vsOpponents) ? data.vsOpponents : [
            { name: "Servo-Bot IA v4.2", avatar: "🤖" },
            { name: "Chen Wei (PE)", avatar: "👨‍💻" }
        ];
        const rival = opponents[Math.floor(Math.random() * opponents.length)];
        
        document.getElementById("vsRivalName").textContent = rival.name;
        document.getElementById("vsRivalAvatar").textContent = rival.avatar;

        myVsPoints = 0;
        rivalVsPoints = 0;
        vsTimeLeft = 20;
        document.getElementById("vsMyScore").textContent = "0 PTS";
        document.getElementById("vsRivalScore").textContent = "0 PTS";
        document.getElementById("vsSeconds").textContent = vsTimeLeft;

        startVsRound();
    };

    function startVsRound() {
        clearInterval(vsTimer);
        const timerBar = document.getElementById("vsTimerBar");
        
        vsTimer = setInterval(() => {
            vsTimeLeft--;
            document.getElementById("vsSeconds").textContent = vsTimeLeft;
            if (timerBar) timerBar.style.width = `${(vsTimeLeft / 20) * 100}%`;

            if (Math.random() > 0.65) {
                rivalVsPoints += 50;
                document.getElementById("vsRivalScore").textContent = `${rivalVsPoints} PTS`;
            }

            if (vsTimeLeft <= 0) {
                clearInterval(vsTimer);
                finishVsBattle();
            }
        }, 1000);

        loadVsQuestion();
    }

    function loadVsQuestion() {
        const item = activities[Math.floor(Math.random() * activities.length)];
        document.getElementById("vsHanziDisplay").textContent = item.hanzi;

        const otherMeanings = activities.filter(a => a.meaning !== item.meaning).map(a => a.meaning);
        const shuffled = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [item.meaning, ...shuffled].sort(() => 0.5 - Math.random());

        const grid = document.getElementById("vsOptionsGrid");
        grid.replaceChildren();

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "14px";
            btn.style.padding = "12px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                if (opt === item.meaning) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    myVsPoints += 100;
                    document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                    setTimeout(loadVsQuestion, 280);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                }
            };
            grid.appendChild(btn);
        });
    }

    function finishVsBattle() {
        const win = myVsPoints >= rivalVsPoints;
        if (win) {
            triggerHaptic("win");
            awardXP(120);
            localStorage.setItem("zidong_vs_won", "true");
            alert(`🏆 ¡VICTORIA! Superaste al rival con ${myVsPoints} vs ${rivalVsPoints} PTS (+120 XP)`);
        } else {
            triggerHaptic("error");
            alert(`⚠️ DERROTA: El rival anotó ${rivalVsPoints} PTS frente a tus ${myVsPoints} PTS.`);
        }
        renderAchievements();
        saveProgress();
        if (typeof window.navigateTo === "function") {
            window.navigateTo("dashboard");
        }
    }

    // =====================================
    // 7. MODAL DE MISIONES DIARIAS
    // =====================================

    window.toggleDailyMissionsModal = () => {
        const modal = document.getElementById("dailyMissionsModal");
        if (!modal) return;
        const isHidden = modal.style.display === "none";
        modal.style.display = isHidden ? "flex" : "none";
        if (isHidden) {
            triggerHaptic("success");
            updateMissionProgress();
        }
    };

    window.closeMissionsModal = (e) => {
        if (e.target.id === "dailyMissionsModal") {
            window.toggleDailyMissionsModal();
        }
    };

    window.claimDailyReward = () => {
        const lastClaim = localStorage.getItem("zidong_last_daily_claim");
        const today = new Date().toDateString();

        if (lastClaim === today) {
            triggerHaptic("error");
            alert("¡Recompensa diaria ya reclamada hoy! Vuelve mañana.");
            return;
        }

        awardXP(100);
        localStorage.setItem("zidong_last_daily_claim", today);
        triggerHaptic("win");

        const sub = document.getElementById("dailyRewardSubtitle");
        if (sub) sub.textContent = "¡Reclamado hoy! ✓";

        alert("🎁 ¡Has recibido +100 XP por tu bono diario!");
        saveProgress();
    };

    // =====================================
    // 8. INITIALIZE APPLICATION
    // =====================================

    function initializeApplication() {
        loadSavedProgress();
        updateMissionProgress();
        renderCareerPath();
        renderLabComponents();
        renderAchievements();
        updateAssessmentVisibility();

        console.log("--------------------------------");
        console.log("ZIDONG CORE 3.0: SYSTEM READY");
        console.log("--------------------------------");
    }

    window.awardXP = awardXP;
    window.interactWithCompanion = interactWithCompanion;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();
