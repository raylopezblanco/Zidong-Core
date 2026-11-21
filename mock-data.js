/* ==========================================================================
   ZIDONG CORE 2.0 - INDUSTRIAL MOCK DATA & LEADERBOARDS
   ========================================================================== */

const data = {
    player: {
        name: "Raymundo Lopez",
        initials: "RL",
        role: "Especialista de Automatización",
        level: 5,
        xp: 1850,
        streak: 5,
        completed: 5,
        winRate: "94%",
        shift: "Turno Nocturno",
        line: "SMT & Assembly Line 04"
    },

    // 1. RANKING INDIVIDUAL DE INGENIEROS
    players: [
        { name: "Raymundo Lopez", initials: "RL", xp: 1850, team: "SMT Alpha", level: "L5", status: "Online" },
        { name: "Chen Wei (陈伟)", initials: "CW", xp: 1720, team: "Robotics Core", level: "L5", status: "En Línea" },
        { name: "Carlos Mendoza", initials: "CM", xp: 1540, team: "SMT Alpha", level: "L4", status: "Turno Tarde" },
        { name: "Li Na (李娜)", initials: "LN", xp: 1410, team: "Vision Systems", level: "L4", status: "Descanso" },
        { name: "Alejandro Silva", initials: "AS", xp: 1290, team: "PLC Controls", level: "L3", status: "En Guardia" },
        { name: "Zhang Tao (张涛)", initials: "ZT", xp: 1150, team: "Robotics Core", level: "L3", status: "Offline" },
        { name: "Eduardo Rivas", initials: "ER", xp: 980, team: "PLC Controls", level: "L2", status: "Offline" },
        { name: "Wang Lei (王磊)", initials: "WL", xp: 870, team: "Vision Systems", level: "L2", status: "Offline" }
    ],

    // 2. RANKING DE CUADRILLAS / EQUIPOS DE PLANTA
    teams: [
        { name: "SMT Alpha", members: 4, xp: 4890, badge: "⚡", line: "Área de Montaje 01" },
        { name: "Robotics Core", members: 3, xp: 4120, badge: "🤖", line: "Celdas Fanuc / Kuka" },
        { name: "PLC Controls", members: 5, xp: 3750, badge: "💻", line: "Líneas de Potencia" },
        { name: "Vision Systems", members: 3, xp: 3260, badge: "👁️", line: "Inspección Óptica AOI" }
    ],

    // 3. OPONENTES PARA EL MODO VS (1v1 BATTLE)
    vsOpponents: [
        { name: "Servo-Bot IA v4.2", rank: "Simulador de Carga", diff: "Normal", winReward: 120, avatar: "🤖" },
        { name: "Chen Wei (PE)", rank: "Ing. de Procesos", diff: "Difícil", winReward: 200, avatar: "👨‍💻" },
        { name: "PLC Omron Test", rank: "Protocolo Serial", diff: "Fácil", winReward: 80, avatar: "⚙️" },
        { name: "Li Na (Vision)", rank: "Especialista AOI", diff: "Experto", winReward: 250, avatar: "⚡" }
    ]
};

// Auto-poblar los rankings en pantalla si las listas existen
document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.updateRanking === "function") {
        window.updateRanking();
    }
});
