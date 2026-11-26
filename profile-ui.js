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
        const liveUser = (typeof window.getZidongUserData === "function" && window.getZidongUserData()) || window.currentUserData;
        if (window.OBERON_PROGRESSION && liveUser) return window.OBERON_PROGRESSION.getRank(liveUser);
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
            const requirements = window.OBERON_PROGRESSION
                ? window.OBERON_PROGRESSION.getRequirements(ud, r)
                : [{ label: "XP", have: ud.xp || 0, need: r.minXp, ok: (ud.xp || 0) >= r.minXp }];
            const isPassed = requirements.every(item => item.ok);
            const missing = requirements.filter(item => !item.ok);

            const card = document.createElement("div");
            card.style.background = isCurrent ? "rgba(0,245,155,0.12)" : "var(--surface)";
            card.style.border = isCurrent ? "1.5px solid var(--green)" : "1px solid var(--border)";
            card.style.borderRadius = "14px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.justifyContent = "space-between";
            card.style.alignItems = "center";

            const requirementHtml = requirements.map(item => `
                <div style="display:flex;justify-content:space-between;gap:8px;font-size:9px;color:${item.ok ? 'var(--green)' : 'var(--muted)'};margin-top:4px;">
                    <span>${item.ok ? '✓' : '○'} ${item.label}</span><strong>${item.have}${item.unit ? ' ' + item.unit : ''} / ${item.need}</strong>
                </div>`).join("");
            card.innerHTML = `
                <div style="flex:1;min-width:0;">
                    <span style="font-size:9px; color:${isCurrent ? "var(--green)" : "var(--muted)"}; font-weight:800; display:block;">${r.icon || '🛰️'} RANGO 0${r.level}</span>
                    <h4 style="color:#fff; font-size:13px; margin-top:2px;">${r.name}</h4>
                    <small style="font-size:10px; color:var(--muted);">${r.desc || ''}</small>
                    <div style="margin-top:7px;padding-top:5px;border-top:1px solid var(--border);">${requirementHtml}</div>
                    ${isCurrent ? '<small style="display:block;color:var(--green);font-weight:800;margin-top:7px;">RANGO ACTUAL · CERTIFICADO</small>' : ''}
                </div>
                <span style="font-size:10px;white-space:nowrap;font-weight:800;color:${isPassed ? "var(--green)" : "var(--muted)"};">${isPassed ? "✓ CERTIFICADO" : "🔒 PENDIENTE"}</span>
            `;
            container.appendChild(card);
        });
    }

    function renderProfileDossier(ud, rank) {
        const xp = Number(ud.xp) || 0;
        const next = (window.OBERON_PROGRESSION?.ranks || getLadder()).find(r => r.level === rank.level + 1);
        const checks = next && window.OBERON_PROGRESSION ? window.OBERON_PROGRESSION.getRequirements(ud, next) : [];
        const pct = next && checks.length ? Math.round(checks.reduce((sum, item) => sum + (item.need > 0 ? Math.min(1, item.have / item.need) : 1), 0) / checks.length * 100) : 100;
        const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
        set('profileXpValue', `${xp.toLocaleString()} XP`);
        set('profileNextRankLabel', next ? `Siguiente rango: ${next.name}` : 'Rango máximo alcanzado');
        set('profileRankProgressText', next ? `${pct}% de preparación` : '100% · Trayectoria completa');
        set('profileXpRemaining', next ? `${Math.max(0, next.minXp - xp).toLocaleString()} XP para requisito` : 'Sin siguiente rango');
        set('profileIdCode', `ID-${String((ud.id || ud.userId || 1)).replace(/[^0-9]/g,'').slice(-6).padStart(6,'0')}`);
        const fill = document.getElementById('profileRankProgressFill'); if (fill) fill.style.width = `${pct}%`;

        const specialties = document.getElementById('profileSpecialtiesList');
        if (specialties) {
            specialties.replaceChildren();
            getWorldsList().forEach(w => {
                const card = document.createElement('div');
                card.className = 'profile-specialty-card pending';
                const title = w.title || w.name || 'Especialidad';
                card.innerHTML = `<div class="profile-specialty-top"><span>${w.icon || '🌐'} ${title}</span><b>EN EVALUACIÓN</b></div><div class="profile-mini-track"><i style="width:0%"></i></div><small>Dominio pendiente de una evaluación específica. El avance del mundo se consulta en la sección Mundos.</small>`;
                specialties.appendChild(card);
            });
        }

        const certList = document.getElementById('profileCertificationsList');
        if (certList) {
            certList.replaceChildren();
            const records = window.OBERON_CERTIFICATION_ENGINE?.getAll?.() || {};
            const certRanks = window.OBERON_CERTIFICATION_DATA?.ranks || [];
            let count = 0;
            certRanks.filter(r => r.level > 1).forEach(r => {
                const rec = records[String(r.level)]; if (!rec || rec.passed !== true) return;
                count++;
                const row = document.createElement('div'); row.className = 'profile-record-row'; row.style.cssText = 'display:flex;align-items:center;gap:9px;padding:9px;border:1px solid var(--border);border-radius:10px;background:var(--surface-light);';
                const date = rec.date ? new Date(rec.date).toLocaleDateString('es-MX') : 'Fecha no disponible';
                row.innerHTML = `<span class="profile-record-icon">${r.icon || '🏅'}</span><div><b>${r.name}</b><small>Certificación aprobada · ${date}</small></div><strong>${rec.score ?? '—'}%</strong>`;
                certList.appendChild(row);
            });
            if (!count) certList.innerHTML = '<div style="padding:10px;border:1px dashed var(--border);border-radius:10px;color:var(--muted);font-size:10px;line-height:1.5;text-align:center;">Aún no hay certificaciones obtenidas. Tu primer ascenso certificado aparecerá aquí.</div>'; 
            set('profileRankPos', String(count));
        }

        const missionList = document.getElementById('profileMissionRecent');
        if (missionList) {
            missionList.replaceChildren();
            const snap = window.OBERON_MISSIONS?.getSnapshot?.();
            const all = snap ? [...snap.daily, ...snap.academy, ...snap.weekly] : [];
            const claimed = all.filter(m => m.claimed);
            set('profileMissionsClaimed', String(claimed.length));
            set('profileMissionXp', `${claimed.reduce((sum,m) => sum + (Number(m.xp)||0),0)} XP`);
            if (!claimed.length) missionList.innerHTML = '<div style="padding:10px;border:1px dashed var(--border);border-radius:10px;color:var(--muted);font-size:10px;line-height:1.5;text-align:center;">Todavía no has reclamado misiones en este ciclo. ¡Tus próximas operaciones aparecerán aquí!</div>'; 
            else claimed.slice(0,4).forEach(m => { const row=document.createElement('div'); row.className='profile-record-row'; row.style.cssText='display:flex;align-items:center;gap:9px;padding:9px;border:1px solid var(--border);border-radius:10px;background:var(--surface-light);'; row.innerHTML=`<span class="profile-record-icon">${m.icon || '🎯'}</span><div><b>${m.title}</b><small>Misión recompensada</small></div><strong>+${m.xp} XP</strong>`; missionList.appendChild(row); });
        }
    }

    window.switchProfileSection = function(section) {
        document.querySelectorAll('[data-profile-section]').forEach(panel => {
            panel.hidden = panel.getAttribute('data-profile-section') !== section;
        });
        document.querySelectorAll('[data-profile-tab]').forEach(button => {
            const active = button.getAttribute('data-profile-tab') === section;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic('light');
    };

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
        if (window.OBERON_PROGRESSION) window.OBERON_PROGRESSION.save(ud);

        const ladder = getLadder();
        const rank = window.OBERON_PROGRESSION ? window.OBERON_PROGRESSION.getRank(ud) : getRank(ud.xp || 0);
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
        if (nextRank && window.OBERON_PROGRESSION) {
            const checks = window.OBERON_PROGRESSION.getRequirements(ud, nextRank);
            const ratios = checks.map(item => item.need > 0 ? Math.min(1, item.have / item.need) : 1);
            pct = Math.round((ratios.reduce((sum, value) => sum + value, 0) / Math.max(1, ratios.length)) * 100);
        } else if (nextRank) {
            const span = nextRank.minXp - rank.minXp;
            pct = Math.min(100, Math.max(0, Math.round((((ud.xp || 0) - rank.minXp) / Math.max(1, span)) * 100)));
        }
        if (batteryFill) {
            batteryFill.style.width = `${pct}%`;
            batteryFill.style.background = "var(--green, #00f59b)";
            batteryFill.style.height = "100%";
        }
        if (batteryPct) batteryPct.textContent = nextRank ? `${pct}% preparación` : "Rango máximo";

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
        if (profileRankBadge) profileRankBadge.textContent = `${rank.icon || '⚡'} ${rank.name}`;
        if (profileLevel) profileLevel.textContent = `0${rank.level}`;
        if (profileStreak) profileStreak.textContent = `${ud.streak || 0} Días`;
        if (profileCompleted) profileCompleted.textContent = (ud.completedActivities || []).length;

        renderProfileDossier(ud, rank);
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
