/* ==========================================================================
   ZIDONG CORE - PROFILE UI MODULE (RESILIENT)
   Renderizado de perfil, medallas, logros, progreso de mundos y escalafón.
   ========================================================================== */

(() => {
    "use strict";

    const DEFAULT_RANKS = [
        { level: 1, name: "Becario de Planta", minXp: 0 },
        { level: 2, name: "Operador Junior", minXp: 300 },
        { level: 3, name: "Técnico de Ensamble", minXp: 750 },
        { level: 4, name: "Técnico Especialista", minXp: 1400 },
        { level: 5, name: "Ingeniero de Automatización", minXp: 2200 },
        { level: 6, name: "Líder Técnico CFT", minXp: 3200 }
    ];

    const DEFAULT_WORLDS = [
        { id: "world_1", title: "MUNDO ELÉCTRICO", icon: "⚡", color: "#00f59b", boss: { badgeName: "Maestro VFD Delta" }, activities: [{ id: "w1_a1" }, { id: "w1_a2" }, { id: "w1_a3" }, { id: "w1_a4" }, { id: "w1_a5" }, { id: "w1_a6" }] },
        { id: "world_2", title: "MUNDO MECÁNICO", icon: "⚙️", color: "#00e5ff", boss: { badgeName: "Especialista Versaflow" }, activities: [{ id: "w2_a1" }, { id: "w2_a2" }, { id: "w2_a3" }, { id: "w2_a4" }] },
        { id: "world_3", title: "MUNDO NEUMÁTICO", icon: "💨", color: "#ffaa00", boss: { badgeName: "Ingeniero Neumático SMC" }, activities: [{ id: "w3_a1" }, { id: "w3_a2" }, { id: "w3_a3" }, { id: "w3_a4" }] },
        { id: "world_4", title: "MUNDO ROBÓTICA", icon: "🤖", color: "#ff4444", boss: { badgeName: "Maestro Kuka-Fanuc" }, activities: [{ id: "w4_a1" }, { id: "w4_a2" }, { id: "w4_a3" }, { id: "w4_a4" }] },
        { id: "world_5", title: "MUNDO CALIDAD", icon: "📊", color: "#a855f7", boss: { badgeName: "Auditor Six Sigma" }, activities: [{ id: "w5_a1" }, { id: "w5_a2" }, { id: "w5_a3" }, { id: "w5_a4" }] }
    ];

    function getUser() {
        if (typeof window.getZidongUserData === "function") {
            const u = window.getZidongUserData();
            if (u) return u;
        }
        return {
            name: localStorage.getItem("zidong_user_name") || "New user",
            nameLocked: localStorage.getItem("zidong_name_locked") === "1",
            xp: 1850,
            streak: 5,
            completedActivities: ["w1_a1", "w1_a2", "w1_a3", "w1_a4", "w2_a1", "w2_a2", "w2_a3", "w2_a4"],
            selectedAvatar: "⚡"
        };
    }

    function getLadder() {
        if (Array.isArray(window.ZIDONG_RANKS_LADDER) && window.ZIDONG_RANKS_LADDER.length > 0) {
            return window.ZIDONG_RANKS_LADDER;
        }
        return DEFAULT_RANKS;
    }

    function getRank(xp) {
        if (typeof window.calculateUserRank === "function") {
            return window.calculateUserRank(xp);
        }
        const ladder = getLadder();
        let current = ladder[0];
        for (const r of ladder) {
            if ((xp || 0) >= r.minXp) current = r;
        }
        return current;
    }

    function getWorldsList() {
        if (Array.isArray(window.ZIDONG_WORLDS_CONFIG) && window.ZIDONG_WORLDS_CONFIG.length > 0) {
            return window.ZIDONG_WORLDS_CONFIG;
        }
        return DEFAULT_WORLDS;
    }

    function buildMedals(ud) {
        if (typeof window.getProfileMedals === "function") {
            const m = window.getProfileMedals(ud);
            if (Array.isArray(m) && m.length > 0) return m;
        }
        const completed = Array.isArray(ud.completedActivities) ? ud.completedActivities : [];
        const worlds = getWorldsList();
        const list = worlds.map(w => {
            const acts = Array.isArray(w.activities) ? w.activities : [];
            const lastAct = acts.length > 0 ? acts[acts.length - 1] : null;
            return {
                id: w.id,
                icon: w.icon,
                name: w.boss?.badgeName || w.title,
                unlocked: lastAct ? completed.includes(lastAct.id) : false,
                lockedMsg: "Esta medalla aún está bloqueada. ¡Supera el checkpoint del mundo para desbloquearla!"
            };
        });
        const swapUnlocked = Number(localStorage.getItem("zidong_swap_max_combo") || 0) >= 2
            || Number(localStorage.getItem("zidong_swap_cleared") || 0) >= 3;
        list.push({
            id: "medal_swap_architect",
            icon: "🧩",
            name: "Arquitecto del Puzzle",
            unlocked: swapUnlocked,
            lockedMsg: "Logra un combo x2+ o purga 3 palabras en Hanzi-Swap para desbloquearla."
        });
        return list;
    }

    function buildAchievements(ud) {
        if (typeof window.getPlantAchievements === "function") {
            const a = window.getPlantAchievements(ud, getRank);
            if (Array.isArray(a) && a.length > 0) return a;
        }
        const completed = Array.isArray(ud.completedActivities) ? ud.completedActivities : [];
        const worlds = getWorldsList();
        const w1Acts = (worlds[0] && Array.isArray(worlds[0].activities)) ? worlds[0].activities : [];
        const rankLevel = getRank(ud.xp || 0).level;
        return [
            { id: "b_first_step", icon: "🚀", name: "Primeros Pasos", desc: "Completa tu primera lección en cualquier mundo.", isUnlocked: () => completed.length >= 1 },
            { id: "b_volt_master", icon: "⚡", name: "Electricista Oberon", desc: "Domina todas las lecciones del Mundo Eléctrico.", isUnlocked: () => w1Acts.length > 0 && w1Acts.every(a => completed.includes(a.id)) },
            { id: "b_mechanic", icon: "⚙️", name: "Manos a la Máquina", desc: "Supera el checkpoint del Mundo Mecánico.", isUnlocked: () => completed.includes("w2_a4") },
            { id: "b_ai_slayer", icon: "⚔️", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
            { id: "b_survivor", icon: "⚠️", name: "Defensor del Núcleo", desc: "Retira con éxito al menos 5 alarmas en Survivor Mode.", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_cleared") || 0) >= 5 },
            { id: "b_polyglot", icon: "🧠", name: "Soporte Bilingüe", desc: "Alcanza el Nivel 3 de rango o superior.", isUnlocked: () => rankLevel >= 3 },
            { id: "b_swap_combo", icon: "🧩", name: "Pulso de Rejilla x2", desc: "Alcanza al menos un combo x2 o superior en Hanzi-Swap.", isUnlocked: () => Number(localStorage.getItem("zidong_swap_max_combo") || 0) >= 2 }
        ];
    }

    function renderBadgesGrid() {
        const ud = getUser();
        const container = document.getElementById("badgesContainer");
        const countLabel = document.getElementById("medalsCountLabel");
        if (!container || !ud) return;
        container.replaceChildren();

        const medals = buildMedals(ud);
        let unlockedCount = 0;

        medals.forEach(m => {
            if (m.unlocked) unlockedCount++;
            const isEquipped = ud.selectedAvatar === m.icon;

            const badgeEl = document.createElement("div");
            badgeEl.className = `profile-badge-item ${m.unlocked ? "unlocked" : "locked"}`;
            badgeEl.style.background = isEquipped ? "rgba(255, 200, 87, 0.15)" : "var(--surface-light)";
            badgeEl.style.border = isEquipped ? "1px solid var(--gold)" : "1px solid var(--border)";
            badgeEl.style.borderRadius = "10px";
            badgeEl.style.padding = "10px 6px";
            badgeEl.style.textAlign = "center";
            badgeEl.style.cursor = m.unlocked ? "pointer" : "default";

            badgeEl.innerHTML = `
                <div style="font-size:24px; display:block; margin-bottom:4px; filter:${m.unlocked ? "none" : "grayscale(100%) opacity(0.4)"};">${m.unlocked ? m.icon : "🔒"}</div>
                <span style="font-size:8px; color:#fff; font-weight:700; display:block; line-height:1.2;">${m.name}</span>
                ${isEquipped ? '<small style="color:var(--gold); font-size:7px; font-weight:900; display:block; margin-top:2px;">EN USO ⚡</small>' : ""}
            `;

            badgeEl.onclick = () => {
                if (m.unlocked) {
                    ud.selectedAvatar = m.icon;
                    if (typeof window.triggerHaptic === "function") window.triggerHaptic("win");
                    window.updateProfile();
                    if (typeof window.showCyberAlert === "function") {
                        window.showCyberAlert("MEDALLA EQUIPADA", `¡Has equipado la medalla ${m.icon} (${m.name}) como tu imagen de perfil!`, "✨");
                    }
                } else {
                    if (typeof window.triggerHaptic === "function") window.triggerHaptic("error");
                    if (typeof window.showCyberAlert === "function") {
                        window.showCyberAlert("ACCESO DENEGADO", m.lockedMsg || "Esta medalla aún está bloqueada.", "🔒");
                    }
                }
            };

            container.appendChild(badgeEl);
        });

        if (countLabel) countLabel.textContent = `${unlockedCount} / ${medals.length} Desbloqueadas`;
    }

    function renderAchievementsList() {
        const ud = getUser();
        const container = document.getElementById("profileAchievementsList");
        const countLabel = document.getElementById("achievementsCountLabel");
        if (!container || !ud) return;
        container.replaceChildren();

        const achievements = buildAchievements(ud);
        let unlockedCount = 0;

        achievements.forEach(ach => {
            const ok = Boolean(ach.isUnlocked && ach.isUnlocked());
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
                <span style="font-size:20px; filter:${ok ? "none" : "grayscale(100%) opacity(0.4)"};">${ach.icon}</span>
                <div style="flex:1;">
                    <strong style="font-size:11.5px; color:${ok ? "#00f59b" : "var(--muted)"}; display:block;">${ach.name}</strong>
                    <small style="font-size:9.5px; color:#fff; display:block; margin-top:1px;">${ach.desc}</small>
                </div>
                <span style="font-size:10px; font-weight:800; color:${ok ? "var(--green)" : "var(--muted)"};">${ok ? "✓" : "🔒"}</span>
            `;
            container.appendChild(item);
        });

        if (countLabel) countLabel.textContent = `${unlockedCount} / ${achievements.length} Desbloqueados`;
    }

    function renderWorldsProgressInProfile() {
        const ud = getUser();
        const container = document.getElementById("profileWorldsProgressList");
        if (!container || !ud) return;
        container.replaceChildren();

        const completed = Array.isArray(ud.completedActivities) ? ud.completedActivities : [];
        getWorldsList().forEach(w => {
            const acts = Array.isArray(w.activities) ? w.activities : [];
            const total = acts.length;
            const done = acts.filter(a => completed.includes(a.id)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

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
        const ud = getUser();
        const container = document.getElementById("ranksLadderContainer");
        if (!container || !ud) return;
        container.replaceChildren();

        const ladder = getLadder();
        const currentRank = getRank(ud.xp || 0);

        ladder.forEach(r => {
            const isCurrent = r.level === currentRank.level;
            const isPassed = (ud.xp || 0) >= r.minXp;

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
                    <span style="font-size:9px; color:${isCurrent ? "var(--green)" : "var(--muted)"}; font-weight:800; display:block;">NIVEL 0${r.level}</span>
                    <h4 style="color:#fff; font-size:13px; margin-top:2px;">${r.name}</h4>
                    <small style="font-size:10px; color:var(--muted);">${r.minXp.toLocaleString()} XP requeridos</small>
                </div>
                <span style="font-size:14px; font-weight:800; color:${isPassed ? "var(--green)" : "var(--muted)"};">${isPassed ? "✓ ALCANZADO" : "🔒 BLOQUEADO"}</span>
            `;
            container.appendChild(card);
        });
    }

    function renderProfileSections() {
        renderBadgesGrid();
        renderAchievementsList();
        renderWorldsProgressInProfile();
        renderRanksLadder();
    }

    window.renderProfileSections = renderProfileSections;

    window.updateProfile = function() {
        const ud = getUser();
        if (!ud) return;

        const ladder = getLadder();
        const rank = getRank(ud.xp || 0);
        ud.level = rank.level;

        const topUser = document.getElementById("topUsername");
        const topAvatar = document.getElementById("topAvatar");
        const topRank = document.getElementById("topRankBadge");
        const batteryFill = document.getElementById("homeBatteryFill");
        const batteryXp = document.getElementById("homeBatteryXpValue");
        const batteryRank = document.getElementById("homeBatteryRank");
        const batteryPct = document.getElementById("homeBatteryPercent");

        if (topUser) topUser.textContent = ud.name;
        if (topAvatar) {
            if (ud.selectedAvatar) {
                topAvatar.textContent = ud.selectedAvatar;
                topAvatar.style.fontSize = "16px";
            } else {
                topAvatar.textContent = ud.name.slice(0, 2).toUpperCase();
                topAvatar.style.fontSize = "11px";
            }
        }
        if (topRank) topRank.textContent = `⚡ ${rank.name}`;

        if (batteryXp) batteryXp.textContent = `${(ud.xp || 0).toLocaleString()} XP`;
        if (batteryRank) batteryRank.textContent = `Rango 0${rank.level}: ${rank.name}`;

        const nextRank = ladder.find(r => r.level === rank.level + 1);
        let pct = 100;
        if (nextRank) {
            const prevXp = rank.minXp;
            const span = nextRank.minXp - prevXp;
            const cur = (ud.xp || 0) - prevXp;
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

        if (profileName) profileName.textContent = ud.name;
        if (profileAvatar) {
            if (ud.selectedAvatar) {
                profileAvatar.textContent = ud.selectedAvatar;
                profileAvatar.style.fontSize = "32px";
            } else {
                profileAvatar.textContent = ud.name.slice(0, 2).toUpperCase();
                profileAvatar.style.fontSize = "24px";
            }
        }
        if (profileRankBadge) profileRankBadge.textContent = `⚡ ${rank.name}`;
        if (profileLevel) profileLevel.textContent = `0${rank.level}`;
        if (profileStreak) profileStreak.textContent = `${ud.streak || 0} Días`;
        if (profileCompleted) profileCompleted.textContent = (ud.completedActivities || []).length;

        renderProfileSections();

        const noticeEl = document.getElementById("nameEditNotice");
        if (noticeEl) {
            const isLocked = ud.nameLocked || localStorage.getItem("zidong_name_locked") === "1";
            if (isLocked) {
                noticeEl.innerHTML = `🔒 Nombre registrado permanentemente: <strong style="color:var(--green);">${ud.name}</strong> (1 sola vez)`;
            } else {
                noticeEl.innerHTML = `✏️ Toca aquí para editar nombre <strong style="color:#ffaa00;">(1 sola vez)</strong>`;
            }
        }
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
    };

    window.renderBadgesGrid = renderBadgesGrid;

    window.switchProfileTab = function(tabName) {
        const btnAch = document.getElementById("tabBtnAchievements");
        const btnMed = document.getElementById("tabBtnMedals");
        const contentAch = document.getElementById("tabContentAchievements");
        const contentMed = document.getElementById("tabContentMedals");

        if (!btnAch || !btnMed || !contentAch || !contentMed) return;

        if (tabName === "achievements") {
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
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            if (typeof window.updateProfile === "function") window.updateProfile();
        });
    } else {
        setTimeout(() => {
            if (typeof window.updateProfile === "function") window.updateProfile();
        }, 0);
    }
})();
