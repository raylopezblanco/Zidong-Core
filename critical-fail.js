/* ==========================================================================
   ZIDONG CORE - SURVIVOR MODE (CRITICAL FAIL) - V29 STABLE
   ========================================================================== */
(() => {
    "use strict";

    let timerInterval = null;
    let timeLeft = 18;
    let alarmsCleared = 0;
    let score = 0;
    let currentAlarmIndex = 0;

    const PLANT_ALARMS = [
        { code: "ALM-0412", hmiText: "伺服驱动器过载", correctAnswer: "Revisar lubricación del husillo y resetear térmico", distractors: ["Subir la velocidad del PLC al 150%", "Desconectar el cable de tierra física", "Acelerar el conveyor principal"] },
        { code: "ALM-0105", hmiText: "急停按钮被按下", correctAnswer: "Girar botón tipo hongo y presionar Reset en tablero", distractors: ["Cambiar fusibles de 24V", "Reemplazar cilindro neumático", "Puentear relevador de seguridad"] },
        { code: "ALM-0220", hmiText: "气压不足, 低于0.5MPa", correctAnswer: "Verificar compresor principal y purgar filtros", distractors: ["Ajustar sensor óptico AOI", "Reiniciar SCADA central", "Cambiar balancín robótico"] }
    ];

    window.openCriticalMode = function() {
        stopSurvivorSession();
        if (typeof window.navigateTo === "function") {
            window.navigateTo("arcade");
        }
        const sel = document.getElementById("cf-selector");
        const arena = document.getElementById("cf-game-arena");
        const collapse = document.getElementById("cf-collapse-screen");
        if (sel) sel.style.display = "block";
        if (arena) arena.style.display = "none";
        if (collapse) collapse.style.display = "none";
    };

    window.startCriticalLevel = function() {
        const sel = document.getElementById("cf-selector");
        const arena = document.getElementById("cf-game-arena");
        const collapse = document.getElementById("cf-collapse-screen");
        if (sel) sel.style.display = "none";
        if (collapse) collapse.style.display = "none";
        if (arena) arena.style.display = "block";

        timeLeft = 18;
        alarmsCleared = 0;
        score = 0;
        currentAlarmIndex = Math.floor(Math.random() * PLANT_ALARMS.length);
        
        updateSurvivorHUD();
        renderSurvivorStage();
        startSurvivorTimer();
    };

    function startSurvivorTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateSurvivorHUD();
            if (timeLeft <= 0) {
                triggerCollapse("¡Se agotó el tiempo de respuesta en línea!");
            }
        }, 1000);
    }

    function updateSurvivorHUD() {
        const tEl = document.getElementById("cf-timer");
        const sEl = document.getElementById("cf-score");
        const cEl = document.getElementById("cf-cleared-count");
        const bar = document.getElementById("cf-timer-bar");
        if (tEl) tEl.textContent = timeLeft;
        if (sEl) sEl.textContent = score;
        if (cEl) cEl.textContent = alarmsCleared;
        if (bar) {
            const pct = (timeLeft / 18) * 100;
            bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
        }
    }

    function renderSurvivorStage() {
        const container = document.getElementById("cf-stage-content");
        if (!container) return;
        const alarm = PLANT_ALARMS[currentAlarmIndex];

        let options = [alarm.correctAnswer, ...alarm.distractors];
        options.sort(() => Math.random() - 0.5);

        let html = `
            <div class="panel" style="margin-top:10px; background:linear-gradient(145deg, #1f0a0d, #111f35); border-color:rgba(255,68,68,0.4);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span class="tag" style="border-color:var(--red); color:var(--red);">⚠️ CÓDIGO: ${alarm.code}</span>
                    <small style="color:var(--muted);">HMI ALARM</small>
                </div>
                <h1 style="font-size:36px; color:#fff; margin:10px 0; font-family:'Noto Sans SC'; text-align:center;">${alarm.hmiText}</h1>
                <p style="font-size:11px; color:var(--muted); text-align:center; margin-bottom:14px;">Selecciona la contramedida técnica exacta:</p>
                <div style="display:flex; flex-direction:column; gap:8px;">
        `;

        options.forEach(opt => {
            const safeOpt = opt.replace(/'/g, "\\'");
            const safeCorrect = alarm.correctAnswer.replace(/'/g, "\\'");
            html += `<button class="reveal-button" style="background:var(--surface-light); color:#fff; border:1px solid var(--border); text-align:left; padding:12px;" onclick="window.checkSurvivorAnswer('${safeOpt}', '${safeCorrect}')">${opt}</button>`;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    }

    window.checkSurvivorAnswer = function(selected, correct) {
        if (selected === correct) {
            alarmsCleared++;
            score += 50;
            timeLeft += 3; // +3 segundos extra por acierto
            currentAlarmIndex = (currentAlarmIndex + 1) % PLANT_ALARMS.length;
            updateSurvivorHUD();
            renderSurvivorStage();
        } else {
            triggerCollapse("Acción errónea ejecutada en tablero de control.");
        }
    };

    function triggerCollapse(reason) {
        stopSurvivorSession();
        const arena = document.getElementById("cf-game-arena");
        const collapse = document.getElementById("cf-collapse-screen");
        if (arena) arena.style.display = "none";
        if (collapse) {
            collapse.style.display = "block";
            const cCount = document.getElementById("cf-collapse-cleared-count");
            const cReason = document.getElementById("cf-collapse-reason");
            const cScore = document.getElementById("cf-collapse-score");
            if (cCount) cCount.textContent = alarmsCleared;
            if (cReason) cReason.textContent = reason;
            if (cScore) cScore.textContent = "+" + score + " XP";
        }
    }

    function stopSurvivorSession() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    window.exitCriticalFail = function() {
        stopSurvivorSession();
        if (typeof window.navigateTo === "function") {
            window.navigateTo("dashboard");
        }
    };
})();
