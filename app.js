/* ==========================================================================
   ZIDONG CORE 7.0 - SISTEMA ESPACIAL OBERON
   - Planetas: Voltaria, Kinetix, Aethel, Machina, Lumina
   - IA 1v1 Nivel Experto (Rápida y letal)
   - Datos curiosos gramaticales del Cyberdog
   - Rangos de alta experiencia (hasta 45,000 XP)
   - Loading Splash Screen inicial de 10s con animación de terminal OBERON
   - Modal estético para Daily Reward
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

    const STORAGE_KEY = "zidong_core_progress_v7";

    // =====================================
    // 1. SISTEMA ESPACIAL OBERON: 5 PLANETAS
    // =====================================
    const WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "PLANETA VOLTARIA",
            subtitle: "Redes de Alta Tensión y Gabinetes I/O",
            planetName: "Voltaria",
            icon: "⚡",
            color: "#27d8e8",
            planetClass: "planet-electric",
            unlocked: true,
            activities: [
                { id: "h_001", hanzi: "电", pinyin: "diàn", meaning: "Electricidad", example: "电缆 (diànlǎn) Cable", reward: 80 },
                { id: "h_002", hanzi: "机", pinyin: "jī", meaning: "Máquina", example: "电机 (diànjī) Motor", reward: 80 },
                { id: "h_003", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cable", example: "电线 (diànxiàn) Cableado", reward: 80 },
                { id: "h_004", hanzi: "力", pinyin: "lì", meaning: "Fuerza / Potencia", example: "动力 (dònglì) Potencia", reward: 80 },
                { id: "h_005", hanzi: "控", pinyin: "kòng", meaning: "Control", example: "控制 (kòngzhì) PLC", reward: 80 }
            ]
        },
        {
            id: "world_2",
            title: "PLANETA KINETIX",
            subtitle: "Servomotores, Husillos y Ejes Cinemáticos",
            planetName: "Kinetix",
            icon: "⚙️",
            color: "#ffc857",
            planetClass: "planet-mechanical",
            unlocked: true,
            activities: [
                { id: "h_006", hanzi: "轴", pinyin: "zhóu", meaning: "Eje / Flecha", example: "伺服轴 (sìfú zhóu) Eje Servo", reward: 100 },
                { id: "h_007", hanzi: "转", pinyin: "zhuǎn", meaning: "Giro / Rotación", example: "转速 (zhuànsù) RPM", reward: 100 },
                { id: "h_008", hanzi: "合", pinyin: "hé", meaning: "Cierre / Acople", example: "离合器 (líhéqì) Embrague", reward: 100 },
                { id: "h_009", hanzi: "紧", pinyin: "jǐn", meaning: "Ajuste / Apriete", example: "紧固 (jǐngù) Sujeción", reward: 100 },
                { id: "h_010", hanzi: "位", pinyin: "wèi", meaning: "Posición", example: "原位 (yuánwèi) Posición Home", reward: 100 }
            ]
        },
        {
            id: "world_3",
            title: "PLANETA AETHEL",
            subtitle: "Atmósfera de Presión Neumática y Válvulas",
            planetName: "Aethel",
            icon: "💨",
            color: "#00f59b",
            planetClass: "planet-pneumatic",
            unlocked: true,
            activities: [
                { id: "h_011", hanzi: "气", pinyin: "qì", meaning: "Aire / Gas", example: "气缸 (qìgāng) Cilindro", reward: 120 },
                { id: "h_012", hanzi: "压", pinyin: "yā", meaning: "Presión", example: "气压 (qìyā) Presión Bar", reward: 120 },
                { id: "h_013", hanzi: "阀", pinyin: "fá", meaning: "Válvula", example: "电磁阀 (diàncífá) Solenoide", reward: 120 },
                { id: "h_014", hanzi: "管", pinyin: "guǎn", meaning: "Manguera / Tubo", example: "气管 (qìguǎn) Tubo de aire", reward: 120 },
                { id: "h_015", hanzi: "漏", pinyin: "lòu", meaning: "Fuga", example: "漏气 (lòuqì) Fuga de aire", reward: 120 }
            ]
        },
        {
            id: "world_4",
            title: "PLANETA MACHINA",
            subtitle: "Celdas Robóticas Fanuc y Flotas AGV",
            planetName: "Machina",
            icon: "🤖",
            color: "#a78bfa",
            planetClass: "planet-robotics",
            unlocked: true,
            activities: [
                { id: "h_016", hanzi: "手", pinyin: "shǒu", meaning: "Brazo / Gripper", example: "机械手 (jīxièshǒu) Robot", reward: 150 },
                { id: "h_017", hanzi: "车", pinyin: "chē", meaning: "Carro / AGV", example: "导引车 (dǎoyǐnchē) AGV", reward: 150 },
                { id: "h_018", hanzi: "点", pinyin: "diǎn", meaning: "Punto / Coordenada", example: "示教点 (shìjiàodiǎn) Teach Point", reward: 150 },
                { id: "h_019", hanzi: "速", pinyin: "sù", meaning: "Velocidad", example: "减速 (jiǎnsù) Reductor", reward: 150 },
                { id: "h_020", hanzi: "避", pinyin: "bì", meaning: "Evadir / Obstáculo", example: "避障 (bìzhàng) Sensor Lidar", reward: 150 }
            ]
        },
        {
            id: "world_5",
            title: "PLANETA LUMINA",
            subtitle: "Inspección Óptica AOI y Espectro Lumínico",
            planetName: "Lumina",
            icon: "👁️",
            color: "#ff7777",
            planetClass: "planet-vision",
            unlocked: true,
            activities: [
                { id: "h_021", hanzi: "光", pinyin: "guāng", meaning: "Luz / Óptica", example: "光源 (guāngyuán) Estroboscopio", reward: 180 },
                { id: "h_022", hanzi: "镜", pinyin: "jìng", meaning: "Lente / Cámara", example: "镜头 (jìngtóu) Objetivo", reward: 180 },
                { id: "h_023", hanzi: "视", pinyin: "shì", meaning: "Visión", example: "视觉 (shìjué) Sistema AOI", reward: 180 },
                { id: "h_024", hanzi: "检", pinyin: "jiǎn", meaning: "Inspección", example: "检测 (jiǎncè) Test de calidad", reward: 180 },
                { id: "h_025", hanzi: "错", pinyin: "cuò", meaning: "Falso / Error", example: "误检 (wùjiǎn) Falso Rechazo", reward: 180 }
            ]
        }
    ];

    // BANCO DEL LABORATORIO
    const LAB_COMPONENTS = [
        { hanzi: "电", pinyin: "diàn", es: "Electricidad", cat: "world_1", catName: "⚡ Voltaria", part: "电缆 (Cable)" },
        { hanzi: "机", pinyin: "jī", es: "Máquina / Motor", cat: "world_1", catName: "⚡ Voltaria", part: "电机 (Motor)" },
        { hanzi: "线", pinyin: "xiàn", es: "Línea / Cable", cat: "world_1", catName: "⚡ Voltaria", part: "电线 (Cableado)" },
        { hanzi: "力", pinyin: "lì", es: "Fuerza / Potencia", cat: "world_1", catName: "⚡ Voltaria", part: "动力 (Potencia)" },
        { hanzi: "控", pinyin: "kòng", es: "Control / PLC", cat: "world_1", catName: "⚡ Voltaria", part: "控制 (Control)" },
        
        { hanzi: "轴", pinyin: "zhóu", es: "Eje / Flecha", cat: "world_2", catName: "⚙️ Kinetix", part: "伺服轴 (Eje Z)" },
        { hanzi: "转", pinyin: "zhuǎn", es: "Giro / RPM", cat: "world_2", catName: "⚙️ Kinetix", part: "转速 (Velocidad)" },
        { hanzi: "合", pinyin: "hé", es: "Acople", cat: "world_2", catName: "⚙️ Kinetix", part: "离合器 (Embrague)" },
        { hanzi: "紧", pinyin: "jǐn", es: "Sujeción", cat: "world_2", catName: "⚙️ Kinetix", part: "紧固 (Tornillería)" },
        { hanzi: "位", pinyin: "wèi", es: "Posición", cat: "world_2", catName: "⚙️ Kinetix", part: "原位 (Home)" },

        { hanzi: "气", pinyin: "qì", es: "Neumática", cat: "world_3", catName: "💨 Aethel", part: "气缸 (Cilindro)" },
        { hanzi: "压", pinyin: "yā", es: "Presión Bar", cat: "world_3", catName: "💨 Aethel", part: "气压 (Regulador)" },
        { hanzi: "阀", pinyin: "fá", es: "Válvula", cat: "world_3", catName: "💨 Aethel", part: "电磁阀 (Solenoide)" },

        { hanzi: "手", pinyin: "shǒu", es: "Brazo Robot", cat: "world_4", catName: "🤖 Machina", part: "机械手 (Fanuc)" },
        { hanzi: "车", pinyin: "chē", es: "Carro AGV", cat: "world_4", catName: "🤖 Machina", part: "导引车 (AGV)" },

        { hanzi: "光", pinyin: "guāng", es: "Sensor Óptico", cat: "world_5", catName: "👁️ Lumina", part: "光源 (Lámpara)" },
        { hanzi: "视", pinyin: "shì", es: "Visión Cámara", cat: "world_5", catName: "👁️ Lumina", part: "视觉 (AOI)" }
    ];

    // ESCALA DE 10 RANGOS PROFESIONALES (HASTA 45,000 XP)
    const INDUSTRIAL_RANKS = [
        { id: 1, name: "Becario", minXP: 0, icon: "📋", desc: "Familiarización con el Sistema Espacial OBERON" },
        { id: 2, name: "Practicante", minXP: 800, icon: "🔰", desc: "Apoyo en cambio de herramentales y verificación visual" },
        { id: 3, name: "Operador", minXP: 2000, icon: "⚙️", desc: "Operación de estaciones automatizadas en Voltaria" },
        { id: 4, name: "Operador Especializado", minXP: 4000, icon: "🛠️", desc: "Calibración de husillos y reseteo de fallas de alimentador" },
        { id: 5, name: "Técnico Jr", minXP: 7000, icon: "⚡", desc: "Diagnóstico eléctrico de señales I/O y relevadores" },
        { id: 6, name: "Técnico Sr", minXP: 11000, icon: "🔧", desc: "Mantenimiento preventivo a servomotores y líneas neumáticas" },
        { id: 7, name: "Ingeniero Jr", minXP: 16000, icon: "💻", desc: "Comisionamiento de sub-estaciones PLC y bus Profinet" },
        { id: 8, name: "Ingeniero Full", minXP: 22000, icon: "🚀", desc: "Optimización de tiempo de ciclo SMT y celdas Kinetix" },
        { id: 9, name: "Ingeniero Sr", minXP: 30000, icon: "🏅", desc: "Arquitectura de celdas robóticas y enlace SCADA global" },
        { id: 10, name: "Maestro de Programación", minXP: 45000, icon: "👑", desc: "Guardián Supremo de OBERON: Cero Downtime en planta" }
    ];

    // MEDALLAS
    const MEDALS_DB = [
        { id: "b_practicante", icon: "🔰", name: "Practicante de Automatización", desc: "Insignia oficial de bienvenida a OBERON", isUnlocked: () => true },
        { id: "b_ai_slayer", icon: "🤖", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle al menos 1 vez", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_troubleshooter", icon: "🛠️", name: "Solucionador de Fallas Básico", desc: "Supera al menos 1 emergencia real en Survivor Mode", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "b_electric", icon: "⚡", name: "Comisionado Eléctrico", desc: "Especialista en potencia y señales", isUnlocked: () => true },
        { id: "b_dragon", icon: "龍", name: "Dragón Zìdòng", desc: "Fundador de la academia técnica", isUnlocked: () => true },
        { id: "b_overclock", icon: "⭐", name: "Overclock 3★", desc: "Test aprobado en menos de 12 segundos", isUnlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3) }
    ];

    // LOGROS TIPO XBOX EXPANDIDOS (1500 G EN TOTAL)
    const XBOX_ACHIEVEMENTS = [
        { id: "ach_welcome", title: "Bienvenido a OBERON", desc: "Supera el protocolo de inicialización de 10s.", score: 100, icon: "🪐", unlocked: () => true },
        { id: "ach_first_circuit", title: "Primer Circuito Energizado", desc: "Domina tu primer componente eléctrico.", score: 100, icon: "⚡", unlocked: () => career.completedActivities.length >= 1 },
        { id: "ach_voltaria", title: "Maestría en Voltaria", desc: "Domina 3 componentes de potencia eléctrica.", score: 150, icon: "🔌", unlocked: () => career.completedActivities.filter(id => id.startsWith("h_00")).length >= 3 },
        { id: "ach_kinetix", title: "Cinemática de Kinetix", desc: "Calibra un servomotor en el Planeta Kinetix.", score: 150, icon: "⚙️", unlocked: () => career.completedActivities.some(id => ["h_006", "h_007", "h_008"].includes(id)) },
        { id: "ach_survivor_hero", title: "Ingeniero de Choque (18s)", desc: "Salva la línea antes de los 18 segundos en Survivor.", score: 200, icon: "🚨", unlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "ach_ai_tamer", title: "Cerebro de Silicio Vencido", desc: "Derrota a la IA en Duelo 1v1 Battle.", score: 200, icon: "⚔️", unlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "ach_ai_master", title: "Pesadilla de la IA", desc: "Derrota a la máquina 3 veces en 1v1.", score: 300, icon: "👑", unlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 3 },
        { id: "ach_overclock", title: "Calibración Overclock", desc: "Consigue 3 estrellas ⭐⭐⭐ en cualquier test.", score: 150, icon: "⭐", unlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3) },
        { id: "ach_technician", title: "Rango Técnico Jr Alcanzado", desc: "Acumula más de 7,000 XP en tu historial.", score: 150, icon: "📈", unlocked: () => currentUserData.xp >= 7000 }
    ];

    // =====================================
    // 2. PROGRESS STATE
    // =====================================
    const career = {
        completedActivities: ["h_001"],
        assessmentPassed: false,
        nodeStars: { "h_001": 3 }
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
                    career.completedActivities = saved.career.completedActivities || ["h_001"];
                    career.assessmentPassed = Boolean(saved.career.assessmentPassed);
                    career.nodeStars = saved.career.nodeStars || { "h_001": 3 };
                }
            }
        } catch (e) {
            console.error("Error al cargar progreso:", e);
        }
    }

    function saveProgress() {
        try {
            const saved = {
                player: currentUserData,
                career: {
                    completedActivities: career.completedActivities,
                    assessmentPassed: career.assessmentPassed,
                    nodeStars: career.nodeStars
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
        renderRanksSection();
        updateProfile();
        saveProgress();
    }

    function getCurrentRank(xp = 1850) {
        let current = INDUSTRIAL_RANKS[0];
        for (let i = INDUSTRIAL_RANKS.length - 1; i >= 0; i--) {
            if (xp >= INDUSTRIAL_RANKS[i].minXP) {
                current = INDUSTRIAL_RANKS[i];
                break;
            }
        }
        return current;
    }

    // =====================================
    // 3. EDICIÓN DE NOMBRE (1 SOLA VEZ)
    // =====================================
    window.editUserNameOnce = () => {
        const alreadyChanged = localStorage.getItem("zidong_name_changed") === "true";
        if (alreadyChanged) {
            triggerHaptic("error");
            alert(`🔒 No puedes modificar tu nombre de nuevo.\nEl sistema OBERON ya registró tu firma oficial como: "${currentUserData.name}".`);
            return;
        }

        const warningMsg = `⚠️ ¡ATENCIÓN! PROTOCOLO OBERON:\n\nSolo tienes permitido registrar tu nombre UNA SOLA VEZ en la terminal.\n\nPiénsalo bien: tal y como lo escribas ahora, así serás conocido en los 5 planetas.\n\n¿Deseas continuar?`;
        
        if (!confirm(warningMsg)) return;

        const newName = prompt("Escribe tu nombre y apellido técnico definitivo:", currentUserData.name);
        if (!newName || newName.trim().length < 2) {
            alert("Operación cancelada: El nombre es muy corto.");
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

        alert(`✅ Identidad registrada con éxito: "${cleanName}".\nFirma biométrica bloqueada permanentemente.`);
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
    // 4. SELECCIÓN DE PLANETAS EN OBERON
    // =====================================
    function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;

        container.replaceChildren();

        WORLDS_CONFIG.forEach((world, wIdx) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere" style="box-shadow: 0 0 25px ${world.color}88, inset -8px -8px 18px rgba(0,0,0,0.8), inset 6px 6px 14px rgba(255,255,255,0.4);">
                        <span class="planet-core-icon">${world.icon}</span>
                    </div>
                    <div class="planet-orbit-ring" style="border-color:${world.color}66;"></div>
                </div>

                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color};">MUNDO 0${wIdx + 1} · SISTEMA OBERON</span>
                    <h4>${world.title}</h4>
                    <p>${world.subtitle}</p>
                    <span class="planet-enter-badge">EXPLORAR PLANETA →</span>
                </div>
            `;

            planetCard.onclick = () => openWorldDetails(world);
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
        if (subEl) subEl.textContent = world.subtitle;
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
                    <small>${act.example}</small>
                    <span class="node-action">${isCompleted ? "REPETIR TEST ↺" : "INICIAR ⚡"}</span>
                </div>
            `;

            nodeEl.style.cursor = "pointer";
            nodeEl.onclick = () => openActivity(act);
            stream.appendChild(nodeEl);
        });
    }

    function openActivity(act) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        renderLesson(act);
    }

    function renderLesson(activity) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const isCompleted = career.completedActivities.includes(activity.id);

        card.innerHTML = `
            <span class="tag" style="border-color:var(--cyan); color:var(--cyan); margin-bottom:8px;">COMPONENTE INDUSTRIAL OBERON</span>
            <div class="recognition-hanzi">${activity.hanzi}</div>

            <div style="background:rgba(39, 216, 232, 0.08); border:1px solid rgba(39, 216, 232, 0.2); border-radius:14px; padding:12px 14px; width:100%; max-width:340px; margin-bottom:14px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:10px; color:var(--muted); font-weight:bold;">SIGNIFICADO:</span>
                    <strong style="color:var(--cyan); font-size:15px;">${activity.meaning}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:10px; color:var(--muted); font-weight:bold;">PINYIN / TONO:</span>
                    <span style="color:#ffffff; font-weight:bold; font-size:14px;">${activity.pinyin}</span>
                </div>
                <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:6px; font-size:11px; color:var(--gold);">
                    Uso en planta: <strong>${activity.example}</strong>
                </div>
            </div>

            <button id="btn-start-evaluation" class="reveal-button" type="button">
                ${isCompleted ? "REPETIR TEST (MEJORAR ⭐)" : "CALIBRAR EN LÍNEA (TEST) ⚡"}
            </button>
        `;

        document.getElementById("btn-start-evaluation").onclick = () => startSingleTest(activity);
    }

    function startSingleTest(activity) {
        const card = document.querySelector("#level01 .recognition-card");
        const allMeanings = ["Electricidad", "Máquina", "Línea / Cable", "Fuerza / Potencia", "Control", "Eje / Flecha", "Presión", "Cilindro", "Aire", "Válvula"];
        const wrongOpts = allMeanings.filter(m => m !== activity.meaning).sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [activity.meaning, ...wrongOpts].sort(() => 0.5 - Math.random());

        card.innerHTML = `
            <span class="tag" style="border-color:#ffaa00; color:#ffaa00;">VALIDACIÓN DE LECTURA</span>
            <div class="recognition-hanzi" style="font-size:68px; margin: 12px 0;">${activity.hanzi}</div>
            <h3 style="font-size:14px; margin-bottom:12px;">¿Cuál es el significado correcto?</h3>
            <div class="career-quiz-grid" id="lessonQuizGrid"></div>
        `;

        const grid = card.querySelector("#lessonQuizGrid");
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "14px";
            btn.style.padding = "12px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (opt === activity.meaning) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    if (!career.completedActivities.includes(activity.id)) {
                        career.completedActivities.push(activity.id);
                    }
                    if (!career.nodeStars) career.nodeStars = {};
                    career.nodeStars[activity.id] = 3;
                    awardXP(activity.reward);
                    setTimeout(() => {
                        alert(`⭐ ¡NIVEL APROBADO! (+${activity.reward} XP)`);
                        if (typeof window.navigateTo === "function") window.navigateTo("career");
                    }, 400);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    setTimeout(() => {
                        alert("⚠️ Respuesta incorrecta. Repasa la tarjeta técnica.");
                        renderLesson(activity);
                    }, 400);
                }
            };
            grid.appendChild(btn);
        });
    }

    // =====================================
    // 5. LABORATORIO
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
                alert(`🔬 ${comp.hanzi} (${comp.pinyin})\nSignificado: ${comp.es}\nAplicación: ${comp.part}\nPlaneta: ${comp.catName}`);
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
    // 6. ESCALAFÓN DE RANGOS
    // =====================================
    function renderRanksSection() {
        const container = document.getElementById("ranksLadderContainer");
        const headerBadge = document.getElementById("topRankBadge");
        const profileRankBadge = document.getElementById("profileRankBadge");
        if (!container) return;

        const current = getCurrentRank(currentUserData.xp);

        if (headerBadge) headerBadge.textContent = `${current.icon} ${current.name}`;
        if (profileRankBadge) profileRankBadge.textContent = `${current.icon} ${current.name} (Rango ${current.id}/10)`;

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

    // =====================================
    // 7. ARENA 1V1 (IA EXPERTA & DIFÍCIL)
    // =====================================
    let vsTimer = null;
    let vsTimeLeft = 20;
    let myVsPoints = 0;
    let rivalVsPoints = 0;
    let currentRival = { name: "Servo-Bot IA v4.2", avatar: "🤖" };

    window.openVsMode = () => {
        stopVsSession();
        triggerHaptic("success");
        if (typeof window.navigateTo === "function") {
            window.navigateTo("vsBattle");
        }

        const rivals = [
            { name: "Servo-Bot IA v4.2 (Overclock)", avatar: "🤖" },
            { name: "Chen Wei (Ing. Senior)", avatar: "👨‍💻" },
            { name: "Protocolo Kinetix IA", avatar: "⚙️" }
        ];
        currentRival = rivals[Math.floor(Math.random() * rivals.length)];
        document.getElementById("vsRivalName").textContent = currentRival.name;
        document.getElementById("vsRivalAvatar").textContent = currentRival.avatar;

        document.getElementById("vsBattleArenaContainer").style.display = "block";
        document.getElementById("vsDefeatScreen").style.display = "none";

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
        const timerBar = document.getElementById("vsTimerBar");

        vsTimer = setInterval(() => {
            vsTimeLeft--;
            document.getElementById("vsSeconds").textContent = vsTimeLeft;
            if (timerBar) timerBar.style.width = `${(vsTimeLeft / 20) * 100}%`;

            if (window.ZidongAudio && window.ZidongAudio.playClockTick) {
                window.ZidongAudio.playClockTick(vsTimeLeft % 2 === 0);
            }

            // IA MÁS DIFÍCIL: Anota 75 puntos cada ~1.8 segundos con 75% de probabilidad
            if (Math.random() > 0.35) {
                rivalVsPoints += 75;
                document.getElementById("vsRivalScore").textContent = `${rivalVsPoints} PTS`;
            }

            if (vsTimeLeft <= 0) {
                stopVsSession();
                finishVsBattle();
            }
        }, 1000);

        loadVsQuestion();
    }

    function loadVsQuestion() {
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
            btn.style.fontSize = "13.5px";
            btn.style.padding = "12px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (opt === item.es) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    myVsPoints += 100;
                    document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                    setTimeout(loadVsQuestion, 240);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                    document.getElementById("vsSeconds").textContent = vsTimeLeft;
                    setTimeout(loadVsQuestion, 300);
                }
            };
            grid.appendChild(btn);
        });
    }

    function finishVsBattle() {
        stopVsSession();
        const win = myVsPoints >= rivalVsPoints;

        if (win) {
            triggerHaptic("win");
            awardXP(150);
            const currentWins = Number(localStorage.getItem("zidong_vs_wins") || 0) + 1;
            localStorage.setItem("zidong_vs_wins", currentWins);
            alert(`🏆 ¡VICTORIA PERFECTA! Superaste a la IA con ${myVsPoints} vs ${rivalVsPoints} PTS (+150 XP)`);
            renderAchievements();
            renderBadgesGrid();
            if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        } else {
            triggerHaptic("error");
            if (window.ZidongAudio && window.ZidongAudio.playLineCollapse) {
                window.ZidongAudio.playLineCollapse();
            }

            document.getElementById("vsBattleArenaContainer").style.display = "none";
            const defeatScreen = document.getElementById("vsDefeatScreen");
            defeatScreen.style.display = "block";

            document.getElementById("vsDefeatRivalAvatar").textContent = currentRival.avatar;
            document.getElementById("vsDefeatScores").textContent = `${currentUserData.name}: ${myVsPoints} PTS vs ${currentRival.name}: ${rivalVsPoints} PTS`;
        }
    }

    function stopVsSession() {
        clearInterval(vsTimer);
        vsTimer = null;
    }

    window.stopVsSession = stopVsSession;

    // =====================================
    // 8. CURIOSIDADES GRAMATICALES DEL CYBERDOG
    // =====================================
    function getCompanionMessages() {
        const rawName = (currentUserData.name || "New user").trim();
        const isChilaquil = rawName.toLowerCase() === "chilaquil";

        const chilaquilMessage = isChilaquil
            ? `Chilaquil... ¡jajaja te la creíste! Ahora te falta la salsa verde y la crema 🐶🌶️`
            : `${rawName}... te quedaría mejor Chilaquil 🐶🔥`;

        return [
            chilaquilMessage,
            `Dato de Hanzi: 线 (cable) tiene el radical 纟 a la izquierda, que significa 'fibra/seda'. En chino, el lado izquierdo suele dar la pista del material. 🧵`,
            `¿Sabías que un solo Hanzi pueden ser 3 juntos? En 机 (máquina), 木 es madera y 几 es mesa: el concepto original de telar industrial. ⚙️`,
            `Curiosidad técnica: El carácter 电 (diàn) originalmente era el dibujo de un rayo cayendo de las nubes en tormenta. ⚡`,
            `Regla de oro: En chino no hay conjugaciones de verbos enredadas como en español. Solo pones partículas como 了 para pasado. 💡`,
            `Tip de piso: El radical 钅 (jīn) indica metal en herramientas: 铁 (hierro), 钻 (broca), 钉 (perno de fijación). 🛠️`,
            `¡Terminal OBERON en línea! Modo Survivor calibrado a 18 segundos de presión extrema. 🚨`
        ];
    }

    let lastMsgIndex = -1;
    function interactWithCompanion() {
        const bubbleText = document.getElementById("companionText");
        const dogImg = document.getElementById("companionVisual");

        triggerHaptic("success");

        const messages = getCompanionMessages();
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
    // 9. MODAL ESTÉTICO DE DAILY REWARD
    // =====================================
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
            descEl.textContent = "Ya recibiste tus +100 XP de turno hoy. Vuelve en el próximo cambio de guardia.";
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

    // =====================================
    // 10. SPLASH LOADING SCREEN (10 SEGUNDOS OBERON)
    // =====================================
    function checkFirstTimeSplash() {
        const hasLoaded = sessionStorage.getItem("oberon_splash_done");
        const splash = document.getElementById("oberonSplashScreen");
        if (!splash) return;

        if (hasLoaded) {
            splash.style.display = "none";
            return;
        }

        splash.style.display = "flex";
        let progress = 0;
        const bar = document.getElementById("splashLoadingFill");
        const statusText = document.getElementById("splashStatusText");

        const steps = [
            "Conectando al enlace cuántico de OBERON...",
            "Sincronizando telemetría de Voltaria y Kinetix...",
            "Calibrando cilindros neumáticos de Aethel...",
            "Inicializando algoritmos de visión en Lumina...",
            "Conexión neural establecida. Sistema seguro."
        ];

        const splashTimer = setInterval(() => {
            progress += 1;
            if (bar) bar.style.width = `${progress * 10}%`;
            if (statusText) {
                const stepIdx = Math.min(Math.floor(progress / 2), steps.length - 1);
                statusText.textContent = steps[stepIdx];
            }

            if (progress >= 10) {
                clearInterval(splashTimer);
                sessionStorage.setItem("oberon_splash_done", "true");
                setTimeout(() => {
                    splash.style.opacity = "0";
                    setTimeout(() => { splash.style.display = "none"; }, 400);
                }, 300);
            }
        }, 1000);

        window.skipSplashLoading = () => {
            clearInterval(splashTimer);
            sessionStorage.setItem("oberon_splash_done", "true");
            splash.style.display = "none";
        };
    }

    // =====================================
    // 11. MEDALLAS & PERFIL
    // =====================================
    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        if (!container) return;

        container.replaceChildren();
        const currentEquipped = localStorage.getItem("zidong_equipped_badge") || currentUserData.initials;

        MEDALS_DB.forEach(medal => {
            const unlocked = medal.isUnlocked();
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

    function updateProfile() {
        const xp = document.getElementById("profileXP");
        const level = document.getElementById("profileLevel");
        const streak = document.getElementById("profileStreak");
        const completed = document.getElementById("profileCompleted");

        if (xp) xp.textContent = Number(currentUserData.xp).toLocaleString("en-US");
        if (level) level.textContent = "05";
        if (streak) streak.textContent = "5 Días";
        if (completed) completed.textContent = career.completedActivities.length;

        const savedIcon = localStorage.getItem("zidong_equipped_badge") || currentUserData.initials;
        applyAvatarIcon(savedIcon);
        updateUserDisplay();
        renderBadgesGrid();
        renderRanksSection();
    }

    function renderAchievements() {
        const container = document.getElementById("achievementsListContainer");
        const totalScoreEl = document.getElementById("totalGamerscore");
        if (!container) return;

        container.replaceChildren();
        let totalG = 0;

        XBOX_ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = ach.unlocked();
            if (isUnlocked) totalG += ach.score;

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

        if (totalScoreEl) totalScoreEl.textContent = `${totalG} G`;
    }

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

    // =====================================
    // 12. INICIALIZACIÓN
    // =====================================
    function initializeApplication() {
        loadSavedProgress();
        updateUserDisplay();
        renderCareerPlanetsMenu();
        renderLabComponents();
        renderRanksSection();
        renderAchievements();
        updateProfile();
        checkFirstTimeSplash();

        if (window.ZidongAudio) {
            window.ZidongAudio.switchTrack("dashboard");
        }

        console.log("--------------------------------");
        console.log("ZIDONG CORE 7.0: SISTEMA OBERON");
        console.log("--------------------------------");
    }

    window.awardXP = awardXP;
    window.renderCareerPlanetsMenu = renderCareerPlanetsMenu;
    window.interactWithCompanion = interactWithCompanion;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();
