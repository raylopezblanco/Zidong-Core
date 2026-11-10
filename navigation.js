
// Sistema de Navegación con soporte para historial de atajos y botón Atrás del celular
const navigationHistory = ['dashboard'];

function navigateTo(pageId, pushHistory = true) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        
        if (pushHistory && navigationHistory[navigationHistory.length - 1] !== pageId) {
            navigationHistory.push(pageId);
        }

        // Actualizar estado activo en barra inferior
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(pageId)) {
                item.classList.add('active');
            }
        });
    }
}

// Escuchar botón atrás del navegador / celular para evitar que cierre la app
window.addEventListener('popstate', (event) => {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // quitar actual
        const previousPage = navigationHistory[navigationHistory.length - 1];
        navigateTo(previousPage, false);
    }
});

// Funciones para Academy
function openAcademyLesson(modId) {
    const container = document.getElementById('academyLessonContainer');
    const title = document.getElementById('academyLessonTitle');
    const content = document.getElementById('academyLessonContent');
    if (!container || !title || !content) return;
    
    container.style.display = 'block';
    if (modId === 1) {
        title.textContent = "Módulo 01: Saludos y Presentación en Turno";
        content.innerHTML = "• <strong>Nǐ hǎo (你好):</strong> Hola.<br>• <strong>Zǎo'ān (早安):</strong> Buenos días / Inicio de turno.<br>• <strong>Wǒ shì... (我是...):</strong> Yo soy [Nombre / Técnico].<br>• <strong>Qǐng bāngzhù (请帮助):</strong> Por favor ayuda.";
    } else if (modId === 2) {
        title.textContent = "Módulo 02: Reporte de Fallas y Emergencias";
        content.innerHTML = "• <strong>Bàojǐng (报警):</strong> Alarma / Código de error.<br>• <strong>Jīqìng gùzhàng (机器故障):</strong> Falla en máquina.<br>• <strong>Tíngzhǐ (停止):</strong> Detener / Paro.<br>• <strong>Kuài lái (快来):</strong> Ven rápido / Emergencia en línea.";
    } else {
        title.textContent = "Módulo 03: Estructura de Preguntas y Órdenes";
        content.innerHTML> = "• <strong>Zài nǎlǐ (在哪里):</strong> ¿Dónde está?<br>• <strong>Hǎo le ma (好了吗):</strong> ¿Está listo / calibrado?<br>• <strong>Méiyǒu wèntí (没有问题):</strong> Sin problema / Todo OK.";
    }
}

function closeAcademyLesson() {
    const container = document.getElementById('academyLessonContainer');
    if (container) container.style.display = 'none';
}

function completeAcademyLesson() {
    alert("¡Lección completada! +50 XP sumados a tu batería de planta.");
    closeAcademyLesson();
}
