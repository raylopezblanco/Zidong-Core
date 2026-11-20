/* ==========================================================================
   ZIDONG CORE - CAREER MODE MODULE (MUNDOS, NIVELES, FASES Y BOSS)
   ========================================================================== */

(() => {
    "use strict";

    window.renderCareerPlanetsMenu = function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;
        container.replaceChildren();

        const worlds = window.WORLDS_CONFIG || [];
        const userData = window.currentUserData || { completedActivities: [] };

        worlds.forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const completedInWorld = world.activities.filter(a => userData.completedActivities.includes(a.id)).length;

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
                if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
                window.openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    };

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

        stream.replaceChildren();

        world.activities.forEach((act, idx) => {
            const isCompleted = currentUserData.completedActivities.includes(act.id);
            const isUnlocked = idx === 0 || currentUserData.completedActivities.includes(world.activities[idx - 1].id);

            const node = document.createElement("div");
            node.className = `planet-node-item ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`;
            node.innerHTML = `
                <div class="node-icon-circle" style="border-color:${world.color};">
                    <span>${isCompleted ? '✓' : isUnlocked ? act.hanzi : '🔒'}</span>
                </div>
                <div class="node-meta">
                    <strong style="color:#fff; font-size:13px; font-family:'Noto Sans SC';">${act.hanzi} · ${act.meaning}</strong>
                    <small style="color:var(--muted); font-size:10px;">Pinyin: ${act.pinyin} · Recompensa: +${act.reward} XP</small>
                </div>
                <span class="node-arrow">${isCompleted ? 'COMPLETADO' : isUnlocked ? 'INICIAR →' : 'BLOQUEADO'}</span>
            `;

            if (isUnlocked) {
                node.onclick = () => {
                    triggerHaptic("success");
                    openActivity(act, world);
                };
            }
            stream.appendChild(node);
        });

        // BOSS CHECKPOINT NODE
        const bossUnlocked = world.activities.every(a => currentUserData.completedActivities.includes(a.id));
        const bossCompleted = currentUserData.completedActivities.includes(world.boss.id);

        const bossNode = document.createElement("div");
        bossNode.className = `planet-node-item boss-node ${bossCompleted ? 'completed' : bossUnlocked ? 'unlocked' : 'locked'}`;
        bossNode.style.borderColor = world.color;
        bossNode.innerHTML = `
            <div class="node-icon-circle" style="background:${world.color}; color:#0b1424; border-color:#fff;">
                <span>👑</span>
            </div>
            <div class="node-meta">
                <strong style="color:${world.color}; font-size:13.5px;">CHECKPOINT FINAL: ${world.boss.title}</strong>
                <small style="color:#fff; font-size:10px;">Desbloquea Medalla: "${world.boss.badgeName}" (+${world.boss.reward} XP)</small>
            </div>
            <span class="node-arrow" style="color:${world.color};">${bossCompleted ? 'CONQUISTADO' : bossUnlocked ? 'ENFRENTAR JEFE ⚡' : 'REQUIERE MUNDO 100%'}</span>
        `;

        if (bossUnlocked) {
            bossNode.onclick = () => {
                triggerHaptic("success");
                startBossCheckpoint(world);
            };
        }
        stream.appendChild(bossNode);
    }

    function openActivity(act, world) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi4Phases(act, world);
    }

    // 4 FASES PEDAGÓGICAS PARA APRENDIZAJE DE HANZI
    function startHanzi4Phases(act, world) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        let currentPhase = 1;

        function renderPhase1() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 1 DE 4 · RECONOCIMIENTO</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Identifica el componente industrial</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:#fff; margin:14px 0; text-shadow:0 0 20px rgba(0,245,155,0.4);">${act.hanzi}</div>
                <p style="font-size:12px; color:var(--muted); margin-bottom:16px;">Pinyin: <strong>${act.pinyin}</strong></p>
                <button class="reveal-button" style="background:${world?.color || 'var(--cyan)'}; color:#0b1424; font-weight:900; padding:14px; width:100%;" onclick="window.nextPhaseCb()">ESCUCHAR & CONTINUAR →</button>
            `;
        }

        function renderPhase2() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 2 DE 4 · SIGNIFICADO TÉCNICO</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">¿Qué función cumple "${act.hanzi}"?</h3>
                <div style="font-size:42px; font-family:'Noto Sans SC'; color:#fff; margin:10px 0;">${act.hanzi}</div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;" id="phase2Options"></div>
            `;

            const optsBox = document.getElementById("phase2Options");
            const wrongOpts = [
                "Válvula de purga neumática",
                "Sensor óptico de presencia",
                "Indicador lumínico de estado"
            ];
            const allOpts = vsShuffle([act.meaning, ...wrongOpts.slice(0, 3)]);

            allOpts.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "reveal-button";
                btn.style.background = "var(--surface-light)";
                btn.style.color = "#fff";
                btn.style.border = "1px solid var(--border)";
                btn.style.padding = "12px";
                btn.style.fontWeight = "800";
                btn.textContent = opt;

                btn.onclick = () => {
                    if (opt === act.meaning) {
                        triggerHaptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        setTimeout(renderPhase3, 500);
                    } else {
                        triggerHaptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                    }
                };
                optsBox.appendChild(btn);
            });
        }

        function renderPhase3() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 3 DE 4 · ASOCIACIÓN DE PINYIN</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Selecciona la pronunciación correcta</h3>
                <div style="font-size:52px; font-family:'Noto Sans SC'; color:#fff; margin:12px 0;">${act.hanzi}</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;" id="phase3Options"></div>
            `;

            const optsBox = document.getElementById("phase3Options");
            const wrongPinyin = ["bō qì", "gāng yā", "zhǎo qì"];
            const allPinyin = vsShuffle([act.pinyin, ...wrongPinyin.slice(0, 3)]);

            allPinyin.forEach(pin => {
                const btn = document.createElement("button");
                btn.className = "reveal-button";
                btn.style.background = "var(--surface-light)";
                btn.style.color = "#fff";
                btn.style.border = "1px solid var(--border)";
                btn.style.padding = "12px";
                btn.style.fontWeight = "800";
                btn.textContent = pin;

                btn.onclick = () => {
                    if (pin === act.pinyin) {
                        triggerHaptic("success");
                        btn.style.background = "var(--green)";
                        btn.style.color = "#0b1424";
                        setTimeout(renderPhase4, 500);
                    } else {
                        triggerHaptic("error");
                        btn.style.background = "var(--red)";
                        btn.style.color = "#fff";
                    }
                };
                optsBox.appendChild(btn);
            });
        }

        function renderPhase4() {
            card.innerHTML = `
                <span class="eyebrow" style="color:${world?.color || 'var(--cyan)'};">FASE 4 DE 4 · VALIDACIÓN DE ESCRITURA</span>
                <h3 style="color:#fff; font-size:14px; margin:8px 0;">Confirma el carácter correcto</h3>
                <div style="font-size:64px; font-family:'Noto Sans SC'; color:var(--green); margin:12px 0;">${act.hanzi}</div>
                <p style="font-size:12px; color:#fff; margin-bottom:16px;">Significado: <strong>${act.meaning}</strong></p>
                <button class="reveal-button" style="background:var(--green); color:#0b1424; font-weight:900; padding:14px; width:100%;" onclick="window.finishActivityCb()">¡CONQUISTAR NIVEL (+${act.reward} XP) ⚡</button>
            `;
        }

        window.nextPhaseCb = () => {
            triggerHaptic("success");
            renderPhase2();
        };

        window.finishActivityCb = () => {
            triggerHaptic("win");
            if (!currentUserData.completedActivities.includes(act.id)) {
                currentUserData.completedActivities.push(act.id);
                currentUserData.xp += act.reward;
                updateProfile();
            }
            window.showCyberAlert("NIVEL CONQUISTADO", `¡NIVEL APROBADO! (+${act.reward} XP)\nHas dominado "${act.hanzi}" (${act.meaning}).`, "🌟");
            if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");
        };

        renderPhase1();
    }

    function startBossCheckpoint(world) {
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
            const allChars = vsShuffle(sequence.map(s => s.char).concat(["动", "机", "线", "电"]));

            allChars.forEach(char => {
                const b = document.createElement("button");
                b.className = "reveal-button";
                b.style.background = "var(--surface-light)";
                b.style.color = "#fff";
                b.style.border = "1px solid var(--border)";
                b.style.fontSize = "26px";
                b.style.fontFamily = "'Noto Sans SC'";
                b.style.padding = "14px";
                b.textContent = char;

                b.onclick = () => {
                    if (char === currentTarget.char) {
                        triggerHaptic("success");
                        b.style.background = "var(--green)";
                        b.style.color = "#0b1424";
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            triggerHaptic("win");
                            if (!currentUserData.completedActivities.includes(boss.id)) {
                                currentUserData.completedActivities.push(boss.id);
                                currentUserData.xp += boss.reward;
                                updateProfile();
                            }
                            setTimeout(() => {
                                window.showCyberAlert("CHECKPOINT DE LÍNEA", `¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`, "🏆");
                                renderBadgesGrid();
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 400);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        triggerHaptic("error");
                        b.style.background = "var(--red)";
                        b.style.color = "#fff";
                        setTimeout(() => b.style.background = "var(--surface-light)", 300);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }

// =============================================
})();
