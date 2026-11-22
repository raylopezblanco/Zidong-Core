/* ==========================================================================
   ZIDONG CORE - 4-TAB MINIGAMES LEADERBOARD MODULE
   4 pestañas independientes de ranking según el minijuego seleccionado:
   1. career : suma de niveles en los 5 mundos (ej. "100 LVL")
   2. endless: número máximo de alarmas retiradas (ej. "12 ALM")
   3. puzzle : puntaje máximo en Hanzi-Swap (ej. "450 PTS")
   4. vs3    : puntaje máximo únicamente en 1v1 Level 3 (ej. "500 PTS")
   ========================================================================== */

(() => {
    "use strict";

    let activeLbTab = "career";

    const TAB_META = {
        career: {
            label: "CAREER MODE · 5 MUNDOS",
            header: "NIVELES (5 MUNDOS)",
            accent: "var(--green)",
            formatVal: (item) => `${item.careerLevels} LVL`,
            getSortVal: (item) => item.careerLevels
        },
        endless: {
            label: "ENDLESS · ALARMAS MÁX",
            header: "MÁX. ALARMAS",
            accent: "#ff6b6b",
            formatVal: (item) => `${item.endlessMaxAlarms} ALM`,
            getSortVal: (item) => item.endlessMaxAlarms
        },
        puzzle: {
            label: "PUZZLE · PUNTAJE MÁX",
            header: "PUNTAJE MÁXIMO",
            accent: "var(--gold)",
            formatVal: (item) => `${item.puzzleMaxScore} PTS`,
            getSortVal: (item) => item.puzzleMaxScore
        },
        vs3: {
            label: "1V1 BATTLE · SOLO LEVEL 3",
            header: "PUNTAJE LEVEL 3",
            accent: "var(--purple)",
            formatVal: (item) => `${item.vsLevel3Score} PTS`,
            getSortVal: (item) => item.vsLevel3Score
        }
    };

    function getUser() {
        return typeof window.getZidongUserData === "function" ? window.getZidongUserData() : null;
    }

    function getCareerLevelsSum(ud) {
        const completed = Array.isArray(ud?.completedActivities) ? ud.completedActivities : [];
        const starsMap = ud?.phaseStars || {};
        let savedStarsObj = {};
        try {
            const raw = localStorage.getItem("zidong_career_phase_stars");
            if (raw) savedStarsObj = JSON.parse(raw);
        } catch (e) {}

        const worlds = Array.isArray(window.ZIDONG_WORLDS_CONFIG) ? window.ZIDONG_WORLDS_CONFIG : [];
        let levelsPlayed = 0;

        worlds.forEach(w => {
            const acts = Array.isArray(w.activities) ? w.activities : [];
            acts.forEach(act => {
                const st = savedStarsObj[act.id] || starsMap[act.id];
                if (st) {
                    levelsPlayed += (st.p1 ? 1 : 0) + (st.p2 ? 1 : 0) + (st.p3 ? 1 : 0);
                } else if (completed.includes(act.id)) {
                    levelsPlayed += 3;
                }
            });
            if (w.boss && completed.includes(w.boss.id)) {
                levelsPlayed += 1;
            }
        });

        const reviews = Array.isArray(ud?.completedReviews) ? ud.completedReviews.length : 0;
        return levelsPlayed + reviews;
    }

    function getCurrentPlayerMinigameStats() {
        const ud = getUser() || {};
        return {
            name: ud.name || "New user",
            isMe: true,
            careerLevels: getCareerLevelsSum(ud),
            endlessMaxAlarms: Number(localStorage.getItem("zidong_survivor_max_alarms") || 0),
            puzzleMaxScore: Number(localStorage.getItem("zidong_swap_max_score") || 0),
            vsLevel3Score: Number(localStorage.getItem("zidong_vs_lvl3_max_score") || 0)
        };
    }

    const RIVAL_MINIGAME_BENCHMARKS = [
        { name: "Chen Wei (Líder Planta)", careerLevels: 28, endlessMaxAlarms: 11, puzzleMaxScore: 420, vsLevel3Score: 500 },
        { name: "Ana Torres (CFT Calidad)", careerLevels: 22, endlessMaxAlarms: 8, puzzleMaxScore: 310, vsLevel3Score: 400 },
        { name: "Li Ming (Soporte SMT)", careerLevels: 14, endlessMaxAlarms: 5, puzzleMaxScore: 195, vsLevel3Score: 200 },
        { name: "Carlos Ruiz (Turno B)", careerLevels: 8, endlessMaxAlarms: 3, puzzleMaxScore: 110, vsLevel3Score: 100 }
    ];

    function syncTabStyles() {
        const meta = TAB_META[activeLbTab] || TAB_META.career;
        document.querySelectorAll("#leaderboardTabsBar .lb-mode-tab").forEach(btn => {
            const key = btn.getAttribute("data-lb-tab");
            const isActive = key === activeLbTab;
            btn.classList.toggle("active", isActive);
            btn.style.background = isActive ? "var(--surface-light)" : "var(--surface)";
            btn.style.borderColor = isActive ? meta.accent : "var(--border)";
            btn.style.color = isActive ? "#fff" : "var(--muted)";
        });

        const hdr = document.getElementById("leaderboardMetricHeader");
        if (hdr) hdr.textContent = meta.header;
    }

    window.switchLeaderboardTab = function(tabKey) {
        if (!TAB_META[tabKey]) return;
        activeLbTab = tabKey;
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        syncTabStyles();
        window.renderLeaderboard();
    };

    window.renderLeaderboard = function() {
        const container = document.getElementById("leaderboardTableContainer");
        const myBox = document.getElementById("leaderboardMyRankBox");
        if (!container) return;

        syncTabStyles();
        container.replaceChildren();

        const meta = TAB_META[activeLbTab] || TAB_META.career;
        const me = getCurrentPlayerMinigameStats();

        const rows = [
            ...RIVAL_MINIGAME_BENCHMARKS.map(r => Object.assign({}, r, { isMe: false })),
            me
        ]
            .sort((a, b) => meta.getSortVal(b) - meta.getSortVal(a))
            .map((item, idx) => Object.assign({}, item, { rank: idx + 1 }));

        rows.forEach(item => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.padding = "10px 12px";
            row.style.borderRadius = "12px";
            row.style.background = item.isMe ? "rgba(0,245,155,0.12)" : "var(--surface-light)";
            row.style.border = item.isMe ? "1px solid var(--green)" : "1px solid var(--border)";

            const posColor = item.rank === 1 ? "var(--gold)" : item.rank === 2 ? "#c0c0c0" : item.rank === 3 ? "#cd7f32" : "var(--muted)";

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:900; font-size:12px; color:${posColor};">#0${item.rank}</span>
                    <strong style="font-size:12px; color:${item.isMe ? "var(--green)" : "#fff"};">${item.name} ${item.isMe ? "(Tú)" : ""}</strong>
                </div>
                <span style="font-weight:900; font-size:12px; color:${meta.accent};">${meta.formatVal(item)}</span>
            `;
            container.appendChild(row);

            if (item.isMe && myBox) {
                myBox.style.background = "var(--surface)";
                myBox.style.border = `1.5px solid ${meta.accent}`;
                myBox.style.borderRadius = "16px";
                myBox.style.padding = "14px";
                myBox.style.display = "flex";
                myBox.style.justifyContent = "space-between";
                myBox.style.alignItems = "center";
                myBox.innerHTML = `
                    <div>
                        <span class="eyebrow" style="color:${meta.accent};">${meta.label} · #0${item.rank}</span>
                        <h3 style="color:#fff; font-size:14px; margin-top:2px;">${item.name}</h3>
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:${meta.accent}; font-size:15px; display:block;">${meta.formatVal(item)}</strong>
                        <small style="color:var(--muted); font-size:9px;">Pestaña activa</small>
                    </div>
                `;
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
        });
    } else {
        setTimeout(() => {
            if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
        }, 0);
    }
})();
