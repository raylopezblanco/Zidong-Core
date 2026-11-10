
/* ==========================================================================
   ZIDONG CORE - APP.JS V27 DEFINITIVO (1v1 Nivel 3, Ranking, Perfil y Lab)
   ========================================================================== */

window.mockUser = {
    username: "New user",
    xp: 1850,
    level: 5,
    streak: 5,
    completed: 5,
    worldsUnlocked: 5,
    survivorBest: 12,
    vsBest: 350,
    rankTitle: "Rango 01: Becario"
};

// 1v1 Battle Logic con 3 niveles (Nivel 1: 1 Hanzi, Nivel 2: 2 Hanzi, Nivel 3: Ordenar bloques Hanzi)
let vsTimerInterval = null;
let vsSecondsLeft = 20;
let vsMyPoints = 0;
let vsRivalPoints = 0;
let currentVsDiff = 'EASY';

window.openVsMode = function() {
    stopVsSession();
    if (typeof window.navigateTo === "function") {
        window.navigateTo("vsBattle");
    }
    document.getElementById("vsDifficultySelector").style.display = "block";
    document.getElementById("vsBattleArenaContainer").style.display = "none";
    document.getElementById("vsDefeatScreen").style.display = "none";
};

window.start1v1WithDifficulty = function(diff) {
    currentVsDiff = diff;
    document.getElementById("vsDifficultySelector").style.display = "none";
    document.getElementById("vsBattleArenaContainer").style.display = "block";
    document.getElementById("vsDefeatScreen").style.display = "none";

    vsSecondsLeft = 20;
    vsMyPoints = 0;
    vsRivalPoints = 0;
    updateVsHUD();
    renderVsStage();
    startVsTimer();
};

function startVsTimer() {
    if (vsTimerInterval) clearInterval(vsTimerInterval);
    vsTimerInterval = setInterval(() => {
        vsSecondsLeft--;
        updateVsHUD();
        if (vsSecondsLeft <= 0) {
            stopVsSession();
            document.getElementById("vsBattleArenaContainer").style.display = "none";
            document.getElementById("vsDefeatScreen").style.display = "block";
            document.getElementById("vsDefeatScores").textContent = vsMyPoints + " PTS vs " + vsRivalPoints + " PTS";
        }
    }, 1000);
}

function stopVsSession() {
    if (vsTimerInterval) {
        clearInterval(vsTimerInterval);
        vsTimerInterval = null;
    }
}

function updateVsHUD() {
    document.getElementById("vsSeconds").textContent = vsSecondsLeft;
    document.getElementById("vsMyScore").textContent = vsMyPoints + " PTS";
    document.getElementById("vsRivalScore").textContent = vsRivalPoints + " PTS";
    const bar = document.getElementById("vsTimerBar");
    if (bar) {
        bar.style.width = ((vsSecondsLeft / 20) * 100) + "%";
    }
}

const VS_QUESTIONS = [
    { hanzi: "电", mean: "Electricidad", dist: ["Motor", "Presión", "Válvula"] },
    { hanzi: "机", mean: "Máquina / Motor", dist: ["Cable", "Sensor", "Filtro"] },
    { hanzi: "报警", mean: "Alarma / Código de error", dist: ["Calibración", "Paro total", "Ciclo OK"] }
];

function renderVsStage() {
    const card = document.getElementById("vsStageCard");
    if (!card) return;

    if (currentVsDiff === 'HARD') {
        // Nivel 3: Ordenar bloques Hanzi
        card.innerHTML = `
            <span class="tag" style="border-color:var(--red); color:var(--red); margin-bottom:8px;">NIVEL 3 · ORDENAR BLOQUES</span>
            <p style="font-size:12px; color:var(--muted); margin-bottom:10px;">Ordena los bloques Hanzi para formar: <strong style="color:var(--cyan);">"Alarma de Máquina" (机器故障)</strong></p>
            <div style="display:flex; justify-content:center; gap:10px; margin:16px 0;">
                <button class="reveal-button" style="background:var(--surface-light); color:#fff; font-size:28px; width:60px; height:60px;" onclick="window.checkVsOrder('机')">机</button>
                <button class="reveal-button" style="background:var(--surface-light); color:#fff; font-size:28px; width:60px; height:60px;" onclick="window.checkVsOrder('器')">器</button>
                <button class="reveal-button" style="background:var(--surface-light); color:#fff; font-size:28px; width:60px; height:60px;" onclick="window.checkVsOrder('故')">故</button>
                <button class="reveal-button" style="background:var(--surface-light); color:#fff; font-size:28px; width:60px; height:60px;" onclick="window.checkVsOrder('障')">障</button>
            </div>
            <p id="vsOrderFeedback" style="font-size:11px; color:var(--gold);">Toca los bloques en orden.</p>
        `;
    } else {
        const q = VS_QUESTIONS[Math.floor(Math.random() * VS_QUESTIONS.length)];
        let opts = [q.mean, ...q.dist];
        opts.sort(() => Math.random() - 0.5);

        card.innerHTML = `
            <span class="tag" style="border-color:var(--purple); color:var(--purple); margin-bottom:8px;">DUELO EN VIVO</span>
            <h1 style="font-size:64px; color:#fff; margin:10px 0; font-family:'Noto Sans SC';">${q.hanzi}</h1>
            <p style="font-size:12px; color:var(--muted); margin-bottom:14px;">Selecciona el significado técnico correcto:</p>
            <div class="career-quiz-grid" id="vsOptionsGrid" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                ${opts.map(o => `<button class="reveal-button" style="background:var(--surface-light); color:#fff; border:1px solid var(--border); padding:12px;" onclick="window.checkVsAnswer('${o}', '${q.mean}')">${o}</button>`).join('')}
            </div>
        `;
    }
}

window.checkVsAnswer = function(selected, correct) {
    if (selected === correct) {
        vsMyPoints += 50;
        vsRivalPoints += 30;
        updateVsHUD();
        renderVsStage();
    } else {
        vsSecondsLeft = Math.max(0, vsSecondsLeft - 3);
        updateVsHUD();
    }
};

let orderStep = 0;
window.checkVsOrder = function(char) {
    const expected = ['机', '器', '故', '障'];
    if (char === expected[orderStep]) {
        orderStep++;
        if (orderStep >= expected.length) {
            vsMyPoints += 100;
            orderStep = 0;
            updateVsHUD();
            alert("¡Bloques ordenados correctamente! +100 PTS");
            renderVsStage();
        } else {
            document.getElementById("vsOrderFeedback").textContent = "¡Bien! Siguiente bloque...";
        }
    } else {
        orderStep = 0;
        vsSecondsLeft = Math.max(0, vsSecondsLeft - 3);
        updateVsHUD();
        document.getElementById("vsOrderFeedback").textContent = "Orden incorrecto. ¡Reiniciando secuencia!";
    }
};

// Ranking Relleno con datos de ejemplo
window.addEventListener('DOMContentLoaded', () => {
    const lbContainer = document.getElementById('leaderboardTableContainer');
    if (lbContainer) {
        const engineers = [
            { pos: 1, name: "Ing. Carlos Mendoza", xp: "4,250 XP", badge: "⚡ Maestro PLC" },
            { pos: 2, name: "Raymundo López Blanco", xp: "1,850 XP", badge: "⚡ Técnico Jr" },
            { pos: 3, name: "Ing. Sofia Valenzuela", xp: "1,620 XP", badge: "⚙️ Mecánico Sr" },
            { pos: 4, name: "Ing. David Ruelas", xp: "1,410 XP", badge: "🤖 Robótica" }
        ];
        lbContainer.innerHTML = engineers.map(e => `
            <div class="lb-rank-row" style="display:flex; justify-content:space-between; align-items:center; background:var(--surface-light); border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:6px;">
                <div>
                    <strong style="color:var(--cyan); font-size:12px;">#${e.pos} ${e.name}</strong>
                    <small style="display:block; color:var(--muted); font-size:9px;">${e.badge}</small>
                </div>
                <strong style="color:var(--gold); font-size:12px;">${e.xp}</strong>
            </div>
        `).join('');
    }
});
