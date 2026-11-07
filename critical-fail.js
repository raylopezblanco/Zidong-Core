/* ==========================================================================
   ZIDONG CORE 10.0 - SURVIVOR MODE (EXPERTO PURO)
   - Sin traducción de la alarma y sin glosario (Modo Avanzado)
   - Inicia en 18s y cada acierto suma +3s
   - Cero segundas oportunidades: 1 error = Colapso total
   - Registro de alarmas retiradas en el perfil
   ========================================================================== */

(() => {
    "use strict";

    let timerInterval = null;
    let timeLeft = 18;
    let alarmsCleared = 0;
    let score = 0;
    let currentAlarmIndex = 0;

    // BANCO EXPERTO: SOLO CÓDIGO Y TEXTO NATIVO HMI EN CHINO (SIN TRADUCCIÓN NI GLOSARIO)
    const INDUSTRIAL_ALARMS_BANK = [
        {
            code: "ALM-0412",
            hmiText: "伺服驱动器过载",
            options: [
                "Revisar lubricación del husillo y resetear térmico",
                "Subir la velocidad del PLC al 150%",
                "Desconectar el cable de tierra física",
                "Acelerar el conveyor principal"
            ],
            correct: 0
        },
        {
            code: "ALM-0105",
            hmiText: "急停按钮被按下",
            options: [
                "Girar botón tipo hongo y presionar Reset en tablero",
                "Cambiar los fusibles de la fuente 24V",
                "Reemplazar el cilindro neumático",
                "Puentea el relevador de seguridad con cable"
            ],
            correct: 0
        },
        {
            code: "ALM-0220",
            hmiText: "气压不足, 低于0.5MPa",
            options: [
                "Verificar la válvula reguladora de aire y compresor",
                "Calibrar la cámara de visión artificial AOI",
                "Purgar la pasta de soldadura de la plantilla",
                "Apagar los sensores de vacío"
            ],
            correct: 0
        },
        {
            code: "ALM-0330",
            hmiText: "光电传感器信号丢失",
            options: [
                "Limpiar lente óptico del sensor y alinear reflector",
                "Incrementar la temperatura del horno de reflujo",
                "Cambiar la dirección de giro de la banda",
                "Forzar la entrada digital permanentemente en 1"
            ],
            correct: 0
        },
        {
            code: "ALM-0518",
            hmiText: "电机堵转警报",
            options: [
                "Inspeccionar obstrucción mecánica en rodamientos",
                "Aumentar el límite de torque en variador al máximo",
                "Desactivar el freno de seguridad de la celda",
                "Ignorar alarma y pulsar arranque continuo"
            ],
            correct: 0
        },
        {
            code: "ALM-0604",
            hmiText: "安全门互锁断开",
            options: [
                "Cerrar la guarda y rearmar el cerrojo magnético",
                "Desmontar el switch de seguridad de la puerta",
                "Acelerar el robot para compensar el tiempo",
                "Cambiar el lenguaje de la HMI a chino mandarín"
            ],
            correct: 0
        }
    ];

    window.openCriticalMode = () => {
        stopSurvivorSession();
        if (typeof window.navigateTo === "function") {
            window.navigateTo("arcade");
        }
        document.getElementById("cf-selector").style.display = "block";
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-collapse-screen").style.display = "none";
    };

    window.startCriticalLevel = () => {
        document.getElementById("cf-selector").style.display = "none";
        document.getElementById("cf-game-arena").style.display = "block";
        document.getElementById("cf-collapse-screen").style.display = "none";

        alarmsCleared = 0;
        score = 0;
        timeLeft = 18;
        currentAlarmIndex = 0;

        document.getElementById("cf-score").textContent = score;
        document.getElementById("cf-timer").textContent = timeLeft;
        document.getElementById("cf-cleared-count").textContent = alarmsCleared;

        startTimer();
        renderNextAlarm();
    };

    function startTimer() {
        clearInterval(timerInterval);
        const timerBar = document.getElementById("cf-timer-bar");

        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("cf-timer").textContent = timeLeft;
            if (timerBar) {
                const pct = Math.min((timeLeft / 18) * 100, 100);
                timerBar.style.width = `${pct}%`;
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                triggerLineCollapse("TIEMPO AGOTADO: La línea se detuvo por falta de respuesta técnica.");
            }
        }, 1000);
    }

    function renderNextAlarm() {
        const stage = document.getElementById("cf-stage-content");
        if (!stage) return;

        const alarm = INDUSTRIAL_ALARMS_BANK[currentAlarmIndex % INDUSTRIAL_ALARMS_BANK.length];
        currentAlarmIndex++;

        // MODO EXPERTO: SOLO CÓDIGO Y TEXTO HMI EN CHINO (SIN TRADUCCIÓN NI GLOSARIO)
        stage.innerHTML = `
            <div style="background:rgba(255, 68, 68, 0.12); border:1.5px solid var(--red); border-radius:16px; padding:16px 14px; text-align:center; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span class="tag" style="border-color:var(--red); color:var(--red); font-size:9px;">INCIDENCIA ACTIVA</span>
                    <strong style="font-family:monospace; color:#fff; font-size:12px;">${alarm.code}</strong>
                </div>

                <h2 style="font-family:'Noto Sans SC', sans-serif; color:#ffffff; font-size:22px; margin: 10px 0; letter-spacing:1px;">${alarm.hmiText}</h2>
            </div>

            <div class="career-quiz-grid" id="cf-options-grid"></div>
        `;

        const grid = stage.querySelector("#cf-options-grid");
        alarm.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "12.5px";
            btn.style.padding = "11px 10px";
            btn.style.textAlign = "left";
            btn.textContent = `${idx + 1}. ${opt}`;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (idx === alarm.correct) {
                    if (window.ZidongAudio && window.ZidongAudio.playSuccess) window.ZidongAudio.playSuccess();
                    btn.classList.add("btn-correct");
                    
                    // BONIFICACIÓN: +3 SEGUNDOS POR ALARMA RESUELTA
                    timeLeft += 3;
                    alarmsCleared++;
                    score += 150;

                    document.getElementById("cf-score").textContent = score;
                    document.getElementById("cf-timer").textContent = timeLeft;
                    document.getElementById("cf-cleared-count").textContent = alarmsCleared;

                    const tBox = document.getElementById("cf-timer-box");
                    if (tBox) {
                        tBox.classList.add("time-bonus-glow");
                        setTimeout(() => tBox.classList.remove("time-bonus-glow"), 350);
                    }

                    setTimeout(renderNextAlarm, 250);
                } else {
                    btn.classList.add("btn-wrong");
                    triggerLineCollapse("ERROR OPERATIVO: Mala maniobra en tablero de control.");
                }
            };
            grid.appendChild(btn);
        });
    }

    function triggerLineCollapse(reasonText) {
        clearInterval(timerInterval);
        if (window.ZidongAudio && window.ZidongAudio.playLineCollapse) {
            window.ZidongAudio.playLineCollapse();
        }

        const bestAlarms = Number(localStorage.getItem("zidong_survivor_best_cleared") || 0);
        if (alarmsCleared > bestAlarms) {
            localStorage.setItem("zidong_survivor_best_cleared", alarmsCleared);
        }
        const totalCleared = Number(localStorage.getItem("zidong_survivor_total_cleared") || 0) + alarmsCleared;
        localStorage.setItem("zidong_survivor_total_cleared", totalCleared);

        if (alarmsCleared >= 1) {
            localStorage.setItem("zidong_survivor_wins", Number(localStorage.getItem("zidong_survivor_wins") || 0) + 1);
        }

        if (typeof window.awardXP === "function" && score > 0) {
            window.awardXP(score);
        }

        document.getElementById("cf-game-arena").style.display = "none";
        const collapseScreen = document.getElementById("cf-collapse-screen");
        collapseScreen.style.display = "block";

        document.getElementById("cf-collapse-reason").textContent = reasonText;
        document.getElementById("cf-collapse-cleared-count").textContent = alarmsCleared;
        document.getElementById("cf-collapse-score").textContent = `+${score} XP`;

        if (typeof window.updateProfile === "function") window.updateProfile();
    }

    function stopSurvivorSession() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    window.exitCriticalFail = () => {
        stopSurvivorSession();
        document.getElementById("cf-game-arena").style.display = "none";
        document.getElementById("cf-collapse-screen").style.display = "none";
        document.getElementById("cf-selector").style.display = "block";
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    };

    window.stopSurvivorSession = stopSurvivorSession;

})();
