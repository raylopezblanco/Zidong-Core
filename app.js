// ========================================================
// CONTROL PRINCIPAL Y ESTADOS DE SESIÓN
// ========================================================

const BLOCK_SIZE = 5;

let currentCategory = 'todos';
let currentLevel = 1;
let currentMode = 'flashcards';

let activeSessionPool = [];
let sessionCorrect = 0;
let sessionTotal = 0;

// Utilidad: Barajado Fisher-Yates
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Genera un nuevo bloque de 5 al azar según nivel y tema
function refreshSessionPool() {
    const fullPool = vocabulary.filter(item => {
        const matchesLevel = item.level === currentLevel;
        const matchesTopic = (currentCategory === 'todos' || item.topic === currentCategory);
        return matchesLevel && matchesTopic;
    });

    activeSessionPool = shuffleArray(fullPool).slice(0, BLOCK_SIZE);
}

function getActivePool() {
    return activeSessionPool;
}

function resetScore() {
    sessionCorrect = 0;
    sessionTotal = 0;
    updateScoreUI();
}

function updateScoreUI() {
    document.getElementById('score-counter').innerText = `${sessionCorrect} / ${sessionTotal}`;
}

function changeCategory(cat) {
    currentCategory = cat;
    refreshSessionPool();
    if (currentMode === 'flashcards') {
        currentFC = 0;
        updateFlashcard();
    } else if (currentMode === 'quiz') {
        resetScore();
        initQuiz();
    } else if (currentMode === 'builder') {
        resetScore();
        initBuilder();
    } else if (currentMode === 'scanner') {
        resetScore();
        initScanner();
    }
}

function setLevel(lvl) {
    currentLevel = lvl;
    document.querySelectorAll('.level-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === lvl);
    });

    refreshSessionPool();

    if (currentMode === 'flashcards') {
        currentFC = 0;
        updateFlashcard();
    } else if (currentMode === 'quiz') {
        resetScore();
        initQuiz();
    } else if (currentMode === 'builder') {
        resetScore();
        initBuilder();
    }
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-view').forEach(view => view.style.display = 'none');

    const levelContainer = document.getElementById('level-container');
    const scoreBar = document.getElementById('session-score-bar');

    if (mode === 'flashcards') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('mode-flashcards').style.display = 'flex';
        levelContainer.style.display = 'flex';
        scoreBar.style.display = 'none';
        currentFC = 0;
        updateFlashcard();
    } else if (mode === 'quiz') {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('mode-quiz').style.display = 'flex';
        levelContainer.style.display = 'flex';
        scoreBar.style.display = 'flex';
        resetScore();
        initQuiz();
    } else if (mode === 'builder') {
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        document.getElementById('mode-builder').style.display = 'flex';
        currentLevel = 2;
        document.querySelectorAll('.level-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === 1);
        });
        refreshSessionPool();
        levelContainer.style.display = 'flex';
        scoreBar.style.display = 'flex';
        resetScore();
        initBuilder();
    } else if (mode === 'scanner') {
        document.querySelectorAll('.tab-btn')[3].classList.add('active');
        document.getElementById('mode-scanner').style.display = 'flex';
        levelContainer.style.display = 'none';
        scoreBar.style.display = 'flex';
        resetScore();
        initScanner();
    }
}

function finishSession() {
    document.querySelectorAll('.mode-view').forEach(view => view.style.display = 'none');
    document.getElementById('session-score-bar').style.display = 'none';
    document.getElementById('level-container').style.display = 'none';

    const percentage = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    document.getElementById('summary-percentage').innerText = `${percentage}%`;
    document.getElementById('summary-details').innerText = `Acertaste ${sessionCorrect} de ${sessionTotal} ejercicios en este bloque.`;
    document.getElementById('mode-summary').style.display = 'block';
}

function restartSession() {
    document.getElementById('mode-summary').style.display = 'none';
    refreshSessionPool();
    switchMode(currentMode);
}

// Atajo de teclado: Espacio o Enter avanza
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        const quizNext = document.getElementById('quiz-next-btn');
        const builderNext = document.getElementById('builder-next-btn');
        const scannerNext = document.getElementById('scanner-next-btn');

        if (currentMode === 'quiz' && quizNext && quizNext.style.display === 'block') {
            e.preventDefault();
            nextQuizQuestion();
        } else if (currentMode === 'builder' && builderNext && builderNext.style.display === 'block') {
            e.preventDefault();
            nextBuilderQuestion();
        } else if (currentMode === 'scanner' && scannerNext && scannerNext.style.display === 'block') {
            e.preventDefault();
            nextScannerQuestion();
        }
    }
});

// --------------------------------------------------------
// 1. FLASHCARDS
// --------------------------------------------------------
let currentFC = 0;
let isFlipped = false;

function renderFlashcardContent() {
    const pool = getActivePool();
    const body = document.getElementById('fc-body');
    
    if (pool.length === 0) {
        document.getElementById('fc-hanzi').innerText = "Vacío";
        document.getElementById('fc-pinyin').innerText = "";
        body.innerHTML = "<div style='margin-top:10px; color:var(--text-muted);'>No hay términos disponibles.</div>";
        return;
    }

    const item = pool[currentFC];
    if (!isFlipped) {
        document.getElementById('fc-hanzi').innerText = item.hanzi;
        document.getElementById('fc-pinyin').innerText = item.pinyin;
        body.innerHTML = `<div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px;">(Clic para ver significado y desglose)</div>`;
    } else {
        document.getElementById('fc-hanzi').innerText = item.meaning;
        document.getElementById('fc-pinyin').innerText = `${item.hanzi} [${item.pinyin}]`;
        
        const titleLabel = item.level === 1 ? "Radicales / Componentes:" : "Ecuación del Término:";
        let partsHtml = item.parts.map(p => 
            `<div class="part-chip"><span class="part-char">${p.char}</span><span class="part-desc">${p.desc}</span></div>`
        ).join('');

        body.innerHTML = `
            <div class="anatomy-box">
                <div class="anatomy-title">${titleLabel}</div>
                <div class="anatomy-parts">${partsHtml}</div>
                <div class="anatomy-summary">${item.summary}</div>
            </div>
        `;
    }
}

function updateFlashcard() {
    isFlipped = false;
    const pool = getActivePool();
    if (currentFC >= pool.length) currentFC = 0;
    renderFlashcardContent();
    document.getElementById('fc-counter').innerText = pool.length > 0 ? `${currentFC + 1} / ${pool.length}` : "0 / 0";
}

function flipCard() {
    isFlipped = !isFlipped;
    renderFlashcardContent();
}

function nextCard() {
    const pool = getActivePool();
    if (pool.length === 0) return;
    currentFC = (currentFC + 1) % pool.length;
    updateFlashcard();
}

function prevCard() {
    const pool = getActivePool();
    if (pool.length === 0) return;
    currentFC = (currentFC - 1 + pool.length) % pool.length;
    updateFlashcard();
}

// --------------------------------------------------------
// 2. QUIZ
// --------------------------------------------------------
let quizList = [];
let currentQuizIndex = 0;

function initQuiz() {
    quizList = [...getActivePool()];
    currentQuizIndex = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (currentQuizIndex >= quizList.length) {
        finishSession();
        return;
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'none';

    const breakdownBox = document.getElementById('quiz-breakdown');
    breakdownBox.style.display = 'none';

    const item = quizList[currentQuizIndex];
    document.getElementById('quiz-hanzi').innerText = item.hanzi;
    document.getElementById('quiz-pinyin').innerText = item.pinyin;

    let options = [item.meaning];
    let candidates = vocabulary.filter(p => p.meaning !== item.meaning);
    candidates.sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(3, candidates.length); i++) {
        options.push(candidates[i].meaning);
    }
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkQuizAnswer(btn, opt, item);
        optionsContainer.appendChild(btn);
    });
}

function checkQuizAnswer(selectedBtn, selectedOpt, item) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    sessionTotal++;

    if (selectedOpt === item.meaning) {
        selectedBtn.classList.add('correct');
        sessionCorrect++;
    } else {
        selectedBtn.classList.add('incorrect');
        allBtns.forEach(b => {
            if (b.innerText === item.meaning) b.classList.add('correct');
        });
    }

    updateScoreUI();

    const breakdownBox = document.getElementById('quiz-breakdown');
    const titleLabel = item.level === 1 ? "Estructura y Radicales:" : "Ecuación del Término:";
    let partsHtml = item.parts.map(p => 
        `<div class="part-chip"><span class="part-char">${p.char}</span><span class="part-desc">${p.desc}</span></div>`
    ).join('');

    breakdownBox.innerHTML = `
        <div class="anatomy-title">${titleLabel}</div>
        <div class="anatomy-parts">${partsHtml}</div>
        <div class="anatomy-summary">${item.summary}</div>
    `;
    breakdownBox.style.display = 'flex';

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
}

function nextQuizQuestion() {
    currentQuizIndex++;
    loadQuizQuestion();
}

// --------------------------------------------------------
// 3. TALLER ENSAMBLE
// --------------------------------------------------------
let builderList = [];
let builderIndex = 0;
let selectedChars = [];
let builderHadMistake = false;

function initBuilder() {
    const pool = vocabulary.filter(v => {
        const matchesLevel = v.level === 2;
        const matchesTopic = (currentCategory === 'todos' || v.topic === currentCategory);
        return matchesLevel && matchesTopic;
    });

    builderList = shuffleArray(pool).slice(0, BLOCK_SIZE);
    builderIndex = 0;
    loadBuilderQuestion();
}

function loadBuilderQuestion() {
    if (builderIndex >= builderList.length) {
        finishSession();
        return;
    }

    selectedChars = [];
    builderHadMistake = false;
    const item = builderList[builderIndex];
    const targetChars = item.hanzi.split('');

    const nextBtn = document.getElementById('builder-next-btn');
    nextBtn.style.display = 'none';

    const breakdownBox = document.getElementById('builder-breakdown');
    breakdownBox.style.display = 'none';

    document.getElementById('builder-meaning').innerText = item.meaning;

    const slotsContainer = document.getElementById('builder-slots');
    slotsContainer.innerHTML = '';
    for (let i = 0; i < targetChars.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.onclick = () => removeCharFromSlot(i);
        slotsContainer.appendChild(slot);
    }

    const distractorChars = ['龙', '门', '使', '能', '未', '缸', '推', '安', '锁', '警', '停', '电', '直', '模', '组', '块'];
    let poolChars = [...targetChars];
    
    while (poolChars.length < targetChars.length + 3) {
        let randChar = distractorChars[Math.floor(Math.random() * distractorChars.length)];
        if (!poolChars.includes(randChar)) {
            poolChars.push(randChar);
        }
    }
    poolChars = shuffleArray(poolChars);

    const poolContainer = document.getElementById('builder-pool');
    poolContainer.innerHTML = '';
    poolChars.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.className = 'tile-btn';
        btn.innerText = ch;
        btn.id = `tile-${idx}`;
        btn.onclick = () => selectTile(ch, `tile-${idx}`);
        poolContainer.appendChild(btn);
    });
}

function selectTile(char, tileId) {
    const item = builderList[builderIndex];
    const targetLen = item.hanzi.length;

    if (selectedChars.length < targetLen) {
        selectedChars.push({ char, tileId });
        document.getElementById(tileId).classList.add('used');
        updateSlots();

        if (selectedChars.length === targetLen) {
            validateAssembly();
        }
    }
}

function removeCharFromSlot(slotIndex) {
    if (slotIndex < selectedChars.length) {
        const removed = selectedChars.splice(slotIndex, 1)[0];
        document.getElementById(removed.tileId).classList.remove('used');
        updateSlots();
    }
}

function updateSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, i) => {
        if (i < selectedChars.length) {
            slot.innerText = selectedChars[i].char;
            slot.classList.add('filled');
        } else {
            slot.innerText = '';
            slot.classList.remove('filled');
        }
    });
}

function validateAssembly() {
    const item = builderList[builderIndex];
    const assembledWord = selectedChars.map(s => s.char).join('');
    const slots = document.querySelectorAll('.slot');

    if (assembledWord === item.hanzi) {
        slots.forEach(s => s.style.borderColor = 'var(--success)');
        
        sessionTotal++;
        if (!builderHadMistake) {
            sessionCorrect++;
        }
        updateScoreUI();

        const breakdownBox = document.getElementById('builder-breakdown');
        let partsHtml = item.parts.map(p => 
            `<div class="part-chip"><span class="part-char">${p.char}</span><span class="part-desc">${p.desc}</span></div>`
        ).join('');

        breakdownBox.innerHTML = `
            <div class="anatomy-title">Ecuación Técnica Resuelta:</div>
            <div class="anatomy-parts">${partsHtml}</div>
            <div class="anatomy-summary">${item.summary}</div>
        `;
        breakdownBox.style.display = 'flex';

        const nextBtn = document.getElementById('builder-next-btn');
        nextBtn.style.display = 'block';
    } else {
        builderHadMistake = true;
        slots.forEach(s => s.style.borderColor = 'var(--error)');
        setTimeout(() => {
            slots.forEach(s => s.style.borderColor = '');
        }, 600);
    }
}

function nextBuilderQuestion() {
    builderIndex++;
    loadBuilderQuestion();
}

// --------------------------------------------------------
// 4. ESCÁNER HMI
// --------------------------------------------------------
let scannerList = [];
let scannerIndex = 0;
let scannerResolved = false;

function initScanner() {
    const pool = scannerScenarios.filter(s => currentCategory === 'todos' || s.topic === currentCategory);
    scannerList = shuffleArray(pool).slice(0, BLOCK_SIZE);
    scannerIndex = 0;
    loadScannerQuestion();
}

function loadScannerQuestion() {
    if (scannerIndex >= scannerList.length) {
        finishSession();
        return;
    }

    scannerResolved = false;
    const scenario = scannerList[scannerIndex];

    document.getElementById('scanner-task').innerText = scenario.prompt;
    document.getElementById('scanner-next-btn').style.display = 'none';

    const breakdownBox = document.getElementById('scanner-breakdown');
    breakdownBox.style.display = 'none';

    const displayContainer = document.getElementById('scanner-alarm-display');
    displayContainer.innerHTML = '';

    scenario.tokens.forEach((token) => {
        const span = document.createElement('span');
        span.className = 'hmi-token';
        span.innerText = token.text;

        if (token.isTarget) {
            span.onclick = () => handleScannerClick(span, token.hanzi, scenario);
        } else {
            span.classList.add('token-plain');
        }

        displayContainer.appendChild(span);
    });
}

function handleScannerClick(tokenElem, clickedHanzi, scenario) {
    if (scannerResolved) return;

    if (clickedHanzi === scenario.targetHanzi) {
        scannerResolved = true;
        tokenElem.classList.add('hit-success');
        sessionTotal++;
        sessionCorrect++;
        updateScoreUI();

        const vocabInfo = vocabulary.find(v => v.hanzi === scenario.targetHanzi);
        const breakdownBox = document.getElementById('scanner-breakdown');

        if (vocabInfo) {
            let partsHtml = vocabInfo.parts.map(p => 
                `<div class="part-chip"><span class="part-char">${p.char}</span><span class="part-desc">${p.desc}</span></div>`
            ).join('');

            breakdownBox.innerHTML = `
                <div class="anatomy-title">Término Identificado en Pantalla:</div>
                <div style="font-size: 1.15rem; font-weight: bold; color: var(--accent); margin: 3px 0;">${vocabInfo.hanzi} [${vocabInfo.pinyin}] - ${vocabInfo.meaning}</div>
                <div class="anatomy-parts">${partsHtml}</div>
                <div class="anatomy-summary">${vocabInfo.summary}</div>
            `;
            breakdownBox.style.display = 'flex';
        }

        const nextBtn = document.getElementById('scanner-next-btn');
        nextBtn.style.display = 'block';
    } else {
        tokenElem.classList.add('hit-error');
        setTimeout(() => {
            tokenElem.classList.remove('hit-error');
        }, 500);
    }
}

function nextScannerQuestion() {
    scannerIndex++;
    loadScannerQuestion();
}

// Inicialización de arranque
refreshSessionPool();
updateFlashcard();