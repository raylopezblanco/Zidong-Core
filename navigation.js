
window.navigationHistory = ['dashboard'];

// Inicializar historia de navegación en el historial del navegador si es necesario
if (window.history && window.history.replaceState) {
    window.history.replaceState({ page: 'dashboard' }, '', '');
}

window.navigateTo = function(pageId, pushHistory = true) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        
        if (pushHistory) {
            if (window.navigationHistory[window.navigationHistory.length - 1] !== pageId) {
                window.navigationHistory.push(pageId);
                if (window.history && window.history.pushState) {
                    window.history.pushState({ page: pageId }, '', '');
                }
            }
        }

        // Actualizar barra inferior
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const onclickAttr = item.getAttribute('onclick') || '';
            if (onclickAttr.includes(pageId)) {
                item.classList.add('active');
            }
        });
    } else {
        console.warn('Página no encontrada:', pageId);
    }
};

// Escuchar botón atrás del celular para navegar entre menús internos en lugar de salir de la app
window.addEventListener('popstate', (event) => {
    if (window.navigationHistory.length > 1) {
        window.navigationHistory.pop(); // remover estado actual
        const previousPage = window.navigationHistory[window.navigationHistory.length - 1];
        if (previousPage) {
            window.navigateTo(previousPage, false);
        } else {
            window.navigateTo('dashboard', false);
        }
    } else {
        // Si estamos en el home y da atrás, forzamos que se mantenga en el home en lugar de salir
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: 'dashboard' }, '', '');
        }
        window.navigateTo('dashboard', false);
    }
});

// Academy lections
window.openAcademyLesson = function(modId) {
    const container = document.getElementById('academyLessonContainer');
    const title = document.getElementById('academyLessonTitle');
    const content = document.getElementById('academyLessonContent');
    if (!container || !title || !content) return;
    
    container.style.display = 'block';
    if (modId === 1) {
        title.textContent = "Módulo 01: Saludos y Presentación en Turno";
        content.innerHTML = "• <strong>Nǐ hǎo (你好):</strong> Hola.<br>• <strong>Zǎo'ān (早安):</strong> Buenos días.<br>• <strong>Wǒ shì (我是):</strong> Yo soy...";
    } else {
        title.textContent = "Módulo 02: Reporte de Fallas";
        content.innerHTML = "• <strong>Bàojǐng (报警):</strong> Alarma.<br>• <strong>Tíngzhǐ (停止):</strong> Paro de máquina.";
    }
};

window.closeAcademyLesson = function() {
    const container = document.getElementById('academyLessonContainer');
    if (container) container.style.display = 'none';
};

window.completeAcademyLesson = function() {
    alert("¡Lección completada! +50 XP sumados.");
    window.closeAcademyLesson();
};
