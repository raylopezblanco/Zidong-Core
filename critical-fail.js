/* ==========================================================================
   ZIDONG CORE 8.0 - SURVIVOR MODE (ENDLESS +3s POR ACIERTO)
   - Inicia en 18 segundos
   - Cada acierto suma +3 segundos de tiempo extra y pasa a la siguiente alarma
   - Registra récord de alarmas retiradas en el perfil
   - 1 error = Colapso total inmediato
   ========================================================================== */

(() => {
    "use strict";

    let timerInterval = null;
    let timeLeft = 18;
    let alarmsCleared = 0;
    let score = 0;
    let currentAlarmIndex = 0;

    // BANCO DEMOSTRATIVO AMPLIADO DE ALARMAS DE PLANTA SMT / ROBÓTICA
    const INDUSTRIAL_ALARMS_BANK = [
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
            subText: "Presión neumática principal por debajo del umbral",
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
        },
        {
            code: "ALM-0518",
            hmiText: "电机堵转警报 (Diànjī dǔzhuǎn jǐngbào)",
            subText: "Bloqueo mecánico / rotor trabado en servomotor de banda",
            options: [
                "Inspeccionar obstrucción mecánica en rodamientos",
                "Aumentar el límite de torque en variador al máximo",
                "Desactivar el freno de seguridad de la celda",
                "Ignorar alarma y pulsar arranque continuo"
            ],
            correct: 0,
            hanziClue: "电机 (Motor) · 堵转 (Bloqueo/Traba)"
        },
        {
            code: "ALM-0604",
            hmiText: "安全门互锁断开 (Ānquán mén hùsuǒ duànkāi)",
            subText: "Interlock de puerta de seguridad abierto durante ciclo",
            options: [
                "Cerrar la guarda y rearmar el cerrojo magnético",
                "Desmontar el switch de seguridad de la puerta",
                "Acelerar el robot para compensar el tiempo",
                "Cambiar el lenguaje de la HMI a chino mandarín"
            ],
            correct: 0,
            hanziClue: "安全门 (Puerta de seguridad) · 互锁 (Interlock)"
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

        // Seleccionar alarma rotativa
        const alarm = INDUSTRIAL_ALARMS_BANK[currentAlarmIndex % INDUSTRIAL_ALARMS_BANK.length];
        currentAlarmIndex++;

        stage.innerHTML = `
            <div style="background:rgba(255, 68, 68, 0.12); border:1.5px solid var(--red); border-radius:16px; padding:14px; text-align:center; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span class="tag" style="border-color:var(--red); color:var(--red); font-size:9px;">INCIDENCIA ACTIVA</span>
                    <strong style="font-family:monospace; color:#fff; font-size:12px;">${alarm.code}</strong>
                </div>

                <h2 style="font-family:'Noto Sans SC', sans-serif; color:#ffffff; font-size:18px; margin: 6px 0;">${alarm.hmiText}</h2>
                <p style="color:var(--text); font-size:11px; margin-bottom:6px;">${alarm.subText}</p>
                <div style="background:rgba(0,0,0,0.35); border-radius:8px; padding:5px; font-size:10px; color:var(--cyan); font-weight:700;">
                    🔍 Glosario: ${alarm.hanziClue}
                </div>
            </div>

            <p style="font-size:10px; color:#ffaa00; margin-bottom:8px; font-weight:800; text-align:center;">
                ⚡ Acierta y gana +3s de tiempo extra. 1 error = Colapso.
            </p>
            <div class="career-quiz-grid" id="cf-options-grid"></div>
        `;

        const grid = stage.querySelector("#cf-options-grid");
        alarm.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "12.5px";
            btn.style.padding = "10px 10px";
            btn.style.textAlign = "left";
            btn.textContent = `${idx + 1}. ${opt}`;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (idx === alarm.correct) {
                    if (window.ZidongAudio && window.ZidongAudio.playSuccess) window.ZidongAudio.playSuccess();
                    btn.classList.add("btn-correct");
                    
                    // ¡REGLA SOLICITADA: +3 SEGUNDOS DE TIEMPO EXTRA!
                    timeLeft += 3;
                    alarmsCleared++;
                    score += 150;

                    document.getElementById("cf-score").textContent = score;
                    document.getElementById("cf-timer").textContent = timeLeft;
                    document.getElementById("cf-cleared-count").textContent = alarmsCleared;

                    // Pulso visual en el temporizador
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

        // Guardar récord de alarmas retiradas en el perfil
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
