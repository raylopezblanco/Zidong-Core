/* ==========================================================================
   ZIDONG CORE - CAREER MODE MODULE (ZIGZAG + 3 ESTRELLAS + REPASOS + BOSS)
   ========================================================================== */

(() => {
    "use strict";

    let activeCareerContext = { act: null, world: null, isBoss: false };

    const FALLBACK_WORLDS = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            planetName: "Planeta Voltaria",
            subtitle: "VFDs, motores y cableado de control",
            icon: "⚡",
            color: "#00f59b",
            planetClass: "planet-voltaria",
            activities: [
                { id: "w1_a1", hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Voltaje", reward: 50, audioNote: "diàn", sentence: "主电源电箱电压正常", sentenceEs: "El voltaje en la caja de energía principal es normal" },
                { id: "w1_a2", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cableado", reward: 50, audioNote: "xiàn", sentence: "3号工位控制线连接牢固", sentenceEs: "La línea de control de la estación 3 está bien conectada" },
                { id: "w1_a3", hanzi: "模", pinyin: "mó", meaning: "Módulo de potencia", reward: 60, audioNote: "mó", sentence: "变频器功率模组温度偏高", sentenceEs: "La temperatura del módulo de potencia del VFD está alta" },
                { id: "w1_a4", hanzi: "组", pinyin: "zǔ", meaning: "Ensamble eléctrico", reward: 70, audioNote: "zǔ", sentence: "线束组件已通过导通测试", sentenceEs: "El ensamble de arnés aprobó la prueba de continuidad" },
                { id: "w1_a5", hanzi: "控", pinyin: "kòng", meaning: "Control / PLC", reward: 70, audioNote: "kòng", sentence: "主控柜与PLC通讯恢复正常", sentenceEs: "La comunicación entre el gabinete de control y el PLC volvió a la normalidad" },
                { id: "w1_a6", hanzi: "路", pinyin: "lù", meaning: "Circuito / Rama", reward: 80, audioNote: "lù", sentence: "检测到24V控制回路断路", sentenceEs: "Se detectó circuito abierto en el lazo de control de 24V" }
            ],
            boss: {
                id: "w1_boss",
                title: "JEFE DE LÍNEA · VFD DELTA MS300",
                badgeName: "Maestro VFD Delta",
                reward: 150,
                sequence: [
                    { char: "电", esName: "Electricidad" },
                    { char: "线", esName: "Cableado" },
                    { char: "模", esName: "Módulo" }
                ]
            }
        },
        {
            id: "world_2",
            title: "MUNDO MECÁNICO",
            planetName: "Planeta ErsaWave",
            subtitle: "Soldadura selectiva y ejes de transmisión",
            icon: "⚙️",
            color: "#00e5ff",
            planetClass: "planet-ersa",
            activities: [
                { id: "w2_a1", hanzi: "机", pinyin: "jī", meaning: "Máquina / Mecanismo", reward: 50, audioNote: "jī" },
                { id: "w2_a2", hanzi: "动", pinyin: "dòng", meaning: "Movimiento / Accionamiento", reward: 50, audioNote: "dòng" },
                { id: "w2_a3", hanzi: "器", pinyin: "qì", meaning: "Aparato / Dispositivo", reward: 60, audioNote: "qì" },
                { id: "w2_a4", hanzi: "修", pinyin: "xiū", meaning: "Mantenimiento / Reparación", reward: 70, audioNote: "xiū" }
            ],
            boss: {
                id: "w2_boss",
                title: "JEFE DE LÍNEA · ERSA VERSAFLOW",
                badgeName: "Especialista Versaflow",
                reward: 150,
                sequence: [
                    { char: "机", esName: "Máquina" },
                    { char: "动", esName: "Movimiento" },
                    { char: "器", esName: "Dispositivo" }
                ]
            }
        },
        {
            id: "world_3",
            title: "MUNDO NEUMÁTICO",
            planetName: "Planeta SMC Air",
            subtitle: "Electroválvulas y pistones de aire",
            icon: "💨",
            color: "#ffaa00",
            planetClass: "planet-smc",
            activities: [
                { id: "w3_a1", hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática", reward: 50, audioNote: "qì" },
                { id: "w3_a2", hanzi: "阀", pinyin: "fá", meaning: "Válvula", reward: 50, audioNote: "fá" },
                { id: "w3_a3", hanzi: "压", pinyin: "yā", meaning: "Presión", reward: 60, audioNote: "yā" },
                { id: "w3_a4", hanzi: "缸", pinyin: "gāng", meaning: "Cilindro neumático", reward: 70, audioNote: "gāng" }
            ],
            boss: {
                id: "w3_boss",
                title: "JEFE DE LÍNEA · BLOQUE SMC",
                badgeName: "Ingeniero Neumático SMC",
                reward: 150,
                sequence: [
                    { char: "气", esName: "Aire" },
                    { char: "阀", esName: "Válvula" },
                    { char: "压", esName: "Presión" }
                ]
            }
        },
        {
            id: "world_4",
            title: "MUNDO ROBÓTICA",
            planetName: "Planeta Kuka-Fanuc",
            subtitle: "Brazo robótico y lógica de celdas",
            icon: "🤖",
            color: "#ff4444",
            planetClass: "planet-robot",
            activities: [
                { id: "w4_a1", hanzi: "人", pinyin: "rén", meaning: "Humano / Operador", reward: 50, audioNote: "rén" },
                { id: "w4_a2", hanzi: "爪", pinyin: "zhǎo", meaning: "Gripper / Pinza", reward: 50, audioNote: "zhǎo" },
                { id: "w4_a3", hanzi: "程", pinyin: "chéng", meaning: "Programa / Rutina", reward: 60, audioNote: "chéng" },
                { id: "w4_a4", hanzi: "安", pinyin: "ān", meaning: "Seguridad / Interlock", reward: 70, audioNote: "ān" }
            ],
            boss: {
                id: "w4_boss",
                title: "JEFE DE LÍNEA · CELDA KUKA",
                badgeName: "Maestro Kuka-Fanuc",
                reward: 150,
                sequence: [
                    { char: "人", esName: "Operador" },
                    { char: "爪", esName: "Pinza" },
                    { char: "安", esName: "Seguridad" }
                ]
            }
        },
        {
            id: "world_5",
            title: "MUNDO CALIDAD",
            planetName: "Planeta Six Sigma",
            subtitle: "Inspección óptica AOI y métricas",
            icon: "📊",
            color: "#a855f7",
            planetClass: "planet-quality",
            activities: [
                { id: "w5_a1", hanzi: "检", pinyin: "jiǎn", meaning: "Inspección / Calidad", reward: 50, audioNote: "jiǎn" },
                { id: "w5_a2", hanzi: "测", pinyin: "cè", meaning: "Prueba / Medición", reward: 50, audioNote: "cè" },
                { id: "w5_a3", hanzi: "误", pinyin: "wù", meaning: "Error / Defecto", reward: 60, audioNote: "wù" },
                { id: "w5_a4", hanzi: "良", pinyin: "liáng", meaning: "Aprobado / Good", reward: 70, audioNote: "liáng" }
            ],
            boss: {
                id: "w5_boss",
                title: "JEFE DE LÍNEA · ESTACIÓN AOI",
                badgeName: "Auditor Six Sigma",
                reward: 200,
                sequence: [
                    { char: "检", esName: "Inspección" },
                    { char: "测", esName: "Medición" },
                    { char: "良", esName: "Aprobado" }
                ]
            }
        }
    ];

    function getWorlds() {
        if (Array.isArray(window.ZIDONG_WORLDS_CONFIG) && window.ZIDONG_WORLDS_CONFIG.length > 0) {
            return window.ZIDONG_WORLDS_CONFIG;
        }
        if (typeof window.getWorldsCatalog === "function") {
            const cat = window.getWorldsCatalog();
            if (Array.isArray(cat) && cat.length > 0) return cat;
        }
        return FALLBACK_WORLDS;
    }

    function getUserData() {
        const ud = typeof window.getZidongUserData === "function" ? window.getZidongUserData() : null;
        if (ud) return ud;
        return {
            name: "New user",
            xp: 1850,
            streak: 5,
            completedActivities: ["w1_a1", "w1_a2", "w1_a3", "w1_a4", "w2_a1", "w2_a2", "w2_a3", "w2_a4"],
            phaseStars: {},
            completedReviews: []
        };
    }

    function haptic(type) {
        if (typeof window.triggerHaptic === "function") window.triggerHaptic(type);
    }

    function alertBox(title, msg, icon = "⚡") {
        if (typeof window.showCyberAlert === "function") {
            window.showCyberAlert(title, msg, icon);
        } else {
            alert(`${title}\n\n${msg}`);
        }
    }

    function refreshProfile() {
        if (typeof window.updateProfile === "function") window.refreshProfile();
    }

    function refreshBadges() {
        if (typeof window.renderBadgesGrid === "function") window.refreshBadges();
    }

    function shuffleArr(arr) {
        if (typeof window.shuffleArr === "function") return window.shuffleArr(arr);
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function loadSavedStarsMap() {
        try {
            const raw = localStorage.getItem("zidong_career_phase_stars");
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveStarsMap(mapObj) {
        try {
            localStorage.setItem("zidong_career_phase_stars", JSON.stringify(mapObj || {}));
        } catch (e) {}
    }

    // CAREER PLANETS MENU RENDERING
    window.renderCareerPlanetsMenu = function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;
        try {
        container.replaceChildren();

        getWorlds().forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const udNow = getUserData();
            const doneArr = (udNow && Array.isArray(udNow.completedActivities)) ? udNow.completedActivities : [];
            const completedInWorld = world.activities.filter(a => doneArr.includes(a.id)).length;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere"><span class="planet-core-icon">${world.icon}</span></div>
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
                haptic("success");
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
        } catch (err) {
            container.innerHTML = `<div class="panel" style="padding:14px; color:#ff8080; font-size:12px;">Error al cargar mundos: ${err && err.message ? err.message : err}</div>`;
        }
    }

    function getCareerStarState(actId) {
        const ud = getUserData();
        const savedMap = loadSavedStarsMap();
        if (ud && !ud.phaseStars) ud.phaseStars = {};
        if (savedMap[actId]) {
            const merged = {
                p1: Boolean(savedMap[actId].p1 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p1)),
                p2: Boolean(savedMap[actId].p2 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p2)),
                p3: Boolean(savedMap[actId].p3 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p3))
            };
            if (ud) ud.phaseStars[actId] = merged;
            return merged;
        }
        if (ud && ud.phaseStars[actId]) {
            return ud.phaseStars[actId];
        }
        const done = ud && Array.isArray(ud.completedActivities) && ud.completedActivities.includes(actId);
        const initObj = { p1: done, p2: done, p3: done };
        if (ud) ud.phaseStars[actId] = initObj;
        return initObj;
    }

    function getCareerStarCount(actId) {
        const s = getCareerStarState(actId);
        return (s.p1 ? 1 : 0) + (s.p2 ? 1 : 0) + (s.p3 ? 1 : 0);
    }

    function grantCareerPhaseStar(actId, phaseNum) {
        const ud = getUserData();
        const s = Object.assign({}, getCareerStarState(actId));
        if (phaseNum === 1) s.p1 = true;
        if (phaseNum === 2) s.p2 = true;
        if (phaseNum === 3) s.p3 = true;
        if (ud) {
            if (!ud.phaseStars) ud.phaseStars = {};
            ud.phaseStars[actId] = s;
        }
        const savedMap = loadSavedStarsMap();
        savedMap[actId] = s;
        saveStarsMap(savedMap);

        if (ud && getCareerStarCount(actId) === 3 && !ud.completedActivities.includes(actId)) {
            ud.completedActivities.push(actId);
        }
    }

    function buildCareerStarsHtml(count) {
        return `<div class="career-zig-stars">${count >= 1 ? "⭐" : "☆"}${count >= 2 ? "⭐" : "☆"}${count >= 3 ? "⭐" : "☆"}</div>`;
    }

    function buildCareerZigzagEntries(world) {
        const list = [];
        const acts = world.activities || [];
        let seen = [];

        acts.forEach((act, idx) => {
            list.push({ type: "hanzi", act, idx });
            seen.push(act);

            const everyFive = (idx + 1) % 5 === 0;
            const endReview = (idx === acts.length - 1) && !everyFive && seen.length >= 3;
            if (everyFive || endReview) {
                list.push({
                    type: "review",
                    id: `${world.id}_repaso_${idx + 1}`,
                    title: `REPASO DE BLOQUE (${seen.length} HANZI)`,
                    subtitle: `Evalúa caracteres vistos en este tramo`,
                    pool: [...seen],
                    reward: 120
                });
            }
        });

        return list;
    }

    function openWorldDetails(world) {
        if (!world) return;
        if (typeof window.navigateTo === "function") {
            window.navigateTo("worldDetailsView");
        } else {
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            const sec = document.getElementById("worldDetailsView");
            if (sec) sec.classList.add("active");
        }

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;
        if (!stream) return;

        stream.className = "career-zigzag-stream";
        stream.replaceChildren();

        const entries = buildCareerZigzagEntries(world);
        let canAdvance = true;
        let zigCounter = 0;

        entries.forEach((entry) => {
            const zigClass = entry.type === "review"
                ? "zig-center"
                : (zigCounter % 2 === 0 ? "zig-left" : "zig-right");
            zigCounter++;

            if (entry.type === "hanzi") {
                const act = entry.act;
                const stars = getCareerStarCount(act.id);
                const mastered = stars === 3;
                const unlocked = canAdvance || stars > 0;

                const card = document.createElement("div");
                card.className = `career-zig-card ${zigClass} ${mastered ? "is-complete" : unlocked ? "is-unlocked" : "is-locked"}`;
                card.style.setProperty("--zig-accent", world.color);

                const badgeTxt = mastered ? "3/3 ★" : unlocked ? `${stars}/3 ★` : "BLOQUEADO";

                card.innerHTML = `
                    <div class="career-zig-orb" style="border-color:${world.color};">${unlocked ? act.hanzi : "🔒"}</div>
                    <div class="career-zig-meta">
                        <span class="career-zig-tag" style="color:${world.color};">HANZI 0${entry.idx + 1} · +${act.reward} XP</span>
                        <strong>${act.meaning}</strong>
                        <small>Pinyin: ${act.pinyin}</small>
                        ${buildCareerStarsHtml(stars)}
                    </div>
                    <span class="career-zig-badge">${badgeTxt}</span>
                `;

                if (unlocked) {
                    card.onclick = () => {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        openActivity(act, world);
                    };
                }
                stream.appendChild(card);

                canAdvance = stars >= 1;
            } else if (entry.type === "review") {
                if (!getUserData().completedReviews) getUserData().completedReviews = [];
                const revDone = getUserData().completedReviews.includes(entry.id);
                const revUnlocked = canAdvance;

                const revCard = document.createElement("div");
                revCard.className = `career-zig-card is-review ${zigClass} ${revDone ? "is-complete" : revUnlocked ? "is-unlocked" : "is-locked"}`;
                revCard.style.setProperty("--zig-accent", "var(--amber)");

                revCard.innerHTML = `
                    <div class="career-zig-orb" style="border-color:var(--amber); color:var(--amber);">${revUnlocked ? "🔁" : "🔒"}</div>
                    <div class="career-zig-meta">
                        <span class="career-zig-tag" style="color:var(--amber);">ETAPA DE REPASO · +${entry.reward} XP</span>
                        <strong>${entry.title}</strong>
                        <small>${entry.subtitle}</small>
                    </div>
                    <span class="career-zig-badge">${revDone ? "LISTO ✓" : revUnlocked ? "REPASAR →" : "BLOQUEADO"}</span>
                `;

                if (revUnlocked) {
                    revCard.onclick = () => {
                        haptic("success");
                        startCareerReview(entry, world);
                    };
                }
                stream.appendChild(revCard);
                canAdvance = revDone || canAdvance;
            }
        });

        const allThreeStars = world.activities.every(a => getCareerStarCount(a.id) === 3);
        const bossDone = getUserData().completedActivities.includes(world.boss.id);
        const earnedStars = world.activities.reduce((acc, a) => acc + getCareerStarCount(a.id), 0);
        const totalStars = world.activities.length * 3;

        const bossCard = document.createElement("div");
        bossCard.className = `career-zig-card is-boss zig-center ${bossDone ? "is-complete" : allThreeStars ? "is-unlocked" : "is-locked"}`;
        bossCard.style.setProperty("--zig-accent", world.color);

        bossCard.innerHTML = `
            <div class="career-zig-orb" style="background:${world.color}; color:#0b1424; border-color:#fff;">👑</div>
            <div class="career-zig-meta">
                <span class="career-zig-tag" style="color:${world.color};">FINAL BOSS · +${world.boss.reward} XP</span>
                <strong>${world.boss.title}</strong>
                <small>Estrellas: ${earnedStars}/${totalStars} ★ · Medalla: "${world.boss.badgeName}"</small>
            </div>
            <span class="career-zig-badge">${bossDone ? "CONQUISTADO ✓" : allThreeStars ? "RETOS DE JEFE ⚡" : `REQUIERE ${totalStars}★`}</span>
        `;

        if (allThreeStars) {
            bossCard.onclick = () => {
                haptic("success");
                startBossCheckpoint(world);
            };
        } else {
            bossCard.onclick = () => {
                haptic("error");
                alertBox(
                    "FINAL BOSS BLOQUEADO",
                    `Necesitas las 3 estrellas (⭐⭐⭐) en cada Hanzi de este mundo para enfrentar al Final Boss.\n\nLlevas ${earnedStars} de ${totalStars} estrellas.`,
                    "🔒"
                );
            };
        }
        stream.appendChild(bossCard);
    }

    let activeCareerContext = { act: null, world: null, isBoss: false };

    window.abandonCareerLevel = function() {
        const label = activeCareerContext.isBoss
            ? "el Checkpoint de Jefe"
            : (activeCareerContext.act ? `el Hanzi "${activeCareerContext.act.hanzi}"` : "este nivel");
        activeCareerContext = { act: null, world: null, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
        if (typeof haptic === "function") haptic("error");
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        alertBox(
            "NIVEL ABANDONADO",
            `¿Te rajaste en ${label}? Sigue preparándote, renacuajo. 🐸⚡`,
            "🐸"
        );
    };

    function openActivity(act, world) {
        activeCareerContext = { act, world, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi3Phases(act, world);
    }

    // 3 FASES = 3 ESTRELLAS:
    // 1) El Hanzi cómo es (1 estrella)
    // 2) El Hanzi cómo se dice (1 estrella)
    // 3) Identificar el Hanzi en una oración (1 estrella)
    // - Bloquea selección múltiple al responder
    // - Si fallas, reinicia ÚNICAMENTE esa fase
    function startHanzi3Phases(act, world) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const accent = world?.color || "var(--cyan)";
        const sentenceText = act.sentence || `1号站${act.hanzi}信号检测正常`;
        const sentenceEs = act.sentenceEs || `Señal de ${act.meaning} en estación 1 verificada`;

        function renderPhaseBar(activeNum) {
            const st = getCareerStarState(act.id);
            return `
                <div style="display:flex; justify-content:space-between; gap:6px; margin-bottom:10px; background:var(--surface-light); padding:8px 10px; border-radius:10px; border:1px solid var(--border);">
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===1 ? accent : (st.p1 ? 'var(--green)' : 'var(--muted)')};">${st.p1 ? '⭐' : '☆'} 1. Cómo es</span>
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===2 ? accent : (st.p2 ? 'var(--green)' : 'var(--muted)')};">${st.p2 ? '⭐' : '☆'} 2. Cómo se dice</span>
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===3 ? accent : (st.p3 ? 'var(--green)' : 'var(--muted)')};">${st.p3 ? '⭐' : '☆'} 3. En oración</span>
                </div>
            `;
        }

        function disableOptions(container) {
            if (!container) return;
            container.querySelectorAll("button").forEach(b => { b.disabled = true; });
        }

        // FASE 1: El Hanzi cómo es (⭐ 1ª estrella)
        function renderPhase1() {
            let locked = false;
            const distractors = shuffleArr([
                "Válvula de purga neumática",
                "Sensor óptico de presencia",
                "Indicador lumínico de estado",
                "Banda transportadora de retorno"
            ].filter(x => x !== act.meaning)).slice(0, 3);
            const choices = shuffleArr([act.meaning, ...distractors]);

            card.innerHTML = `
                ${renderPhaseBar(1)}
                <span class="eyebrow" style="color:${accent};">FASE 1 DE 3 · ⭐ EL HANZI CÓMO ES</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Identifica qué representa este Hanzi</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0; text-shadow:0 0 20px rgba(39,216,232,0.35);">${act.hanzi}</div>
                <button type="button" id="p1SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer; margin-bottom:10px;">🔊 Escuchar sonido</button>
                <div style="display:flex; flex-direction:column; gap:8px;" id="p1Choices"></div>
            `;

            const speakBtn = document.getElementById("p1SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(act.hanzi);
                };
            }

            const box = document.getElementById("p1Choices");
            choices.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(box);

                    if (opt === act.meaning) {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 1);
                        setTimeout(renderPhase2, 500);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        btn.style.borderColor = "var(--red)";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase1();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        // FASE 2: El Hanzi cómo se dice (⭐ 2ª estrella)
        function renderPhase2() {
            let locked = false;
            const distractors = shuffleArr([
                "bō qì", "gāng yā", "zhǎo qì", "wù cè", "fá lù", "cè guāng"
            ].filter(p => p !== act.pinyin)).slice(0, 3);
            const choices = shuffleArr([act.pinyin, ...distractors]);

            card.innerHTML = `
                ${renderPhaseBar(2)}
                <span class="eyebrow" style="color:${accent};">FASE 2 DE 3 · ⭐ EL HANZI CÓMO SE DICE</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Selecciona la pronunciación de "${act.hanzi}" (${act.meaning})</h3>
                <div style="font-size:56px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0;">${act.hanzi}</div>
                <button type="button" id="p2SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer; margin-bottom:10px;">🔊 Escuchar sonido</button>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;" id="p2Choices"></div>
            `;

            const speakBtn = document.getElementById("p2SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(act.hanzi);
                };
            }

            const box = document.getElementById("p2Choices");
            choices.forEach(pin => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.style.textAlign = "center";
                btn.textContent = pin;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(box);

                    if (pin === act.pinyin) {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 2);
                        setTimeout(renderPhase3, 500);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        btn.style.borderColor = "var(--red)";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase2();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        // FASE 3: Identificar el Hanzi en una oración (⭐ 3ª estrella) - sin soplar el carácter
        function renderPhase3() {
            let locked = false;
            const rawChars = sentenceText.split("");
            const tokens = rawChars.includes(act.hanzi) ? rawChars : [...rawChars, act.hanzi];

            card.innerHTML = `
                ${renderPhaseBar(3)}
                <span class="eyebrow" style="color:${accent};">FASE 3 DE 3 · ⭐ IDENTIFICAR EN ORACIÓN</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Identifica el Hanzi de <strong style="color:var(--green);">${act.meaning}</strong> dentro de la oración</h3>
                <div class="career-quote-box">
                    <div class="career-quote-es">${sentenceEs}</div>
                    <div class="hmi-tokens-container" id="p3Tokens" style="margin-top:10px;"></div>
                </div>
                <button type="button" id="p3SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer;">🔊 Leer oración</button>
            `;

            const speakBtn = document.getElementById("p3SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(sentenceText);
                };
            }

            const tokenBox = document.getElementById("p3Tokens");
            tokens.forEach(ch => {
                const tok = document.createElement("button");
                tok.type = "button";
                tok.className = "hmi-char-token";
                tok.textContent = ch;
                tok.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(tokenBox);

                    if (ch === act.hanzi) {
                        tok.classList.add("token-hit");
                        grantCareerPhaseStar(act.id, 3);
                        if (!getUserData()._xpGranted) getUserData()._xpGranted = [];
                        let bonus = 0;
                        if (!getUserData()._xpGranted.includes(act.id)) {
                            getUserData()._xpGranted.push(act.id);
                            getUserData().xp += act.reward;
                            bonus = act.reward;
                        }
                        refreshProfile();
                        haptic("win");
                        window.speakMandarin(act.hanzi);
                        setTimeout(() => {
                            alertBox(
                                "¡3 ESTRELLAS OBTENIDAS! ⭐⭐⭐",
                                `Completaste las 3 fases de "${act.hanzi}" (${act.meaning})${bonus > 0 ? ` (+${bonus} XP)` : ""}.`,
                                "🌟"
                            );
                            if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                            if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                            if (world) openWorldDetails(world);
                        }, 450);
                    } else {
                        tok.classList.add("token-miss");
                        haptic("error");
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase3();
                        }, 600);
                    }
                };
                tokenBox.appendChild(tok);
            });
        }

        renderPhase1();
    }

    function startCareerReview(revItem, world) {
        activeCareerContext = { act: { hanzi: revItem.title }, world, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const pool = revItem.pool || [];
        const list = shuffleArr(pool).slice(0, Math.min(4, pool.length));
        let idx = 0;

        function nextReviewQ() {
            const target = list[idx];
            if (!target) {
                if (!getUserData().completedReviews) getUserData().completedReviews = [];
                if (!getUserData().completedReviews.includes(revItem.id)) {
                    getUserData().completedReviews.push(revItem.id);
                    getUserData().xp += revItem.reward;
                    refreshProfile();
                }
                haptic("win");
                alertBox("REPASO COMPLETADO", `¡Superaste ${revItem.title}! (+${revItem.reward} XP)`, "🔁");
                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                if (world) openWorldDetails(world);
                return;
            }

            let locked = false;
            const others = pool.filter(p => p.id !== target.id).map(p => p.meaning);
            const extras = ["Sensor inductivo de proximidad", "Válvula de purga neumática", "Fuente de control 24V"];
            const opts = shuffleArr([target.meaning, ...others, ...extras]).slice(0, 4);

            card.innerHTML = `
                <span class="eyebrow" style="color:var(--amber);">🔁 REPASO · PREGUNTA ${idx + 1} DE ${list.length}</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">¿Qué significa este Hanzi visto anteriormente?</h3>
                <div style="font-size:60px; font-family:'Noto Sans SC'; color:var(--amber); margin:12px 0;">${target.hanzi}</div>
                <div style="display:flex; flex-direction:column; gap:8px;" id="revChoices"></div>
            `;

            const box = document.getElementById("revChoices");
            opts.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    box.querySelectorAll("button").forEach(b => { b.disabled = true; });

                    if (opt === target.meaning) {
                        haptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        idx++;
                        setTimeout(nextReviewQ, 450);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            nextReviewQ();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        nextReviewQ();
    }

    function startBossCheckpoint(world) {
        activeCareerContext = { act: null, world, isBoss: true };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card || !world.boss) return;

        const boss = world.boss;
        const sequence = boss.sequence;
        let currentStepIndex = 0;

        function renderBossSequenceView() {
            const currentTarget = sequence[currentStepIndex];
            const chipsHtml = sequence.map((s, idx) => {
                let st = "background:var(--surface-light); color:var(--muted); border:1px solid var(--border);";
                if (idx < currentStepIndex) st = "background:var(--green); color:#0b1424; font-weight:bold;";
                else if (idx === currentStepIndex) st = "background:var(--surface); color:var(--cyan); border:2px solid var(--cyan); font-weight:bold;";
                return `<div style="padding:6px 12px; border-radius:8px; font-size:11px; ${st}">${idx+1}. ${s.esName}</div>`;
            }).join("");

            card.innerHTML = `
                <span class="eyebrow" style="color:${world.color};">👑 AUDITORÍA DE JEFE · ${boss.title}</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Secuencia requerida en celda:</h3>
                <div style="display:flex; gap:6px; justify-content:center; margin-bottom:14px; flex-wrap:wrap;">${chipsHtml}</div>
                <div style="background:rgba(0,245,155,0.06); border:1px solid rgba(0,245,155,0.2); border-radius:12px; padding:12px; margin-bottom:14px;">
                    <small style="color:var(--muted); display:block; font-size:10px;">SELECCIONA EL CARACTER PARA:</small>
                    <strong style="color:var(--green); font-size:15px; display:block; margin-top:2px;">"${currentTarget.esName}"</strong>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;" id="bossTokensGrid"></div>
            `;

            const tokensGrid = document.getElementById("bossTokensGrid");
            const allChars = shuffleArr(sequence.map(s => s.char).concat(["动", "机", "线", "电"]));
            let locked = false;

            allChars.forEach(char => {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "reveal-button";
                b.style.background = "var(--surface-light)";
                b.style.color = "#fff";
                b.style.border = "1px solid var(--border)";
                b.style.fontSize = "26px";
                b.style.fontFamily = "'Noto Sans SC'";
                b.style.padding = "14px";
                b.textContent = char;

                b.onclick = () => {
                    if (locked) return;
                    locked = true;
                    tokensGrid.querySelectorAll("button").forEach(btn => { btn.disabled = true; });

                    if (char === currentTarget.char) {
                        haptic("success");
                        window.speakMandarin(char);
                        b.style.background = "var(--green)";
                        b.style.color = "#0b1424";
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            haptic("win");
                            if (!getUserData().completedActivities.includes(boss.id)) {
                                getUserData().completedActivities.push(boss.id);
                                getUserData().xp += boss.reward;
                                refreshProfile();
                            }
                            setTimeout(() => {
                                alertBox("CHECKPOINT DE LÍNEA", `¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`, "🏆");
                                refreshBadges();
                                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 400);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        haptic("error");
                        b.style.background = "var(--red)";
                        b.style.color = "#fff";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderBossSequenceView();
                        }, 600);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }



    window.forceRenderCareerPlanets = function forceRenderCareerPlanets() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;
        container.replaceChildren();
        const list = getWorlds();
        const ud = getUserData();
        const doneArr = (ud && Array.isArray(ud.completedActivities)) ? ud.completedActivities : [];
        list.forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass || ""}`;
            const totalAct = Array.isArray(world.activities) ? world.activities.length : 0;
            const completedInWorld = Array.isArray(world.activities)
                ? world.activities.filter(a => doneArr.includes(a.id)).length
                : 0;
            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere"><span class="planet-core-icon">${world.icon || "🪐"}</span></div>
                    <div class="planet-orbit-ring" style="border-color:${world.color || "#27d8e8"}88;"></div>
                </div>
                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color || "#27d8e8"};">${world.title || ""}</span>
                    <h4>${world.planetName || ""}</h4>
                    <p>${world.subtitle || ""}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <span class="planet-enter-badge">EXPLORAR MUNDO →</span>
                        <small style="color:${world.color || "#27d8e8"}; font-weight:800; font-size:10px;">${completedInWorld}/${totalAct} NIVELES</small>
                    </div>
                </div>
            `;
            planetCard.onclick = () => {
                haptic("success");
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    };

window.forceRenderCareerPlanets = function forceRenderCareerPlanets() {
    const container = document.getElementById("careerPlanetsGrid");
    if (!container) return;
    container.replaceChildren();
    const list = Array.isArray(window.ZIDONG_WORLDS_CONFIG) ? window.ZIDONG_WORLDS_CONFIG : [];
    const ud = typeof window.getZidongUserData === "function" ? window.getZidongUserData() : null;
    const doneArr = (ud && Array.isArray(ud.completedActivities)) ? ud.completedActivities : [];
    list.forEach((world) => {
        const planetCard = document.createElement("div");
        planetCard.className = `planet-menu-item ${world.planetClass || ""}`;
        const totalAct = Array.isArray(world.activities) ? world.activities.length : 0;
        const completedInWorld = Array.isArray(world.activities)
            ? world.activities.filter(a => doneArr.includes(a.id)).length
            : 0;
        planetCard.innerHTML = `
            <div class="planet-sphere-wrapper">
                <div class="planet-sphere"><span class="planet-core-icon">${world.icon || "🪐"}</span></div>
                <div class="planet-orbit-ring" style="border-color:${world.color || "#27d8e8"}88;"></div>
            </div>
            <div class="planet-menu-meta">
                <span class="planet-tag" style="color:${world.color || "#27d8e8"};">${world.title || ""}</span>
                <h4>${world.planetName || ""}</h4>
                <p>${world.subtitle || ""}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                    <span class="planet-enter-badge">EXPLORAR MUNDO →</span>
                    <small style="color:${world.color || "#27d8e8"}; font-weight:800; font-size:10px;">${completedInWorld}/${totalAct} NIVELES</small>
                </div>
            </div>
        `;
        planetCard.onclick = () => {
            if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
            if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");
        };
        container.appendChild(planetCard);
    });
};
window.renderCareerPlanetsMenu = window.forceRenderCareerPlanets;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => window.renderCareerPlanetsMenu());
    } else {
        setTimeout(() => window.renderCareerPlanetsMenu(), 0);
    }
})();
