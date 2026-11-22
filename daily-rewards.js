/* ==========================================================================
   ZIDONG CORE - DAILY REWARDS & MISSIONS MODULE
   Recompensas diarias y misiones de turno separadas para agregar más fácilmente.
   ========================================================================== */

(() => {
    "use strict";

    // Agrega aquí más recompensas o misiones de turno cuando quieras
    window.ZIDONG_DAILY_REWARDS_CONFIG = [
        {
            id: "daily_shift_bonus",
            title: "RECOMPENSA DIARIA DE TURNO",
            desc: "¡Reclama tu energía diaria de turno y mantén tu racha!",
            claimedDesc: "Ya has obtenido tu bono de energía de hoy. ¡Vuelve mañana!",
            xp: 100,
            buttonLabel: "RECLAMAR +100 XP ⚡",
            claimedLabel: "YA RECLAMADO HOY ✓"
        }
    ];

    window.ZIDONG_DAILY_MISSIONS_CONFIG = [
        { id: "m1", label: "1. Completa 1 nivel en Mundo Eléctrico (+50 XP)", done: true },
        { id: "m2", label: "2. Supera 1 duelo en Modo 1v1 (+80 XP)", done: false },
        { id: "m3", label: "3. Derrota 1 alarma en Survivor Mode (+100 XP)", done: false }
    ];

    function getActiveReward() {
        const list = Array.isArray(window.ZIDONG_DAILY_REWARDS_CONFIG) && window.ZIDONG_DAILY_REWARDS_CONFIG.length > 0
            ? window.ZIDONG_DAILY_REWARDS_CONFIG
            : [];
        return list[0] || {
            title: "RECOMPENSA DIARIA DE TURNO",
            desc: "¡Reclama tu energía diaria de turno y mantén tu racha!",
            claimedDesc: "Ya has obtenido tu bono de energía de hoy. ¡Vuelve mañana!",
            xp: 100,
            buttonLabel: "RECLAMAR +100 XP ⚡",
            claimedLabel: "YA RECLAMADO HOY ✓"
        };
    }

    window.refreshDailyRewardFloat = function() {
        const badge = document.getElementById("dailyFloatNotification");
        if (!badge) return;
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        const alreadyClaimed = (lastClaim === today);
        badge.style.display = alreadyClaimed ? "none" : "flex";
    };

    window.toggleDailyRewardModal = function() {
        const modal = document.getElementById("dailyRewardModal");
        if (modal) {
            modal.style.display = modal.style.display === "flex" ? "none" : "flex";
        }
    };

    window.closeRewardModal = function(e) {
        if (e && (e.target.id === "dailyRewardModal" || e.target.classList.contains("modal-overlay"))) {
            window.toggleDailyRewardModal();
        }
    };

    window.claimDailyReward = function() {
        if (typeof window.triggerHaptic === "function") {
            window.triggerHaptic("success");
        }
        const reward = getActiveReward();
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        const titleEl = document.getElementById("rewardModalTitle");
        const btn = document.getElementById("btnClaimRewardAction");
        const desc = document.getElementById("rewardModalDesc");

        if (titleEl && reward.title) titleEl.textContent = reward.title;

        if (btn && desc) {
            if (lastClaim === today) {
                btn.textContent = reward.claimedLabel || "YA RECLAMADO HOY ✓";
                btn.style.opacity = "0.85";
                btn.style.pointerEvents = "auto";
                desc.textContent = reward.claimedDesc || "Ya has obtenido tu bono de energía de hoy. ¡Vuelve mañana!";
            } else {
                btn.textContent = reward.buttonLabel || `RECLAMAR +${reward.xp} XP ⚡`;
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto";
                desc.textContent = reward.desc || "¡Reclama tu energía diaria de turno y mantén tu racha!";
            }
        }
        window.toggleDailyRewardModal();
    };

    window.confirmClaimReward = function() {
        const reward = getActiveReward();
        const today = new Date().toISOString().slice(0, 10);
        const lastClaim = localStorage.getItem("zidong_last_claim_date");
        if (lastClaim === today) {
            window.toggleDailyRewardModal();
            return;
        }
        if (typeof window.triggerHaptic === "function") {
            window.triggerHaptic("win");
        }
        if (window.currentUserData) {
            window.currentUserData.xp = (window.currentUserData.xp || 0) + (Number(reward.xp) || 100);
        }
        localStorage.setItem("zidong_last_claim_date", today);
        if (typeof window.refreshDailyRewardFloat === "function") window.refreshDailyRewardFloat();
        if (typeof window.updateProfile === "function") window.updateProfile();
        window.toggleDailyRewardModal();
    };

    window.renderDailyMissionsList = function() {
        const listEl = document.getElementById("dailyMissionsList");
        if (!listEl) return;
        const missions = Array.isArray(window.ZIDONG_DAILY_MISSIONS_CONFIG) ? window.ZIDONG_DAILY_MISSIONS_CONFIG : [];
        listEl.replaceChildren();
        missions.forEach(m => {
            const row = document.createElement("div");
            row.textContent = `${m.done ? "✓" : "○"} ${m.label}`;
            listEl.appendChild(row);
        });
    };

    window.toggleDailyMissionsModal = function() {
        const modal = document.getElementById("dailyMissionsModal");
        if (modal) {
            const opening = modal.style.display !== "flex";
            if (opening && typeof window.renderDailyMissionsList === "function") {
                window.renderDailyMissionsList();
            }
            modal.style.display = opening ? "flex" : "none";
        }
    };

    window.closeMissionsModal = function(e) {
        if (e && e.target.id === "dailyMissionsModal") {
            window.toggleDailyMissionsModal();
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            window.refreshDailyRewardFloat();
            window.renderDailyMissionsList();
        });
    } else {
        setTimeout(() => {
            window.refreshDailyRewardFloat();
            window.renderDailyMissionsList();
        }, 0);
    }
})();
