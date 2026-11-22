/* ==========================================================================
   ZIDONG CORE - ACADEMY MODULE (GRAMÁTICA, RADICALES/HANZI & 3 ENFOQUES)
   Separado por:
   1. Escrito (Hanzi + Radicales / conformación de caracteres)
   2. Leído (Pinyin, tonos y lectura en contexto)
   3. Hablado (Patrones de habla en planta y audio TTS)
   ========================================================================== */

(() => {
    "use strict";

    let activeTrack = "written"; // "written" | "reading" | "spoken"
    let activeLessonId = null;

    window.ZIDONG_ACADEMY_TRACKS = {
        written: {
            id: "written",
            label: "✍️ ESCRITO",
            subtitle: "Estructura de Hanzi, radicales (丝 hilo, 金 metal, 氵 agua, 扌 mano) y orden de trazos",
            accent: "var(--cyan)",
            lessons: [
                {
                    id: "w_radicals",
                    levelTag: "BASE · RADICALES",
                    title: "Cómo se conforman los Hanzi (Radicales)",
                    summary: "Muchos caracteres combinan un radical (pista de significado/categoría, suele ir a la izquierda) con otra parte que aporta sonido o matiz.",
                    radicals: [
                        { radical: "丝", pinyin: "sī", meaning: "Hilo / seda / cableado", example: "线 (xiàn · cable/línea) — hilo + elemento fonético" },
                        { radical: "金", pinyin: "jīn", meaning: "Metal / oro", example: "铁 (tiě · hierro) / 钢 (gāng · acero) / 锁 (suǒ · seguro/candado)" },
                        { radical: "氵", pinyin: "shuǐ", meaning: "Agua / líquido", example: "液 (yè · líquido) / 油 (yóu · aceite) / 流 (liú · flujo)" },
                        { radical: "扌", pinyin: "shǒu", meaning: "Mano (acción)", example: "按 (àn · presionar botón) / 接 (jiē · conectar/recibir)" },
                        { radical: "口", pinyin: "kǒu", meaning: "Boca / señal / puerto", example: "号 (hào · número/código) / 叫 (jiào · llamar/activar)" }
                    ],
                    grammarNote: "Regla práctica en manuales: observa primero el radical izquierdo (丝 = cable/señal, 金 = pieza metálica, 扌 = acción manual) para inferir el campo antes de memorizar el trazo completo."
                },
                {
                    id: "w_compounds",
                    levelTag: "NIVEL 1 · COMPUESTOS",
                    title: "Palabras de 2 Hanzi: Núcleo + Modificador",
                    summary: "En chino técnico la palabra compuesta aclara el sentido exacto: por ejemplo 急 (urgente) + 停 (detener) = 急停 (paro de emergencia).",
                    radicals: [
                        { radical: "电", pinyin: "diàn", meaning: "Electricidad", example: "电源 (diàn yuán · fuente de poder) / 电压 (diàn yā · voltaje)" },
                        { radical: "动", pinyin: "dòng", meaning: "Mover / accionar", example: "自动 (zì dòng · automático) / 启动 (qǐ dòng · arrancar)" },
                        { radical: "报", pinyin: "bào", meaning: "Reportar / avisar", example: "报警 (bào jǐng · alarma) / 报错 (bào cuò · error)" }
                    ],
                    grammarNote: "Cuando veas dos caracteres juntos en una pantalla HMI, identifica el verbo/acción (停, 动, 报) y el objeto o condición (急, 电, 警)."
                }
            ]
        },
        reading: {
            id: "reading",
            label: "📖 LEÍDO",
            subtitle: "Pinyin, los 4 tonos (+ tono neutro) y lectura rápida de etiquetas/alarmas",
            accent: "var(--green)",
            lessons: [
                {
                    id: "r_tones",
                    levelTag: "BASE · TONOS",
                    title: "Tonos y Pinyin sin perderte",
                    summary: "El tono cambia el significado de la sílaba: 1º alto parejo (mā), 2º sube (má), 3º baja y sube (mǎ), 4º cae firme (mà).",
                    examples: [
                        { zh: "急停", py: "jí tíng", es: "Paro de emergencia (dos tonos ascendentes rápidos)" },
                        { zh: "安全门", py: "ān quán mén", es: "Puerta de seguridad (1º + 2º + 2º)" },
                        { zh: "传感器", py: "chuán gǎn qì", es: "Sensor (2º + 3º + 4º)" }
                    ],
                    grammarNote: "Al leer Pinyin, no lo leas como español: la 'q' suena similar a 'ch' suave, la 'x' como 'sh' suave con lengua hacia abajo y la 'zh' como 'ch/y' retrofleja."
                },
                {
                    id: "r_svo",
                    levelTag: "NIVEL 1 · ORDEN",
                    title: "Orden básico: Sujeto + Verbo + Objeto",
                    summary: "La frase afirmativa en chino sigue un orden directo y estable: quién hace + qué hace + sobre qué.",
                    examples: [
                        { zh: "我检查传感器。", py: "Wǒ jiǎnchá chuángǎnqì.", es: "Yo reviso el sensor." },
                        { zh: "机器停止了。", py: "Jīqì tíngzhǐ le.", es: "La máquina se detuvo (cambio de estado con 了)." },
                        { zh: "门没有关好。", py: "Mén méiyǒu guān hǎo.", es: "La puerta no cerró bien." }
                    ],
                    grammarNote: "Para negar acciones normales usa 不 (bù), y para negar haber/ocurrencia en pasado usa 没 / 没有 (méi / méiyǒu)."
                }
            ]
        },
        spoken: {
            id: "spoken",
            label: "🗣️ HABLADO",
            subtitle: "Expresiones cortas y claras para piso de producción, relevos y soporte",
            accent: "var(--gold)",
            lessons: [
                {
                    id: "s_shift_handoff",
                    levelTag: "BASE · TURNO",
                    title: "Saludo, estado de línea y relevo",
                    summary: "Frases directas para coordinar en turno sin rodeos: qué pasa, dónde está y si ya quedó listo.",
                    examples: [
                        { zh: "你好，我是自动化支持。", py: "Nǐ hǎo, wǒ shì zìdònghuà zhīchí.", es: "Hola, soy de soporte de automatización." },
                        { zh: "这条线现在正常。", py: "Zhè tiáo xiàn xiànzài zhèngcháng.", es: "Esta línea ahorita está normal." },
                        { zh: "好了，可以试运行。", py: "Hǎo le, kěyǐ shì yùnxíng.", es: "Listo, ya se puede hacer prueba en vacío." }
                    ],
                    grammarNote: "En piso ayuda mucho hablar con frases cortas y pausadas; si usas el botón de audio, escucha el ritmo y repite en voz alta."
                },
                {
                    id: "s_fault_report",
                    levelTag: "NIVEL 1 · FALLAS",
                    title: "Reportar paro, alarma o bloqueo",
                    summary: "Estructura rápida para avisar una falla y pedir confirmación antes de energizar o liberar.",
                    examples: [
                        { zh: "这里有报警，请等一下。", py: "Zhèlǐ yǒu bàojǐng, qǐng děng yíxià.", es: "Aquí hay alarma, por favor espera un momento." },
                        { zh: "急停复位了吗？", py: "Jítíng fùwèi le ma?", es: "¿Ya se rearmó el paro de emergencia?" },
                        { zh: "先断电，再检查。", py: "Xiān duàndiàn, zài jiǎnchá.", es: "Primero corta energía, luego revisa." }
                    ],
                    grammarNote: "La secuencia 先 ... 再 ... (xiān ... zài ...) es oro en seguridad industrial: 'primero [paso 1], luego [paso 2]'."
                }
            ]
        }
    };

    function getCurrentTrack() {
        return window.ZIDONG_ACADEMY_TRACKS[activeTrack] || window.ZIDONG_ACADEMY_TRACKS.written;
    }

    function syncAcademyTrackButtons() {
        document.querySelectorAll("#academyTracksBar .ac-track-btn").forEach(btn => {
            const key = btn.getAttribute("data-track");
            const meta = window.ZIDONG_ACADEMY_TRACKS[key];
            const isActive = key === activeTrack;
            btn.classList.toggle("active", isActive);
            btn.style.background = isActive ? "var(--surface-light)" : "var(--surface)";
            btn.style.borderColor = isActive && meta ? meta.accent : "var(--border)";
            btn.style.color = isActive ? "#fff" : "var(--muted)";
        });
    }

    window.switchAcademyTrack = function(trackKey) {
        if (!window.ZIDONG_ACADEMY_TRACKS[trackKey]) return;
        activeTrack = trackKey;
        const track = getCurrentTrack();
        activeLessonId = track.lessons[0]?.id || null;
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        window.renderAcademyView();
    };

    window.selectAcademyLesson = function(lessonId) {
        activeLessonId = lessonId;
        if (typeof window.triggerHaptic === "function") window.triggerHaptic("success");
        window.renderAcademyView();
    };

    window.renderAcademyView = function() {
        const listContainer = document.getElementById("academyModulesContainer");
        const detailContainer = document.getElementById("academyLessonDetailContainer");
        const subtitleEl = document.getElementById("academyTrackSubtitle");
        if (!listContainer || !detailContainer) return;

        syncAcademyTrackButtons();
        const track = getCurrentTrack();
        if (subtitleEl) subtitleEl.textContent = track.subtitle;

        if (!activeLessonId || !track.lessons.some(l => l.id === activeLessonId)) {
            activeLessonId = track.lessons[0]?.id || null;
        }

        listContainer.replaceChildren();
        track.lessons.forEach((lesson, idx) => {
            const selected = lesson.id === activeLessonId;
            const card = document.createElement("div");
            card.className = "panel academy-module-card";
            card.style.background = selected ? "var(--surface-light)" : "var(--surface)";
            card.style.border = selected ? `1.5px solid ${track.accent}` : "1px solid var(--border)";
            card.style.borderLeft = `4px solid ${track.accent}`;
            card.style.borderRadius = "14px";
            card.style.padding = "14px";
            card.style.cursor = "pointer";
            card.style.display = "flex";
            card.style.justifyContent = "space-between";
            card.style.alignItems = "center";

            card.innerHTML = `
                <div>
                    <span class="tag" style="color:${track.accent}; border-color:${track.accent}; font-size:8px;">LECCIÓN 0${idx + 1} · ${lesson.levelTag}</span>
                    <h3 style="color:#fff; font-size:13px; margin-top:4px;">${lesson.title}</h3>
                </div>
                <span style="color:${track.accent}; font-size:16px; font-weight:900;">${selected ? "▼" : "→"}</span>
            `;
            card.onclick = () => window.selectAcademyLesson(lesson.id);
            listContainer.appendChild(card);
        });

        const currentLesson = track.lessons.find(l => l.id === activeLessonId);
        detailContainer.replaceChildren();
        if (!currentLesson) return;

        const detailBox = document.createElement("div");
        detailBox.className = "panel";
        detailBox.style.background = "var(--surface)";
        detailBox.style.border = `1.5px solid ${track.accent}`;
        detailBox.style.borderRadius = "16px";
        detailBox.style.padding = "16px";
        detailBox.style.marginTop = "12px";

        let bodyHtml = `
            <span class="eyebrow" style="color:${track.accent};">${currentLesson.levelTag}</span>
            <h3 style="color:#fff; font-size:15px; margin:4px 0 6px 0;">${currentLesson.title}</h3>
            <p style="font-size:11.5px; color:#e2e8f0; line-height:1.45; margin-bottom:12px;">${currentLesson.summary}</p>
        `;

        if (Array.isArray(currentLesson.radicals)) {
            bodyHtml += `<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">`;
            currentLesson.radicals.forEach(r => {
                const safeHanzi = r.radical.replace(/'/g, "\'");
                bodyHtml += `
                    <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:12px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:24px; font-family:'Noto Sans SC'; color:${track.accent}; font-weight:900; min-width:34px; text-align:center;">${r.radical}</span>
                            <div>
                                <strong style="font-size:11.5px; color:#fff; display:block;">${r.meaning} <small style="color:var(--muted); font-weight:600;">(${r.pinyin})</small></strong>
                                <small style="font-size:10px; color:var(--cyan); display:block; margin-top:2px;">${r.example}</small>
                            </div>
                        </div>
                        <button type="button" onclick="if(window.speakMandarin) window.speakMandarin('${safeHanzi}')" style="background:rgba(39,216,232,0.14); border:1px solid var(--cyan); color:var(--cyan); border-radius:8px; padding:6px 8px; font-size:11px; font-weight:800; cursor:pointer;">🔊</button>
                    </div>
                `;
            });
            bodyHtml += `</div>`;
        }

        if (Array.isArray(currentLesson.examples)) {
            bodyHtml += `<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">`;
            currentLesson.examples.forEach(ex => {
                const safeZh = ex.zh.replace(/'/g, "\'");
                bodyHtml += `
                    <div style="background:var(--surface-light); border:1px solid var(--border); border-radius:12px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                        <div>
                            <strong style="font-size:15px; font-family:'Noto Sans SC'; color:#fff; display:block;">${ex.zh}</strong>
                            <small style="font-size:10px; color:${track.accent}; display:block;">${ex.py}</small>
                            <small style="font-size:10.5px; color:#e2e8f0; display:block; margin-top:2px;">${ex.es}</small>
                        </div>
                        <button type="button" onclick="if(window.speakMandarin) window.speakMandarin('${safeZh}')" style="background:rgba(0,245,155,0.14); border:1px solid var(--green); color:var(--green); border-radius:8px; padding:6px 8px; font-size:11px; font-weight:800; cursor:pointer;">🔊</button>
                    </div>
                `;
            });
            bodyHtml += `</div>`;
        }

        if (currentLesson.grammarNote) {
            bodyHtml += `
                <div style="background:rgba(39,216,232,0.08); border:1px solid rgba(39,216,232,0.3); border-radius:10px; padding:10px 12px;">
                    <strong style="font-size:10px; color:var(--cyan); display:block; margin-bottom:3px;">💡 CLAVE GRAMATICAL</strong>
                    <p style="font-size:11px; color:#fff; line-height:1.4; margin:0;">${currentLesson.grammarNote}</p>
                </div>
            `;
        }

        detailBox.innerHTML = bodyHtml;
        detailContainer.appendChild(detailBox);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            if (typeof window.renderAcademyView === "function") window.renderAcademyView();
        });
    } else {
        setTimeout(() => {
            if (typeof window.renderAcademyView === "function") window.renderAcademyView();
        }, 0);
    }
})();
