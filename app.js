// ========================================================
// ZÌDÒNG CORE - HUB CONTROLLER & SPECIALTY ROUTING
// ========================================================

const BLOCK_SIZE = 5;

let currentSpecialty = 'plc';
let currentMode = 'lobby';

let activeSessionPool = [];
let sessionCorrect = 0;
let sessionTotal = 0;

// MOTOR DE AUDIO SFX SINTETIZADO
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
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
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
    } 
    else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(739.99, now + 0.06);
        osc.frequency.setValueAtTime(880.00, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
    } 
    else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    }
}

function triggerErrorShake(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.remove('screen-shake');
        void el.offsetWidth;
        el.classList.add('screen-shake');
        setTimeout(() => el.classList.remove('screen-shake'), 400);
    }
}

// PERSISTENCIA Y USUARIO
function loadUserData() {
    let streak = parseInt(localStorage.getItem('zidong_streak') || '1');
    let xp = parseInt(localStorage.getItem('zidong_xp') || '0');
    let username = localStorage.getItem('zidong_username') || 'Raymundo';

    document.getElementById('hud-username').innerText = username;
    document.getElementById('hud-avatar').innerText = username.charAt(0).toUpperCase();
    document.getElementById('hud-streak-count').innerText = streak;
    document.getElementById('hud-xp-count').innerText = `${xp} XP`;
}

function saveUserName(newName) {
    const clean = newName.trim() || 'Operador';
    localStorage.setItem('zidong_username', clean);
    playSound('click');
    loadUserData();
}

function openProfileModal() {
    playSound('click');
    document.getElementById('profile-modal').classList.add('active');
}
function closeProfileModal(e) {
    if (e.target.id === 'profile-modal') {
        playSound('click');
        document.getElementById('profile-modal').classList.remove('active');
    }
}
function closeProfileModalDirect() {
    playSound('click');
    document.getElementById('profile-modal').classList.remove('active');
}

// SISTEMA DE NAVEGACIÓN Y LOBBY
function enterLobby() {
    playSound('click');
    currentMode = 'lobby';
    document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));
    document.getElementById('mode-lobby').classList.add('active');
}

function selectSpecialty(topic) {
    playSound('click');
    currentSpecialty = topic;
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

function refreshSessionPool() {
    const pool = vocabulary.filter(v => v.topic === currentSpecialty);
    activeSessionPool = shuffleArray(pool).slice(0, BLOCK_SIZE);
}

function switchMode(mode) {
    playSound('click');
    currentMode = mode;
    document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));

    if (mode === 'flashcards') {
        document.querySelectorAll('.dock-item')[0].classList.add('active');
        document.getElementById('mode-flashcards').classList.add('active');
        currentFC = 0;
        updateFlashcard();
    } else if (mode === 'quiz') {
        document.querySelectorAll('.dock-item')[1].classList.add('active');
        document.getElementById('mode-quiz').classList.add('active');
        initQuiz();
    } else if (mode === 'builder') {
        document.querySelectorAll('.dock-item')[2].classList.add('active');
        document.getElementById('mode-builder').classList.add('active');
        initBuilder();
    } else if (mode === 'scanner') {
        document.querySelectorAll('.dock-item')[3].classList.add('active');
        document.getElementById('mode-scanner').classList.add('active');
        initScanner();
    }
}

function finishSession() {
    playSound('correct');
    document.querySelectorAll('.mode-screen').forEach(v => v.classList.remove('active'));

    const percentage = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
    document.getElementById('summary-percentage').innerText = `${percentage}%`;
    document.getElementById('summary-details').innerText = `Validaste ${sessionCorrect} reactivos de ${currentSpecialty.toUpperCase()}.`;
    document.getElementById('mode-summary').classList.add('active');

    let xp = parseInt(localStorage.getItem('zidong_xp') || '0') + (sessionCorrect * 25);
    localStorage.setItem('zidong_xp', xp);
    loadUserData();
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
        body.innerHTML = `<span class="inspect-badge">SIN TÉRMINOS</span>`;
        return;
    }

    const item = activeSessionPool[currentFC];

    if (!isFlipped) {
        hanziElem.className = "hanzi-character";
        hanziElem.innerText = item.hanzi;
        pinyinElem.innerHTML = `
            ${item.pinyin} 
            <button onclick="event.stopPropagation(); playVoice('${item.hanzi}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--cyber-cyan);">🔊</button>
        `;
        body.innerHTML = `<span class="inspect-badge">&gt; TOCAR PARA DECODIFICAR &lt;</span>`;
    } else {
        hanziElem.className = "meaning-title";
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
        playSound('correct');
        btn.classList.add('correct');
        sessionCorrect++;
    } else {
        playSound('wrong');
        btn.classList.add('incorrect');
        triggerErrorShake('quiz-chassis');
        all.forEach(b => { if (b.innerText === item.meaning) b.classList.add('correct'); });
    }

    const popout = document.getElementById('quiz-breakdown');
    let chips = item.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
    popout.innerHTML = `<div class="telemetry-chips">${chips}</div><div class="telemetry-log">${item.summary}</div>`;
    popout.style.display = 'block';

    document.getElementById('quiz-next-btn').style.display = 'block';
}

function nextQuizQuestion() {
    playSound('click');
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
    playSound('click');
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
    playSound('click');
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
        playSound('correct');
        slots.forEach(s => s.style.borderColor = 'var(--cyber-green)');
        if (!builderMistake) sessionCorrect++;

        playVoice(item.hanzi);

        const popout = document.getElementById('builder-breakdown');
        let chips = item.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
        popout.innerHTML = `<div class="telemetry-chips">${chips}</div><div class="telemetry-log">${item.summary}</div>`;
        popout.style.display = 'block';

        document.getElementById('builder-next-btn').style.display = 'block';
    } else {
        playSound('wrong');
        triggerErrorShake('builder-chassis');
        builderMistake = true;
        slots.forEach(s => s.style.borderColor = 'var(--cyber-red)');
        setTimeout(() => slots.forEach(s => s.style.borderColor = ''), 500);
    }
}

function nextBuilderQuestion() {
    playSound('click');
    builderIndex++;
    loadBuilderQuestion();
}

// --------------------------------------------------------
// 4. ESCÁNER
// --------------------------------------------------------
let scannerPool = [];
let scannerIndex = 0;
let scannerLocked = false;

function initScanner() {
    const filtered = scannerScenarios.filter(s => s.topic === currentSpecialty || currentSpecialty === 'seguridad');
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
            span.classList.add('token-static');
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

        const vocabInfo = vocabulary.find(v => v.hanzi === item.targetHanzi);
        const popout = document.getElementById('scanner-breakdown');

        if (vocabInfo) {
            let chips = vocabInfo.parts.map(p => `<div class="telemetry-chip"><strong>${p.char}</strong> ${p.desc}</div>`).join('');
            popout.innerHTML = `
                <div style="font-weight: 800; color: var(--cyber-cyan); margin-bottom: 4px;">${vocabInfo.hanzi} [${vocabInfo.pinyin}] - ${vocabInfo.meaning}</div>
                <div class="telemetry-chips">${chips}</div>
                <div class="telemetry-log">${vocabInfo.summary}</div>
            `;
            popout.style.display = 'block';
        }

        document.getElementById('scanner-next-btn').style.display = 'block';
    } else {
        playSound('wrong');
        triggerErrorShake('scanner-chassis');
        span.classList.add('fail-hit');
        setTimeout(() => span.classList.remove('fail-hit'), 400);
    }
}

function nextScannerQuestion() {
    playSound('click');
    scannerIndex++;
    loadScannerQuestion();
}

// INICIALIZACIÓN
loadUserData();
enterLobby();
