window.navigationHistory = ['dashboard'];

window.MINIGAME_LOCK_PAGES = ['level01', 'hanziSwapPage', 'vsBattle', 'arcade'];
window.minigameSessionLocked = false;

window.setMinigameLock = function(locked) {
    window.minigameSessionLocked = Boolean(locked);
    if (window.minigameSessionLocked) {
        document.body.classList.add('in-minigame-lock');
    } else {
        document.body.classList.remove('in-minigame-lock');
    }
};

window.syncMinigameBarForPage = function(pageId) {
    const isGameView = window.MINIGAME_LOCK_PAGES.includes(pageId);
    if (isGameView) {
        document.body.classList.add('in-minigame-lock');
    } else if (!window.minigameSessionLocked) {
        document.body.classList.remove('in-minigame-lock');
    }
};


if (window.history && window.history.replaceState) {
    window.history.replaceState({ page: 'dashboard' }, '', '');
}

window.navigateTo = function(pageId, pushHistory = true) {
    const currentActive = document.querySelector('.page.active');
    const currentId = currentActive ? currentActive.id : 'dashboard';
    if (window.minigameSessionLocked && pageId !== currentId && window.MINIGAME_LOCK_PAGES.includes(currentId)) {
        return;
    }

    const target = document.getElementById(pageId);
    if (target) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('active'));
        if (typeof window.syncMinigameBarForPage === 'function') {
            window.syncMinigameBarForPage(pageId);
        }
        if (window.ZidongAudio && typeof window.ZidongAudio.syncTrackWithPage === 'function') {
            window.ZidongAudio.syncTrackWithPage(pageId);
        }
        target.classList.add('active');
        window.scrollTo(0, 0);

        if (pageId === 'dashboard' && typeof window.updateProfile === 'function') {
            window.updateProfile();
        }
        if (pageId === 'career' && typeof window.renderCareerPlanetsMenu === 'function') {
            window.renderCareerPlanetsMenu();
        }
        if (pageId === 'leaderboard' && typeof window.renderLeaderboard === 'function') {
            window.renderLeaderboard();
        }
        if (pageId === 'profile' && typeof window.updateProfile === 'function') {
            window.updateProfile();
        }
        if (pageId === 'hanziLab' && typeof window.renderLabComponents === 'function') {
            window.renderLabComponents('all', '');
        }
        
        if (pushHistory) {
            if (window.navigationHistory[window.navigationHistory.length - 1] !== pageId) {
                window.navigationHistory.push(pageId);
                if (window.history && window.history.pushState) {
                    window.history.pushState({ page: pageId }, '', '');
                }
            }
        }

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

window.addEventListener('popstate', (event) => {
    const currentActive = document.querySelector('.page.active');
    const currentId = currentActive ? currentActive.id : 'dashboard';
    if (window.minigameSessionLocked && window.MINIGAME_LOCK_PAGES.includes(currentId)) {
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: currentId }, '', '');
        }
        return;
    }
    if (window.navigationHistory.length > 1) {
        window.navigationHistory.pop();
        const previousPage = window.navigationHistory[window.navigationHistory.length - 1];
        if (previousPage) {
            window.navigateTo(previousPage, false);
        } else {
            window.navigateTo('dashboard', false);
        }
    } else {
        if (window.history && window.history.pushState) {
            window.history.pushState({ page: 'dashboard' }, '', '');
        }
        window.navigateTo('dashboard', false);
    }
});

window.openAcademyLesson = function(modId) {
    if (typeof window.showCyberAlert === 'function') {
        window.showCyberAlert("ACADEMY OBERON", "Abriendo módulo de Academy #" + modId, "📖");
    } else {
        alert("Abriendo módulo de Academy #" + modId);
    }
};