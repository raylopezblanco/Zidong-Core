/* ==========================================================================
   ZIDONG NAVIGATION ENGINE 4.0
   - Enrutamiento limpio y seguro
   - Cancela pruebas y detiene audios fantasma al salir de cualquier pantalla
   ========================================================================== */

(() => {
    "use strict";

    window.navigateTo = (pageId) => {
        // 1. Detener sesiones activas y relojes para evitar que sigan sonando de fondo
        if (typeof window.stopSurvivorSession === "function") {
            window.stopSurvivorSession();
        }
        if (typeof window.stopVsSession === "function") {
            window.stopVsSession();
        }

        // 2. Gestionar música según la pantalla de destino
        if (window.ZidongAudio) {
            if (pageId === "dashboard") {
                window.ZidongAudio.startDashboardZelda();
            } else if (pageId === "vsBattle") {
                window.ZidongAudio.start1v1MarioCastle();
            } else if (pageId === "career" || pageId === "level01" || pageId === "assessment") {
                window.ZidongAudio.startCareerAmbience();
            } else {
                window.ZidongAudio.stopAllMusic();
            }
        }

        // 3. Cambiar visibilidad de páginas
        const pages = document.querySelectorAll(".page");
        pages.forEach(p => p.classList.remove("active"));

        const target = document.getElementById(pageId);
        if (target) {
            target.classList.add("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // 4. Actualizar barra de navegación inferior
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

        // 5. Refrescar datos según sección
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
