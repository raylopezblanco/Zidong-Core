// ========================================================
// ZÌDÒNG CORE - APP CONTROLLER & ESCALAFÓN INDUSTRIAL
// ========================================================

const BLOCK_SIZE = 5;

let currentCategory = 'todos';
let currentLevel = 1;
let currentMode = 'flashcards';

let activeSessionPool = [];
let sessionCorrect = 0;
let sessionTotal = 0;

// TABLA DE RANGOS DE INGENIERÍA
const RANKS = [
    { title: "Practicante", minXP: 0, nextXP: 150, access: "N1 · OBSERVADOR" },
    { title: "Técnico", minXP: 150, nextXP: 400, access: "N2 · MANTENIMIENTO BÁSICO" },
    { title: "Especialista", minXP: 400, nextXP: 800, access: "N3 · DIAGNÓSTICO I/O" },
    { title: "Ingeniero Jr", minXP: 800, nextXP: 1500, access: "N4 · EDICIÓN DE RECETAS" },
    { title: "Ingeniero Full", minXP: 1500, nextXP: 2500, access: "N5 · MODIFICACIÓN PLC/HMI" },
    { title: "Ingeniero Sr", minXP: 2500, nextXP: 4000, access: "N6 · CALIBRACIÓN ROBÓTICA" },
    { title: "Superintendente", minXP: 4000, nextXP: 6000, access: "N7 · GESTIÓN DE CELDA" },
    { title: "Gerente", minXP: 6000, nextXP: 99999, access: "N8 · CONTROL MAESTRO DE PLANTA" }
];

function getCurrentRank(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXP) {
            return RANKS[i];
        }
    }
    return RANKS[0];
}

// REPRODUCTOR DE VOZ EN MANDARÍN (TTS NATIVO)
function playVoice(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    }
}

// PERSISTENCIA Y PERFIL DE USUARIO
function loadUserData() {
    let streak = parseInt(localStorage.getItem('zidong_streak') || '1');
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0');
    let username = localStorage.getItem('zidong_username') || 'Raymundo';
    let lastDate = localStorage.getItem('zidong_last_date');

    const today = new Date().toISOString().slice(0, 10);

    if (lastDate && lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().slice(0, 10);

        if (lastDate !== yestStr) {
            streak = 1;
            localStorage.setItem('zidong_streak', streak);
        }
    }

    const rank = getCurrentRank(xp);

    // Actualizar HUD superior
    document.getElementById('hud-username').innerText = username;
    document.getElementById('hud-avatar').innerText = username.charAt(0).toUpperCase();
    document.getElementById('hud-userrank').innerText = rank.title;
    document.getElementById('hud-streak-count').innerText = streak;
    document.getElementById('hud-xp-count').innerText = `${xp} XP`;
}

function saveUserName(newName) {
    const clean = newName.trim() || 'Operador';
    localStorage.setItem('zidong_username', clean);
    loadUserData();
}

function openProfileModal() {
    const xp = parseInt(localStorage.getItem('zidong_xp') || '0');
    const streak = parseInt(localStorage.getItem('zidong_streak') || '1');
    const username = localStorage.getItem('zidong_username') || 'Raymundo';
    const rank = getCurrentRank(xp);

    document.getElementById('modal-avatar').innerText = username.charAt(0).toUpperCase();
    document.getElementById('modal-name-input').value = username;
    document.getElementById('modal-rank-name').innerText = rank.title;
    document.getElementById('modal-access-level').innerText = `NIVEL ACCESO: ${rank.access}`;
    document.getElementById('modal-streak-val').innerText = streak;
    document.getElementById('modal-total-xp').innerText = xp;

    if (rank.nextXP >= 99999) {
        document.getElementById('modal-rank-progress').style.width = '100%';
        document.getElementById('modal-xp-details').innerText = 'Rango Máximo Alcanzado';
    } else {
        const xpInCurrentRank = xp - rank.minXP;
        const totalNeededInRank = rank.nextXP - rank.minXP;
        const pct = Math.min(100, Math.max(0, Math.round((xpInCurrentRank / totalNeededInRank) * 100)));
        document.getElementById('modal-rank-progress').style.width = `${pct}%`;
        document.getElementById('modal-xp-details').innerText = `${xp} / ${rank.nextXP} XP (${pct}%) para siguiente ascenso`;
    }

    document.getElementById('profile-modal').classList.add('active');
}

function closeProfileModal(e) {
    if (e.target.id === 'profile-modal') {
        document.getElementById('profile-modal').classList.remove('active');
    }
}

function closeProfileModalDirect() {
    document.getElementById('profile-modal').classList.remove('active');
}

function addXP(amount) {
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0') + amount;
    localStorage.setItem('zidong_xp', xp);
    loadUserData();
}

function registerDailyActivity() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('zidong_last_date');

    if (lastDate !== today) {
        let streak = parseInt(localStorage.getItem('zidong_streak') || '1');
        if (lastDate) streak++;
        localStorage.setItem('zidong_streak', streak);
        localStorage.setItem('zidong_last_date', today);
        document.getElementById('hud-streak-count').innerText = streak;
    }
}

// POOL Y SESIONES
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function refreshSessionPool() {
    const fullPool = vocabulary.filter(item => {
        const matchesLevel = item.level === currentLevel;
        const matchesTopic = (currentCategory === 'todos' || item.topic === currentCategory);
        return matchesLevel && matchesTopic;
    });

    activeSessionPool = shuffleArray(fullPool).slice(0, BLOCK_SIZE);
    updateProgressBar(0);
}

function updateProgressBar(stepIndex) {
    const percentage = Math.min(100, Math.round(((stepIndex + 1) / BLOCK_SIZE) * 100));
    document.getElementById('progress-bar-fill').style.width = `${percentage}%`;
}

function changeCategory(cat) {
    currentCategory = cat;
    refreshSessionPool();
    if (currentMode === 'flashcards') {
        currentFC = 0;
        updateFlashcard();
    } else if (currentMode === 'quiz') {
        initQuiz();
    } else if (currentMode === 'builder') {
        initBuilder();
    } else if (currentMode === 'scanner') {
        initScanner();
    }
}

function setLevel(lvl) {
    currentLevel = lvl;
    document.querySelectorAll('.level-pill').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === lvl);
    });

    refreshSessionPool();
    if (currentMode === 'flashcards') {
        currentFC = 0;
        updateFlashcard();
    } else if (currentMode === 'quiz') {
        initQuiz();
    } else if (currentMode === 'builder') {
        initBuilder();
    }
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));

    const levelContainer = document.getElementById('level-container');

    if (mode === 'flashcards') {
        document.querySelectorAll('.dock-item')[0].classList.add('active');
        document.getElementById('mode-flashcards').classList.add('active');
        levelContainer.style.display = 'grid';
        currentFC = 0;
        updateFlashcard();
    } else if (mode === 'quiz') {
        document.querySelectorAll('.dock-item')[1].classList.add('active');
        document.getElementById('mode-quiz').classList.add('active');
        levelContainer.style.display = 'grid';
        initQuiz();
    } else if (mode === 'builder') {
        document.querySelectorAll('.dock-item')[2].classList.add('active');
        document.getElementById('mode-builder').classList.add('active');
        currentLevel = 2;
        document.querySelectorAll('.level-pill').forEach((b, idx) => b.classList.toggle('active', idx === 1));
        refreshSessionPool();
        levelContainer.style.display = 'grid';
        initBuilder();
    } else if (mode === 'scanner') {
        document.querySelectorAll('.dock-item')[3].classList.add('active');
        document.getElementById('mode-scanner').classList.add('active');
        levelContainer.style.display = 'none';
        initScanner();
    }
}

function finishSession() {
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));
    document.getElementById('level-container').style.display = 'none';

    const percentage = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
    document.getElementById('summary-percentage').innerText = `${percentage}%`;
    document.getElementById('summary-details').innerText = `Validaste ${sessionCorrect} diagnósticos en este bloque.`;
    document.getElementById('mode-summary').classList.add('active');

    registerDailyActivity();
    addXP(sessionCorrect * 25);
}

function restartSession() {
    document.getElementById('mode-summary').classList.remove('active');
    refreshSessionPool();
    switchMode(currentMode);
}

// --------------------------------------------------------
// 1. FLASHCARDS
// --------------------------------------------------------
let currentFC = 0;
let isFlipped = false;

function renderFlashcardContent() {
    const body = document.getElementById('fc-body');
    const hanziElem = document.getElementById('fc-hanzi');
    const pinyinElem = document.getElementById('fc-pinyin');

    if (activeSessionPool.length === 0) {
        hanziElem.innerText = "--";
        pinyinElem.innerText = "";
        body.innerHTML = `<span class="inspect-badge">Sin términos</span>`;
        return;
    }

    const item = activeSessionPool[currentFC];
    updateProgressBar(currentFC);

    if (!isFlipped) {
        hanziElem.className = "hanzi-character";
        hanziElem.innerText = item.hanzi;
        pinyinElem.innerHTML = `
            ${item.pinyin} 
            <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--accent-cyan);" title="Escuchar">🔊</button>
        `;
        body.innerHTML = `<span class="inspect-badge">Toca para inspeccionar telemetría</span>`;
    } else {
        hanziElem.className = "meaning-title";
        hanziElem.innerText = item.meaning;
        pinyinElem.innerHTML = `
            ${item.hanzi} [${item.pinyin}] 
            <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--accent-cyan);" title="Escuchar">🔊</button>
        `;

        let chips = item.parts.map(p => 
            `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`
        ).join('');

        body.innerHTML = `
            <div class="telemetry-box">
                <div class="telemetry-chips">${chips}</div>
                <div class="telemetry-log">${item.summary}</div>
            </div>
        `;
    }
}

function updateFlashcard() {
    isFlipped = false;
    if (currentFC >= activeSessionPool.length) currentFC = 0;
    renderFlashcardContent();
    document.getElementById('fc-counter').innerText = `${currentFC + 1} / ${activeSessionPool.length}`;
}

function flipCard() {
    isFlipped = !isFlipped;
    renderFlashcardContent();
}

function nextCard() {
    if (activeSessionPool.length === 0) return;
    currentFC = (currentFC + 1) % activeSessionPool.length;
    updateFlashcard();
}

function prevCard() {
    if (activeSessionPool.length === 0) return;
    currentFC = (currentFC - 1 + activeSessionPool.length) % activeSessionPool.length;
    updateFlashcard();
}

// --------------------------------------------------------
// 2. QUIZ
// --------------------------------------------------------
let quizIndex = 0;

function initQuiz() {
    quizIndex = 0;
    sessionCorrect = 0;
    sessionTotal = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (quizIndex >= activeSessionPool.length) {
        finishSession();
        return;
    }

    updateProgressBar(quizIndex);
    const item = activeSessionPool[quizIndex];

    document.getElementById('quiz-next-btn').style.display = 'none';
    document.getElementById('quiz-breakdown').style.display = 'none';

    document.getElementById('quiz-hanzi').innerText = item.hanzi;
    document.getElementById('quiz-pinyin').innerHTML = `
        ${item.pinyin} 
        <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1rem; color:var(--accent-cyan);">🔊</button>
    `;

    let options = [item.meaning];
    let distractors = vocabulary.filter(v => v.meaning !== item.meaning).sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, distractors.length); i++) options.push(distractors[i].meaning);
    options.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('quiz-options');
    grid.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'matrix-button';
        btn.innerText = opt;
        btn.onclick = () => checkQuiz(btn, opt, item);
        grid.appendChild(btn);
    });
}

function checkQuiz(btn, selected, item) {
    const all = document.querySelectorAll('.matrix-button');
    all.forEach(b => b.style.pointerEvents = 'none');
    sessionTotal++;

    if (selected === item.meaning) {
        btn.classList.add('correct');
        sessionCorrect++;
    } else {
        btn.classList.add('incorrect');
        all.forEach(b => { if (b.innerText === item.meaning) b.classList.add('correct'); });
    }

    const popout = document.getElementById('quiz-breakdown');
    let chips = item.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
    popout.innerHTML = `<div class="telemetry-chips">${chips}</div><div class="telemetry-log">${item.summary}</div>`;
    popout.style.display = 'block';

    document.getElementById('quiz-next-btn').style.display = 'block';
}

function nextQuizQuestion() {
    quizIndex++;
    loadQuizQuestion();
}

// --------------------------------------------------------
// 3. TALLER ENSAMBLE
// --------------------------------------------------------
let builderIndex = 0;
let selectedBuilderChars = [];
let builderMistake = false;

function initBuilder() {
    builderIndex = 0;
    sessionCorrect = 0;
    sessionTotal = 0;
    loadBuilderQuestion();
}

function loadBuilderQuestion() {
    if (builderIndex >= activeSessionPool.length) {
        finishSession();
        return;
    }

    updateProgressBar(builderIndex);
    selectedBuilderChars = [];
    builderMistake = false;
    const item = activeSessionPool[builderIndex];
    const targetChars = item.hanzi.split('');

    document.getElementById('builder-next-btn').style.display = 'none';
    document.getElementById('builder-breakdown').style.display = 'none';
    document.getElementById('builder-meaning').innerText = item.meaning;

    const rail = document.getElementById('builder-slots');
    rail.innerHTML = '';
    for (let i = 0; i < targetChars.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'assembly-slot';
        slot.onclick = () => removeTile(i);
        rail.appendChild(slot);
    }

    const distractors = ['电', '缸', '模', '组', '臂', '门', '锁', '停', '警', '能', '未', '推'];
    let poolChars = [...targetChars];
    while (poolChars.length < targetChars.length + 3) {
        let r = distractors[Math.floor(Math.random() * distractors.length)];
        if (!poolChars.includes(r)) poolChars.push(r);
    }
    poolChars = shuffleArray(poolChars);

    const tray = document.getElementById('builder-pool');
    tray.innerHTML = '';
    poolChars.forEach((ch, idx) => {
        const tile = document.createElement('button');
        tile.className = 'component-tile';
        tile.innerText = ch;
        tile.id = `t-${idx}`;
        tile.onclick = () => pickTile(ch, `t-${idx}`);
        tray.appendChild(tile);
    });
}

function pickTile(char, id) {
    const item = activeSessionPool[builderIndex];
    if (selectedBuilderChars.length < item.hanzi.length) {
        selectedBuilderChars.push({ char, id });
        document.getElementById(id).classList.add('used');
        renderSlots();

        if (selectedBuilderChars.length === item.hanzi.length) {
            validateAssembly();
        }
    }
}

function removeTile(idx) {
    if (idx < selectedBuilderChars.length) {
        const rem = selectedBuilderChars.splice(idx, 1)[0];
        document.getElementById(rem.id).classList.remove('used');
        renderSlots();
    }
}

function renderSlots() {
    const slots = document.querySelectorAll('.assembly-slot');
    slots.forEach((s, i) => {
        if (i < selectedBuilderChars.length) {
            s.innerText = selectedBuilderChars[i].char;
            s.classList.add('active-dock');
        } else {
            s.innerText = '';
            s.classList.remove('active-dock');
        }
    });
}

function validateAssembly() {
    const item = activeSessionPool[builderIndex];
    const word = selectedBuilderChars.map(s => s.char).join('');
    const slots = document.querySelectorAll('.assembly-slot');

    sessionTotal++;
    if (word === item.hanzi) {
        slots.forEach(s => s.style.borderColor = 'var(--status-green)');
        if (!builderMistake) sessionCorrect++;

        playVoice(item.hanzi);

        const popout = document.getElementById('builder-breakdown');
        let chips = item.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
        popout.innerHTML = `<div class="telemetry-chips">${chips}</div><div class="telemetry-log">${item.summary}</div>`;
        popout.style.display = 'block';

        document.getElementById('builder-next-btn').style.display = 'block';
    } else {
        builderMistake = true;
        slots.forEach(s => s.style.borderColor = 'var(--status-red)');
        setTimeout(() => slots.forEach(s => s.style.borderColor = ''), 500);
    }
}

function nextBuilderQuestion() {
    builderIndex++;
    loadBuilderQuestion();
}

// --------------------------------------------------------
// 4. ESCÁNER HMI
// --------------------------------------------------------
let scannerPool = [];
let scannerIndex = 0;
let scannerLocked = false;

function initScanner() {
    const filtered = scannerScenarios.filter(s => currentCategory === 'todos' || s.topic === currentCategory);
    scannerPool = shuffleArray(filtered).slice(0, BLOCK_SIZE);
    scannerIndex = 0;
    sessionCorrect = 0;
    sessionTotal = 0;
    loadScannerQuestion();
}

function loadScannerQuestion() {
    if (scannerIndex >= scannerPool.length) {
        finishSession();
        return;
    }

    updateProgressBar(scannerIndex);
    scannerLocked = false;
    const item = scannerPool[scannerIndex];

    document.getElementById('scanner-next-btn').style.display = 'none';
    document.getElementById('scanner-breakdown').style.display = 'none';
    document.getElementById('scanner-task').innerText = item.prompt;

    const terminal = document.getElementById('scanner-alarm-display');
    terminal.innerHTML = '';

    item.tokens.forEach(tok => {
        const span = document.createElement('span');
        span.className = 'terminal-token';
        span.innerText = tok.text;

        if (tok.isTarget) {
            span.onclick = () => clickScannerToken(span, tok.hanzi, item);
        } else {
            span.classList.add('token-static');
        }
        terminal.appendChild(span);
    });
}

function clickScannerToken(span, clickedHanzi, item) {
    if (scannerLocked) return;

    sessionTotal++;
    if (clickedHanzi === item.targetHanzi) {
        scannerLocked = true;
        span.classList.add('success-hit');
        sessionCorrect++;

        playVoice(item.targetHanzi);

        const vocabInfo = vocabulary.find(v => v.hanzi === item.targetHanzi);
        const popout = document.getElementById('scanner-breakdown');

        if (vocabInfo) {
            let chips = vocabInfo.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
            popout.innerHTML = `
                <div style="font-weight: 800; color: var(--accent-cyan); margin-bottom: 4px;">${vocabInfo.hanzi} [${vocabInfo.pinyin}] - ${vocabInfo.meaning}</div>
                <div class="telemetry-chips">${chips}</div>
                <div class="telemetry-log">${vocabInfo.summary}</div>
            `;
            popout.style.display = 'block';
        }

        document.getElementById('scanner-next-btn').style.display = 'block';
    } else {
        span.classList.add('fail-hit');
        setTimeout(() => span.classList.remove('fail-hit'), 400);
    }
}

function nextScannerQuestion() {
    scannerIndex++;
    loadScannerQuestion();
}

// ARRANQUE INICIAL
loadUserData();
refreshSessionPool();
updateFlashcard();
