/* ==========================================================================
   ZIDONG CORE - SISTEMA INDUSTRIAL INTEGRAL (APP.JS DEFINITIVO V35)
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
            if (navigator.vibrate) navigator.vibrate([40, 60, 40, 80]);
            if (window.ZidongAudio && window.ZidongAudio.playWinFanfare) window.ZidongAudio.playWinFanfare();
        }
    }
    window.triggerHaptic = triggerHaptic;

    let currentUserData = {
        name: "New user",
        xp: 1850,
        streak: 5,
        completedActivities: ["w1_a1", "w1_a2"],
        unlockedWorlds: ["world_1", "world_2", "world_3", "world_4", "world_5"],
        unlockedBadges: ["badge_starter", "badge_volt", "badge_sensor"]
    };

    const WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            planetName: "Planeta Voltaria",
            subtitle: "VFDs, motores y cableado de control",
            icon: "⚡",
            color: "#00f59b",
            planetClass: "planet-voltaria",
            activities: [
                { id: "w1_a1", hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Voltaje", reward: 50, audioNote: "diàn" },
                { id: "w1_a2", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cableado", reward: 50, audioNote: "xiàn" },
                { id: "w1_a3", hanzi: "模", pinyin: "mó", meaning: "Módulo de potencia", reward: 60, audioNote: "mó" },
                { id: "w1_a4", hanzi: "组", pinyin: "zǔ", meaning: "Ensamble eléctrico", reward: 70, audioNote: "zǔ" }
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

    const RANKS_LADDER = [
        { level: 1, name: "Becario de Planta", minXp: 0 },
        { level: 2, name: "Operador Junior", minXp: 300 },
        { level: 3, name: "Técnico de Ensamble", minXp: 750 },
        { level: 4, name: "Técnico Especialista", minXp: 1400 },
        { level: 5, name: "Ingeniero de Automatización", minXp: 2200 },
        { level: 6, name: "Líder Técnico CFT", minXp: 3200 }
    ];

    const ACHIEVEMENTS_DATA = [
        { id: "b_first_step", icon: "🚀", name: "Primeros Pasos", desc: "Completa tu primera lección en cualquier mundo.", isUnlocked: () => currentUserData.completedActivities.length >= 1 },
        { id: "b_volt_master", icon: "⚡", name: "Electricista Oberon", desc: "Domina todas las lecciones del Mundo Eléctrico.", isUnlocked: () => WORLDS_CONFIG[0].activities.every(a => currentUserData.completedActivities.includes(a.id)) },
        { id: "b_mechanic", icon: "⚙️", name: "Manos a la Máquina", desc: "Supera el checkpoint del Mundo Mecánico.", isUnlocked: () => currentUserData.completedActivities.includes("w2_a4") },
        { id: "b_ai_slayer", icon: "⚔️", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_survivor", icon: "⚠️", name: "Defensor del Núcleo", desc: "Retira con éxito al menos 5 alarmas en Survivor Mode.", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_cleared") || 0) >= 5 },
        { id: "b_polyglot", icon: "🧠", name: "Soporte Bilingüe", desc: "Alcanza el Nivel 3 de rango o superior.", isUnlocked: () => calculateUserRank(currentUserData.xp).level >= 3 }
    ];

    function calculateUserRank(xp) {
        let current = RANKS_LADDER[0];
        for (let r of RANKS_LADDER) {
            if (xp >= r.minXp) current = r;
        }
        return current;
    }

    function updateProfile() {
        const rank = calculateUserRank(currentUserData.xp);
        currentUserData.level = rank.level;

        const topUser = document.getElementById("topUsername");
        const topAvatar = document.getElementById("topAvatar");
        const topRank = document.getElementById("topRankBadge");
        const batteryFill = document.getElementById("homeBatteryFill");
        const batteryXp = document.getElementById("homeBatteryXpValue");
        const batteryRank = document.getElementById("homeBatteryRank");
        const batteryPct = document.getElementById("homeBatteryPercent");

        if (topUser) topUser.textContent = currentUserData.name;
        if (topAvatar) topAvatar.textContent = currentUserData.name.slice(0, 2).toUpperCase();
        if (topRank) topRank.textContent = `⚡ ${rank.name}`;

        if (batteryXp) batteryXp.textContent = `${currentUserData.xp.toLocaleString()} XP`;
        if (batteryRank) batteryRank.textContent = `Rango 0${rank.level}: ${rank.name}`;
        
        const nextRank = RANKS_LADDER.find(r => r.level === rank.level + 1);
        let pct = 100;
        if (nextRank) {
            const prevXp = rank.minXp;
            const span = nextRank.minXp - prevXp;
            const cur = currentUserData.xp - prevXp;
            pct = Math.min(100, Math.max(0, Math.round((cur / span) * 100)));
        }
        if (batteryFill) batteryFill.style.width = `${pct}%`;
        if (batteryPct) batteryPct.textContent = `${pct}% carga`;

        const profileName = document.getElementById("profileName");
        const profileAvatar = document.getElementById("profileAvatar");
        const profileRankBadge = document.getElementById("profileRankBadge");
        const profileLevel = document.getElementById("profileLevel");
        const profileStreak = document.getElementById("profileStreak");
        const profileCompleted = document.getElementById("profileCompleted");

        if (profileName) profileName.textContent = currentUserData.name;
        if (profileAvatar) profileAvatar.textContent = currentUserData.name.slice(0, 2).toUpperCase();
        if (profileRankBadge) profileRankBadge.textContent = `⚡ ${rank.name}`;
        if (profileLevel) profileLevel.textContent = `0${rank.level}`;
        if (profileStreak) profileStreak.textContent = `${currentUserData.streak} Días`;
        if (profileCompleted) profileCompleted.textContent = currentUserData.completedActivities.length;

        renderBadgesGrid();
        renderAchievementsList();
        renderWorldsProgressInProfile();
        renderRanksLadder();
    }
    window.updateProfile = updateProfile;

    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        if (!container) return;
        container.replaceChildren();

        WORLDS_CONFIG.forEach(w => {
            const isUnlocked = currentUserData.completedActivities.includes(w.activities[w.activities.length - 1].id);
            const badgeEl = document.createElement("div");
            badgeEl.className = `profile-badge-item ${isUnlocked ? "unlocked" : "locked"}`;
            badgeEl.innerHTML = `
                <div class="badge-icon-box">${isUnlocked ? w.icon : "🔒"}</div>
                <span>${w.boss.badgeName}</span>
            `;
            container.appendChild(badgeEl);
        });
    }

    function renderAchievementsList() {
        const container = document.getElementById("profileAchievementsList");
        const countLabel = document.getElementById("achievementsCountLabel");
        if (!container) return;
        container.replaceChildren();

        let unlockedCount = 0;
        ACHIEVEMENTS_DATA.forEach(ach => {
            const ok = ach.isUnlocked();
            if (ok) unlockedCount++;

            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.gap = "10px";
            item.style.padding = "8px 10px";
            item.style.borderRadius = "10px";
            item.style.background = ok ? "rgba(0,245,155,0.08)" : "rgba(255,255,255,0.03)";
            item.style.border = ok ? "1px solid rgba(0,245,155,0.25)" : "1px solid var(--border)";

            item.innerHTML = `
                <span style="font-size:20px; filter:${ok ? 'none' : 'grayscale(100%) opacity(0.4)'};">${ach.icon}</span>
                <div style="flex:1;">
                    <strong style="font-size:11.5px; color:${ok ? '#00f59b' : 'var(--muted)'}; display:block;">${ach.name}</strong>
                    <small style="font-size:9.5px; color:#fff; display:block; margin-top:1px;">${ach.desc}</small>
                </div>
                <span style="font-size:10px; font-weight:800; color:${ok ? 'var(--green)' : 'var(--muted)'};">${ok ? '✓' : '🔒'}</span>
            `;
            container.appendChild(item);
        });

        if (countLabel) countLabel.textContent = `${unlockedCount} / ${ACHIEVEMENTS_DATA.length} Desbloqueados`;
    }

    function renderWorldsProgressInProfile() {
        const container = document.getElementById("profileWorldsProgressList");
        if (!container) return;
        container.replaceChildren();

        WORLDS_CONFIG.forEach(w => {
            const total = w.activities.length;
            const done = w.activities.filter(a => currentUserData.completedActivities.includes(a.id)).length;
            const pct = Math.round((done / total) * 100);

            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.gap = "4px";
            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-size:11px;">
                    <span style="color:#fff; font-weight:700;">${w.icon} ${w.title}</span>
                    <span style="color:${w.color}; font-weight:800;">${done}/${total} (${pct}%)</span>
                </div>
                <div class="progress-bar-container"><div class="progress-fill" style="width:${pct}%; background:${w.color};"></div></div>
            `;
            container.appendChild(row);
        });
    }

    function renderRanksLadder() {
        const container = document.getElementById("ranksLadderContainer");
        if (!container) return;
        container.replaceChildren();

        const currentRank = calculateUserRank(currentUserData.xp);

        RANKS_LADDER.forEach(r => {
            const isCurrent = r.level === currentRank.level;
            const isPassed = currentUserData.xp >= r.minXp;

            const card = document.createElement("div");
            card.style.background = isCurrent ? "rgba(0,245,155,0.12)" : "var(--surface)";
            card.style.border = isCurrent ? "1.5px solid var(--green)" : "1px solid var(--border)";
            card.style.borderRadius = "14px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.justifyContent = "space-between";
            card.style.alignItems = "center";

            card.innerHTML = `
                <div>
                    <span style="font-size:9px; color:${isCurrent ? 'var(--green)' : 'var(--muted)'}; font-weight:800; display:block;">NIVEL 0${r.level}</span>
                    <h4 style="color:#fff; font-size:13px; margin-top:2px;">${r.name}</h4>
                    <small style="font-size:10px; color:var(--muted);">${r.minXp.toLocaleString()} XP requeridos</small>
                </div>
                <span style="font-size:14px; font-weight:800; color:${isPassed ? 'var(--green)' : 'var(--muted)'};">${isPassed ? '✓ ALCANZADO' : '🔒 BLOQUEADO'}</span>
            `;
            container.appendChild(card);
        });
    }

    window.editUserNameOnce = function() {
        const newName = prompt("Ingresa tu nombre o identificador de especialista (Solo 1 vez):", currentUserData.name);
        if (newName && newName.trim().length > 0) {
            currentUserData.name = newName.trim().slice(0, 20);
            updateProfile();
            alert("¡Identificador actualizado correctamente!");
        }
    };

    window.claimDailyReward = function() {
        triggerHaptic("win");
        currentUserData.xp += 100;
        updateProfile();
        alert("🎁 ¡Bono de Turno reclamado con éxito!\nHas recibido +100 XP.");
    };

    window.toggleDailyMissionsModal = function() {
        const modal = document.getElementById("dailyMissionsModal");
        if (modal) {
            modal.style.display = modal.style.display === "flex" ? "none" : "flex";
        }
    };

    window.closeMissionsModal = function(e) {
        if (e.target.id === "dailyMissionsModal") {
            window.toggleDailyMissionsModal();
        }
    };

    // LAB COMPONENTS DATA & FILTER
    const LAB_COMPONENTS = [
        { id: "c1", category: "world_1", hanzi: "变频器", pinyin: "biàn pín qì", name: "VFD / Inversor de Frecuencia", desc: "Controla velocidad y torque de motores asíncronos.", icon: "⚡" },
        { id: "c2", category: "world_1", hanzi: "接触器", pinyin: "jiē chù qì", name: "Contactor Eléctrico", desc: "Dispositivo electromecánico para abrir/cerrar potencia.", icon: "🔌" },
        { id: "c3", category: "world_2", hanzi: "气缸", pinyin: "qì gāng", name: "Cilindro Neumático", desc: "Actuador lineal impulsado por aire comprimido.", icon: "⚙️" },
        { id: "c4", category: "world_2", hanzi: "传感器", pinyin: "chuán gǎn qì", name: "Sensor Inductivo / Fotoeléctrico", desc: "Detecta presencia de piezas metálicas u ópticas.", icon: "📡" },
        { id: "c5", category: "world_3", hanzi: "电磁阀", pinyin: "diàn cí fá", name: "Electroválvula SMC", desc: "Gobierna el flujo de aire hacia los actuadores.", icon: "💨" },
        { id: "c6", category: "world_4", hanzi: "机器人", pinyin: "jī qì rén", name: "Brazo Robot KUKA / Fanuc", desc: "Manipulador articulado para ensamble automático.", icon: "🤖" },
        { id: "c7", category: "world_5", hanzi: "相机", pinyin: "xiàng jī", name: "Cámara AOI / Visión", desc: "Inspección de soldadura y componentes SMD.", icon: "📷" }
    ];

    window.renderLabComponents = function(filterCat = "all", searchTerm = "") {
        const container = document.getElementById("labComponentsContainer");
        if (!container) return;
        container.replaceChildren();

        const filtered = LAB_COMPONENTS.filter(item => {
            const matchesCat = filterCat === "all" || item.category === filterCat;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.hanzi.includes(searchTerm) || item.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted); font-size:12px;">No se encontraron componentes en el laboratorio.</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "panel";
            card.style.background = "var(--surface)";
            card.style.border = "1px solid var(--border)";
            card.style.borderRadius = "14px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.gap = "12px";

            card.innerHTML = `
                <div style="font-size:28px; background:var(--surface-light); width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border);">${item.icon}</div>
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:var(--cyan); font-size:13.5px; font-family:'Noto Sans SC';">${item.hanzi}</strong>
                        <small style="color:var(--muted); font-size:9.5px;">${item.pinyin}</small>
                    </div>
                    <h4 style="color:#fff; font-size:12px; margin-top:2px;">${item.name}</h4>
                    <p style="font-size:10px; color:var(--muted); margin-top:2px; line-height:1.3;">${item.desc}</p>
                </div>
            `;
            container.appendChild(card);
        });
    };

    window.filterLabCategory = function(cat, btn) {
        document.querySelectorAll(".lab-tab-btn").forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");
        const searchVal = document.getElementById("labSearchInput")?.value || "";
        window.renderLabComponents(cat, searchVal);
    };

    window.filterLabComponents = function(query) {
        const activeTab = document.querySelector(".lab-tab-btn.active");
        let cat = "all";
        if (activeTab) {
            const text = activeTab.textContent;
            if (text.includes("Eléctrico")) cat = "world_1";
            else if (text.includes("Mecánico")) cat = "world_2";
            else if (text.includes("Neumático")) cat = "world_3";
            else if (text.includes("Robótica")) cat = "world_4";
        }
        window.renderLabComponents(cat, query);
    };

    // LEADERBOARD MOCK DATA
    const MOCK_LEADERBOARD = [
        { rank: 1, name: "Chen Wei (Líder Planta)", xp: 3450, badge: "⚡ Nivel 6" },
        { rank: 2, name: "Ana Torres (CFT Calidad)", xp: 2980, badge: "🤖 Nivel 5" },
        { rank: 3, name: "Raymundo López (Especialista)", xp: 1850, badge: "⚙️ Nivel 3", isMe: true },
        { rank: 4, name: "Li Ming (Soporte SMT)", xp: 1420, badge: "📡 Nivel 3" },
        { rank: 5, name: "Carlos Ruiz (Técnico Turno B)", xp: 950, badge: "🔌 Nivel 2" }
    ];

    window.renderLeaderboard = function() {
        const container = document.getElementById("leaderboardTableContainer");
        const myBox = document.getElementById("leaderboardMyRankBox");
        if (!container) return;
        container.replaceChildren();

        MOCK_LEADERBOARD.forEach(item => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.padding = "10px 12px";
            row.style.borderRadius = "12px";
            row.style.background = item.isMe ? "rgba(0,245,155,0.12)" : "var(--surface-light)";
            row.style.border = item.isMe ? "1px solid var(--green)" : "1px solid var(--border)";

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:900; font-size:12px; color:${item.rank === 1 ? 'var(--gold)' : item.rank === 2 ? '#c0c0c0' : item.rank === 3 ? '#cd7f32' : 'var(--muted)'};">#0${item.rank}</span>
                    <div>
                        <strong style="font-size:12px; color:${item.isMe ? 'var(--green)' : '#fff'}; display:block;">${item.name} ${item.isMe ? '(Tú)' : ''}</strong>
                        <small style="font-size:9.5px; color:var(--muted);">${item.badge}</small>
                    </div>
                </div>
                <span style="font-weight:900; font-size:12px; color:var(--cyan);">${item.xp.toLocaleString()} XP</span>
            `;
            container.appendChild(row);

            if (item.isMe && myBox) {
                myBox.style.background = "var(--surface)";
                myBox.style.border = "1.5px solid var(--cyan)";
                myBox.style.borderRadius = "16px";
                myBox.style.padding = "14px";
                myBox.style.display = "flex";
                myBox.style.justifyContent = "space-between";
                myBox.style.alignItems = "center";
                myBox.innerHTML = `
                    <div>
                        <span class="eyebrow" style="color:var(--cyan);">TU POSICIÓN GLOBAL</span>
                        <h3 style="color:#fff; font-size:14px; margin-top:2px;">#0${item.rank} · ${currentUserData.name}</h3>
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:var(--green); font-size:15px; display:block;">${currentUserData.xp.toLocaleString()} XP</strong>
                        <small style="color:var(--muted); font-size:9px;">Top 3 de Planta</small>
                    </div>
                `;
            }
        });
    };

    // COMPANION SPEECHES
    const COMPANION_PHRASES = [
        "¡Los VFDs Delta MS300 regulan la frecuencia de los motores en la línea de SMT! ⚡",
        "¿Sabías que 'diàn' (电) significa electricidad y se usa en casi todo término electrónico? 🔋",
        "El mantenimiento autónomo previene paros imprevistos en las máquinas Ersa Versaflow. ⚙️",
        "¡Revisa las electroválvulas SMC si notas caída de presión en los pistones neumáticos! 💨"
    ];

    window.interactWithCompanion = function() {
        triggerHaptic("success");
        const bubble = document.getElementById("companionBubble");
        const textEl = document.getElementById("companionText");
        if (!bubble || !textEl) return;

        const randomPhrase = COMPANION_PHRASES[Math.floor(Math.random() * COMPANION_PHRASES.length)];
        textEl.textContent = randomPhrase;
        bubble.classList.add("bounce-pop");
        setTimeout(() => bubble.classList.remove("bounce-pop"), 400);
    };

    // CAREER PLANETS MENU RENDERING
    function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;
        container.replaceChildren();

        WORLDS_CONFIG.forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const completedInWorld = world.activities.filter(a => currentUserData.completedActivities.includes(a.id)).length;

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
                triggerHaptic("success");
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    }

    function openWorldDetails(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;
        if (!stream) return;

        stream.replaceChildren();

        world.activities.forEach((act, idx) => {
            const isCompleted = currentUserData.completedActivities.includes(act.id);
            const isUnlocked = idx === 0 || currentUserData.completedActivities.includes(world.activities[idx - 1].id);

            const node = document.createElement("div");
            node.className = `planet-node-item ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`;
            node.innerHTML = `
                <div class="node-icon-circle" style="border-color:${world.color};">
                    <span>${isCompleted ? '✓' : isUnlocked ? act.hanzi : '🔒'}</span>
                </div>
                <div class="node-meta">
                    <strong style="color:#fff; font-size:13px; font-family:'Noto Sans SC';">${act.hanzi} · ${act.meaning}</strong>
                    <small style="color:var(--muted); font-size:10px;">Pinyin: ${act.pinyin} · Recompensa: +${act.reward} XP</small>
                </div>
                <span class="node-arrow">${isCompleted ? 'COMPLETADO' : isUnlocked ? 'INICIAR →' : 'BLOQUEADO'}</span>
            `;

            if (isUnlocked) {
                node.onclick = () => {
                    triggerHaptic("success");
                    openActivity(act, world);
                };
            }
            stream.appendChild(node);
        });

        // BOSS CHECKPOINT NODE
        const bossUnlocked = world.activities.every(a => currentUserData.completedActivities.includes(a.id));
        const bossCompleted = currentUserData.completedActivities.includes(world.boss.id);

        const bossNode = document.createElement("div");
        bossNode.className = `planet-node-item boss-node ${bossCompleted ? 'completed' : bossUnlocked ? 'unlocked' : 'locked'}`;
        bossNode.style.borderColor = world.color;
        bossNode.innerHTML = `
            <div class="node-icon-circle" style="background:${world.color}; color:#0b1424; border-color:#fff;">
                <span>👑</span>
            </div>
            <div class="node-meta">
                <strong style="color:${world.color}; font-size:13.5px;">CHECKPOINT FINAL: ${world.boss.title}</strong>
                <small style="color:#fff; font-size:10px;">Desbloquea Medalla: "${world.boss.badgeName}" (+${world.boss.reward} XP)</small>
            </div>
            <span class="node-arrow" style="color:${world.color};">${bossCompleted ? 'CONQUISTADO' : bossUnlocked ? 'ENFRENTAR JEFE ⚡' : 'REQUIERE MUNDO 100%'}</span>
        `;

        if (bossUnlocked) {
            bossNode.onclick = () => {
                triggerHaptic("success");
                startBossCheckpoint(world);
            };
        }
        stream.appendChild(bossNode);
    }

    function openActivity(act, world) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi4Phases(act, world);
    }

    // 4 FASES PEDAGÓGICAS PARA APRENDIZAJE DE HANZI
    function startHanzi4Phases(act, world) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        let currentPhase = 1;

        function renderPhase1() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 1 DE 4 · RECONOCIMIENTO</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Identifica el componente industrial</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:#fff; margin:14px 0; text-shadow:0 0 20px rgba(0,245,155,0.4);">${act.hanzi}</div>
                <p style="font-size:12px; color:var(--muted); margin-bottom:16px;">Pinyin: <strong>${act.pinyin}</strong></p>
                <button class="reveal-button" style="background:${world?.color || 'var(--cyan)'}; color:#0b1424; font-weight:900; padding:14px; width:100%;" onclick="window.nextPhaseCb()">ESCUCHAR & CONTINUAR →</button>
            `;
        }

        function renderPhase2() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 2 DE 4 · SIGNIFICADO TÉCNICO</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">¿Qué función cumple "${act.hanzi}"?</h3>
                <div style="font-size:42px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0;">${act.hanzi}</div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;" id="phase2Options"></div>
            `;

            const optsBox = document.getElementById("phase2Options");
            const wrongOpts = [
                "Válvula de purga neumática",
                "Sensor óptico de presencia",
                "Indicador lumínico de estado"
            ];
            const allOpts = vsShuffle([act.meaning, ...wrongOpts.slice(0, 3)]);

            allOpts.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "reveal-button";
                btn.style.background = "var(--surface-light)";
                btn.style.color = "#fff";
                btn.style.border = "1px solid var(--border)";
                btn.style.padding = "12px";
                btn.style.fontWeight = "800";
                btn.textContent = opt;

                btn.onclick = () => {
                    if (opt === act.meaning) {
                        triggerHaptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        setTimeout(renderPhase3, 500);
                    } else {
                        triggerHaptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                    }
                };
                optsBox.appendChild(btn);
            });
        }

        function renderPhase3() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 3 DE 4 · ASOCIACIÓN DE PINYIN</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Selecciona la pronunciación correcta</h3>
                <div style="font-size:52px; font-family:'Noto Sans SC'; color:#fff; margin:12px 0;">${act.hanzi}</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;" id="phase3Options"></div>
            `;

            const optsBox = document.getElementById("phase3Options");
            const wrongPinyin = ["bō qì", "gāng yā", "zhǎo qì"];
            const allPinyin = vsShuffle([act.pinyin, ...wrongPinyin.slice(0, 3)]);

            allPinyin.forEach(pin => {
                const btn = document.createElement("button");
                btn.className = "reveal-button";
                btn.style.background = "var(--surface-light)";
                btn.style.color = "#fff";
                btn.style.border = "1px solid var(--border)";
                btn.style.padding = "12px";
                btn.style.fontWeight = "800";
                btn.textContent = pin;

                btn.onclick = () => {
                    if (pin === act.pinyin) {
                        triggerHaptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        setTimeout(renderPhase4, 500);
                    } else {
                        triggerHaptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                    }
                };
                optsBox.appendChild(btn);
            });
        }

        function renderPhase4() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 4 DE 4 · VALIDACIÓN DE ESCRITURA</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Confirma el carácter correcto</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:var(--green); margin:12px 0;">${act.hanzi}</div>
                <p style="font-size:12px; color:#fff; margin-bottom:16px;">Significado: <strong>${act.meaning}</strong></p>
                <button class="reveal-button" style="background:var(--green); color:#0b1424; font-weight:900; padding:14px; width:100%;" onclick="window.finishActivityCb()">¡CONQUISTAR NIVEL (+${act.reward} XP) ⚡</button>
            `;
        }

        window.nextPhaseCb = () => {
            triggerHaptic("success");
            renderPhase2();
        };

        window.finishActivityCb = () => {
            triggerHaptic("win");
            if (!currentUserData.completedActivities.includes(act.id)) {
                currentUserData.completedActivities.push(act.id);
                currentUserData.xp += act.reward;
                updateProfile();
            }
            alert(`🌟 ¡NIVEL APROBADO! (+${act.reward} XP)\nHas dominado "${act.hanzi}" (${act.meaning}).`);
            if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");
        };

        renderPhase1();
    }

    function startBossCheckpoint(world) {
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
            const allChars = vsShuffle(sequence.map(s => s.char).concat(["动", "机", "线", "电"]));

            allChars.forEach(char => {
                const b = document.createElement("button");
                b.className = "reveal-button";
                b.style.background = "var(--surface-light)";
                b.style.color = "#fff";
                b.style.border = "1px solid var(--border)";
                b.style.fontSize = "26px";
                b.style.fontFamily = "'Noto Sans SC'";
                b.style.padding = "14px";
                b.textContent = char;

                b.onclick = () => {
                    if (char === currentTarget.char) {
                        triggerHaptic("success");
                        b.style.background = "var(--green)";
                        b.style.color = "#0b1424";
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            triggerHaptic("win");
                            if (!currentUserData.completedActivities.includes(boss.id)) {
                                currentUserData.completedActivities.push(boss.id);
                                currentUserData.xp += boss.reward;
                                updateProfile();
                            }
                            setTimeout(() => {
                                alert(`🏆 ¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`);
                                renderBadgesGrid();
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 400);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        triggerHaptic("error");
                        b.style.background = "var(--red)";
                        b.style.color = "#fff";
                        setTimeout(() => b.style.background = "var(--surface-light)", 300);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }

// =============================================
// MOTOR 1V1 - SISTEMA DE TRES NIVELES (GLOBAL)
// =============================================

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
    { hanzi: "动", pinyin: "dòng", meaning: "Movimiento / Automático" }
];

window.VS_WORD_DATA = [
    { hanzi: "急停", pinyin: "jí tíng", meaning: "Paro de emergencia" },
    { hanzi: "自动", pinyin: "zì dòng", meaning: "Automático" },
    { hanzi: "机器人", pinyin: "jī qì rén", meaning: "Robot industrial" },
    { hanzi: "PLC", pinyin: "kě lù", meaning: "Controlador PLC" },
    { hanzi: "传感器", pinyin: "chuán gǎn qì", meaning: "Sensor" }
];

window.vsShuffle = function(array) {
    let arr = [...array];
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
        stage.insertBefore(instruction, document.getElementById("vsHanziDisplay"));
    }
    return instruction;
};

window.openVsMode = function() {
    if (typeof stopVsSession === "function") stopVsSession();

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
    if (!window.VS_DIFFICULTIES[diffKey]) {
        console.error("Dificultad 1v1 desconocida:", diffKey);
        return;
    }

    if (typeof stopVsSession === "function") stopVsSession();

    window.selectedVsDiffKey = diffKey;
    const diff = window.VS_DIFFICULTIES[diffKey];

    const selector = document.getElementById("vsDifficultySelector");
    const arena = document.getElementById("vsBattleArenaContainer");
    const defeat = document.getElementById("vsDefeatScreen");

    if (selector) selector.style.setProperty("display", "none", "important");
    if (defeat) defeat.style.setProperty("display", "none", "important");
    if (arena) {
        arena.style.setProperty("display", "block", "important");
        arena.style.setProperty("pointer-events", "auto", "important");
    }

    const rivalName = document.getElementById("vsRivalName");
    const rivalAvatar = document.getElementById("vsRivalAvatar");
    const badge = document.getElementById("vsDiffBadge");

    if (rivalName) rivalName.textContent = diff.name;
    if (rivalAvatar) {
        rivalAvatar.textContent = diffKey === "HARD" ? "⚡" : diffKey === "MEDIUM" ? "🤖" : "⚙️";
    }
    if (badge) badge.textContent = diff.badge;

    // INICIALIZACIÓN CRÍTICA DE ESTADO
    window.myVsPoints = 0;
    window.rivalVsPoints = 0;
    window.vsTimeLeft = 20;
    window.vsSessionActive = true; // Forzar sesión activa
    window.vsRoundLocked = false;

    window.vsUpdateScores();

    const seconds = document.getElementById("vsSeconds");
    if (seconds) seconds.textContent = window.vsTimeLeft;

    const timerBar = document.getElementById("vsTimerBar");
    if (timerBar) timerBar.style.width = "100%";

    // Arrancar la primera ronda y el reloj de inmediato
    if (typeof window.startVsRound === "function") {
        window.startVsRound();
    }
    if (typeof window.startVsTimer === "function") {
        window.startVsTimer();
    }
};

window.startVsRound = function() {
    window.vsSessionActive = true; // Blindaje extra
    if (window.vsTimeLeft <= 0) return;
    window.vsRoundLocked = false;
    window.vsSelectedChars = [];

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();

    if (!display || !grid) return;
    grid.replaceChildren();

    if (window.selectedVsDiffKey === "EASY") {
        window.loadVsLevel1SingleHanzi();
    } else if (window.selectedVsDiffKey === "MEDIUM") {
        window.loadVsLevel2CompoundWord();
    } else if (window.selectedVsDiffKey === "HARD") {
        window.loadVsLevel3OrderHanzi();
    }
};
window.loadVsLevel1SingleHanzi = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();

    const correct = window.vsRandomItem(window.VS_HANZI_DATA);
    const wrongOptions = window.vsShuffle(
        window.VS_HANZI_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = window.vsShuffle([correct, ...wrongOptions]);
    window.vsCurrentQuestion = correct;

    if (display) display.textContent = correct.hanzi;
    if (instruction) instruction.textContent = `Identifica el significado: "${correct.meaning}"`;

    options.forEach(option => {
        const button = document.createElement("button");
        button.className = "reveal-button";
        button.style.background = "var(--surface-light)";
        button.style.color = "#fff";
        button.style.border = "1px solid var(--border)";
        button.style.padding = "10px";
        button.style.fontWeight = "800";
        button.style.fontSize = "12px";
        button.textContent = option.pinyin ? `${option.pinyin} - ${option.meaning}` : option.meaning;

        button.onclick = () => {
            if (window.vsRoundLocked || !window.vsSessionActive) return;
            window.submitVsAnswer(option.hanzi === correct.hanzi, button);
        };
        grid.appendChild(button);
    });
};

window.loadVsLevel2CompoundWord = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();

    const correct = window.vsRandomItem(window.VS_WORD_DATA);
    const wrongOptions = window.vsShuffle(
        window.VS_WORD_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = window.vsShuffle([correct, ...wrongOptions]);
    window.vsCurrentQuestion = correct;

    if (display) display.textContent = correct.hanzi;
    if (instruction) instruction.textContent = `Selecciona la planta/término correcto para: "${correct.meaning}"`;

    options.forEach(option => {
        const button = document.createElement("button");
        button.className = "reveal-button";
        button.style.background = "var(--surface-light)";
        button.style.color = "#fff";
        button.style.border = "1px solid var(--border)";
        button.style.padding = "10px";
        button.style.fontWeight = "800";
        button.style.fontSize = "12px";
        button.textContent = option.meaning;

        button.onclick = () => {
            if (window.vsRoundLocked || !window.vsSessionActive) return;
            window.submitVsAnswer(option.hanzi === correct.hanzi, button);
        };
        grid.appendChild(button);
    });
};

window.loadVsLevel3OrderHanzi = function() {
    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = window.vsGetInstruction();

    const correct = window.vsRandomItem(window.VS_WORD_DATA);
    window.vsCurrentQuestion = correct;

    if (display) display.textContent = correct.meaning;
    if (instruction) instruction.textContent = `Ordena los caracteres para formar: "${correct.meaning}"`;

    const correctChars = correct.hanzi.split("");
    const extraChars = ["电", "线", "模", "组", "机", "动", "停", "自"];
    const availableChars = [
        ...correctChars,
        ...window.vsShuffle(extraChars).filter(char => !correctChars.includes(char)).slice(0, 3)
    ];
    const shuffledChars = window.vsShuffle(availableChars);

    const containerBox = document.createElement("div");
    containerBox.style.display = "flex";
    containerBox.style.flexDirection = "column";
    containerBox.style.gap = "10px";
    containerBox.style.width = "100%";

    const answerBox = document.createElement("div");
    answerBox.id = "vsBuildAnswer";
    answerBox.style.background = "rgba(0,0,0,0.4)";
    answerBox.style.border = "2px dashed var(--cyan)";
    answerBox.style.borderRadius = "10px";
    answerBox.style.padding = "12px";
    answerBox.style.fontSize = "22px";
    answerBox.style.letterSpacing = "4px";
    answerBox.style.color = "var(--cyan)";
    answerBox.style.minHeight = "48px";
    answerBox.style.display = "flex";
    answerBox.style.alignItems = "center";
    answerBox.style.justifyContent = "center";
    answerBox.textContent = "";

    const chipsGrid = document.createElement("div");
    chipsGrid.style.display = "flex";
    chipsGrid.style.flexWrap = "wrap";
    chipsGrid.style.gap = "6px";
    chipsGrid.style.justifyContent = "center";

    shuffledChars.forEach(char => {
        const chip = document.createElement("button");
        chip.className = "reveal-button";
        chip.style.background = "var(--surface-light)";
        chip.style.color = "#fff";
        chip.style.border = "1px solid var(--border)";
        chip.style.padding = "8px 12px";
        chip.style.fontSize = "16px";
        chip.style.fontWeight = "bold";
        chip.textContent = char;

        chip.onclick = () => {
            if (window.vsRoundLocked || !window.vsSessionActive) return;
            window.vsSelectedChars.push(char);
            answerBox.textContent = window.vsSelectedChars.join("");

            if (window.vsSelectedChars.length === correctChars.length) {
                const assembled = window.vsSelectedChars.join("");
                window.submitVsAnswer(assembled === correct.hanzi);
            }
        };
        chipsGrid.appendChild(chip);
    });

    const clearBtn = document.createElement("button");
    clearBtn.className = "btn-secondary";
    clearBtn.style.fontSize = "10px";
    clearBtn.style.padding = "6px";
    clearBtn.textContent = "🔄 Borrar selección";
    clearBtn.onclick = () => {
        if (window.vsRoundLocked || !window.vsSessionActive) return;
        window.vsSelectedChars = [];
        answerBox.textContent = "";
    };

    containerBox.appendChild(answerBox);
    containerBox.appendChild(chipsGrid);
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
    if (typeof stopVsSession === "function") stopVsSession();
    window.vsTimer = setInterval(() => {
        if (!window.vsSessionActive) return;
        window.vsTimeLeft--;

        const seconds = document.getElementById("vsSeconds");
        const timerBar = document.getElementById("vsTimerBar");

        if (seconds) seconds.textContent = window.vsTimeLeft;
        if (timerBar) {
            timerBar.style.width = `${Math.max(0, (window.vsTimeLeft / 20) * 100)}%`;
        }

        if (window.vsTimeLeft > 0 && window.vsTimeLeft % 5 === 0) {
            const diff = window.VS_DIFFICULTIES[window.selectedVsDiffKey];
            window.rivalVsPoints += Math.round(diff.points * 0.8);
            window.vsUpdateScores();
        }

        if (window.vsTimeLeft <= 0) {
            if (typeof finishVsBattle === "function") finishVsBattle();
        }
    }, 1000);
};

window.finishVsBattle = function() {
    if (!window.vsSessionActive) return;
    if (typeof stopVsSession === "function") stopVsSession();

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

        alert(`🏆 ¡VICTORIA EN DUELO 1V1!\nHas derrotado a ${diff.name}.\n\nPuntuación: Tú ${window.myVsPoints} PTS vs IA ${window.rivalVsPoints} PTS\nRecompensa: +${earnedXp} XP ⚡`);
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    } else {
        if (typeof triggerHaptic === "function") triggerHaptic("error");

        const arena = document.getElementById("vsBattleArenaContainer");
        const defeat = document.getElementById("vsDefeatScreen");
        const scores = document.getElementById("vsDefeatScores");

        if (arena) arena.style.setProperty("display", "none", "important");
        if (defeat) defeat.style.setProperty("display", "block", "important");

        const avatar = document.getElementById("vsDefeatRivalAvatar");
        if (avatar) {
            avatar.textContent = window.selectedVsDiffKey === "HARD" ? "⚡" : "🤖";
        }

        if (scores) {
            scores.textContent = `Tú: ${window.myVsPoints} PTS vs ${diff.name}: ${window.rivalVsPoints} PTS`;
        }
    }
};

window.stopVsSession = function() {
    window.vsSessionActive = false;
    if (window.vsTimer) {
        clearInterval(window.vsTimer);
        window.vsTimer = null;
    }
};

})();
