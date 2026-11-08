/* ==========================================================================
   ZIDONG NAVIGATION ENGINE 6.0
   - Navegación de pantalla completa limpia (oculta Dashboard y muestra solo la página activa)
   - Cero solapamiento debajo del home
   - Detención segura de audios y temporizadores
   ========================================================================== */

(() => {
    "use strict";

    window.navigateTo = (pageId) => {
        // 1. Detener sesiones activas y temporizadores
        if (typeof window.stopSurvivorSession === "function") {
            window.stopSurvivorSession();
        }
        if (typeof window.stopVsSession === "function") {
            window.stopVsSession();
        }

        // 2. Control de audio según pantalla
        if (window.ZidongAudio) {
            if (pageId === "dashboard") {
                window.ZidongAudio.startDashboardZelda();
            } else if (pageId === "vsBattle") {
                window.ZidongAudio.start1v1MarioCastle();
            } else if (pageId === "career" || pageId === "worldDetailsView" || pageId === "level01" || pageId === "assessment") {
                window.ZidongAudio.startCareerAmbience();
            } else {
                window.ZidongAudio.stopAllMusic();
            }
        }

        // 3. OCULTAR TODAS LAS PÁGINAS ESTRICTAMENTE
        const allPages = document.querySelectorAll(".page");
        allPages.forEach(p => {
            p.classList.remove("active");
            p.style.display = "none"; // Forzar ocultamiento para que no quede nada debajo del Home
        });

        // 4. MOSTRAR ÚNICAMENTE LA PÁGINA DESTINO
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

        // 6. Refrescos dinámicos
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
