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
            if (window.ZidongAudio && window.ZidongAudio.playVictory) window.ZidongAudio.playVictory();
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


    const SAVED_USER_NAME = localStorage.getItem("zidong_user_name") || "";
    const NAME_LOCKED_FLAG = localStorage.getItem("zidong_name_locked") === "1";

    let currentUserData = {
        name: SAVED_USER_NAME || "New user",
        nameLocked: NAME_LOCKED_FLAG || Boolean(SAVED_USER_NAME),
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
    };
    window.currentUserData = currentUserData;

    const RANKS_LADDER = [
        { level: 1, name: "Becario de Planta", minXp: 0 },
        { level: 2, name: "Operador Junior", minXp: 300 },
        { level: 3, name: "Técnico de Ensamble", minXp: 750 },
        { level: 4, name: "Técnico Especialista", minXp: 1400 },
        { level: 5, name: "Ingeniero de Automatización", minXp: 2200 },
        { level: 6, name: "Líder Técnico CFT", minXp: 3200 }
    ];
    window.ZIDONG_RANKS_LADDER = RANKS_LADDER;

    function calculateUserRank(xp) {
        let current = RANKS_LADDER[0];
        for (let r of RANKS_LADDER) {
            if (xp >= r.minXp) current = r;
        }
        return current;
    }
    window.calculateUserRank = calculateUserRank;

    let pendingNameValue = "";

    window.editUserNameOnce = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        const isLocked = currentUserData.nameLocked || localStorage.getItem("zidong_name_locked") === "1";
        if (isLocked) {
            if (typeof triggerHaptic === "function") triggerHaptic("error");
            window.showCyberAlert(
                "NOMBRE BLOQUEADO",
                `Tu identificador "${currentUserData.name}" ya fue guardado de forma permanente (1 sola edición permitida).`,
                "🔒"
            );
            return;
        }
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
        currentUserData.nameLocked = true;
        try {
            localStorage.setItem("zidong_user_name", finalName);
            localStorage.setItem("zidong_name_locked", "1");
        } catch (e) {}
        MOCK_LEADERBOARD.forEach(item => {
            if (item.isMe) {
                item.name = currentUserData.name;
            }
        });
        window.closeEditNameModal();
        if (typeof window.updateProfile === "function") window.updateProfile();
        if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
        if (typeof triggerHaptic === "function") triggerHaptic("win");
        window.showCyberAlert("SISTEMA ACTUALIZADO", `¡Tu nombre ahora es "${currentUserData.name}"!`, "✏️");
    };

    // COMPANION SPEECHES
    function getCompanionPhrasesList() {
        try {
            if (typeof window.getCompanionPhrases === "function") {
                const list = window.getCompanionPhrases(currentUserData?.name || "");
                if (Array.isArray(list) && list.length > 0) return list;
            }
            if (Array.isArray(window.ZIDONG_NPC_DIALOGUES?.companion) && window.ZIDONG_NPC_DIALOGUES.companion.length > 0) {
                return window.ZIDONG_NPC_DIALOGUES.companion;
            }
        } catch (e) {}
        return ["¡Terminal OBERON en línea! ⚡"];
    }

    window.interactWithCompanion = function() {
        try {
            if (navigator.vibrate) navigator.vibrate(35);
            if (window.ZidongAudio && typeof window.ZidongAudio.playBark === "function") {
                window.ZidongAudio.playBark();
            }
        } catch (e) {}
        const bubble = document.getElementById("companionBubble");
        const textEl = document.getElementById("companionText");
        if (!textEl) return;

        const phrases = getCompanionPhrasesList();
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        textEl.textContent = randomPhrase;
        if (bubble) {
            bubble.classList.remove("bounce-pop");
            void bubble.offsetWidth;
            bubble.classList.add("bounce-pop");
            setTimeout(() => bubble.classList.remove("bounce-pop"), 400);
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        if (typeof window.updateProfile === "function") window.updateProfile();
        setTimeout(() => { if (typeof window.renderCareerPlanetsMenu === "function") window.renderCareerPlanetsMenu(); }, 0);
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
        if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
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
