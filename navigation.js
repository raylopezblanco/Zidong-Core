/* ==========================================================================
   ZIDONG NAVIGATION ENGINE 10.0
   - Enrutamiento estricto: Oculta Dashboard y muestra la sección solicitada
   - Transición de audio limpia (incluye música al entrar a los mundos de Career)
   - Actualización de barra inferior con Clasificatoria (Ranking)
   ========================================================================== */

(() => {
    "use strict";

    window.navigateTo = (pageId) => {
        // 1. Detener sesiones activas de juego
        if (typeof window.stopSurvivorSession === "function") {
            window.stopSurvivorSession();
        }
        if (typeof window.stopVsSession === "function") {
            window.stopVsSession();
        }

        // 2. Transición musical limpia por pantalla
        if (window.ZidongAudio) {
            if (pageId === "dashboard") {
                window.ZidongAudio.switchTrack("dashboard");
            } else if (pageId === "career" || pageId === "worldDetailsView" || pageId === "level01" || pageId === "assessment") {
                window.ZidongAudio.switchTrack("career"); // Música de exploración espacial en Career Mode
            } else if (pageId === "arcade") {
                window.ZidongAudio.switchTrack("survivor");
            } else if (pageId === "vsBattle") {
                window.ZidongAudio.switchTrack("vsBattle");
            } else {
                window.ZidongAudio.stopAllMusic();
            }
        }

        // 3. Ocultar todas las páginas estrictamente
        const allPages = document.querySelectorAll(".page");
        allPages.forEach(p => {
            p.classList.remove("active");
            p.style.display = "none";
        });

        // 4. Mostrar página destino
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add("active");
            targetPage.style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // 5. Actualizar barra inferior (Home, Mundos, Ranking, Rangos)
        const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
        navButtons.forEach(btn => btn.classList.remove("active"));

        if (pageId === "dashboard") {
            navButtons[0]?.classList.add("active");
        } else if (pageId === "career" || pageId === "worldDetailsView") {
            navButtons[1]?.classList.add("active");
        } else if (pageId === "leaderboard") {
            navButtons[2]?.classList.add("active");
        } else if (pageId === "ranksLadderPage") {
            navButtons[3]?.classList.add("active");
        }

        // 6. Refrescar vistas
        if (pageId === "career" && typeof window.renderCareerPlanetsMenu === "function") {
            window.renderCareerPlanetsMenu();
        }
        if (pageId === "leaderboard" && typeof window.renderLeaderboardSection === "function") {
            window.renderLeaderboardSection();
        }
        if (pageId === "ranksLadderPage" && typeof window.renderRanksSection === "function") {
            window.renderRanksSection();
        }
        if (pageId === "profile" && typeof window.updateProfile === "function") {
            window.updateProfile();
        }
        if (pageId === "hanziLab" && typeof window.renderLabComponents === "function") {
            window.renderLabComponents();
        }
    };
})();
