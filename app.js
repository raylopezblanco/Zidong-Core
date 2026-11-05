// ========================================================
// ZÌDÒNG CORE - DAILY BOUNTIES & FOCUS VOCABULARY ENGINE
// ========================================================

const BLOCK_SIZE = 5;

let currentSector = 'plc';
let currentMode = 'lobby';

let activeSessionPool = [];
let sessionCorrect = 0;
let sessionTotal = 0;
let comboCount = 0;

// DETERMINAR LA PALABRA DEL TURNO / DÍA SEGÚN LA FECHA
function getDailyFocusWord() {
    const today = new Date();
    const daySeed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 31 + today.getDate();
    const index = daySeed % vocabulary.length;
    return vocabulary[index];
}

const dailyFocusWord = getDailyFocusWord();

// MOTOR DE AUDIO SFX SINTETIZADO
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, comboMultiplier = 1) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
    } 
    else if (type === 'correct') {
        const baseFreq = 523.25;
        const step = Math.min(comboMultiplier, 5) * 60;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq + step, now);
        osc.frequency.setValueAtTime(baseFreq + step + 120, now + 0.07);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } 
    else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(75, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
    }
    else if (type === 'achievement') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(698.46, now);
        osc.frequency.setValueAtTime(1046.50, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
    }
}

// LOGROS DISPONIBLES
const ACHIEVEMENTS = [
    { id: "ach_saltamontes", icon: "🦗", title: "Pequeño Saltamontes", desc: "Completaste tu primera sesión en PLC Systems.", rewardXP: 150 },
    { id: "ach_chispazo", icon: "⚡", title: "Cuidado con el Chispazo", desc: "Dominaste términos críticos de Potencia.", rewardXP: 200 },
    { id: "ach_grano_arroz", icon: "🌾", title: "Grano de Arroz", desc: "Completaste 5 sesiones técnicas.", rewardXP: 250 },
    { id: "ach_agv_pilot", icon: "🤖", title: "Piloto de Cintas", desc: "Identificaste comandos y guiado de AGV.", rewardXP: 200 },
    { id: "ach_palacio_imperial", icon: "🏯", title: "Palacio Imperial", desc: "Obtuviste un PERFECT (100% de aciertos).", rewardXP: 300 },
    { id: "ach_dedos_rapidos", icon: "🚨", title: "Dedos Rápidos", desc: "Resolviste una alarma crítica sin error.", rewardXP: 200 }
];

function triggerAchievement(achId) {
    let unlocked = JSON.parse(localStorage.getItem('zidong_achievements') || '[]');
    if (unlocked.includes(achId)) return;

    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return;

    unlocked.push(achId);
    localStorage.setItem('zidong_achievements', JSON.stringify(unlocked));

    playSound('achievement');
    const toast = document.getElementById('xbox-achievement-toast');
    document.getElementById('toast-achievement-name').innerText = `${ach.icon} ${ach.title} (+${ach.rewardXP} XP)`;
    toast.classList.add('active');

    setTimeout(() => toast.classList.remove('active'), 3800);

    addXP(ach.rewardXP);
    renderAchievements();
}

function renderAchievements() {
    const listContainer = document.getElementById('achievements-list');
    if (!listContainer) return;

    let unlocked = JSON.parse(localStorage.getItem('zidong_achievements') || '[]');
    listContainer.innerHTML = '';

    document.getElementById('ach-unlocked-counter').innerText = `${unlocked.length} / ${ACHIEVEMENTS.length}`;

    ACHIEVEMENTS.forEach(ach => {
        const isDone = unlocked.includes(ach.id);
        const tile = document.createElement('div');
        tile.className = `achievement-tile ${isDone ? 'unlocked' : ''}`;
        tile.innerHTML = `
            <div class="ach-icon-circle">${isDone ? ach.icon : '🔒'}</div>
            <div style="flex:1;">
                <div style="display:flex; justify-content:space-between;">
                    <span class="ach-name">${ach.title}</span>
                    <span style="font-family:var(--font-mono); font-size:0.65rem; color:var(--cyber-cyan);">+${ach.rewardXP} XP</span>
                </div>
                <div style="font-size:0.68rem; color:var(--text-dim);">${ach.desc}</div>
            </div>
        `;
        listContainer.appendChild(tile);
    });
}

// GESTIÓN DE MISIONES DIARIAS Y FECHAS
function getDailyMissionStatus() {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('zidong_dm_date');
    
    if (savedDate !== today) {
        // Nuevo día: resetear misiones diarias
        localStorage.setItem('zidong_dm_date', today);
        localStorage.setItem('zidong_dm_1', 'false');
        localStorage.setItem('zidong_dm_2', 'false');
    }

    return {
        m1: localStorage.getItem('zidong_dm_1') === 'true',
        m2: localStorage.getItem('zidong_dm_2') === 'true'
    };
}

function completeDailyMission(num) {
    const status = getDailyMissionStatus();
    if (num === 1 && !status.m1) {
        localStorage.setItem('zidong_dm_1', 'true');
        addXP(200);
        playSound('achievement');
    }
    if (num === 2 && !status.m2) {
        localStorage.setItem('zidong_dm_2', 'true');
        addXP(250);
        playSound('achievement');
    }
    renderDailyMissions();
}

function renderDailyMissions() {
    const status = getDailyMissionStatus();
    const card1 = document.getElementById('dm-card-1');
    const card2 = document.getElementById('dm-card-2');
    const tag1 = document.getElementById('dm-status-1');
    const tag2 = document.getElementById('dm-status-2');
    const badgeCounter = document.getElementById('daily-badge-counter');

    let pending = 0;

    if (status.m1) {
        card1.classList.add('done');
        tag1.innerHTML = '<span>✔</span><span>COMPLETA</span>';
    } else {
        card1.classList.remove('done');
        tag1.innerHTML = '<span>🚨</span><span>PENDIENTE</span>';
        pending++;
    }

    if (status.m2) {
        card2.classList.add('done');
        tag2.innerHTML = '<span>✔</span><span>COMPLETA</span>';
    } else {
        card2.classList.remove('done');
        tag2.innerHTML = '<span>🚨</span><span>PENDIENTE</span>';
        pending++;
    }

    if (pending === 0) {
        badgeCounter.innerText = 'TODO LISTO';
        badgeCounter.style.color = 'var(--cyber-green)';
        badgeCounter.style.borderColor = 'rgba(34,197,94,0.4)';
        badgeCounter.style.backgroundColor = 'rgba(34,197,94,0.15)';
    } else {
        badgeCounter.innerText = `${pending} ACTIVAS`;
        badgeCounter.style.color = 'var(--cyber-red)';
        badgeCounter.style.borderColor = 'rgba(239,68,68,0.3)';
        badgeCounter.style.backgroundColor = 'rgba(239,68,68,0.15)';
    }
}

function startDailyBounty(num) {
    playSound('click');
    if (num === 1) {
        currentSector = dailyFocusWord.topic;
        refreshSessionPool();
        switchMode('quiz');
    } else if (num === 2) {
        currentSector = 'seguridad';
        switchMode('scanner');
    }
}

// TABLA DE RANGOS
const RANKS = [
    { title: "PRACTICANTE", minXP: 0, nextXP: 150 },
    { title: "TÉCNICO", minXP: 150, nextXP: 400 },
    { title: "ESPECIALISTA", minXP: 400, nextXP: 800 },
    { title: "INGENIERO JR", minXP: 800, nextXP: 1500 },
    { title: "INGENIERO FULL", minXP: 1500, nextXP: 2500 },
    { title: "INGENIERO SR", minXP: 2500, nextXP: 4000 },
    { title: "SUPERINTENDENTE", minXP: 4000, nextXP: 6000 },
    { title: "GERENTE", minXP: 6000, nextXP: 99999 }
];

function getCurrentRank(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXP) return RANKS[i];
    }
    return RANKS[0];
}

function loadUserData() {
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0');
    let username = localStorage.getItem('zidong_username') || 'ENGINEER 001';

    const rank = getCurrentRank(xp);

    document.getElementById('op-name').innerText = username;
    document.getElementById('op-avatar').innerText = username.charAt(0).toUpperCase();
    document.getElementById('op-rank').innerText = `RANK: ${rank.title}`;
    document.getElementById('op-xp-total').innerText = xp.toLocaleString();

    if (rank.nextXP >= 99999) {
        document.getElementById('op-next-pct').innerText = 'MAX';
        document.getElementById('op-bar-fill').style.width = '100%';
    } else {
        const xpInRank = xp - rank.minXP;
        const totalNeeded = rank.nextXP - rank.minXP;
        const pct = Math.min(100, Math.max(0, Math.round((xpInRank / totalNeeded) * 100)));
        document.getElementById('op-next-pct').innerText = `${pct}%`;
        document.getElementById('op-bar-fill').style.width = `${pct}%`;
    }

    // Renderizar palabra del día
    document.getElementById('daily-focus-hanzi').innerText = dailyFocusWord.hanzi;
    document.getElementById('daily-focus-pinyin').innerText = dailyFocusWord.pinyin;
    document.getElementById('daily-focus-meaning').innerText = dailyFocusWord.meaning;

    renderDailyMissions();
    renderAchievements();
}

function addXP(amount) {
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0') + amount;
    localStorage.setItem('zidong_xp', xp);
    loadUserData();
}

// NAVEGACIÓN
function enterLobby() {
    playSound('click');
    currentMode = 'lobby';
    document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dock-item')[0].classList.add('active');
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));
    document.getElementById('mode-lobby').classList.add('active');
}

function selectSector(topic) {
    playSound('click');
    currentSector = topic;
    refreshSessionPool();
    switchMode('flashcards');
}

function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ARMAR EL POOL CON PRIORIDAD AL TÉRMINO DEL DÍA
function refreshSessionPool() {
    let pool = vocabulary.filter(v => v.topic === currentSector);
    let shuffled = shuffleArray(pool);

    // Si la palabra del día pertenece a este sector o estamos en sesión general, ponerla en la posición 1
    if (dailyFocusWord.topic === currentSector) {
        shuffled = [dailyFocusWord, ...shuffled.filter(item => item.hanzi !== dailyFocusWord.hanzi)];
    }

    activeSessionPool = shuffled.slice(0, BLOCK_SIZE);
}

function switchMode(mode) {
    playSound('click');
    currentMode = mode;

    document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));

    if (mode === 'lobby') {
        document.querySelectorAll('.dock-item')[0].classList.add('active');
        document.getElementById('mode-lobby').classList.add('active');
    } else if (mode === 'achievements') {
        document.querySelectorAll('.dock-item')[1].classList.add('active');
        document.getElementById('mode-achievements').classList.add('active');
        renderAchievements();
    } else if (mode === 'flashcards') {
        document.querySelectorAll('.dock-item')[2].classList.add('active');
        document.getElementById('mode-flashcards').classList.add('active');
        currentFC = 0;
        updateFlashcard();
    } else if (mode === 'quiz') {
        document.querySelectorAll('.dock-item')[3].classList.add('active');
        document.getElementById('mode-quiz').classList.add('active');
        initQuiz();
    } else if (mode === 'scanner') {
        document.querySelectorAll('.dock-item')[4].classList.add('active');
        document.getElementById('mode-scanner').classList.add('active');
        initScanner();
    }
}

function finishSession() {
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));

    const percentage = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
    const badgeContainer = document.getElementById('summary-badge-container');

    if (percentage === 100) {
        playSound('correct');
        badgeContainer.innerHTML = `<span style="font-family:var(--font-display); font-size:1.6rem; color:var(--cyber-yellow); font-weight:900;">PERFECT ★</span>`;
        addXP(sessionCorrect * 35);
        triggerAchievement('ach_palacio_imperial');
    } else {
        playSound('correct');
        badgeContainer.innerHTML = `<span style="font-family:var(--font-display); font-size:1.1rem; color:var(--cyber-cyan);">MISIÓN CONCLUIDA</span>`;
        addXP(sessionCorrect * 25);
    }

    document.getElementById('summary-percentage').innerText = `${percentage}%`;
    document.getElementById('summary-details').innerText = `Validaste ${sessionCorrect} reactivos de ${currentSector.toUpperCase()}.`;
    document.getElementById('mode-summary').classList.add('active');

    // Comprobar si se completó misión diaria 2 en el escáner
    if (currentMode === 'scanner' && sessionCorrect >= 1) {
        completeDailyMission(2);
    }

    if (currentSector === 'plc' && sessionCorrect > 0) triggerAchievement('ach_saltamontes');
    if (currentSector === 'electricidad' && sessionCorrect > 0) triggerAchievement('ach_chispazo');
    if (currentSector === 'agv' && sessionCorrect > 0) triggerAchievement('ach_agv_pilot');

    let totalRuns = parseInt(localStorage.getItem('zidong_completed_runs') || '0') + 1;
    localStorage.setItem('zidong_completed_runs', totalRuns);
    if (totalRuns >= 5) triggerAchievement('ach_grano_arroz');
}

function playVoice(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    }
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
        body.innerHTML = `<span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--cyber-cyan);">SIN TÉRMINOS</span>`;
        return;
    }

    const item = activeSessionPool[currentFC];

    if (!isFlipped) {
        hanziElem.innerText = item.hanzi;
        pinyinElem.innerHTML = `
            ${item.pinyin} 
            <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--cyber-cyan);">🔊</button>
        `;
        body.innerHTML = `<span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--cyber-cyan);">[ TOCAR PARA INSPECCIONAR ]</span>`;
    } else {
        hanziElem.innerText = item.meaning;
        pinyinElem.innerHTML = `
            ${item.hanzi} [${item.pinyin}] 
            <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--cyber-cyan);">🔊</button>
        `;

        let chips = item.parts.map(p => 
            `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`
        ).join('');

        body.innerHTML = `
            <div class="telemetry-box">
                <div class="telemetry-chips">${chips}</div>
                <div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">${item.summary}</div>
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
    playSound('click');
    isFlipped = !isFlipped;
    renderFlashcardContent();
}

function nextCard() {
    playSound('click');
    if (activeSessionPool.length === 0) return;
    currentFC = (currentFC + 1) % activeSessionPool.length;
    updateFlashcard();
}

function prevCard() {
    playSound('click');
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
    comboCount = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (quizIndex >= activeSessionPool.length) {
        finishSession();
        return;
    }

    const item = activeSessionPool[quizIndex];
    document.getElementById('quiz-next-btn').style.display = 'none';
    document.getElementById('quiz-breakdown').style.display = 'none';

    document.getElementById('quiz-hanzi').innerText = item.hanzi;
    document.getElementById('quiz-pinyin').innerHTML = `
        ${item.pinyin} 
        <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1rem; color:var(--cyber-cyan);">🔊</button>
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
        comboCount++;
        playSound('correct', comboCount);
        btn.classList.add('correct');
        sessionCorrect++;

        // Si acertó la palabra del turno, completar Misión Diaria 1
        if (item.hanzi === dailyFocusWord.hanzi) {
            completeDailyMission(1);
        }
    } else {
        comboCount = 0;
        playSound('wrong');
        btn.classList.add('incorrect');
        all.forEach(b => { if (b.innerText === item.meaning) b.classList.add('correct'); });
    }

    const popout = document.getElementById('quiz-breakdown');
    let chips = item.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
    popout.innerHTML = `<div class="telemetry-chips">${chips}</div><div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">${item.summary}</div>`;
    popout.style.display = 'block';

    document.getElementById('quiz-next-btn').style.display = 'block';
}

function nextQuizQuestion() {
    playSound('click');
    quizIndex++;
    loadQuizQuestion();
}

// --------------------------------------------------------
// 3. ESCÁNER
// --------------------------------------------------------
let scannerPool = [];
let scannerIndex = 0;
let scannerLocked = false;

function initScanner() {
    const filtered = scannerScenarios.filter(s => s.topic === currentSector || currentSector === 'seguridad');
    scannerPool = shuffleArray(filtered.length > 0 ? filtered : scannerScenarios).slice(0, BLOCK_SIZE);
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
            span.style.cursor = 'default';
            span.style.color = '#475569';
        }
        terminal.appendChild(span);
    });
}

function clickScannerToken(span, clickedHanzi, item) {
    if (scannerLocked) return;

    sessionTotal++;
    if (clickedHanzi === item.targetHanzi) {
        playSound('correct');
        scannerLocked = true;
        span.classList.add('success-hit');
        sessionCorrect++;

        playVoice(item.targetHanzi);

        if (item.targetHanzi === "急停") triggerAchievement('ach_dedos_rapidos');

        const vocabInfo = vocabulary.find(v => v.hanzi === item.targetHanzi);
        const popout = document.getElementById('scanner-breakdown');

        if (vocabInfo) {
            let chips = vocabInfo.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
            popout.innerHTML = `
                <div style="font-weight: 800; color: var(--cyber-cyan); margin-bottom: 4px;">${vocabInfo.hanzi} [${vocabInfo.pinyin}] - ${vocabInfo.meaning}</div>
                <div class="telemetry-chips">${chips}</div>
                <div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">${vocabInfo.summary}</div>
            `;
            popout.style.display = 'block';
        }

        document.getElementById('scanner-next-btn').style.display = 'block';
    } else {
        playSound('wrong');
        span.classList.add('fail-hit');
        setTimeout(() => span.classList.remove('fail-hit'), 400);
    }
}

function nextScannerQuestion() {
    playSound('click');
    scannerIndex++;
    loadScannerQuestion();
}

// ARRANQUE
loadUserData();
enterLobby();
