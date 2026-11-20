/* ==========================================================================
   ZIDONG CORE - CORE STATE & BOOTSTRAP (MODULAR)
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


    let currentUserData = {
        name: "New user",
        xp: 1850,
        streak: 5,
        completedActivities: ["w1_a1", "w1_a2", "w1_a3", "w1_a4", "w2_a1", "w2_a2", "w2_a3", "w2_a4"],
        unlockedWorlds: ["world_1", "world_2", "world_3", "world_4", "world_5"],
        unlockedBadges: ["badge_starter", "badge_volt", "badge_sensor"],
        selectedAvatar: "⚡"
    };

    const WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            planetName: "Planeta Voltaria",
            subtitle: "VFDs, motores y cableado de control",
            icon: "⚡",
            color: "#00f59b",
            planetClass: "planet-voltaria",
            activities: [
                { id: "w1_a1", hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Voltaje", reward: 50, audioNote: "diàn" },
                { id: "w1_a2", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cableado", reward: 50, audioNote: "xiàn" },
                { id: "w1_a3", hanzi: "模", pinyin: "mó", meaning: "Módulo de potencia", reward: 60, audioNote: "mó" },
                { id: "w1_a4", hanzi: "组", pinyin: "zǔ", meaning: "Ensamble eléctrico", reward: 70, audioNote: "zǔ" }
            ],
            boss: {
                id: "w1_boss",
                title: "JEFE DE LÍNEA · VFD DELTA MS300",
                badgeName: "Maestro VFD Delta",
                reward: 150,
                sequence: [
                    { char: "电", esName: "Electricidad" },
                    { char: "线", esName: "Cableado" },
                    { char: "模", esName: "Módulo" }
                ]
            }
        },
        {
            id: "world_2",
            title: "MUNDO MECÁNICO",
            planetName: "Planeta ErsaWave",
            subtitle: "Soldadura selectiva y ejes de transmisión",
            icon: "⚙️",
            color: "#00e5ff",
            planetClass: "planet-ersa",
            activities: [
                { id: "w2_a1", hanzi: "机", pinyin: "jī", meaning: "Máquina / Mecanismo", reward: 50, audioNote: "jī" },
                { id: "w2_a2", hanzi: "动", pinyin: "dòng", meaning: "Movimiento / Accionamiento", reward: 50, audioNote: "dòng" },
                { id: "w2_a3", hanzi: "器", pinyin: "qì", meaning: "Aparato / Dispositivo", reward: 60, audioNote: "qì" },
                { id: "w2_a4", hanzi: "修", pinyin: "xiū", meaning: "Mantenimiento / Reparación", reward: 70, audioNote: "xiū" }
            ],
            boss: {
                id: "w2_boss",
                title: "JEFE DE LÍNEA · ERSA VERSAFLOW",
                badgeName: "Especialista Versaflow",
                reward: 150,
                sequence: [
                    { char: "机", esName: "Máquina" },
                    { char: "动", esName: "Movimiento" },
                    { char: "器", esName: "Dispositivo" }
                ]
            }
        },
        {
            id: "world_3",
            title: "MUNDO NEUMÁTICO",
            planetName: "Planeta SMC Air",
            subtitle: "Electroválvulas y pistones de aire",
            icon: "💨",
            color: "#ffaa00",
            planetClass: "planet-smc",
            activities: [
                { id: "w3_a1", hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática", reward: 50, audioNote: "qì" },
                { id: "w3_a2", hanzi: "阀", pinyin: "fá", meaning: "Válvula", reward: 50, audioNote: "fá" },
                { id: "w3_a3", hanzi: "压", pinyin: "yā", meaning: "Presión", reward: 60, audioNote: "yā" },
                { id: "w3_a4", hanzi: "缸", pinyin: "gāng", meaning: "Cilindro neumático", reward: 70, audioNote: "gāng" }
            ],
            boss: {
                id: "w3_boss",
                title: "JEFE DE LÍNEA · BLOQUE SMC",
                badgeName: "Ingeniero Neumático SMC",
                reward: 150,
                sequence: [
                    { char: "气", esName: "Aire" },
                    { char: "阀", esName: "Válvula" },
                    { char: "压", esName: "Presión" }
                ]
            }
        },
        {
            id: "world_4",
            title: "MUNDO ROBÓTICA",
            planetName: "Planeta Kuka-Fanuc",
            subtitle: "Brazo robótico y lógica de celdas",
            icon: "🤖",
            color: "#ff4444",
            planetClass: "planet-robot",
            activities: [
                { id: "w4_a1", hanzi: "人", pinyin: "rén", meaning: "Humano / Operador", reward: 50, audioNote: "rén" },
                { id: "w4_a2", hanzi: "爪", pinyin: "zhǎo", meaning: "Gripper / Pinza", reward: 50, audioNote: "zhǎo" },
                { id: "w4_a3", hanzi: "程", pinyin: "chéng", meaning: "Programa / Rutina", reward: 60, audioNote: "chéng" },
                { id: "w4_a4", hanzi: "安", pinyin: "ān", meaning: "Seguridad / Interlock", reward: 70, audioNote: "ān" }
            ],
            boss: {
                id: "w4_boss",
                title: "JEFE DE LÍNEA · CELDA KUKA",
                badgeName: "Maestro Kuka-Fanuc",
                reward: 150,
                sequence: [
                    { char: "人", esName: "Operador" },
                    { char: "爪", esName: "Pinza" },
                    { char: "安", esName: "Seguridad" }
                ]
            }
        },
        {
            id: "world_5",
            title: "MUNDO CALIDAD",
            planetName: "Planeta Six Sigma",
            subtitle: "Inspección óptica AOI y métricas",
            icon: "📊",
            color: "#a855f7",
            planetClass: "planet-quality",
            activities: [
                { id: "w5_a1", hanzi: "检", pinyin: "jiǎn", meaning: "Inspección / Calidad", reward: 50, audioNote: "jiǎn" },
                { id: "w5_a2", hanzi: "测", pinyin: "cè", meaning: "Prueba / Medición", reward: 50, audioNote: "cè" },
                { id: "w5_a3", hanzi: "误", pinyin: "wù", meaning: "Error / Defecto", reward: 60, audioNote: "wù" },
                { id: "w5_a4", hanzi: "良", pinyin: "liáng", meaning: "Aprobado / Good", reward: 70, audioNote: "liáng" }
            ],
            boss: {
                id: "w5_boss",
                title: "JEFE DE LÍNEA · ESTACIÓN AOI",
                badgeName: "Auditor Six Sigma",
                reward: 200,
                sequence: [
                    { char: "检", esName: "Inspección" },
                    { char: "测", esName: "Medición" },
                    { char: "良", esName: "Aprobado" }
                ]
            }
        }
    ];

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
        { id: "b_volt_master", icon: "⚡", name: "Electricista Oberon", desc: "Domina todas las lecciones del Mundo Eléctrico.", isUnlocked: () => WORLDS_CONFIG[0].activities.every(a => currentUserData.completedActivities.includes(a.id)) },
        { id: "b_mechanic", icon: "⚙️", name: "Manos a la Máquina", desc: "Supera el checkpoint del Mundo Mecánico.", isUnlocked: () => currentUserData.completedActivities.includes("w2_a4") },
        { id: "b_ai_slayer", icon: "⚔️", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_survivor", icon: "⚠️", name: "Defensor del Núcleo", desc: "Retira con éxito al menos 5 alarmas en Survivor Mode.", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_cleared") || 0) >= 5 },
        { id: "b_polyglot", icon: "🧠", name: "Soporte Bilingüe", desc: "Alcanza el Nivel 3 de rango o superior.", isUnlocked: () => calculateUserRank(currentUserData.xp).level >= 3 }
    ];

    function calculateUserRank(xp) {
        let current = RANKS_LADDER[0];
        for (let r of RANKS_LADDER) {
            if (xp >= r.minXp) current = r;
        }
        return current;
    }


    window.currentUserData = currentUserData;
    window.WORLDS_CONFIG = WORLDS_CONFIG;
    window.RANKS_LADDER = RANKS_LADDER;
    window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
    window.calculateUserRank = calculateUserRank;

    function bootZidongCore() {
        if (typeof window.updateProfile === "function") window.updateProfile();
        if (typeof window.renderCareerPlanetsMenu === "function") window.renderCareerPlanetsMenu();
        if (typeof window.renderLeaderboard === "function") window.renderLeaderboard();
        if (typeof window.renderLabComponents === "function") window.renderLabComponents("all", "");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootZidongCore);
    } else {
        bootZidongCore();
    }
})();
