
/* =========================================
   ZIDONG CORE 2.0
   NAVIGATION SYSTEM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navButtons = document.querySelectorAll(".nav-btn");
    const pages = document.querySelectorAll(".page");

    function navigateTo(pageId) {

        // 1. Ocultar todas las páginas
        pages.forEach(page => {
            page.classList.remove("active");
        });

        // 2. Desactivar todos los botones
        navButtons.forEach(button => {
            button.classList.remove("active");
        });

        // 3. Buscar la página seleccionada
        const selectedPage = document.getElementById(pageId);

        if (!selectedPage) {
            console.error("Página no encontrada:", pageId);
            return;
        }

        // 4. Mostrar la página seleccionada
        selectedPage.classList.add("active");

        // 5. Activar el botón correspondiente
        const selectedButton = document.querySelector(
            `.nav-btn[data-page="${pageId}"]`
        );

        if (selectedButton) {
            selectedButton.classList.add("active");
        }

        // 6. Regresar inmediatamente al inicio
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        console.log("Navegación:", pageId);
    }
   // En navigation.js, justo después de mostrar la página:
        if (pageId === "profile" && typeof updateProfile === "function") {
           updateProfile();
        }

    // 7. Hacer la función accesible desde otros archivos
    window.navigateTo = navigateTo;

    // 8. Detectar clics en la navegación inferior
    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            const pageId = button.dataset.page;

            navigateTo(pageId);

        });

    });

    console.log("Zidong Core Navigation: READY");

});
