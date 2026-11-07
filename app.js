/* ==========================================================================
   ZIDONG CORE 11.0 - MODULAR ENGINE
   - Motor limpio desacoplado de bases de datos
   - Carga modular desde companion-phrases.js, medals-data.js, achievements-data.js,
     worlds-data.js e industrial-ranks.js
   ========================================================================== */

(() => {
    "use strict";

    function triggerHaptic(type) {
        if (type === "success") {
            if (navigator.vibrate) navigator.vibrate(35);
            if (window.ZidongAudio && window.ZidongAudio.playSuccess) window.ZidongAudio.playSuccess();
        } else if (type === "error") {
            if (navigator.vibrate) navigator.vibrate([50, 40]);
            if (window.ZidongAudio && window.ZidongAudio.playError) window.ZidongAudio.playError();
        } else if (type === "win") {
            if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
            if (window.ZidongAudio && window.ZidongAudio.playVictory) window.ZidongAudio.playVictory();
        }
    }

    const STORAGE_KEY = "zidong_core_progress_v11";

    // Enlace a los módulos externos o fallback seguro
    const WORLDS_CONFIG = window.ZidongWorlds || [];
    const INDUSTRIAL_RANKS = window.ZidongRanks || [];
    const MEDALS_DB = window.ZidongMedals || [];
    const XBOX_ACHIEVEMENTS = window.ZidongAchievements || [];

    // BANCO DEL LABORATORIO (COMPONENTES)
    const LAB_COMPONENTS = [
        { hanzi: "电", pinyin: "diàn", es: "Electricidad", cat: "world_1", catName: "⚡ Voltaria", part: "电缆 (Cable)" },
        { hanzi: "机", pinyin: "jī", es: "Máquina / Motor", cat: "world_1", catName: "⚡ Voltaria", part: "电机 (Motor)" },
        { hanzi: "线", pinyin: "xiàn", es: "Línea / Cable", cat: "world_1", catName: "⚡ Voltaria", part: "电线 (Cableado)" },
        { hanzi: "力", pinyin: "lì", es: "Fuerza / Potencia", cat: "world_1", catName: "⚡ Voltaria", part: "动力 (Potencia)" },
        { hanzi: "控", pinyin: "kòng", es: "Control / PLC", cat: "world_1", catName: "⚡ Voltaria", part: "控制 (Control)" },
        { hanzi: "源", pinyin: "yuán", es: "Fuente de poder", cat: "world_1", catName: "⚡ Voltaria", part: "电源 (Fuente 24V)" },
        { hanzi: "缆", pinyin: "lǎn", es: "Cable blindado", cat: "world_1", catName: "⚡ Voltaria", part: "光缆 (Fibra)" },
        { hanzi: "路", pinyin: "lù", es: "Circuito", cat: "world_1", catName: "⚡ Voltaria", part: "短路 (Corto)" },

        { hanzi: "轴", pinyin: "zhóu", es: "Eje / Flecha", cat: "world_2", catName: "⚙️ Kinetix", part: "伺服轴 (Eje Z)" },
        { hanzi: "转", pinyin: "zhuǎn", es: "Giro / RPM", cat: "world_2", catName: "⚙️ Kinetix", part: "转速 (Velocidad)" },
        { hanzi: "合", pinyin: "hé", es: "Acople", cat: "world_2", catName: "⚙️ Kinetix", part: "离合器 (Embrague)" },
        { hanzi: "紧", pinyin: "jǐn", es: "Sujeción", cat: "world_2", catName: "⚙️ Kinetix", part: "紧固 (Tornillería)" },
        { hanzi: "位", pinyin: "wèi", es: "Posición", cat: "world_2", catName: "⚙️ Kinetix", part: "原位 (Home)" },
        { hanzi: "轮", pinyin: "lún", es: "Rueda / Polea", cat: "world_2", catName: "⚙️ Kinetix", part: "齿轮 (Engrane)" },
        { hanzi: "杆", pinyin: "gān", es: "Tornillo de bolas", cat: "world_2", catName: "⚙️ Kinetix", part: "丝杆 (Husillo)" },
        { hanzi: "齿", pinyin: "chǐ", es: "Diente de engrane", cat: "world_2", catName: "⚙️ Kinetix", part: "齿条 (Cremallera)" },

        { hanzi: "气", pinyin: "qì", es: "Neumática", cat: "world_3", catName: "💨 Aethel", part: "气缸 (Cilindro)" },
        { hanzi: "压", pinyin: "yā", es: "Presión Bar", cat: "world_3", catName: "💨 Aethel", part: "气压 (Regulador)" },
        { hanzi: "阀", pinyin: "fá", es: "Válvula", cat: "world_3", catName: "💨 Aethel", part: "电磁阀 (Solenoide)" },
        { hanzi: "管", pinyin: "guǎn", es: "Tubo de aire", cat: "world_3", catName: "💨 Aethel", part: "气管 (Manguera)" },
        { hanzi: "漏", pinyin: "lòu", es: "Fuga de aire", cat: "world_3", catName: "💨 Aethel", part: "漏气 (Fuga)" },

        { hanzi: "手", pinyin: "shǒu", es: "Brazo Robot", cat: "world_4", catName: "🤖 Machina", part: "机械手 (Fanuc)" },
        { hanzi: "车", pinyin: "chē", es: "Carro AGV", cat: "world_4", catName: "🤖 Machina", part: "导引车 (AGV)" },
        { hanzi: "点", pinyin: "diǎn", es: "Punto Teach", cat: "world_4", catName: "🤖 Machina", part: "示教点 (Punto)" },
        { hanzi: "速", pinyin: "sù", es: "Velocidad", cat: "world_4", catName: "🤖 Machina", part: "减速 (Reductor)" },
        { hanzi: "避", pinyin: "bì", es: "Evasión Lidar", cat: "world_4", catName: "🤖 Machina", part: "避障 (Sensor)" },

        { hanzi: "光", pinyin: "guāng", es: "Sensor Óptico", cat: "world_5", catName: "👁️ Lumina", part: "光源 (Lámpara)" },
        { hanzi: "镜", pinyin: "jìng", es: "Lente cámara", cat: "world_5", catName: "👁️ Lumina", part: "镜头 (Lente)" },
        { hanzi: "视", pinyin: "shì", es: "Visión AOI", cat: "world_5", catName: "👁️ Lumina", part: "视觉 (AOI)" },
        { hanzi: "检", pinyin: "jiǎn", es: "Inspección", cat: "world_5", catName: "👁️ Lumina", part: "检测 (Test)" },
        { hanzi: "错", pinyin: "cuò", es: "Falso rechazo", cat: "world_5", catName: "👁️ Lumina", part: "误检 (Rechazo)" }
    ];

    // =====================================
    // 2. ESTADO DEL USUARIO
    // =====================================
    const career = {
        completedActivities: ["w1_01"],
        assessmentPassed: false,
        nodeStars: { "w1_01": 3 },
        bossBeaten: {}
    };

    let currentUserData = {
        name: "New user",
        initials: "NU",
        xp: 1850,
        level: 5,
        streak: 5
    };

    function loadSavedProgress() {
        try {
            const savedName = localStorage.getItem("zidong_user_name");
            if (savedName) {
                currentUserData.name = savedName;
                currentUserData.initials = getInitials(savedName);
            } else {
                currentUserData.name = "New user";
                currentUserData.initials = "NU";
            }

            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved) {
                if (saved.player) {
                    currentUserData.xp = saved.player.xp || 1850;
                    currentUserData.level = saved.player.level || 5;
                    currentUserData.streak = saved.player.streak || 5;
                }
                if (saved.career) {
                    career.completedActivities = saved.career.completedActivities || ["w1_01"];
                    career.assessmentPassed = Boolean(saved.career.assessmentPassed);
                    career.nodeStars = saved.career.nodeStars || { "w1_01": 3 };
                    career.bossBeaten = saved.career.bossBeaten || {};
                }
            }
        } catch (e) {
            console.error("Error al cargar:", e);
        }
    }

    function saveProgress() {
        try {
            const saved = {
                player: currentUserData,
                career: {
                    completedActivities: career.completedActivities,
                    assessmentPassed: career.assessmentPassed,
                    nodeStars: career.nodeStars,
                    bossBeaten: career.bossBeaten
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {
            console.error("Error al guardar:", e);
        }
    }

    function getInitials(name) {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    }

    function awardXP(reward) {
        currentUserData.xp += reward;
        updateEnergyBatteryDisplay();
        renderRanksSection();
        updateProfile();
        saveProgress();
    }

    function getCurrentRank(xp = 1850) {
        let current = INDUSTRIAL_RANKS[0] || { id: 1, name: "Becario", minXP: 0, maxXP: 800, icon: "📋" };
        for (let i = INDUSTRIAL_RANKS.length - 1; i >= 0; i--) {
            if (xp >= INDUSTRIAL_RANKS[i].minXP) {
                current = INDUSTRIAL_RANKS[i];
                break;
            }
        }
        return current;
    }

    function updateEnergyBatteryDisplay() {
        const fill = document.getElementById("homeBatteryFill");
        const valText = document.getElementById("homeBatteryXpValue");
        const rankText = document.getElementById("homeBatteryRank");
        const pctText = document.getElementById("homeBatteryPercent");

        const curRank = getCurrentRank(currentUserData.xp);
        const xpInLevel = Math.max(0, currentUserData.xp - curRank.minXP);
        const levelRange = Math.max(1, curRank.maxXP - curRank.minXP);
        const pct = Math.min(100, Math.max(5, Math.round((xpInLevel / levelRange) * 100)));

        if (fill) fill.style.width = `${pct}%`;
        if (valText) valText.textContent = `${Number(currentUserData.xp).toLocaleString("en-US")} XP`;
        if (rankText) rankText.textContent = `Rango 0${curRank.id}: ${curRank.name}`;
        if (pctText) pctText.textContent = `${pct}% de carga`;
    }

    // =====================================
    // 3. EDICIÓN DE NOMBRE (1 SOLA VEZ)
    // =====================================
    window.editUserNameOnce = () => {
        const alreadyChanged = localStorage.getItem("zidong_name_changed") === "true";
        if (alreadyChanged) {
            triggerHaptic("error");
            alert(`🔒 No puedes modificar tu nombre de nuevo.\nEl sistema ya registró tu identidad como: "${currentUserData.name}".`);
            return;
        }

        const warningMsg = `⚠️ ¡ATENCIÓN! REGLA DE PLANTA:\n\nSolo tienes permitido registrar tu nombre UNA SOLA VEZ en el sistema.\n\nPiénsalo bien: tal y como lo escribas ahora, así serás conocido en los 5 mundos.\n\n¿Deseas continuar?`;
        
        if (!confirm(warningMsg)) return;

        const newName = prompt("Escribe tu nombre y apellido definitivo:", currentUserData.name);
        if (!newName || newName.trim().length < 2) {
            alert("Operación cancelada: Nombre no válido.");
            return;
        }

        const cleanName = newName.trim();
        currentUserData.name = cleanName;
        currentUserData.initials = getInitials(cleanName);
        localStorage.setItem("zidong_user_name", cleanName);
        localStorage.setItem("zidong_name_changed", "true");

        triggerHaptic("win");
        updateUserDisplay();
        updateProfile();
        saveProgress();

        alert(`✅ Nombre registrado con éxito: "${cleanName}".\nEste cambio ha quedado bloqueado permanentemente.`);
    };

    function updateUserDisplay() {
        const topU = document.getElementById("topUsername");
        const topA = document.getElementById("topAvatar");
        const profU = document.getElementById("profileName");
        const profA = document.getElementById("profileAvatar");
        const editNotice = document.getElementById("nameEditNotice");

        if (topU) topU.textContent = currentUserData.name;
        if (topA && !topA.classList.contains("custom-icon")) topA.textContent = currentUserData.initials;
        if (profU) profU.textContent = currentUserData.name;
        if (profA && !profA.classList.contains("custom-icon")) profA.textContent = currentUserData.initials;

        const isLocked = localStorage.getItem("zidong_name_changed") === "true";
        if (editNotice) {
            editNotice.innerHTML = isLocked 
                ? "🔒 Nombre oficial bloqueado (ya utilizado)" 
                : "✏️ Toca aquí para editar nombre <strong style='color:#ffaa00;'>(1 sola vez)</strong>";
        }
    }

    // =====================================
    // 4. COMPANION (CARGA DINÁMICA DESDE REPOSITORIO MODULAR)
    // =====================================
    let lastMsgIndex = -1;
    function interactWithCompanion() {
        const bubbleText = document.getElementById("companionText");
        const dogImg = document.getElementById("companionVisual");

        triggerHaptic("success");

        const phrasesModule = window.ZidongPhrases;
        const messages = phrasesModule ? phrasesModule.getPhrases(currentUserData.name) : [
            `${currentUserData.name}... te quedaría mejor Chilaquil 🐶🔥`,
            `¡Terminal OBERON en línea! Modo Survivor experto sin pistas: +3s por alarma retirada. 🚨`
        ];

        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * messages.length);
        } while (nextIndex === lastMsgIndex);
        lastMsgIndex = nextIndex;

        if (bubbleText) {
            bubbleText.style.opacity = "0";
            setTimeout(() => {
                bubbleText.textContent = messages[nextIndex];
                bubbleText.style.opacity = "1";
            }, 120);
        }

        if (dogImg) {
            dogImg.style.transform = "scale(0.92) translateY(4px)";
            setTimeout(() => { dogImg.style.transform = "scale(1) translateY(0)"; }, 180);
        }
    }

    // =====================================
    // 5. MENÚ DE PLANETAS Y NIVELES (CAREER MODE)
    // =====================================
    function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;

        container.replaceChildren();

        WORLDS_CONFIG.forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const completedInWorld = world.activities.filter(a => career.completedActivities.includes(a.id)).length;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere">
                        <span class="planet-core-icon">${world.icon}</span>
                    </div>
                    <div class="planet-orbit-ring" style="border-color:${world.color}88;"></div>
                </div>

                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color};">${world.title}</span>
                    <h4>${world.planetName}</h4>
                    <p>${world.subtitle}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <span class="planet-enter-badge">EXPLORAR MUNDO →</span>
                        <small style="color:${world.color}; font-weight:800; font-size:10px;">${completedInWorld}/${totalAct} NIVELES</small>
                    </div>
                </div>
            `;

            planetCard.onclick = () => {
                if (window.ZidongAudio && window.ZidongAudio.playPlanetChime) {
                    window.ZidongAudio.playPlanetChime();
                }
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    }

    function openWorldDetails(world) {
        if (typeof window.navigateTo === "function") {
            window.navigateTo("worldDetailsView");
        }

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;

        if (!stream) return;
        stream.replaceChildren();

        world.activities.forEach((act, aIdx) => {
            const isCompleted = career.completedActivities.includes(act.id);
            const stars = (career.nodeStars && career.nodeStars[act.id]) || (isCompleted ? 3 : 0);
            const nodeEl = document.createElement("div");
            nodeEl.className = `path-step ${aIdx % 2 === 0 ? "left" : "right"}`;

            nodeEl.innerHTML = `
                <div class="path-node ${isCompleted ? "completed" : "current"}">
                    <span>${isCompleted ? "✓" : act.hanzi}</span>
                </div>
                <div class="path-label">
                    <strong>Nivel 0${aIdx + 1} · ${act.meaning} ${isCompleted ? "⭐".repeat(stars) : ""}</strong>
                    <small>4 Fases: Significado, Pinyin, Compuesta, Alarma</small>
                    <span class="node-action">${isCompleted ? "REPETIR TEST ↺" : "CALIBRAR EN LÍNEA ⚡"}</span>
                </div>
            `;

            nodeEl.style.cursor = "pointer";
            nodeEl.onclick = () => openActivity(act);
            stream.appendChild(nodeEl);
        });

        // BOSS CHECKPOINT AL FINAL (SECUENCIA EN ORDEN ESPAÑOL)
        if (world.boss) {
            const isBossBeaten = Boolean(career.bossBeaten && career.bossBeaten[world.boss.id]);
            const bossNode = document.createElement("div");
            bossNode.className = "path-step left";
            bossNode.innerHTML = `
                <div class="path-node assessment ${isBossBeaten ? "completed" : "current"}" style="border-color:${world.color};">
                    <span>${isBossBeaten ? "✓" : "🏅"}</span>
                </div>
                <div class="path-label">
                    <strong style="color:${world.color};">${world.boss.name}</strong>
                    <small>Secuencia en orden español · Sin pistas en Hanzi</small>
                    <span class="node-action" style="color:${world.color};">${isBossBeaten ? "CERTIFICADO ✓" : "INICIAR CHECKPOINT FINAL →"}</span>
                </div>
            `;
            bossNode.style.cursor = "pointer";
            bossNode.onclick = () => startBossCheckpoint(world);
            stream.appendChild(bossNode);
        }
    }

    function openActivity(act) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi4Phases(act);
    }

    // =====================================
    // 6. PEDAGOGÍA EN 4 FASES POR HANZI
    // =====================================
    function startHanzi4Phases(act) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        // FASE 1: SIGNIFICADO
        function renderPhase1() {
            const allMeanings = ["Electricidad", "Máquina / Motor", "Línea / Cable", "Fuerza / Potencia", "Control / PLC", "Eje / Flecha", "Presión Bar", "Cilindro neumático", "Aire / Neumática", "Válvula solenoide"];
            const wrongOpts = allMeanings.filter(m => m !== act.meaning).sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.meaning, ...wrongOpts].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot active">1. Significado</span>
                    <span class="step-dot">2. Pronunciación</span>
                    <span class="step-dot">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:var(--cyan); color:var(--cyan); margin:6px 0 4px 0;">FASE 1 DE 4 · IDENTIFICACIÓN</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:13.5px; margin-bottom:12px; color:#fff;">¿Cuál es el significado técnico de este carácter?</h3>
                <div class="career-quiz-grid" id="phaseQuizGrid"></div>
            `;

            const grid = card.querySelector("#phaseQuizGrid");
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "cf-btn-option";
                btn.style.fontSize = "13.5px";
                btn.style.padding = "12px 10px";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allButtons = grid.querySelectorAll("button");
                    allButtons.forEach(b => b.style.pointerEvents = "none");

                    if (opt === act.meaning) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(renderPhase2, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase1, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        // FASE 2: PRONUNCIACIÓN / PINYIN
        function renderPhase2() {
            const dummyPinyins = ["diàn", "jī", "xiàn", "lì", "kòng", "zhóu", "zhuǎn", "qì", "fá", "shǒu", "guāng", "jìng"].filter(p => p !== act.pinyin);
            const shuffledP = dummyPinyins.sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.pinyin, ...shuffledP].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">2. Pronunciación</span>
                    <span class="step-dot">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:#a78bfa; color:#a78bfa; margin:6px 0 4px 0;">FASE 2 DE 4 · LECTURA FONÉTICA</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:13.5px; margin-bottom:12px; color:#fff;">¿Cómo se pronuncia en mandarín técnico?</h3>
                <div class="career-quiz-grid" id="phaseQuizGrid"></div>
            `;

            const grid = card.querySelector("#phaseQuizGrid");
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "cf-btn-option";
                btn.style.fontSize = "15px";
                btn.style.padding = "12px 10px";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allButtons = grid.querySelectorAll("button");
                    allButtons.forEach(b => b.style.pointerEvents = "none");

                    if (opt === act.pinyin) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(renderPhase3, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase2, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        // FASE 3: PALABRA COMPUESTA (ENSAMBLE TÉCNICO)
        function renderPhase3() {
            const chars = act.compound.split("");
            const targetChar = chars.find(c => c !== act.hanzi) || act.hanzi;
            const dummyPool = ["缆", "箱", "压", "电", "机", "线", "阀", "器", "门", "轴", "气", "光", "头"].filter(c => c !== targetChar);
            const blockOptions = [targetChar, ...dummyPool.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:#ffaa00; color:#ffaa00; margin:6px 0 4px 0;">FASE 3 DE 4 · PALABRA COMPUESTA</span>
                <p style="font-size:10.5px; color:var(--muted); margin:4px 0;">FORMA EL TÉRMINO DE PLANTA:</p>
                <h2 style="color:var(--cyan); margin: 4px 0 12px 0;">${act.compoundMeaning}</h2>

                <div class="cf-slots-dock" style="margin-bottom:14px;">
                    <div class="cf-slot filled">${act.hanzi}</div>
                    <div class="cf-slot empty" id="slotTarget">_</div>
                </div>

                <div style="display:flex; justify-content:center; gap:12px;" id="compoundBlocksGrid"></div>
            `;

            const bGrid = card.querySelector("#compoundBlocksGrid");
            blockOptions.forEach(char => {
                const b = document.createElement("button");
                b.className = "cf-part-btn";
                b.style.width = "64px";
                b.textContent = char;

                b.onclick = () => {
                    if (char === targetChar) {
                        triggerHaptic("success");
                        const slot = card.querySelector("#slotTarget");
                        slot.textContent = char;
                        slot.classList.add("filled");
                        slot.classList.remove("empty");
                        setTimeout(renderPhase4, 400);
                    } else {
                        triggerHaptic("error");
                        b.style.opacity = "0.2";
                        b.style.pointerEvents = "none";
                    }
                };
                bGrid.appendChild(b);
            });
        }

        // FASE 4: IDENTIFICAR LA PALABRA/HANZI DENTRO DE LA ALARMA REAL DE HMI
        function renderPhase4() {
            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">4. Escáner HMI</span>
                </div>

                <span class="tag" style="border-color:#00f59b; color:#00f59b; margin:6px 0 4px 0;">FASE 4 DE 4 · ESCÁNER EN PISO</span>
                <p style="font-size:12px; color:#ffffff; font-weight:700; margin:6px 0 10px 0;">
                    Identifica el componente <strong style="color:var(--cyan);">"${act.meaning}"</strong> dentro del texto de la alarma HMI:
                </p>

                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header">
                        <small>HMI RUNTIME · ALARM MONITOR</small>
                        <span class="alarm-led-red">●</span>
                    </div>
                    <div class="hmi-tokens-container" id="alarmTokensGrid"></div>
                </div>

                <p style="font-size:10px; color:var(--muted); margin-top:6px;">
                    Toca el carácter exacto en la alarma para autorizar el rearme.
                </p>
            `;

            const tokensGrid = card.querySelector("#alarmTokensGrid");
            const chars = act.alarmSentence.split("");

            chars.forEach((c) => {
                const tokenBtn = document.createElement("button");
                tokenBtn.className = "hmi-char-token";
                tokenBtn.textContent = c;

                tokenBtn.onclick = () => {
                    if (c === act.alarmTarget) {
                        triggerHaptic("win");
                        tokenBtn.classList.add("token-hit");

                        if (!career.completedActivities.includes(act.id)) {
                            career.completedActivities.push(act.id);
                        }
                        if (!career.nodeStars) career.nodeStars = {};
                        career.nodeStars[act.id] = 3;
                        awardXP(act.reward);

                        setTimeout(() => {
                            alert(`🌟 ¡NIVEL APROBADO! (+${act.reward} XP)\nHas dominado las 4 fases de "${act.hanzi}" (${act.meaning}).`);
                            if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");
                        }, 400);
                    } else {
                        triggerHaptic("error");
                        tokenBtn.classList.add("token-miss");
                        setTimeout(() => tokenBtn.classList.remove("token-miss"), 300);
                    }
                };
                tokensGrid.appendChild(tokenBtn);
            });
        }

        renderPhase1();
    }

    // =====================================
    // 7. BOSS CHECKPOINT CON SECUENCIA ORDENADA EN ESPAÑOL
    // =====================================
    function startBossCheckpoint(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card || !world.boss) return;

        const boss = world.boss;
        const sequence = boss.sequence;
        let currentStepIndex = 0;

        function renderBossSequenceView() {
            const chipsHtml = sequence.map((s, idx) => {
                let statusClass = "seq-target-chip";
                if (idx < currentStepIndex) statusClass += " done-step";
                else if (idx === currentStepIndex) statusClass += " active-step";
                return `<span class="${statusClass}">${idx + 1}. ${s.esName}</span>`;
            }).join("");

            const currentTarget = sequence[currentStepIndex];

            card.innerHTML = `
                <span class="tag" style="border-color:${world.color}; color:${world.color}; margin-bottom:8px;">
                    ${boss.name} · SECUENCIA EN ORDEN
                </span>
                
                <p style="font-size:11px; color:var(--muted); margin-bottom:6px;">SELECCIONA EN ESTE ORDEN EXACTO:</p>
                <div class="boss-target-sequence-shelf">${chipsHtml}</div>

                <p style="font-size:12.5px; color:#ffffff; font-weight:800; margin:6px 0 12px 0;">
                    Toca en la alarma el Hanzi que corresponde a: <strong style="color:var(--gold); font-size:14px;">"${currentTarget.esName}"</strong>
                </p>

                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header">
                        <small>CHECKPOINT MASTER SCANNER</small>
                        <span class="alarm-led-red">●</span>
                    </div>
                    <div class="hmi-tokens-container" id="bossTokensGrid"></div>
                </div>

                <p style="font-size:10px; color:var(--muted); margin-top:4px;">
                    Paso ${currentStepIndex + 1} de ${sequence.length}. Identifica la palabra en la alarma sin pistas chinas.
                </p>
            `;

            const tokensGrid = card.querySelector("#bossTokensGrid");
            boss.alarmSentence.split("").forEach(c => {
                const b = document.createElement("button");
                b.className = "hmi-char-token";
                b.textContent = c;

                b.onclick = () => {
                    if (c === currentTarget.targetHanzi) {
                        triggerHaptic("success");
                        b.classList.add("token-hit");
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            triggerHaptic("win");
                            if (!career.bossBeaten) career.bossBeaten = {};
                            career.bossBeaten[boss.id] = true;
                            awardXP(boss.reward);

                            setTimeout(() => {
                                alert(`🏆 ¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`);
                                renderBadgesGrid();
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 450);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        triggerHaptic("error");
                        b.classList.add("token-miss");
                        setTimeout(() => b.classList.remove("token-miss"), 300);
                        alert(`⚠️ ¡Orden incorrecto! Debes identificar primero: "${currentTarget.esName}".`);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }

    // =====================================
    // 8. ARENA 1V1: IA IGUAL DE DIFÍCIL (MECÁNICAS POR NIVEL)
    // =====================================
    const VS_DIFFICULTIES = {
        EASY: {
            name: "Simulador de Enlace",
            badge: "NIVEL 1 · HANZI SIMPLE",
            prob: 0.82,
            points: 100,
            winBonus: 100
        },
        MEDIUM: {
            name: "Servocontrolador Overclock",
            badge: "NIVEL 2 · PALABRA 2 HANZI",
            prob: 0.85,
            points: 100,
            winBonus: 150
        },
        HARD: {
            name: "Protocolo Centinela IA",
            badge: "NIVEL 3 · ORDENAR PALABRA",
            prob: 0.88,
            points: 100,
            winBonus: 250
        }
    };

    let selectedVsDiffKey = "MEDIUM";
    let vsTimer = null;
    let vsTimeLeft = 20;
    let myVsPoints = 0;
    let rivalVsPoints = 0;

    window.openVsMode = () => {
        stopVsSession();
        triggerHaptic("success");
        if (typeof window.navigateTo === "function") {
            window.navigateTo("vsBattle");
        }
        document.getElementById("vsDifficultySelector").style.display = "block";
        document.getElementById("vsBattleArenaContainer").style.display = "none";
        document.getElementById("vsDefeatScreen").style.display = "none";
    };

    window.start1v1WithDifficulty = (diffKey) => {
        selectedVsDiffKey = diffKey;
        const diff = VS_DIFFICULTIES[diffKey];

        document.getElementById("vsDifficultySelector").style.display = "none";
        document.getElementById("vsBattleArenaContainer").style.display = "block";
        document.getElementById("vsDefeatScreen").style.display = "none";

        document.getElementById("vsRivalName").textContent = diff.name;
        document.getElementById("vsRivalAvatar").textContent = diffKey === "HARD" ? "⚡" : diffKey === "MEDIUM" ? "🤖" : "⚙️";
        document.getElementById("vsDiffBadge").textContent = diff.badge;

        myVsPoints = 0;
        rivalVsPoints = 0;
        vsTimeLeft = 20;

        document.getElementById("vsMyScore").textContent = "0 PTS";
        document.getElementById("vsRivalScore").textContent = "0 PTS";
        document.getElementById("vsSeconds").textContent = vsTimeLeft;

        startVsRound();
    };

    function startVsRound() {
        stopVsSession();
        const diff = VS_DIFFICULTIES[selectedVsDiffKey];
        const timerBar = document.getElementById("vsTimerBar");

        vsTimer = setInterval(() => {
            vsTimeLeft--;
            document.getElementById("vsSeconds").textContent = vsTimeLeft;
            if (timerBar) timerBar.style.width = `${(vsTimeLeft / 20) * 100}%`;

            if (window.ZidongAudio && window.ZidongAudio.playClockTick) {
                window.ZidongAudio.playClockTick(vsTimeLeft % 2 === 0);
            }

            if (Math.random() < diff.prob) {
                rivalVsPoints += diff.points;
                document.getElementById("vsRivalScore").textContent = `${rivalVsPoints} PTS`;
            }

            if (vsTimeLeft <= 0) {
                stopVsSession();
                finishVsBattle();
            }
        }, 1000);

        loadVsMechanicByLevel();
    }

    function loadVsMechanicByLevel() {
        if (selectedVsDiffKey === "EASY") {
            loadVsLevel1SingleHanzi();
        } else if (selectedVsDiffKey === "MEDIUM") {
            loadVsLevel2CompoundWord();
        } else {
            loadVsLevel3OrderHanzi();
        }
    }

    function loadVsLevel1SingleHanzi() {
        const pool = LAB_COMPONENTS;
        const item = pool[Math.floor(Math.random() * pool.length)];
        document.getElementById("vsHanziDisplay").textContent = item.hanzi;

        const otherMeanings = pool.filter(a => a.es !== item.es).map(a => a.es);
        const shuffled = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [item.es, ...shuffled].sort(() => 0.5 - Math.random());

        const grid = document.getElementById("vsOptionsGrid");
        grid.replaceChildren();

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "13px";
            btn.style.padding = "11px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (opt === item.es) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    myVsPoints += 100;
                    document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                    setTimeout(loadVsMechanicByLevel, 240);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                    document.getElementById("vsSeconds").textContent = vsTimeLeft;
                    setTimeout(loadVsMechanicByLevel, 300);
                }
            };
            grid.appendChild(btn);
        });
    }

    function loadVsLevel2CompoundWord() {
        const words = [
            { hanzi2: "电缆", es: "Cable eléctrico" },
            { hanzi2: "电机", es: "Motor eléctrico" },
            { hanzi2: "气缸", es: "Cilindro neumático" },
            { hanzi2: "伺服", es: "Servocontrolador" },
            { hanzi2: "电磁", es: "Solenoide eléctrico" },
            { hanzi2: "机械", es: "Mecanismo robótico" },
            { hanzi2: "气压", es: "Presión de aire" },
            { hanzi2: "急停", es: "Paro de emergencia" }
        ];

        const item = words[Math.floor(Math.random() * words.length)];
        document.getElementById("vsHanziDisplay").textContent = item.hanzi2;

        const otherMeanings = words.filter(a => a.es !== item.es).map(a => a.es);
        const shuffled = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [item.es, ...shuffled].sort(() => 0.5 - Math.random());

        const grid = document.getElementById("vsOptionsGrid");
        grid.replaceChildren();

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "13px";
            btn.style.padding = "11px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (opt === item.es) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    myVsPoints += 100;
                    document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                    setTimeout(loadVsMechanicByLevel, 240);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                    document.getElementById("vsSeconds").textContent = vsTimeLeft;
                    setTimeout(loadVsMechanicByLevel, 300);
                }
            };
            grid.appendChild(btn);
        });
    }

    function loadVsLevel3OrderHanzi() {
        const words = [
            { hanzi2: "电缆", chars: ["缆", "电"], es: "Cable eléctrico", order: ["电", "缆"] },
            { hanzi2: "气缸", chars: ["缸", "气"], es: "Cilindro neumático", order: ["气", "缸"] },
            { hanzi2: "电机", chars: ["机", "电"], es: "Motor eléctrico", order: ["电", "机"] },
            { hanzi2: "急停", chars: ["停", "急"], es: "Paro de emergencia", order: ["急", "停"] },
            { hanzi2: "伺服", chars: ["服", "伺"], es: "Servocontrolador", order: ["伺", "服"] }
        ];

        const item = words[Math.floor(Math.random() * words.length)];
        document.getElementById("vsHanziDisplay").textContent = item.es;

        const grid = document.getElementById("vsOptionsGrid");
        grid.replaceChildren();

        let stepOrder = 0;
        const slotsRow = document.createElement("div");
        slotsRow.className = "cf-slots-dock";
        slotsRow.style.margin = "0 auto 10px auto";
        slotsRow.innerHTML = `
            <div class="cf-slot empty" id="vSlot0">_</div>
            <div class="cf-slot empty" id="vSlot1">_</div>
        `;
        grid.appendChild(slotsRow);

        const blocksRow = document.createElement("div");
        blocksRow.style.display = "flex";
        blocksRow.style.justifyContent = "center";
        blocksRow.style.gap = "12px";

        const shuffledChars = [...item.chars].sort(() => 0.5 - Math.random());

        shuffledChars.forEach(char => {
            const b = document.createElement("button");
            b.className = "cf-part-btn";
            b.style.width = "64px";
            b.textContent = char;

            b.onclick = () => {
                if (char === item.order[stepOrder]) {
                    triggerHaptic("success");
                    const slot = document.getElementById(`vSlot${stepOrder}`);
                    if (slot) {
                        slot.textContent = char;
                        slot.classList.add("filled");
                        slot.classList.remove("empty");
                    }
                    b.style.opacity = "0.3";
                    b.style.pointerEvents = "none";
                    stepOrder++;

                    if (stepOrder === 2) {
                        myVsPoints += 100;
                        document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                        setTimeout(loadVsMechanicByLevel, 240);
                    }
                } else {
                    triggerHaptic("error");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                    document.getElementById("vsSeconds").textContent = vsTimeLeft;
                    b.style.borderColor = "#ff4444";
                    setTimeout(loadVsMechanicByLevel, 300);
                }
            };
            blocksRow.appendChild(b);
        });

        grid.appendChild(blocksRow);
    }

    function finishVsBattle() {
        stopVsSession();
        const diff = VS_DIFFICULTIES[selectedVsDiffKey];
        const win = myVsPoints >= rivalVsPoints;

        const recordKey = `zidong_vs_best_${selectedVsDiffKey.toLowerCase()}`;
        const prevBest = Number(localStorage.getItem(recordKey) || 0);
        if (myVsPoints > prevBest) {
            localStorage.setItem(recordKey, myVsPoints);
        }

        if (win) {
            triggerHaptic("win");
            awardXP(diff.winBonus);
            const currentWins = Number(localStorage.getItem("zidong_vs_wins") || 0) + 1;
            localStorage.setItem("zidong_vs_wins", currentWins);
            alert(`🏆 ¡VICTORIA! Superaste a "${diff.name}" con ${myVsPoints} vs ${rivalVsPoints} PTS (+${diff.winBonus} XP)`);
            renderBadgesGrid();
            updateProfile();
            if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        } else {
            triggerHaptic("error");
            if (window.ZidongAudio && window.ZidongAudio.playLineCollapse) {
                window.ZidongAudio.playLineCollapse();
            }

            document.getElementById("vsBattleArenaContainer").style.display = "none";
            const defeatScreen = document.getElementById("vsDefeatScreen");
            defeatScreen.style.display = "block";

            document.getElementById("vsDefeatRivalAvatar").textContent = selectedVsDiffKey === "HARD" ? "⚡" : "🤖";
            document.getElementById("vsDefeatScores").textContent = `${currentUserData.name}: ${myVsPoints} PTS vs ${diff.name}: ${rivalVsPoints} PTS`;
        }
    }

    function stopVsSession() {
        clearInterval(vsTimer);
        vsTimer = null;
    }

    window.stopVsSession = stopVsSession;

    // =====================================
    // 9. CLASIFICATORIA DE PLANTA (LEADERBOARD)
    // =====================================
    const MOCK_LEADERBOARD = [
        { name: "Chen Wei (陈伟)", rank: "Ingeniero Sr", xp: 32450, team: "SMT Alpha", badge: "🥇" },
        { name: "Li Na (李娜)", rank: "Ingeniero Full", xp: 24800, team: "AOI Lumina", badge: "🥈" },
        { name: "Carlos Mendoza", rank: "Ingeniero Jr", xp: 18950, team: "Kinetix Core", badge: "🥉" },
        { name: "Zhang Tao (张涛)", rank: "Técnico Sr", xp: 14200, team: "Robotics 04", badge: "4." },
        { name: "Alejandro Silva", rank: "Técnico Jr", xp: 9800, team: "Neumática Aethel", badge: "5." }
    ];

    function renderLeaderboardSection() {
        const myRankCard = document.getElementById("leaderboardMyRankBox");
        const listContainer = document.getElementById("leaderboardTableContainer");
        if (!listContainer) return;

        const allUsers = [
            { name: currentUserData.name, rank: getCurrentRank(currentUserData.xp).name, xp: currentUserData.xp, team: "Mi Estación", isMe: true },
            ...MOCK_LEADERBOARD
        ].sort((a, b) => b.xp - a.xp);

        const myIndex = allUsers.findIndex(u => u.isMe);

        if (myRankCard) {
            myRankCard.innerHTML = `
                <div class="lb-my-avatar">${currentUserData.initials}</div>
                <div class="lb-my-info">
                    <span class="eyebrow" style="color:var(--cyan);">TU POSICIÓN EN PLANTA</span>
                    <strong style="color:#fff; font-size:14px;">#0${myIndex + 1} · ${currentUserData.name}</strong>
                    <small style="color:var(--muted);">${getCurrentRank(currentUserData.xp).name}</small>
                </div>
                <div class="lb-my-score">
                    <span style="color:var(--green); font-size:15px; font-weight:900;">${Number(currentUserData.xp).toLocaleString("en-US")}</span>
                    <small style="color:var(--gold); font-size:9px;">XP TOTAL</small>
                </div>
            `;
        }

        listContainer.replaceChildren();
        const medals = ["🥇", "🥈", "🥉"];

        allUsers.forEach((user, idx) => {
            const row = document.createElement("div");
            row.className = `lb-rank-row ${user.isMe ? "lb-highlight-me" : ""}`;

            const posTag = medals[idx] || `${idx + 1}.`;

            row.innerHTML = `
                <span class="lb-pos">${posTag}</span>
                <div class="lb-user-details">
                    <strong style="color:${user.isMe ? 'var(--cyan)' : '#ffffff'}; font-size:12.5px;">${user.name}</strong>
                    <small style="color:var(--muted); font-size:9.5px;">${user.rank} · ${user.team}</small>
                </div>
                <div class="lb-xp-tag">
                    <strong>${Number(user.xp).toLocaleString("en-US")}</strong>
                    <small>XP</small>
                </div>
            `;
            listContainer.appendChild(row);
        });
    }

    // =====================================
    // 10. LABORATORIO (LAB)
    // =====================================
    let currentLabCategory = "all";

    function renderLabComponents(filteredList = null) {
        const container = document.getElementById("labComponentsContainer");
        if (!container) return;

        let list = filteredList;
        if (!list) {
            list = currentLabCategory === "all" 
                ? LAB_COMPONENTS 
                : LAB_COMPONENTS.filter(c => c.cat === currentLabCategory);
        }

        container.replaceChildren();

        list.forEach(comp => {
            const card = document.createElement("div");
            card.className = "comp-card";
            card.innerHTML = `
                <div class="comp-header">
                    <span class="comp-hanzi">${comp.hanzi}</span>
                    <span class="comp-pinyin">${comp.pinyin}</span>
                </div>
                <strong>${comp.es}</strong>
                <small>${comp.part} · ${comp.catName}</small>
            `;
            card.onclick = () => {
                triggerHaptic("success");
                alert(`🔬 ${comp.hanzi} (${comp.pinyin})\nSignificado: ${comp.es}\nAplicación: ${comp.part}\nMundo: ${comp.catName}`);
            };
            container.appendChild(card);
        });
    }

    window.filterLabCategory = (cat, btnEl) => {
        currentLabCategory = cat;
        document.querySelectorAll(".lab-tab-btn").forEach(b => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        renderLabComponents();
    };

    window.filterLabComponents = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            renderLabComponents();
            return;
        }
        const filtered = LAB_COMPONENTS.filter(c => 
            c.hanzi.includes(q) || c.pinyin.toLowerCase().includes(q) || c.es.toLowerCase().includes(q) || c.part.toLowerCase().includes(q)
        );
        renderLabComponents(filtered);
    };

    // =====================================
    // 11. ESCALAFÓN Y PERFIL
    // =====================================
    function renderRanksSection() {
        const container = document.getElementById("ranksLadderContainer");
        const headerBadge = document.getElementById("topRankBadge");
        const profileRankBadge = document.getElementById("profileRankBadge");
        if (!container) return;

        const current = getCurrentRank(currentUserData.xp);

        if (headerBadge) headerBadge.textContent = `${current.icon} ${current.name}`;
        if (profileRankBadge) profileRankBadge.textContent = `${current.icon} ${current.name} (Rango 0${current.id}/10)`;

        container.replaceChildren();

        INDUSTRIAL_RANKS.forEach(rank => {
            const isReached = currentUserData.xp >= rank.minXP;
            const isCurrent = rank.id === current.id;

            const card = document.createElement("div");
            card.className = `rank-ladder-card ${isReached ? "reached" : "locked"} ${isCurrent ? "current-rank" : ""}`;

            card.innerHTML = `
                <div class="rank-icon-box">${rank.icon}</div>
                <div class="rank-info-box">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${rank.id}. ${rank.name}</strong>
                        <span class="rank-xp-req">${rank.minXP.toLocaleString("en-US")} XP</span>
                    </div>
                    <small>${rank.desc}</small>
                </div>
                <div class="rank-status-tag">
                    ${isCurrent ? "<span class='badge-current'>ACTUAL</span>" : isReached ? "✓" : "🔒"}
                </div>
            `;
            container.appendChild(card);
        });
    }

    function updateProfile() {
        const level = document.getElementById("profileLevel");
        const streak = document.getElementById("profileStreak");
        const completed = document.getElementById("profileCompleted");

        if (level) level.textContent = "05";
        if (streak) streak.textContent = "5 Días";
        if (completed) completed.textContent = career.completedActivities.length;

        const bestAlarms = localStorage.getItem("zidong_survivor_best_cleared") || "0";
        const totalAlarms = localStorage.getItem("zidong_survivor_total_cleared") || "0";
        const profBestEl = document.getElementById("profileSurvivorBest");
        if (profBestEl) profBestEl.textContent = `${bestAlarms} Alarmas (Total retiradas: ${totalAlarms})`;

        const bestEasy = Number(localStorage.getItem("zidong_vs_best_easy") || 0);
        const bestMed = Number(localStorage.getItem("zidong_vs_best_medium") || 0);
        const bestHard = Number(localStorage.getItem("zidong_vs_best_hard") || 0);
        const maxScoreOverall = Math.max(bestEasy, bestMed, bestHard);
        const profVsEl = document.getElementById("profileVsRecords");
        if (profVsEl) {
            profVsEl.textContent = `${maxScoreOverall} Puntos (Fácil: ${bestEasy} · Medio: ${bestMed} · Experto: ${bestHard})`;
        }

        renderProfileWorldsProgress();
        renderBadgesGrid();
        renderRanksSection();
        updateUserDisplay();
        updateEnergyBatteryDisplay();
    }

    function renderProfileWorldsProgress() {
        const container = document.getElementById("profileWorldsProgressList");
        if (!container) return;

        container.replaceChildren();

        WORLDS_CONFIG.forEach(world => {
            const total = world.activities.length;
            const done = world.activities.filter(a => career.completedActivities.includes(a.id)).length;
            const pct = Math.round((done / total) * 100);

            const row = document.createElement("div");
            row.className = "world-prog-row";
            row.innerHTML = `
                <div class="world-prog-title">
                    <span style="color:${world.color};">${world.icon} ${world.title}</span>
                    <strong style="color:#fff;">${done}/${total} (${pct}%)</strong>
                </div>
                <div class="world-prog-track">
                    <div class="world-prog-fill" style="width:${pct}%; background:${world.color};"></div>
                </div>
            `;
            container.appendChild(row);
        });
    }

    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        if (!container) return;

        container.replaceChildren();
        const currentEquipped = localStorage.getItem("zidong_equipped_badge") || currentUserData.initials;

        MEDALS_DB.forEach(medal => {
            const unlocked = medal.isUnlocked({ career, userData: currentUserData });
            const isEquipped = currentEquipped === medal.icon;

            const badgeEl = document.createElement("div");
            badgeEl.className = `badge-item ${unlocked ? "" : "locked"} ${isEquipped ? "equipped" : ""}`;
            badgeEl.innerHTML = `
                <span class="badge-icon">${unlocked ? medal.icon : "🔒"}</span>
                <span class="badge-title">${medal.name}</span>
            `;

            if (unlocked) {
                badgeEl.onclick = () => {
                    const newEquip = isEquipped ? currentUserData.initials : medal.icon;
                    localStorage.setItem("zidong_equipped_badge", newEquip);
                    triggerHaptic("success");
                    renderBadgesGrid();
                    applyAvatarIcon(newEquip);
                };
            }
            container.appendChild(badgeEl);
        });
    }

    function applyAvatarIcon(icon) {
        const profileAvatar = document.getElementById("profileAvatar");
        const topAvatar = document.getElementById("topAvatar");
        [profileAvatar, topAvatar].forEach(el => {
            if (!el) return;
            el.textContent = icon;
            if (icon !== "NU" && icon !== currentUserData.initials) el.classList.add("custom-icon");
            else el.classList.remove("custom-icon");
        });
    }

    // DAILY REWARD MODAL
    window.claimDailyReward = () => {
        const lastClaim = localStorage.getItem("zidong_last_daily_claim");
        const today = new Date().toDateString();

        const modal = document.getElementById("dailyRewardModal");
        const claimBtn = document.getElementById("btnClaimRewardAction");
        const titleEl = document.getElementById("rewardModalTitle");
        const descEl = document.getElementById("rewardModalDesc");

        if (lastClaim === today) {
            triggerHaptic("error");
            titleEl.textContent = "¡RECOMPENSA RECLAMADA!";
            descEl.textContent = "Ya recibiste tus +100 XP de guardia hoy. Vuelve en el siguiente cambio de turno.";
            claimBtn.textContent = "ENTENDIDO";
            claimBtn.onclick = () => { modal.style.display = "none"; };
        } else {
            triggerHaptic("win");
            titleEl.textContent = "¡BONO DE TURNO OBERON!";
            descEl.textContent = "Has recibido +100 XP por inicio de operaciones en el sistema.";
            claimBtn.textContent = "RECLAMAR +100 XP 🎁";
            claimBtn.onclick = () => {
                awardXP(100);
                localStorage.setItem("zidong_last_daily_claim", today);
                triggerHaptic("success");
                modal.style.display = "none";
                const sub = document.getElementById("dailyRewardSubtitle");
                if (sub) sub.textContent = "¡Reclamado hoy! ✓";
            };
        }

        modal.style.display = "flex";
    };

    window.closeRewardModal = (e) => {
        if (e.target.id === "dailyRewardModal") {
            document.getElementById("dailyRewardModal").style.display = "none";
        }
    };

    window.toggleDailyMissionsModal = () => {
        const modal = document.getElementById("dailyMissionsModal");
        if (!modal) return;
        const isHidden = modal.style.display === "none";
        modal.style.display = isHidden ? "flex" : "none";
        if (isHidden) triggerHaptic("success");
    };

    window.closeMissionsModal = (e) => {
        if (e.target.id === "dailyMissionsModal") window.toggleDailyMissionsModal();
    };

    // SPLASH SCREEN 6 SEGUNDOS (SIN BOTÓN OMITIR)
    function checkSplash6Seconds() {
        const hasLoaded = sessionStorage.getItem("oberon_splash_done");
        const splash = document.getElementById("oberonSplashScreen");
        if (!splash) return;

        if (hasLoaded) {
            splash.style.display = "none";
            return;
        }

        splash.style.display = "flex";
        let elapsed = 0;
        const bar = document.getElementById("splashLoadingFill");
        const statusText = document.getElementById("splashStatusText");

        const steps = [
            "Conectando al enlace cuántico de OBERON...",
            "Sincronizando telemetría de Voltaria y Kinetix...",
            "Cargando atmósfera de presión en Aethel...",
            "Inicializando celdas y visión en Lumina...",
            "¡Conexión neural lista! Buen turno técnico."
        ];

        const timer = setInterval(() => {
            elapsed += 1;
            if (bar) bar.style.width = `${(elapsed / 6) * 100}%`;
            if (statusText) {
                const sIdx = Math.min(Math.floor(elapsed / 1.5), steps.length - 1);
                statusText.textContent = steps[sIdx];
            }

            if (elapsed >= 6) {
                clearInterval(timer);
                sessionStorage.setItem("oberon_splash_done", "true");
                setTimeout(() => {
                    splash.style.opacity = "0";
                    setTimeout(() => { splash.style.display = "none"; }, 350);
                }, 200);
            }
        }, 1000);
    }

    // INICIALIZACIÓN
    function initializeApplication() {
        loadSavedProgress();
        updateUserDisplay();
        renderCareerPlanetsMenu();
        renderLabComponents();
        renderRanksSection();
        updateProfile();
        checkSplash6Seconds();

        if (window.ZidongAudio) {
            window.ZidongAudio.switchTrack("dashboard");
        }

        console.log("--------------------------------");
        console.log("ZIDONG CORE 11.0: MODULAR SYSTEM ONLINE");
        console.log("--------------------------------");
    }

    window.awardXP = awardXP;
    window.renderCareerPlanetsMenu = renderCareerPlanetsMenu;
    window.renderLeaderboardSection = renderLeaderboardSection;
    window.interactWithCompanion = interactWithCompanion;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();
