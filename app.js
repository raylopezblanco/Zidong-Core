// ========================================================
// ZÌDÒNG CORE - APP CONTROLLER CON PERSISTENCIA
// ========================================================

const BLOCK_SIZE = 5;

let currentCategory = 'todos';
let currentLevel = 1;
let currentMode = 'flashcards';

let activeSessionPool = [];
let sessionCorrect = 0;
let sessionTotal = 0;

// SISTEMA DE RACHA Y XP CON LOCALSTORAGE
function loadUserData() {
    let streak = parseInt(localStorage.getItem('zidong_streak') || '1');
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0');
    let lastDate = localStorage.getItem('zidong_last_date');

    const today = new Date().toISOString().slice(0, 10);

    if (lastDate && lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().slice(0, 10);

        if (lastDate !== yestStr) {
            streak = 1; // Se reinicia la racha si pasó más de un día
            localStorage.setItem('zidong_streak', streak);
        }
    }

    document.getElementById('hud-streak-count').innerText = streak;
    document.getElementById('hud-xp-count').innerText = `${xp} XP`;
}

function addXP(amount) {
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0') + amount;
    localStorage.setItem('zidong_xp', xp);
    document.getElementById('hud-xp-count').innerText = `${xp} XP`;
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

// BARAJADO DE SESIÓN
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
    document.querySelectorAll('.pill-btn').forEach((btn, idx) => {
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
    document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));

    const levelContainer = document.getElementById('level-container');

    if (mode === 'flashcards') {
        document.querySelectorAll('.dock-tab')[0].classList.add('active');
        document.getElementById('mode-flashcards').classList.add('active');
        levelContainer.style.display = 'flex';
        currentFC = 0;
        updateFlashcard();
    } else if (mode === 'quiz') {
        document.querySelectorAll('.dock-tab')[1].classList.add('active');
        document.getElementById('mode-quiz').classList.add('active');
        levelContainer.style.display = 'flex';
        initQuiz();
    } else if (mode === 'builder') {
        document.querySelectorAll('.dock-tab')[2].classList.add('active');
        document.getElementById('mode-builder').classList.add('active');
        currentLevel = 2;
        document.querySelectorAll('.pill-btn').forEach((b, idx) => b.classList.toggle('active', idx === 1));
        refreshSessionPool();
        levelContainer.style.display = 'flex';
        initBuilder();
    } else if (mode === 'scanner') {
        document.querySelectorAll('.dock-tab')[3].classList.add('active');
        document.getElementById('mode-scanner').classList.add('active');
        levelContainer.style.display = 'none';
        initScanner();
    }
}

function finishSession() {
    document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));
    document.getElementById('level-container').style.display = 'none';

    const percentage = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
    document.getElementById('summary-percentage').innerText = `${percentage}%`;
    document.getElementById('summary-details').innerText = `Completaste ${sessionCorrect} aciertos en este bloque.`;
    document.getElementById('mode-summary').classList.add('active');

    registerDailyActivity();
    addXP(sessionCorrect * 15);
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
    if (activeSessionPool.length === 0) {
        document.getElementById('fc-hanzi').innerText = "--";
        document.getElementById('fc-pinyin').innerText = "";
        body.innerHTML = `<span class="tap-hint">Sin términos</span>`;
        return;
    }

    const item = activeSessionPool[currentFC];
    updateProgressBar(currentFC);

    if (!isFlipped) {
        document.getElementById('fc-hanzi').innerText = item.hanzi;
        document.getElementById('fc-pinyin').innerText = item.pinyin;
        body.innerHTML = `<span class="tap-hint">Toca para inspeccionar desglose</span>`;
    } else {
        document.getElementById('fc-hanzi').innerText = item.meaning;
        document.getElementById('fc-pinyin').innerText = `${item.hanzi} [${item.pinyin}]`;

        let chips = item.parts.map(p => 
            `<div class="anatomy-chip"><strong>${p.char}</strong> ${p.desc}</div>`
        ).join('');

        body.innerHTML = `
            <div class="anatomy-popout">
                <div class="chips-row">${chips}</div>
                <div class="anatomy-desc">${item.summary}</div>
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
    document.getElementById('quiz-pinyin').innerText = item.pinyin;

    let options = [item.meaning];
    let distractors = vocabulary.filter(v => v.meaning !== item.meaning).sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, distractors.length); i++) options.push(distractors[i].meaning);
    options.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('quiz-options');
    grid.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-cell';
        btn.innerText = opt;
        btn.onclick = () => checkQuiz(btn, opt, item);
        grid.appendChild(btn);
    });
}

function checkQuiz(btn, selected, item) {
    const all = document.querySelectorAll('.option-cell');
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
    let chips = item.parts.map(p => `<div class="anatomy-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
    popout.innerHTML = `<div class="chips-row">${chips}</div><div class="anatomy-desc">${item.summary}</div>`;
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
        slot.className = 'slot-box';
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
        tile.className = 'tile-press';
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
    const slots = document.querySelectorAll('.slot-box');
    slots.forEach((s, i) => {
        if (i < selectedBuilderChars.length) {
            s.innerText = selectedBuilderChars[i].char;
            s.classList.add('filled');
        } else {
            s.innerText = '';
            s.classList.remove('filled');
        }
    });
}

function validateAssembly() {
    const item = activeSessionPool[builderIndex];
    const word = selectedBuilderChars.map(s => s.char).join('');
    const slots = document.querySelectorAll('.slot-box');

    sessionTotal++;
    if (word === item.hanzi) {
        slots.forEach(s => s.style.borderColor = 'var(--success)');
        if (!builderMistake) sessionCorrect++;

        const popout = document.getElementById('builder-breakdown');
        let chips = item.parts.map(p => `<div class="anatomy-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
        popout.innerHTML = `<div class="chips-row">${chips}</div><div class="anatomy-desc">${item.summary}</div>`;
        popout.style.display = 'block';

        document.getElementById('builder-next-btn').style.display = 'block';
    } else {
        builderMistake = true;
        slots.forEach(s => s.style.borderColor = 'var(--danger)');
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
        span.className = 'hmi-token-unit';
        span.innerText = tok.text;

        if (tok.isTarget) {
            span.onclick = () => clickScannerToken(span, tok.hanzi, item);
        } else {
            span.classList.add('plain');
        }
        terminal.appendChild(span);
    });
}

function clickScannerToken(span, clickedHanzi, item) {
    if (scannerLocked) return;

    sessionTotal++;
    if (clickedHanzi === item.targetHanzi) {
        scannerLocked = true;
        span.classList.add('hit-success');
        sessionCorrect++;

        const vocabInfo = vocabulary.find(v => v.hanzi === item.targetHanzi);
        const popout = document.getElementById('scanner-breakdown');

        if (vocabInfo) {
            let chips = vocabInfo.parts.map(p => `<div class="anatomy-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
            popout.innerHTML = `
                <div style="font-weight: 800; color: var(--accent-blue); margin-bottom: 4px;">${vocabInfo.hanzi} [${vocabInfo.pinyin}] - ${vocabInfo.meaning}</div>
                <div class="chips-row">${chips}</div>
                <div class="anatomy-desc">${vocabInfo.summary}</div>
            `;
            popout.style.display = 'block';
        }

        document.getElementById('scanner-next-btn').style.display = 'block';
    } else {
        span.classList.add('hit-error');
        setTimeout(() => span.classList.remove('hit-error'), 400);
    }
}

function nextScannerQuestion() {
    scannerIndex++;
    loadScannerQuestion();
}

// ARRANQUE
loadUserData();
refreshSessionPool();
updateFlashcard();
