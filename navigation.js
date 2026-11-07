/* ==========================================================================
   ZIDONG NAVIGATION ENGINE 7.0
   - Navegación estricta de pantalla completa (display: none forzado)
   - Transición de audio instantánea por menú
   - Detención segura de timers y sesiones activas
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
            } else if (pageId === "arcade") {
                window.ZidongAudio.switchTrack("survivor");
            } else if (pageId === "vsBattle") {
                window.ZidongAudio.switchTrack("vsBattle");
            } else if (pageId === "career" || pageId === "worldDetailsView" || pageId === "level01" || pageId === "assessment") {
                window.ZidongAudio.switchTrack("oberon");
            } else {
                window.ZidongAudio.stopAllMusic();
            }
        }

        // 3. Ocultar todas las páginas
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

        // 5. Actualizar barra inferior
        const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
        navButtons.forEach(btn => btn.classList.remove("active"));

        if (pageId === "dashboard") {
            navButtons[0]?.classList.add("active");
        } else if (pageId === "hanziLab") {
            navButtons[1]?.classList.add("active");
        } else if (pageId === "ranksLadderPage") {
            navButtons[2]?.classList.add("active");
        } else if (pageId === "achievementsPage") {
            navButtons[3]?.classList.add("active");
        }

        // 6. Refrescar vistas
        if (pageId === "career" && typeof window.renderCareerPlanetsMenu === "function") {
            window.renderCareerPlanetsMenu();
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
