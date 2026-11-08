/* ==========================================================================
   ZIDONG CORE 4.0 - SURVIVOR MODE (SUDDEN DEATH / FALLO CRÍTICO INMEDIATO)
   - Cero segundas oportunidades: Un error = Colapso total de la línea.
   - Detención inmediata de timers y audios al abandonar la pantalla.
   ========================================================================== */

(() => {
    "use strict";

    let currentLevel = 1;
    let timerInterval = null;
    let timeLeft = 45;
    let score = 0;

    const INDUSTRIAL_ALARMS = [
        {
            code: "ALM-0412",
            hmiText: "伺服驱动器过载 (Sìfú qūdòngqì guòzài)",
            subText: "Eje Z: Servocontrolador en sobrecarga de corriente",
            options: [
                "Revisar lubricación del husillo y resetear térmico",
                "Subir la velocidad del PLC al 150%",
                "Desconectar el cable de tierra física",
                "Acelerar el conveyor principal"
            ],
            correct: 0,
            hanziClue: "过载 (Sobrecarga) · 伺服 (Servo)"
        },
        {
            code: "ALM-0105",
            hmiText: "急停按钮被按下 (Jítíng ànniǔ bèi ànxià)",
            subText: "Paro de emergencia activado en Celda de Soldadura",
            options: [
                "Girar botón tipo hongo y presionar Reset en tablero",
                "Cambiar los fusibles de la fuente 24V",
                "Reemplazar el cilindro neumático",
                "Puentea el relevador de seguridad con cable"
            ],
            correct: 0,
            hanziClue: "急停 (Paro de emergencia) · 按钮 (Botón)"
        },
        {
            code: "ALM-0220",
            hmiText: "气压不足, 低于0.5MPa (Qìyā bùzú, dīyú 0.5MPa)",
            subText: "Presión neumática por debajo del umbral de seguridad",
            options: [
                "Verificar la válvula reguladora de aire y compresor",
                "Calibrar la cámara de visión artificial AOI",
                "Purgar la pasta de soldadura de la plantilla",
                "Apagar los sensores de vacío"
            ],
            correct: 0,
            hanziClue: "气压 (Presión de aire) · 不足 (Insuficiente)"
        },
        {
            code: "ALM-0330",
            hmiText: "光电传感器信号丢失 (Guāngdiàn chuángǎnqì xìnhào diūshī)",
            subText: "Sensor fotoeléctrico de entrada sin detección de PCB",
            options: [
                "Limpiar lente óptico del sensor y alinear reflector",
                "Incrementar la temperatura del horno de reflujo",
                "Cambiar la dirección de giro de la banda",
                "Forzar la entrada digital permanentemente en 1"
            ],
            correct: 0,
            hanziClue: "光电 (Fotoeléctrico) · 丢失 (Pérdida/Falla)"
        }
    ];

    window.openCriticalMode = () => {
        stopSurvivorSession();
        if (typeof window.navigateTo === "function") {
            window.navigateTo("arcade");
        }
        document.getElementById("cf-selector").style.display = "block";
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "none";
        document.getElementById("cf-collapse-screen").style.display = "none";
    };

    window.startCriticalLevel = (lvl) => {
        currentLevel = lvl;
        document.getElementById("cf-selector").style.display = "none";
        document.getElementById("cf-game-arena").style.display = "block";
        document.getElementById("cf-result-screen").style.display = "none";
        document.getElementById("cf-collapse-screen").style.display = "none";

        document.getElementById("cf-current-level-tag").textContent = `SURVIVOR LEVEL 0${lvl}`;
        score = 0;
        timeLeft = 40;
        document.getElementById("cf-score").textContent = score;
        document.getElementById("cf-timer").textContent = timeLeft;

        startTimer();
        renderStageContent();
    };

    function startTimer() {
        clearInterval(timerInterval);
        const timerBar = document.getElementById("cf-timer-bar");
        const maxTime = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("cf-timer").textContent = timeLeft;
            if (timerBar) {
                const pct = (timeLeft / maxTime) * 100;
                timerBar.style.width = `${pct}%`;
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                triggerLineCollapse("TIEMPO AGOTADO: La línea se detuvo por falta de respuesta técnica.");
            }
        }, 1000);
    }

    function renderStageContent() {
        const stage = document.getElementById("cf-stage-content");
        if (!stage) return;

        const alarm = INDUSTRIAL_ALARMS[Math.floor(Math.random() * INDUSTRIAL_ALARMS.length)];

        stage.innerHTML = `
            <div style="background:rgba(255, 68, 68, 0.12); border:1.5px solid var(--red); border-radius:16px; padding:16px 14px; text-align:center; margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span class="tag" style="border-color:var(--red); color:var(--red); font-size:9.5px;">ALARMA CRÍTICA</span>
                    <strong style="font-family:monospace; color:#fff; font-size:12px;">${alarm.code}</strong>
                </div>

                <h2 style="font-family:'Noto Sans SC', sans-serif; color:#ffffff; font-size:19px; margin: 8px 0;">${alarm.hmiText}</h2>
                <p style="color:var(--text); font-size:11.5px; margin-bottom:8px;">${alarm.subText}</p>
                <div style="background:rgba(0,0,0,0.35); border-radius:8px; padding:6px; font-size:10px; color:var(--cyan); font-weight:700;">
                    🔍 Glosario de piso: ${alarm.hanziClue}
                </div>
            </div>

            <p style="font-size:11px; color:#ff7777; margin-bottom:10px; font-weight:800; text-align:center;">
                ⚠️ ADVERTENCIA: 1 solo intento. Si fallas, la línea colapsa.
            </p>
            <div class="career-quiz-grid" id="cf-options-grid"></div>
        `;

        const grid = stage.querySelector("#cf-options-grid");
        alarm.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "13px";
            btn.style.padding = "12px 10px";
            btn.style.textAlign = "left";
            btn.textContent = `${idx + 1}. ${opt}`;

            btn.onclick = () => {
                // DESACTIVAR TODOS LOS BOTONES AL PRIMER TOQUE (CERO MULTISELECCIÓN)
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (idx === alarm.correct) {
                    if (window.ZidongAudio && window.ZidongAudio.playSuccess) window.ZidongAudio.playSuccess();
                    btn.classList.add("btn-correct");
                    score += 200;
                    document.getElementById("cf-score").textContent = score;
                    setTimeout(finishInterventionSuccess, 450);
                } else {
                    btn.classList.add("btn-wrong");
                    triggerLineCollapse("ACCIÓN INCORRECTA: Provocaste un corto o daño mecánico en estación.");
                }
            };
            grid.appendChild(btn);
        });
    }

    // PANTALLA ROJA DE COLAPSO TOTAL (SOLICITADA POR EL USUARIO)
    function triggerLineCollapse(reasonText) {
        clearInterval(timerInterval);
        if (window.ZidongAudio && window.ZidongAudio.playLineCollapse) {
            window.ZidongAudio.playLineCollapse();
        }

        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "none";
        const collapseScreen = document.getElementById("cf-collapse-screen");
        collapseScreen.style.display = "block";

        document.getElementById("cf-collapse-reason").textContent = reasonText;
    }

    function finishInterventionSuccess() {
        clearInterval(timerInterval);
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "block";

        const rewardXP = Math.max(score, 150);
        document.getElementById("cf-final-score").textContent = `+${rewardXP} XP`;

        localStorage.setItem("zidong_survivor_won", "true");

        if (typeof window.awardXP === "function") {
            window.awardXP(rewardXP);
        }
        if (window.ZidongAudio && window.ZidongAudio.playVictory) {
            window.ZidongAudio.playVictory();
        }
    }

    function stopSurvivorSession() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    window.exitCriticalFail = () => {
        stopSurvivorSession();
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-result-screen").style.display = "none";
        document.getElementById("cf-collapse-screen").style.display = "none";
        document.getElementById("cf-selector").style.display = "block";
    };

    window.stopSurvivorSession = stopSurvivorSession;

})();
