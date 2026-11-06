
/* =========================================
   ZIDONG CORE 2.0
   MOCK DATA / DEMO DATABASE
========================================= */

window.ZIDONG_DEMO = {

    // =====================================
    // PLAYER INFORMATION
    // =====================================

    player: {
        name: "Raymundo Lopez",
        initials: "RL",
        xp: 1250,
        level: 5,
        streak: 5,
        completed: 18,
        nextLevel: 2000
    },

    // =====================================
    // DAILY MISSIONS
    // =====================================

    missions: [
        {
            icon: "文",
            title: "Hanzi Recognition",
            detail: "Recognize 5 Chinese characters (3/5)",
            xp: "+50 XP"
        },
        {
            icon: "◈",
            title: "Character Components",
            detail: "Explore 2 character structures",
            xp: "+30 XP"
        },
        {
            icon: "⚡",
            title: "Daily Practice",
            detail: "Complete one learning activity",
            xp: "+40 XP"
        }
    ],

    // =====================================
    // TEAM BATTLE
    // =====================================

    teams: [
        {
            icon: "🐼",
            name: "Los Arroces Chinos",
            members: 4,
            xp: 2450,
            percent: 100
        },
        {
            icon: "🐉",
            name: "Dragon Team",
            members: 3,
            xp: 2180,
            percent: 89
        },
        {
            icon: "🥢",
            name: "Team Bamboo",
            members: 4,
            xp: 1950,
            percent: 80
        }
    ],

    // =====================================
    // RECENT ACTIVITY
    // =====================================

    activity: [],
    // =====================================
    // GLOBAL PLAYER RANKING
    // =====================================

    players: [
        {
            initials: "RL",
            name: "Raymundo Lopez",
            team: "Los Arroces Chinos",
            xp: 1250
        },
        {
            initials: "VC",
            name: "Victor Chen",
            team: "Dragon Team",
            xp: 1180
        },
        {
            initials: "JM",
            name: "James Miller",
            team: "Team Bamboo",
            xp: 1050
        },
        {
            initials: "AL",
            name: "Alex Lopez",
            team: "Los Arroces Chinos",
            xp: 920
        },
        {
            initials: "MP",
            name: "Michael Perez",
            team: "Dragon Team",
            xp: 850
        }
    ]

};
