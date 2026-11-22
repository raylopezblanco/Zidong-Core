/* ==========================================================================
   ZIDONG CORE - PROFILE UI MODULE
   Renderizado de perfil, medallas, logros, progreso de mundos y escalafón.
   ========================================================================== */

(() => {
    "use strict";

    function getUser() {
        if (typeof window.getZidongUserData === "function") return window.getZidongUserData();
        return null;
    }

    function getRank(xp) {
        if (typeof window.calculateUserRank === "function") return window.calculateUserRank(xp);
        return { level: 1, name: "Becario de Planta", minXp: 0 };
    }

    function getLadder() {
        return Array.isArray(window.ZIDONG_RANKS_LADDER) ? window.ZIDONG_RANKS_LADDER : [];
    }

    function renderBadgesGrid() {
        const ud = getUser();
        const container = document.getElementById("badgesContainer");
        const countLabel = document.getElementById("medalsCountLabel");
        if (!container || !ud) return;
        container.replaceChildren();

        const medals = typeof window.getProfileMedals === "function" ? window.getProfileMedals(ud) : [];
        let unlockedCount = 0;

        medals.forEach(m => {
            if (m.unlocked) unlockedCount++;
            const isEquipped = ud.selectedAvatar === m.icon;

            const badgeEl = document.createElement("div");
            badgeEl.className = `profile-badge-item ${m.unlocked ? "unlocked" : "locked"}`;
            badgeEl.style.background = "var(--surface-light)";
            badgeEl.style.border = isEquipped ? "1px solid var(--gold)" : "1px solid var(--border)";
            if (isEquipped) badgeEl.style.background = "rgba(255, 200, 87, 0.15)";
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

        const achievements = typeof window.getPlantAchievements === "function"
            ? window.getPlantAchievements(ud, getRank)
            : [];

        let unlockedCount = 0;
        achievements.forEach(ach => {
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
        (window.ZIDONG_WORLDS_CONFIG || []).forEach(w => {
            const total = w.activities.length;
            const done = w.activities.filter(a => completed.includes(a.id)).length;
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

        renderBadgesGrid();
        renderAchievementsList();
        renderWorldsProgressInProfile();
        renderRanksLadder();

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
