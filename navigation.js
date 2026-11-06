/* =========================================
   ZIDONG CORE 2.0
   NAVIGATION SYSTEM & LIFECYCLE ROUTER
========================================= */

(() => {
    "use strict";

    function navigateTo(pageId) {
        if (!pageId) return;

        const pages = document.querySelectorAll(".page");
        const navButtons = document.querySelectorAll(".nav-item, .nav-btn");

        // 1. Ocultar todas las vistas
        pages.forEach(page => {
            page.classList.remove("active");
            page.style.display = "none";
        });

        // 2. Desactivar botones de navegación inferior
        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // 3. Obtener y mostrar la página seleccionada
        const targetPage = document.getElementById(pageId);
        if (!targetPage) {
            console.warn(`[Navigation] Página no encontrada: #${pageId}`);
            return;
        }

        targetPage.classList.add("active");
        targetPage.style.display = "block";

        // 4. Activar el botón de barra inferior correspondiente (por data-page o función)
        navButtons.forEach(btn => {
            const attrPage = btn.dataset.page;
            const onclickText = btn.getAttribute("onclick") || "";
            if (attrPage === pageId || onclickText.includes(`'${pageId}'`) || onclickText.includes(`"${pageId}"`)) {
                btn.classList.add("active");
            }
        });

        // 5. Scroll inmediato al inicio de la pantalla
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 6. Retroalimentación táctil y sonora al cambiar de pantalla
        if (window.ZidongAudio && typeof window.ZidongAudio.playTap === "function") {
            window.ZidongAudio.playTap();
        }

        // 7. Ciclo de vida dinámico: Actualizar componentes según la pantalla activa
        switch (pageId) {
            case "profile":
                if (typeof window.updateProfile === "function") {
                    window.updateProfile();
                }
                break;

            case "career":
                if (typeof window.renderCareerPath === "function") {
                    window.renderCareerPath();
                }
                break;

            case "leaderboard":
            case "ranking":
                if (typeof window.updateRanking === "function") {
                    window.updateRanking();
                }
                break;

            case "dashboard":
                if (typeof window.updateMissionProgress === "function") {
                    window.updateMissionProgress();
                }
                break;

            case "arcade":
            case "free":
                if (typeof window.openCriticalMode === "function") {
                    window.openCriticalMode();
                }
                break;
        }

        console.log(`[Navigation] Vista activa: ${pageId}`);
    }

    // Exponer globalmente para HTML y otros scripts
    window.navigateTo = navigateTo;

    // Inicializar listeners al cargar el DOM
    document.addEventListener("DOMContentLoaded", () => {
        // Enlazar botones con data-page automáticamente
        const navElements = document.querySelectorAll("[data-page]");
        navElements.forEach(element => {
            element.addEventListener("click", () => {
                const target = element.dataset.page;
                if (target) navigateTo(target);
            });
        });

        console.log("Zidong Navigation Router: READY");
    });
})();
