/* ==========================================================================
   ZIDONG CORE - MINIGAMES PROGRESS LEADERBOARD MODULE
   Ranking basado en avance de minijuegos (no por XP):
   - Career Mode: total de niveles/estrellas-fases completadas en los 5 mundos
   - Endless / Survivor: número máximo de alarmas retiradas
   - Puzzle (Hanzi-Swap): puntaje máximo alcanzado
   - 1v1 Battle: puntaje máximo únicamente en Nivel 3 (HARD)
   ========================================================================== */

(() => {
    "use strict";

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
        const careerLevels = getCareerLevelsSum(ud);
        const endlessMaxAlarms = Number(localStorage.getItem("zidong_survivor_max_alarms") || 0);
        const puzzleMaxScore = Number(localStorage.getItem("zidong_swap_max_score") || 0);
        const vsLevel3Score = Number(localStorage.getItem("zidong_vs_lvl3_max_score") || 0);

        const progressScore = (careerLevels * 100) + (endlessMaxAlarms * 35) + puzzleMaxScore + vsLevel3Score;

        return {
            name: ud.name || "New user",
            isMe: true,
            careerLevels,
            endlessMaxAlarms,
            puzzleMaxScore,
            vsLevel3Score,
            progressScore
        };
    }

    const RIVAL_MINIGAME_BENCHMARKS = [
        { name: "Chen Wei (Líder Planta)", careerLevels: 28, endlessMaxAlarms: 11, puzzleMaxScore: 420, vsLevel3Score: 500 },
        { name: "Ana Torres (CFT Calidad)", careerLevels: 22, endlessMaxAlarms: 8, puzzleMaxScore: 310, vsLevel3Score: 400 },
        { name: "Li Ming (Soporte SMT)", careerLevels: 14, endlessMaxAlarms: 5, puzzleMaxScore: 195, vsLevel3Score: 200 },
        { name: "Carlos Ruiz (Turno B)", careerLevels: 8, endlessMaxAlarms: 3, puzzleMaxScore: 110, vsLevel3Score: 100 }
    ];

    window.renderLeaderboard = function() {
        const container = document.getElementById("leaderboardTableContainer");
        const myBox = document.getElementById("leaderboardMyRankBox");
        if (!container) return;
        container.replaceChildren();

        const me = getCurrentPlayerMinigameStats();
        const rows = [
            ...RIVAL_MINIGAME_BENCHMARKS.map(r => Object.assign({}, r, {
                isMe: false,
                progressScore: (r.careerLevels * 100) + (r.endlessMaxAlarms * 35) + r.puzzleMaxScore + r.vsLevel3Score
            })),
            me
        ]
            .sort((a, b) => b.progressScore - a.progressScore)
            .map((item, idx) => Object.assign({}, item, { rank: idx + 1 }));

        rows.forEach(item => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.gap = "6px";
            row.style.padding = "10px 12px";
            row.style.borderRadius = "12px";
            row.style.background = item.isMe ? "rgba(0,245,155,0.12)" : "var(--surface-light)";
            row.style.border = item.isMe ? "1px solid var(--green)" : "1px solid var(--border)";

            const posColor = item.rank === 1 ? "var(--gold)" : item.rank === 2 ? "#c0c0c0" : item.rank === 3 ? "#cd7f32" : "var(--muted)";

            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-weight:900; font-size:12px; color:${posColor};">#0${item.rank}</span>
                        <strong style="font-size:12px; color:${item.isMe ? "var(--green)" : "#fff"};">${item.name} ${item.isMe ? "(Tú)" : ""}</strong>
                    </div>
                    <span style="font-weight:900; font-size:11px; color:var(--cyan);">CAREER ${item.careerLevels} LVL</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:5px; font-size:9px; text-align:center;">
                    <div style="background:rgba(11,20,36,0.7); border:1px solid var(--border); border-radius:7px; padding:4px;">
                        <span style="color:var(--muted); display:block;">CAREER (5M)</span>
                        <strong style="color:var(--green);">${item.careerLevels} LVL</strong>
                    </div>
                    <div style="background:rgba(11,20,36,0.7); border:1px solid var(--border); border-radius:7px; padding:4px;">
                        <span style="color:var(--muted); display:block;">ENDLESS</span>
                        <strong style="color:#ff6b6b;">${item.endlessMaxAlarms} ALM</strong>
                    </div>
                    <div style="background:rgba(11,20,36,0.7); border:1px solid var(--border); border-radius:7px; padding:4px;">
                        <span style="color:var(--muted); display:block;">PUZZLE MAX</span>
                        <strong style="color:var(--gold);">${item.puzzleMaxScore} PTS</strong>
                    </div>
                    <div style="background:rgba(11,20,36,0.7); border:1px solid var(--border); border-radius:7px; padding:4px;">
                        <span style="color:var(--muted); display:block;">1V1 NVL 3</span>
                        <strong style="color:var(--purple);">${item.vsLevel3Score} PTS</strong>
                    </div>
                </div>
            `;
            container.appendChild(row);

            if (item.isMe && myBox) {
                myBox.style.background = "var(--surface)";
                myBox.style.border = "1.5px solid var(--cyan)";
                myBox.style.borderRadius = "16px";
                myBox.style.padding = "14px";
                myBox.style.display = "flex";
                myBox.style.flexDirection = "column";
                myBox.style.gap = "8px";
                myBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span class="eyebrow" style="color:var(--cyan);">AVANCE DE MINIJUEGOS · #0${item.rank}</span>
                            <h3 style="color:#fff; font-size:14px; margin-top:2px;">${item.name}</h3>
                        </div>
                        <span style="color:var(--green); font-size:12px; font-weight:900;">${item.careerLevels} LVL EN 5 MUNDOS</span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; font-size:9.5px; text-align:center;">
                        <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:8px; padding:6px 4px;">
                            <small style="color:var(--muted); display:block; font-size:8px;">CAREER MODE</small>
                            <strong style="color:var(--green);">${item.careerLevels} LVL</strong>
                        </div>
                        <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:8px; padding:6px 4px;">
                            <small style="color:var(--muted); display:block; font-size:8px;">ENDLESS MÁX</small>
                            <strong style="color:#ff6b6b;">${item.endlessMaxAlarms} ALM</strong>
                        </div>
                        <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:8px; padding:6px 4px;">
                            <small style="color:var(--muted); display:block; font-size:8px;">PUZZLE MÁX</small>
                            <strong style="color:var(--gold);">${item.puzzleMaxScore} PTS</strong>
                        </div>
                        <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:8px; padding:6px 4px;">
                            <small style="color:var(--muted); display:block; font-size:8px;">1V1 LEVEL 3</small>
                            <strong style="color:var(--purple);">${item.vsLevel3Score} PTS</strong>
                        </div>
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
