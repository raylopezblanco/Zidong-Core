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

    window.showCyberAlert = function(title, message, icon = "⚡") {
        const modal = document.getElementById("cyberAlertModal");
        const titleEl = document.getElementById("cyberAlertTitle");
        const msgEl = document.getElementById("cyberAlertMsg");
        const iconEl = document.getElementById("cyberAlertIcon");
        if (modal && titleEl && msgEl) {
            if (iconEl) iconEl.textContent = icon;
            titleEl.textContent = title;
            msgEl.textContent = message;
            modal.style.display = "flex";
        } else {
            alert(`${title}\n\n${message}`);
        }
    };

    window.closeCyberAlert = function() {
        const modal = document.getElementById("cyberAlertModal");
        if (modal) modal.style.display = "none";
    };

    window.speakMandarin = function(text) {
        if (!text) return;
        try {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = "zh-CN";
                u.rate = 0.88;
                window.speechSynthesis.speak(u);
            }
        } catch (e) {}
        if (window.ZidongAudio && typeof window.ZidongAudio.playPlanetChime === "function") {
            window.ZidongAudio.playPlanetChime();
        }
    };


    let currentUserData = {
        name: "New user",
        xp: 1850,
        streak: 5,
        completedActivities: ["w1_a1", "w1_a2", "w1_a3", "w1_a4", "w2_a1", "w2_a2", "w2_a3", "w2_a4"],
        unlockedWorlds: ["world_1", "world_2", "world_3", "world_4", "world_5"],
        unlockedBadges: ["badge_starter", "badge_volt", "badge_sensor"],
        selectedAvatar: "⚡",
        phaseStars: {},
        completedReviews: [],
        swapMaxCombo: Number(localStorage.getItem("zidong_swap_max_combo") || 0),
        swapCleared: Number(localStorage.getItem("zidong_swap_cleared") || 0)
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
        { id: "b_polyglot", icon: "🧠", name: "Soporte Bilingüe", desc: "Alcanza el Nivel 3 de rango o superior.", isUnlocked: () => calculateUserRank(currentUserData.xp).level >= 3 },
        { id: "b_swap_combo", icon: "🧩", name: "Pulso de Rejilla x2", desc: "Alcanza al menos un combo x2 o superior en Hanzi-Swap.", isUnlocked: () => Number(localStorage.getItem("zidong_swap_max_combo") || 0) >= 2 }
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
        if (topAvatar) {
            if (currentUserData.selectedAvatar) {
                topAvatar.textContent = currentUserData.selectedAvatar;
                topAvatar.style.fontSize = "16px";
            } else {
                topAvatar.textContent = currentUserData.name.slice(0, 2).toUpperCase();
                topAvatar.style.fontSize = "11px";
            }
        }
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
        if (batteryFill) {
            batteryFill.style.width = `${pct}%`;
            batteryFill.style.background = "var(--green, #00f59b)";
            batteryFill.style.height = "100%";
        }
        if (batteryPct) batteryPct.textContent = `${pct}% carga`;

        const profileName = document.getElementById("profileName");
        const profileAvatar = document.getElementById("profileAvatar");
        const profileRankBadge = document.getElementById("profileRankBadge");
        const profileLevel = document.getElementById("profileLevel");
        const profileStreak = document.getElementById("profileStreak");
        const profileCompleted = document.getElementById("profileCompleted");

        if (profileName) profileName.textContent = currentUserData.name;
        if (profileAvatar) {
            if (currentUserData.selectedAvatar) {
                profileAvatar.textContent = currentUserData.selectedAvatar;
                profileAvatar.style.fontSize = "32px";
            } else {
                profileAvatar.textContent = currentUserData.name.slice(0, 2).toUpperCase();
                profileAvatar.style.fontSize = "24px";
            }
        }
        if (profileRankBadge) profileRankBadge.textContent = `⚡ ${rank.name}`;
        if (profileLevel) profileLevel.textContent = `0${rank.level}`;
        if (profileStreak) profileStreak.textContent = `${currentUserData.streak} Días`;
        if (profileCompleted) profileCompleted.textContent = currentUserData.completedActivities.length;

        renderBadgesGrid();
        renderAchievementsList();
        renderWorldsProgressInProfile();
        renderRanksLadder();
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
    }
    window.updateProfile = updateProfile;

    window.refreshDailyRewardFloat = function() {
        const badge = document.getElementById("dailyFloatNotification");
        if (!badge) return;
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        const alreadyClaimed = (lastClaim === today);
        badge.style.display = alreadyClaimed ? "none" : "flex";
    };


    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        const countLabel = document.getElementById("medalsCountLabel");
        if (!container) return;
        container.replaceChildren();

        let unlockedCount = 0;
        WORLDS_CONFIG.forEach(w => {
            const isUnlocked = currentUserData.completedActivities.includes(w.activities[w.activities.length - 1].id);
            if (isUnlocked) unlockedCount++;

            const badgeEl = document.createElement("div");
            badgeEl.className = `profile-badge-item ${isUnlocked ? "unlocked" : "locked"}`;
            badgeEl.style.background = "var(--surface-light)";
            badgeEl.style.border = "1px solid var(--border)";
            badgeEl.style.borderRadius = "10px";
            badgeEl.style.padding = "10px 6px";
            badgeEl.style.textAlign = "center";
            badgeEl.style.cursor = isUnlocked ? "pointer" : "default";

            const isEquipped = currentUserData.selectedAvatar === w.icon;
            if (isEquipped) {
                badgeEl.style.borderColor = "var(--gold)";
                badgeEl.style.background = "rgba(255, 200, 87, 0.15)";
            }

            badgeEl.innerHTML = `
                <div style="font-size:24px; display:block; margin-bottom:4px; filter:${isUnlocked ? 'none' : 'grayscale(100%) opacity(0.4)'};">${isUnlocked ? w.icon : "🔒"}</div>
                <span style="font-size:8px; color:#fff; font-weight:700; display:block; line-height:1.2;">${w.boss.badgeName}</span>
                ${isEquipped ? '<small style="color:var(--gold); font-size:7px; font-weight:900; display:block; margin-top:2px;">EN USO ⚡</small>' : ''}
            `;

            badgeEl.onclick = () => {
                if (isUnlocked) {
                    currentUserData.selectedAvatar = w.icon;
                    if (typeof triggerHaptic === "function") triggerHaptic("win");
                    updateProfile();
                    window.showCyberAlert("MEDALLA EQUIPADA", `¡Has equipado la medalla ${w.icon} (${w.boss.badgeName}) como tu imagen de perfil!`, "✨");
                } else {
                    if (typeof triggerHaptic === "function") triggerHaptic("error");
                    window.showCyberAlert("ACCESO DENEGADO", "Esta medalla aún está bloqueada. ¡Supera el checkpoint del mundo para desbloquearla!", "🔒");
                }
            };

            container.appendChild(badgeEl);
        });

        const swapUnlocked = Number(localStorage.getItem("zidong_swap_max_combo") || 0) >= 2 || Number(localStorage.getItem("zidong_swap_cleared") || 0) >= 3;
        if (swapUnlocked) unlockedCount++;
        const swapEquipped = currentUserData.selectedAvatar === "🧩";
        const swapBadge = document.createElement("div");
        swapBadge.className = `profile-badge-item ${swapUnlocked ? "unlocked" : "locked"}`;
        swapBadge.style.background = "var(--surface-light)";
        swapBadge.style.border = swapEquipped ? "1px solid var(--gold)" : "1px solid var(--border)";
        if (swapEquipped) swapBadge.style.background = "rgba(255, 200, 87, 0.15)";
        swapBadge.style.borderRadius = "10px";
        swapBadge.style.padding = "10px 6px";
        swapBadge.style.textAlign = "center";
        swapBadge.style.cursor = swapUnlocked ? "pointer" : "default";
        swapBadge.innerHTML = `
            <div style="font-size:24px; display:block; margin-bottom:4px; filter:${swapUnlocked ? 'none' : 'grayscale(100%) opacity(0.4)'};">${swapUnlocked ? "🧩" : "🔒"}</div>
            <span style="font-size:8px; color:#fff; font-weight:700; display:block; line-height:1.2;">Arquitecto del Puzzle</span>
            ${swapEquipped ? '<small style="color:var(--gold); font-size:7px; font-weight:900; display:block; margin-top:2px;">EN USO ⚡</small>' : ''}
        `;
        swapBadge.onclick = () => {
            if (swapUnlocked) {
                currentUserData.selectedAvatar = "🧩";
                if (typeof triggerHaptic === "function") triggerHaptic("win");
                updateProfile();
                window.showCyberAlert("MEDALLA EQUIPADA", "¡Has equipado la medalla 🧩 (Arquitecto del Puzzle)!", "✨");
            } else {
                if (typeof triggerHaptic === "function") triggerHaptic("error");
                window.showCyberAlert("MEDALLA BLOQUEADA", "Logra un combo x2+ o purga 3 palabras en Hanzi-Swap para desbloquearla.", "🔒");
            }
        };
        container.appendChild(swapBadge);

        if (countLabel) countLabel.textContent = `${unlockedCount} / ${WORLDS_CONFIG.length + 1} Desbloqueadas`;
    }

    window.toggleProfileMenu = function(contentId, arrowId) {
        const content = document.getElementById(contentId);
        const arrow = document.getElementById(arrowId);
        if (content) {
            const isHidden = content.style.display === "none" || content.style.display === "";
            content.style.display = isHidden ? "block" : "none";
            if (arrow) {
                arrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
            }
            if (typeof triggerHaptic === "function") triggerHaptic("success");
        }
    };

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

    let pendingNameValue = "";

    window.editUserNameOnce = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        const modal = document.getElementById("editNameModal");
        const step1 = document.getElementById("editNameStep1");
        const step2 = document.getElementById("editNameStep2");
        const input = document.getElementById("editNameInput");

        pendingNameValue = "";
        if (step1) step1.style.display = "block";
        if (step2) step2.style.display = "none";
        if (input) input.value = currentUserData.name === "New user" ? "" : currentUserData.name;

        if (modal) {
            modal.style.display = "flex";
            if (input) setTimeout(() => { try { input.focus(); } catch (err) {} }, 40);
        }
    };

    window.closeEditNameModal = function() {
        const modal = document.getElementById("editNameModal");
        const step1 = document.getElementById("editNameStep1");
        const step2 = document.getElementById("editNameStep2");
        if (step1) step1.style.display = "block";
        if (step2) step2.style.display = "none";
        if (modal) modal.style.display = "none";
        pendingNameValue = "";
    };

    window.toggleEditNameModal = window.closeEditNameModal;

    window.askConfirmUserName = function() {
        const input = document.getElementById("editNameInput");
        const typed = input ? input.value.trim().slice(0, 20) : "";
        if (!typed) {
            if (typeof triggerHaptic === "function") triggerHaptic("error");
            window.showCyberAlert("ADVERTENCIA DE PLANTA", "Por favor escribe un nombre válido.", "⚠️");
            return;
        }
        pendingNameValue = typed;
        const step1 = document.getElementById("editNameStep1");
        const step2 = document.getElementById("editNameStep2");
        const preview = document.getElementById("confirmPreviewName");
        if (preview) preview.textContent = pendingNameValue;
        if (step1) step1.style.display = "none";
        if (step2) step2.style.display = "block";
        if (typeof triggerHaptic === "function") triggerHaptic("success");
    };

    window.confirmSaveNewUserName = function() {
        const finalName = pendingNameValue || (document.getElementById("editNameInput")?.value || "").trim().slice(0, 20);
        if (!finalName) {
            window.closeEditNameModal();
            return;
        }
        currentUserData.name = finalName;
        MOCK_LEADERBOARD.forEach(item => {
            if (item.isMe) {
                item.name = currentUserData.name;
            }
        });
        window.closeEditNameModal();
        updateProfile();
        if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
        if (typeof triggerHaptic === "function") triggerHaptic("win");
        window.showCyberAlert("SISTEMA ACTUALIZADO", `¡Tu nombre ahora es "${currentUserData.name}"!`, "✏️");
    };

    window.saveNewUserName = window.confirmSaveNewUserName;

    window.claimDailyReward = function() {
        if (typeof triggerHaptic === "function") {
            triggerHaptic("success");
        }
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        const btn = document.getElementById("btnClaimRewardAction");
        const desc = document.getElementById("rewardModalDesc");
        
        if (btn && desc) {
            if (lastClaim === today) {
                btn.textContent = "YA RECLAMADO HOY ✓";
                btn.style.opacity = "0.85";
                btn.style.pointerEvents = "auto";
                desc.textContent = "Ya has obtenido tu bono de energía de hoy. ¡Vuelve mañana!";
            } else {
                btn.textContent = "RECLAMAR +100 XP ⚡";
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto";
                desc.textContent = "¡Reclama tu energía diaria de turno y mantén tu racha!";
            }
        }
        window.toggleDailyRewardModal();
    };

    window.confirmClaimReward = function() {
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        if (lastClaim === today) {
            window.toggleDailyRewardModal();
            return;
        }
        if (typeof triggerHaptic === "function") {
            triggerHaptic("win");
        }
        currentUserData.xp += 100;
        localStorage.setItem("zidong_last_claim_date", today);
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
        updateProfile();
        window.toggleDailyRewardModal();
    };

    window.toggleDailyRewardModal = function() {
        const modal = document.getElementById("dailyRewardModal");
        if (modal) {
            modal.style.display = modal.style.display === "flex" ? "none" : "flex";
        }
    };

    window.closeRewardModal = function(e) {
        if (e.target.id === "dailyRewardModal" || e.target.classList.contains("modal-overlay")) {
            window.toggleDailyRewardModal();
        }
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

        const currentRankObj = calculateUserRank(currentUserData.xp);
        const rowsData = MOCK_LEADERBOARD.map(item => {
            if (item.isMe) {
                return Object.assign({}, item, {
                    name: currentUserData.name,
                    xp: currentUserData.xp,
                    badge: `⚡ Nivel ${currentRankObj.level}`
                });
            }
            return Object.assign({}, item);
        }).sort((a, b) => b.xp - a.xp).map((item, idx) => Object.assign({}, item, { rank: idx + 1 }));

        rowsData.forEach(item => {
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
        if (navigator.vibrate) navigator.vibrate(35);
        if (window.ZidongAudio && typeof window.ZidongAudio.playBark === "function") {
            window.ZidongAudio.playBark();
        }
        const bubble = document.getElementById("companionBubble");
        const textEl = document.getElementById("companionText");
        if (!bubble || !textEl) return;

        const randomPhrase = COMPANION_PHRASES[Math.floor(Math.random() * COMPANION_PHRASES.length)];
        textEl.textContent = randomPhrase;
        bubble.classList.add("bounce-pop");
        setTimeout(() => bubble.classList.remove("bounce-pop"), 400);
    };

    // CAREER PLANETS MENU RENDERING
    window.renderCareerPlanetsMenu = function renderCareerPlanetsMenu() {
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

    function getCareerStarState(actId) {
        if (!currentUserData.phaseStars) currentUserData.phaseStars = {};
        if (!currentUserData.phaseStars[actId]) {
            const done = currentUserData.completedActivities.includes(actId);
            currentUserData.phaseStars[actId] = { p1: done, p2: done, p3: done };
        }
        return currentUserData.phaseStars[actId];
    }

    function getCareerStarCount(actId) {
        const s = getCareerStarState(actId);
        return (s.p1 ? 1 : 0) + (s.p2 ? 1 : 0) + (s.p3 ? 1 : 0);
    }

    function grantCareerPhaseStar(actId, phaseNum) {
        const s = getCareerStarState(actId);
        if (phaseNum === 1) s.p1 = true;
        if (phaseNum === 2) s.p2 = true;
        if (phaseNum === 3) s.p3 = true;
        if (getCareerStarCount(actId) === 3 && !currentUserData.completedActivities.includes(actId)) {
            currentUserData.completedActivities.push(actId);
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
        if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");

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
                        triggerHaptic("success");
                        window.speakMandarin(act.hanzi);
                        openActivity(act, world);
                    };
                }
                stream.appendChild(card);

                canAdvance = stars >= 1;
            } else if (entry.type === "review") {
                if (!currentUserData.completedReviews) currentUserData.completedReviews = [];
                const revDone = currentUserData.completedReviews.includes(entry.id);
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
                        triggerHaptic("success");
                        startCareerReview(entry, world);
                    };
                }
                stream.appendChild(revCard);
                canAdvance = revDone || canAdvance;
            }
        });

        const allThreeStars = world.activities.every(a => getCareerStarCount(a.id) === 3);
        const bossDone = currentUserData.completedActivities.includes(world.boss.id);
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
                triggerHaptic("success");
                startBossCheckpoint(world);
            };
        } else {
            bossCard.onclick = () => {
                triggerHaptic("error");
                window.showCyberAlert(
                    "FINAL BOSS BLOQUEADO",
                    `Necesitas las 3 estrellas (⭐⭐⭐) en cada Hanzi de este mundo para enfrentar al Final Boss.\n\nLlevas ${earnedStars} de ${totalStars} estrellas.`,
                    "🔒"
                );
            };
        }
        stream.appendChild(bossCard);
    }

    function openActivity(act, world) {
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
            const distractors = vsShuffle([
                "Válvula de purga neumática",
                "Sensor óptico de presencia",
                "Indicador lumínico de estado",
                "Banda transportadora de retorno"
            ].filter(x => x !== act.meaning)).slice(0, 3);
            const choices = vsShuffle([act.meaning, ...distractors]);

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
                    triggerHaptic("success");
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
                        triggerHaptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 1);
                        setTimeout(renderPhase2, 500);
                    } else {
                        triggerHaptic("error");
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
            const distractors = vsShuffle([
                "bō qì", "gāng yā", "zhǎo qì", "wù cè", "fá lù", "cè guāng"
            ].filter(p => p !== act.pinyin)).slice(0, 3);
            const choices = vsShuffle([act.pinyin, ...distractors]);

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
                    triggerHaptic("success");
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
                        triggerHaptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 2);
                        setTimeout(renderPhase3, 500);
                    } else {
                        triggerHaptic("error");
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
                    triggerHaptic("success");
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
                        if (!currentUserData._xpGranted) currentUserData._xpGranted = [];
                        let bonus = 0;
                        if (!currentUserData._xpGranted.includes(act.id)) {
                            currentUserData._xpGranted.push(act.id);
                            currentUserData.xp += act.reward;
                            bonus = act.reward;
                        }
                        updateProfile();
                        triggerHaptic("win");
                        window.speakMandarin(act.hanzi);
                        setTimeout(() => {
                            window.showCyberAlert(
                                "¡3 ESTRELLAS OBTENIDAS! ⭐⭐⭐",
                                `Completaste las 3 fases de "${act.hanzi}" (${act.meaning})${bonus > 0 ? ` (+${bonus} XP)` : ""}.`,
                                "🌟"
                            );
                            if (world) openWorldDetails(world);
                        }, 450);
                    } else {
                        tok.classList.add("token-miss");
                        triggerHaptic("error");
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
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const pool = revItem.pool || [];
        const list = vsShuffle(pool).slice(0, Math.min(4, pool.length));
        let idx = 0;

        function nextReviewQ() {
            const target = list[idx];
            if (!target) {
                if (!currentUserData.completedReviews) currentUserData.completedReviews = [];
                if (!currentUserData.completedReviews.includes(revItem.id)) {
                    currentUserData.completedReviews.push(revItem.id);
                    currentUserData.xp += revItem.reward;
                    updateProfile();
                }
                triggerHaptic("win");
                window.showCyberAlert("REPASO COMPLETADO", `¡Superaste ${revItem.title}! (+${revItem.reward} XP)`, "🔁");
                if (world) openWorldDetails(world);
                return;
            }

            let locked = false;
            const others = pool.filter(p => p.id !== target.id).map(p => p.meaning);
            const extras = ["Sensor inductivo de proximidad", "Válvula de purga neumática", "Fuente de control 24V"];
            const opts = vsShuffle([target.meaning, ...others, ...extras]).slice(0, 4);

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
                        triggerHaptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        idx++;
                        setTimeout(nextReviewQ, 450);
                    } else {
                        triggerHaptic("error");
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
                        triggerHaptic("success");
                        window.speakMandarin(char);
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
                                window.showCyberAlert("CHECKPOINT DE LÍNEA", `¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`, "🏆");
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

window.VS_ABANDON_MESSAGES = {
    EASY: "¿Me has tenido miedo en Nivel 1? Sigue preparándote, renacuajo. 🐸⚡",
    MEDIUM: "¿Ya te rajaste en Nivel 2? Hasta un relevador aguanta más presión, renacuajo. 🐸🤖",
    HARD: "¿Huiste del Nivel 3? Sigue calibrando en la banca, renacuajo. 🐸🔥"
};

window.abandonVsBattle = function() {
    const levelKey = window.selectedVsDiffKey || "MEDIUM";
    window.stopVsSession();
    if (typeof triggerHaptic === "function") triggerHaptic("error");
    const msg = window.VS_ABANDON_MESSAGES[levelKey] || "¿Me has tenido miedo? Sigue preparándote, renacuajo. 🐸";
    if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    window.showCyberAlert("DUELO ABANDONADO", msg, "🐸");
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
    containerBox.style.gap = "8px";
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
    chipsGrid.style.gap = "7px";
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

    document.addEventListener("DOMContentLoaded", () => {
        updateProfile();
        renderCareerPlanetsMenu();
        renderLeaderboard();
        if (typeof window.renderLabComponents === "function") {
            window.renderLabComponents();
        }
        if (typeof window.refreshDailyRewardFloat === "function") {
            window.refreshDailyRewardFloat();
        }
        const unlockAudioOnce = () => {
            const activeSec = document.querySelector(".page.active");
            const pageId = activeSec ? activeSec.id : "dashboard";
            if (window.ZidongAudio && typeof window.ZidongAudio.syncTrackWithPage === "function") {
                window.ZidongAudio.syncTrackWithPage(pageId);
            }
            document.removeEventListener("pointerdown", unlockAudioOnce);
            document.removeEventListener("keydown", unlockAudioOnce);
        };
        document.addEventListener("pointerdown", unlockAudioOnce, { once: false });
        document.addEventListener("keydown", unlockAudioOnce, { once: false });
    });

})();

    window.switchProfileTab = function(tabName) {
        const btnAch = document.getElementById("tabBtnAchievements");
        const btnMed = document.getElementById("tabBtnMedals");
        const contentAch = document.getElementById("tabContentAchievements");
        const contentMed = document.getElementById("tabContentMedals");

        if (!btnAch || !btnMed || !contentAch || !contentMed) return;

        if (tabName === 'achievements') {
            btnAch.style.borderColor = "var(--green)";
            btnAch.style.color = "#fff";
            btnMed.style.borderColor = "var(--border)";
            btnMed.style.color = "var(--muted)";
            contentAch.style.display = "flex";
            contentMed.style.display = "none";
        } else {
            btnMed.style.borderColor = "var(--gold)";
            btnMed.style.color = "#fff";
            btnAch.style.borderColor = "var(--border)";
            btnAch.style.color = "var(--muted)";
            contentMed.style.display = "flex";
            contentAch.style.display = "none";
        }
        if (typeof triggerHaptic === "function") triggerHaptic("success");
    };