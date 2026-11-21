/* ==========================================================================
   ZIDONG CORE - CAREER MODE MODULE (ZIGZAG + 3 ESTRELLAS + REPASOS + BOSS)
   ========================================================================== */

(() => {
    "use strict";

    let activeCareerContext = { act: null, world: null, isBoss: false };

    function getWorlds() {
        if (Array.isArray(window.ZIDONG_WORLDS_CONFIG)) return window.ZIDONG_WORLDS_CONFIG;
        if (typeof window.getWorldsCatalog === "function") return window.getWorldsCatalog() || [];
        return [];
    }

    function getUserData() {
        return typeof window.getZidongUserData === "function" ? window.getZidongUserData() : null;
    }

    function haptic(type) {
        if (typeof window.haptic === "function") window.haptic(type);
    }

    function alertBox(title, msg, icon = "⚡") {
        if (typeof alertBox === "function") {
            alertBox(title, msg, icon);
        } else {
            alert(`${title}\n\n${msg}`);
        }
    }

    function refreshProfile() {
        if (typeof window.updateProfile === "function") window.refreshProfile();
    }

    function refreshBadges() {
        if (typeof window.renderBadgesGrid === "function") window.refreshBadges();
    }

    function shuffleArr(arr) {
        if (typeof window.shuffleArr === "function") return window.shuffleArr(arr);
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function loadSavedStarsMap() {
        try {
            const raw = localStorage.getItem("zidong_career_phase_stars");
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveStarsMap(mapObj) {
        try {
            localStorage.setItem("zidong_career_phase_stars", JSON.stringify(mapObj || {}));
        } catch (e) {}
    }

    // CAREER PLANETS MENU RENDERING
    window.renderCareerPlanetsMenu = function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;
        container.replaceChildren();

        getWorlds().forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const completedInWorld = world.activities.filter(a => getUserData().completedActivities.includes(a.id)).length;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere"><span class="planet-core-icon">${world.icon}</span></div>
                    <div class="planet-orbit-ring" style="border-color:${world.color}88;"></div>
                </div>
                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color};">${world.title}</span>
                    <h4>${world.planetName}</h4>
                    <p>${world.subtitle}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <span class="planet-enter-badge">EXPLORAR MUNDO →</span>
                        <small style="color:${world.color}; font-weight:800; font-size:10px;">${completedInWorld}/${totalAct} NIVELES</small>
                    </div>
                </div>
            `;

            planetCard.onclick = () => {
                haptic("success");
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    }

    function getCareerStarState(actId) {
        const ud = getUserData();
        const savedMap = loadSavedStarsMap();
        if (ud && !ud.phaseStars) ud.phaseStars = {};
        if (savedMap[actId]) {
            const merged = {
                p1: Boolean(savedMap[actId].p1 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p1)),
                p2: Boolean(savedMap[actId].p2 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p2)),
                p3: Boolean(savedMap[actId].p3 || (ud && ud.phaseStars[actId] && ud.phaseStars[actId].p3))
            };
            if (ud) ud.phaseStars[actId] = merged;
            return merged;
        }
        if (ud && ud.phaseStars[actId]) {
            return ud.phaseStars[actId];
        }
        const done = ud && Array.isArray(ud.completedActivities) && ud.completedActivities.includes(actId);
        const initObj = { p1: done, p2: done, p3: done };
        if (ud) ud.phaseStars[actId] = initObj;
        return initObj;
    }

    function getCareerStarCount(actId) {
        const s = getCareerStarState(actId);
        return (s.p1 ? 1 : 0) + (s.p2 ? 1 : 0) + (s.p3 ? 1 : 0);
    }

    function grantCareerPhaseStar(actId, phaseNum) {
        const ud = getUserData();
        const s = Object.assign({}, getCareerStarState(actId));
        if (phaseNum === 1) s.p1 = true;
        if (phaseNum === 2) s.p2 = true;
        if (phaseNum === 3) s.p3 = true;
        if (ud) {
            if (!ud.phaseStars) ud.phaseStars = {};
            ud.phaseStars[actId] = s;
        }
        const savedMap = loadSavedStarsMap();
        savedMap[actId] = s;
        saveStarsMap(savedMap);

        if (ud && getCareerStarCount(actId) === 3 && !ud.completedActivities.includes(actId)) {
            ud.completedActivities.push(actId);
        }
    }

    function buildCareerStarsHtml(count) {
        return `<div class="career-zig-stars">${count >= 1 ? "⭐" : "☆"}${count >= 2 ? "⭐" : "☆"}${count >= 3 ? "⭐" : "☆"}</div>`;
    }

    function buildCareerZigzagEntries(world) {
        const list = [];
        const acts = world.activities || [];
        let seen = [];

        acts.forEach((act, idx) => {
            list.push({ type: "hanzi", act, idx });
            seen.push(act);

            const everyFive = (idx + 1) % 5 === 0;
            const endReview = (idx === acts.length - 1) && !everyFive && seen.length >= 3;
            if (everyFive || endReview) {
                list.push({
                    type: "review",
                    id: `${world.id}_repaso_${idx + 1}`,
                    title: `REPASO DE BLOQUE (${seen.length} HANZI)`,
                    subtitle: `Evalúa caracteres vistos en este tramo`,
                    pool: [...seen],
                    reward: 120
                });
            }
        });

        return list;
    }

    function openWorldDetails(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;
        if (!stream) return;

        stream.className = "career-zigzag-stream";
        stream.replaceChildren();

        const entries = buildCareerZigzagEntries(world);
        let canAdvance = true;
        let zigCounter = 0;

        entries.forEach((entry) => {
            const zigClass = entry.type === "review"
                ? "zig-center"
                : (zigCounter % 2 === 0 ? "zig-left" : "zig-right");
            zigCounter++;

            if (entry.type === "hanzi") {
                const act = entry.act;
                const stars = getCareerStarCount(act.id);
                const mastered = stars === 3;
                const unlocked = canAdvance || stars > 0;

                const card = document.createElement("div");
                card.className = `career-zig-card ${zigClass} ${mastered ? "is-complete" : unlocked ? "is-unlocked" : "is-locked"}`;
                card.style.setProperty("--zig-accent", world.color);

                const badgeTxt = mastered ? "3/3 ★" : unlocked ? `${stars}/3 ★` : "BLOQUEADO";

                card.innerHTML = `
                    <div class="career-zig-orb" style="border-color:${world.color};">${unlocked ? act.hanzi : "🔒"}</div>
                    <div class="career-zig-meta">
                        <span class="career-zig-tag" style="color:${world.color};">HANZI 0${entry.idx + 1} · +${act.reward} XP</span>
                        <strong>${act.meaning}</strong>
                        <small>Pinyin: ${act.pinyin}</small>
                        ${buildCareerStarsHtml(stars)}
                    </div>
                    <span class="career-zig-badge">${badgeTxt}</span>
                `;

                if (unlocked) {
                    card.onclick = () => {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        openActivity(act, world);
                    };
                }
                stream.appendChild(card);

                canAdvance = stars >= 1;
            } else if (entry.type === "review") {
                if (!getUserData().completedReviews) getUserData().completedReviews = [];
                const revDone = getUserData().completedReviews.includes(entry.id);
                const revUnlocked = canAdvance;

                const revCard = document.createElement("div");
                revCard.className = `career-zig-card is-review ${zigClass} ${revDone ? "is-complete" : revUnlocked ? "is-unlocked" : "is-locked"}`;
                revCard.style.setProperty("--zig-accent", "var(--amber)");

                revCard.innerHTML = `
                    <div class="career-zig-orb" style="border-color:var(--amber); color:var(--amber);">${revUnlocked ? "🔁" : "🔒"}</div>
                    <div class="career-zig-meta">
                        <span class="career-zig-tag" style="color:var(--amber);">ETAPA DE REPASO · +${entry.reward} XP</span>
                        <strong>${entry.title}</strong>
                        <small>${entry.subtitle}</small>
                    </div>
                    <span class="career-zig-badge">${revDone ? "LISTO ✓" : revUnlocked ? "REPASAR →" : "BLOQUEADO"}</span>
                `;

                if (revUnlocked) {
                    revCard.onclick = () => {
                        haptic("success");
                        startCareerReview(entry, world);
                    };
                }
                stream.appendChild(revCard);
                canAdvance = revDone || canAdvance;
            }
        });

        const allThreeStars = world.activities.every(a => getCareerStarCount(a.id) === 3);
        const bossDone = getUserData().completedActivities.includes(world.boss.id);
        const earnedStars = world.activities.reduce((acc, a) => acc + getCareerStarCount(a.id), 0);
        const totalStars = world.activities.length * 3;

        const bossCard = document.createElement("div");
        bossCard.className = `career-zig-card is-boss zig-center ${bossDone ? "is-complete" : allThreeStars ? "is-unlocked" : "is-locked"}`;
        bossCard.style.setProperty("--zig-accent", world.color);

        bossCard.innerHTML = `
            <div class="career-zig-orb" style="background:${world.color}; color:#0b1424; border-color:#fff;">👑</div>
            <div class="career-zig-meta">
                <span class="career-zig-tag" style="color:${world.color};">FINAL BOSS · +${world.boss.reward} XP</span>
                <strong>${world.boss.title}</strong>
                <small>Estrellas: ${earnedStars}/${totalStars} ★ · Medalla: "${world.boss.badgeName}"</small>
            </div>
            <span class="career-zig-badge">${bossDone ? "CONQUISTADO ✓" : allThreeStars ? "RETOS DE JEFE ⚡" : `REQUIERE ${totalStars}★`}</span>
        `;

        if (allThreeStars) {
            bossCard.onclick = () => {
                haptic("success");
                startBossCheckpoint(world);
            };
        } else {
            bossCard.onclick = () => {
                haptic("error");
                alertBox(
                    "FINAL BOSS BLOQUEADO",
                    `Necesitas las 3 estrellas (⭐⭐⭐) en cada Hanzi de este mundo para enfrentar al Final Boss.\n\nLlevas ${earnedStars} de ${totalStars} estrellas.`,
                    "🔒"
                );
            };
        }
        stream.appendChild(bossCard);
    }

    let activeCareerContext = { act: null, world: null, isBoss: false };

    window.abandonCareerLevel = function() {
        const label = activeCareerContext.isBoss
            ? "el Checkpoint de Jefe"
            : (activeCareerContext.act ? `el Hanzi "${activeCareerContext.act.hanzi}"` : "este nivel");
        activeCareerContext = { act: null, world: null, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
        if (typeof haptic === "function") haptic("error");
        if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        alertBox(
            "NIVEL ABANDONADO",
            `¿Te rajaste en ${label}? Sigue preparándote, renacuajo. 🐸⚡`,
            "🐸"
        );
    };

    function openActivity(act, world) {
        activeCareerContext = { act, world, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi3Phases(act, world);
    }

    // 3 FASES = 3 ESTRELLAS:
    // 1) El Hanzi cómo es (1 estrella)
    // 2) El Hanzi cómo se dice (1 estrella)
    // 3) Identificar el Hanzi en una oración (1 estrella)
    // - Bloquea selección múltiple al responder
    // - Si fallas, reinicia ÚNICAMENTE esa fase
    function startHanzi3Phases(act, world) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const accent = world?.color || "var(--cyan)";
        const sentenceText = act.sentence || `1号站${act.hanzi}信号检测正常`;
        const sentenceEs = act.sentenceEs || `Señal de ${act.meaning} en estación 1 verificada`;

        function renderPhaseBar(activeNum) {
            const st = getCareerStarState(act.id);
            return `
                <div style="display:flex; justify-content:space-between; gap:6px; margin-bottom:10px; background:var(--surface-light); padding:8px 10px; border-radius:10px; border:1px solid var(--border);">
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===1 ? accent : (st.p1 ? 'var(--green)' : 'var(--muted)')};">${st.p1 ? '⭐' : '☆'} 1. Cómo es</span>
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===2 ? accent : (st.p2 ? 'var(--green)' : 'var(--muted)')};">${st.p2 ? '⭐' : '☆'} 2. Cómo se dice</span>
                    <span style="font-size:9.5px; font-weight:800; color:${activeNum===3 ? accent : (st.p3 ? 'var(--green)' : 'var(--muted)')};">${st.p3 ? '⭐' : '☆'} 3. En oración</span>
                </div>
            `;
        }

        function disableOptions(container) {
            if (!container) return;
            container.querySelectorAll("button").forEach(b => { b.disabled = true; });
        }

        // FASE 1: El Hanzi cómo es (⭐ 1ª estrella)
        function renderPhase1() {
            let locked = false;
            const distractors = shuffleArr([
                "Válvula de purga neumática",
                "Sensor óptico de presencia",
                "Indicador lumínico de estado",
                "Banda transportadora de retorno"
            ].filter(x => x !== act.meaning)).slice(0, 3);
            const choices = shuffleArr([act.meaning, ...distractors]);

            card.innerHTML = `
                ${renderPhaseBar(1)}
                <span class="eyebrow" style="color:${accent};">FASE 1 DE 3 · ⭐ EL HANZI CÓMO ES</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Identifica qué representa este Hanzi</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0; text-shadow:0 0 20px rgba(39,216,232,0.35);">${act.hanzi}</div>
                <button type="button" id="p1SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer; margin-bottom:10px;">🔊 Escuchar sonido</button>
                <div style="display:flex; flex-direction:column; gap:8px;" id="p1Choices"></div>
            `;

            const speakBtn = document.getElementById("p1SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(act.hanzi);
                };
            }

            const box = document.getElementById("p1Choices");
            choices.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(box);

                    if (opt === act.meaning) {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 1);
                        setTimeout(renderPhase2, 500);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        btn.style.borderColor = "var(--red)";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase1();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        // FASE 2: El Hanzi cómo se dice (⭐ 2ª estrella)
        function renderPhase2() {
            let locked = false;
            const distractors = shuffleArr([
                "bō qì", "gāng yā", "zhǎo qì", "wù cè", "fá lù", "cè guāng"
            ].filter(p => p !== act.pinyin)).slice(0, 3);
            const choices = shuffleArr([act.pinyin, ...distractors]);

            card.innerHTML = `
                ${renderPhaseBar(2)}
                <span class="eyebrow" style="color:${accent};">FASE 2 DE 3 · ⭐ EL HANZI CÓMO SE DICE</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Selecciona la pronunciación de "${act.hanzi}" (${act.meaning})</h3>
                <div style="font-size:56px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0;">${act.hanzi}</div>
                <button type="button" id="p2SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer; margin-bottom:10px;">🔊 Escuchar sonido</button>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;" id="p2Choices"></div>
            `;

            const speakBtn = document.getElementById("p2SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(act.hanzi);
                };
            }

            const box = document.getElementById("p2Choices");
            choices.forEach(pin => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.style.textAlign = "center";
                btn.textContent = pin;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(box);

                    if (pin === act.pinyin) {
                        haptic("success");
                        window.speakMandarin(act.hanzi);
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        btn.style.borderColor = "var(--green)";
                        grantCareerPhaseStar(act.id, 2);
                        setTimeout(renderPhase3, 500);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        btn.style.borderColor = "var(--red)";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase2();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        // FASE 3: Identificar el Hanzi en una oración (⭐ 3ª estrella) - sin soplar el carácter
        function renderPhase3() {
            let locked = false;
            const rawChars = sentenceText.split("");
            const tokens = rawChars.includes(act.hanzi) ? rawChars : [...rawChars, act.hanzi];

            card.innerHTML = `
                ${renderPhaseBar(3)}
                <span class="eyebrow" style="color:${accent};">FASE 3 DE 3 · ⭐ IDENTIFICAR EN ORACIÓN</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Identifica el Hanzi de <strong style="color:var(--green);">${act.meaning}</strong> dentro de la oración</h3>
                <div class="career-quote-box">
                    <div class="career-quote-es">${sentenceEs}</div>
                    <div class="hmi-tokens-container" id="p3Tokens" style="margin-top:10px;"></div>
                </div>
                <button type="button" id="p3SpeakBtn" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:20px; padding:6px 14px; font-size:11px; font-weight:800; cursor:pointer;">🔊 Leer oración</button>
            `;

            const speakBtn = document.getElementById("p3SpeakBtn");
            if (speakBtn) {
                speakBtn.onclick = () => {
                    haptic("success");
                    window.speakMandarin(sentenceText);
                };
            }

            const tokenBox = document.getElementById("p3Tokens");
            tokens.forEach(ch => {
                const tok = document.createElement("button");
                tok.type = "button";
                tok.className = "hmi-char-token";
                tok.textContent = ch;
                tok.onclick = () => {
                    if (locked) return;
                    locked = true;
                    disableOptions(tokenBox);

                    if (ch === act.hanzi) {
                        tok.classList.add("token-hit");
                        grantCareerPhaseStar(act.id, 3);
                        if (!getUserData()._xpGranted) getUserData()._xpGranted = [];
                        let bonus = 0;
                        if (!getUserData()._xpGranted.includes(act.id)) {
                            getUserData()._xpGranted.push(act.id);
                            getUserData().xp += act.reward;
                            bonus = act.reward;
                        }
                        refreshProfile();
                        haptic("win");
                        window.speakMandarin(act.hanzi);
                        setTimeout(() => {
                            alertBox(
                                "¡3 ESTRELLAS OBTENIDAS! ⭐⭐⭐",
                                `Completaste las 3 fases de "${act.hanzi}" (${act.meaning})${bonus > 0 ? ` (+${bonus} XP)` : ""}.`,
                                "🌟"
                            );
                            if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                            if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                            if (world) openWorldDetails(world);
                        }, 450);
                    } else {
                        tok.classList.add("token-miss");
                        haptic("error");
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderPhase3();
                        }, 600);
                    }
                };
                tokenBox.appendChild(tok);
            });
        }

        renderPhase1();
    }

    function startCareerReview(revItem, world) {
        activeCareerContext = { act: { hanzi: revItem.title }, world, isBoss: false };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        const pool = revItem.pool || [];
        const list = shuffleArr(pool).slice(0, Math.min(4, pool.length));
        let idx = 0;

        function nextReviewQ() {
            const target = list[idx];
            if (!target) {
                if (!getUserData().completedReviews) getUserData().completedReviews = [];
                if (!getUserData().completedReviews.includes(revItem.id)) {
                    getUserData().completedReviews.push(revItem.id);
                    getUserData().xp += revItem.reward;
                    refreshProfile();
                }
                haptic("win");
                alertBox("REPASO COMPLETADO", `¡Superaste ${revItem.title}! (+${revItem.reward} XP)`, "🔁");
                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                if (world) openWorldDetails(world);
                return;
            }

            let locked = false;
            const others = pool.filter(p => p.id !== target.id).map(p => p.meaning);
            const extras = ["Sensor inductivo de proximidad", "Válvula de purga neumática", "Fuente de control 24V"];
            const opts = shuffleArr([target.meaning, ...others, ...extras]).slice(0, 4);

            card.innerHTML = `
                <span class="eyebrow" style="color:var(--amber);">🔁 REPASO · PREGUNTA ${idx + 1} DE ${list.length}</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">¿Qué significa este Hanzi visto anteriormente?</h3>
                <div style="font-size:60px; font-family:'Noto Sans SC'; color:var(--amber); margin:12px 0;">${target.hanzi}</div>
                <div style="display:flex; flex-direction:column; gap:8px;" id="revChoices"></div>
            `;

            const box = document.getElementById("revChoices");
            opts.forEach(opt => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "career-choice-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (locked) return;
                    locked = true;
                    box.querySelectorAll("button").forEach(b => { b.disabled = true; });

                    if (opt === target.meaning) {
                        haptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        idx++;
                        setTimeout(nextReviewQ, 450);
                    } else {
                        haptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            nextReviewQ();
                        }, 600);
                    }
                };
                box.appendChild(btn);
            });
        }

        nextReviewQ();
    }

    function startBossCheckpoint(world) {
        activeCareerContext = { act: null, world, isBoss: true };
        if (typeof window.setMinigameLock === "function") window.setMinigameLock(true);
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card || !world.boss) return;

        const boss = world.boss;
        const sequence = boss.sequence;
        let currentStepIndex = 0;

        function renderBossSequenceView() {
            const currentTarget = sequence[currentStepIndex];
            const chipsHtml = sequence.map((s, idx) => {
                let st = "background:var(--surface-light); color:var(--muted); border:1px solid var(--border);";
                if (idx < currentStepIndex) st = "background:var(--green); color:#0b1424; font-weight:bold;";
                else if (idx === currentStepIndex) st = "background:var(--surface); color:var(--cyan); border:2px solid var(--cyan); font-weight:bold;";
                return `<div style="padding:6px 12px; border-radius:8px; font-size:11px; ${st}">${idx+1}. ${s.esName}</div>`;
            }).join("");

            card.innerHTML = `
                <span class="eyebrow" style="color:${world.color};">👑 AUDITORÍA DE JEFE · ${boss.title}</span>
                <h3 style="color:#fff; font-size:13.5px; margin:6px 0;">Secuencia requerida en celda:</h3>
                <div style="display:flex; gap:6px; justify-content:center; margin-bottom:14px; flex-wrap:wrap;">${chipsHtml}</div>
                <div style="background:rgba(0,245,155,0.06); border:1px solid rgba(0,245,155,0.2); border-radius:12px; padding:12px; margin-bottom:14px;">
                    <small style="color:var(--muted); display:block; font-size:10px;">SELECCIONA EL CARACTER PARA:</small>
                    <strong style="color:var(--green); font-size:15px; display:block; margin-top:2px;">"${currentTarget.esName}"</strong>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;" id="bossTokensGrid"></div>
            `;

            const tokensGrid = document.getElementById("bossTokensGrid");
            const allChars = shuffleArr(sequence.map(s => s.char).concat(["动", "机", "线", "电"]));
            let locked = false;

            allChars.forEach(char => {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "reveal-button";
                b.style.background = "var(--surface-light)";
                b.style.color = "#fff";
                b.style.border = "1px solid var(--border)";
                b.style.fontSize = "26px";
                b.style.fontFamily = "'Noto Sans SC'";
                b.style.padding = "14px";
                b.textContent = char;

                b.onclick = () => {
                    if (locked) return;
                    locked = true;
                    tokensGrid.querySelectorAll("button").forEach(btn => { btn.disabled = true; });

                    if (char === currentTarget.char) {
                        haptic("success");
                        window.speakMandarin(char);
                        b.style.background = "var(--green)";
                        b.style.color = "#0b1424";
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            haptic("win");
                            if (!getUserData().completedActivities.includes(boss.id)) {
                                getUserData().completedActivities.push(boss.id);
                                getUserData().xp += boss.reward;
                                refreshProfile();
                            }
                            setTimeout(() => {
                                alertBox("CHECKPOINT DE LÍNEA", `¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`, "🏆");
                                refreshBadges();
                                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                                if (typeof window.setMinigameLock === "function") window.setMinigameLock(false);
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 400);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        haptic("error");
                        b.style.background = "var(--red)";
                        b.style.color = "#fff";
                        card.classList.add("career-shake");
                        setTimeout(() => {
                            card.classList.remove("career-shake");
                            renderBossSequenceView();
                        }, 600);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }


})();
