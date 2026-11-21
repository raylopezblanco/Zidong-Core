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
        swapCleared: Number(localStorage.getItem("zidong_swap_cleared") || 0),
        swapMaxCombo: Number(localStorage.getItem("zidong_swap_max_combo") || 0),
        swapCleared: Number(localStorage.getItem("zidong_swap_cleared") || 0)
    };

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
        { id: "b_volt_master", icon: "⚡", name: "Electricista Oberon", desc: "Domina todas las lecciones del Mundo Eléctrico.", isUnlocked: () => (window.ZIDONG_WORLDS_CONFIG || [])[0].activities.every(a => currentUserData.completedActivities.includes(a.id)) },
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
    window.getZidongUserData = function() { return currentUserData; };
    window.getWorldsCatalog = function() { return window.ZIDONG_WORLDS_CONFIG || []; };

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
        (window.ZIDONG_WORLDS_CONFIG || []).forEach(w => {
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

        if (countLabel) countLabel.textContent = `${unlockedCount} / ${(window.ZIDONG_WORLDS_CONFIG || []).length + 1} Desbloqueadas`;
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

        (window.ZIDONG_WORLDS_CONFIG || []).forEach(w => {
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

    document.addEventListener("DOMContentLoaded", () => {
        updateProfile();
        setTimeout(() => { if (typeof window.renderCareerPlanetsMenu === "function") window.renderCareerPlanetsMenu(); }, 0);
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
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