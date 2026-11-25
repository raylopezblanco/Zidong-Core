/* ==========================================================================
   ZIDONG CORE - LAB COMPONENTS MODULE
   Catálogo de componentes industriales y renderizado/filtrado para hanziLab.
   ========================================================================== */

(() => {
    "use strict";

    const DEFAULT_LAB_COMPONENTS = [
        { id: "c1", category: "world_1", hanzi: "变频器", pinyin: "biàn pín qì", name: "VFD / Inversor de Frecuencia", desc: "Controla velocidad y torque de motores asíncronos.", icon: "⚡" },
        { id: "c2", category: "world_1", hanzi: "接触器", pinyin: "jiē chù qì", name: "Contactor Eléctrico", desc: "Dispositivo electromecánico para abrir/cerrar potencia.", icon: "🔌" },
        { id: "c3", category: "world_2", hanzi: "气缸", pinyin: "qì gāng", name: "Cilindro Neumático", desc: "Actuador lineal impulsado por aire comprimido.", icon: "⚙️" },
        { id: "c4", category: "world_2", hanzi: "传感器", pinyin: "chuán gǎn qì", name: "Sensor Inductivo / Fotoeléctrico", desc: "Detecta presencia de piezas metálicas u ópticas.", icon: "📡" },
        { id: "c5", category: "world_3", hanzi: "电磁阀", pinyin: "diàn cí fá", name: "Electroválvula SMC", desc: "Gobierna el flujo de aire hacia los actuadores.", icon: "💨" },
        { id: "c6", category: "world_4", hanzi: "机器人", pinyin: "jī qì rén", name: "Brazo Robot KUKA / Fanuc", desc: "Manipulador articulado para ensamble automático.", icon: "🤖" },
        { id: "c7", category: "world_5", hanzi: "相机", pinyin: "xiàng jī", name: "Cámara AOI / Visión", desc: "Inspección de soldadura y componentes SMD.", icon: "📷" }
    ];

    window.ZIDONG_LAB_COMPONENTS = DEFAULT_LAB_COMPONENTS;

    window.getLabComponentsCatalog = function() {
        if (Array.isArray(window.ZIDONG_LAB_COMPONENTS) && window.ZIDONG_LAB_COMPONENTS.length > 0) {
            return window.ZIDONG_LAB_COMPONENTS;
        }
        return DEFAULT_LAB_COMPONENTS;
    };

    const LAB_CATEGORY_NAMES = {
        world_1: "SISTEMAS ELÉCTRICOS",
        world_2: "MECÁNICA Y ACTUADORES",
        world_3: "NEUMÁTICA Y CONTROL",
        world_4: "ROBÓTICA Y AUTOMATIZACIÓN",
        world_5: "VISIÓN ARTIFICIAL"
    };

    function escapeHTML(value = "") {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[char]));
    }

    function ensureLabDetailModal() {
        let modal = document.getElementById("labDetailModal");
        if (modal) return modal;
        modal = document.createElement("div");
        modal.id = "labDetailModal";
        modal.className = "lab-detail-overlay";
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = `
            <section class="lab-detail-card" role="dialog" aria-modal="true" aria-labelledby="labDetailName">
                <button class="lab-detail-close" type="button" aria-label="Cerrar ficha">✕</button>
                <div class="lab-detail-topline"><span>OBERON LABORATORY</span><span class="lab-detail-status"><i></i> REGISTRO ACTIVO</span></div>
                <div class="lab-detail-hero">
                    <div class="lab-detail-icon" id="labDetailIcon"></div>
                    <div class="lab-detail-hanzi-wrap"><div class="lab-detail-hanzi" id="labDetailHanzi"></div><div class="lab-detail-pinyin" id="labDetailPinyin"></div></div>
                </div>
                <div class="lab-detail-category" id="labDetailCategory"></div>
                <h3 id="labDetailName"></h3>
                <p class="lab-detail-description" id="labDetailDescription"></p>
                <div class="lab-detail-info-grid">
                    <div class="lab-detail-info"><span>CARÁCTER</span><strong id="labDetailCharacterCount"></strong></div>
                    <div class="lab-detail-info"><span>ÁREA TÉCNICA</span><strong id="labDetailArea"></strong></div>
                </div>
                <button class="lab-detail-audio" id="labDetailAudio" type="button">🔊 ESCUCHAR PRONUNCIACIÓN</button>
                <div class="lab-detail-footnote">BASE DE DATOS TÉCNICA · ZÌDÒNG CORE</div>
            </section>`;
        document.body.appendChild(modal);
        modal.addEventListener("click", event => {
            if (event.target === modal || event.target.closest(".lab-detail-close")) window.closeLabDetail();
        });
        modal.querySelector("#labDetailAudio").addEventListener("click", () => {
            const pinyin = modal.dataset.pinyin || "";
            if (!pinyin || !("speechSynthesis" in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(modal.dataset.hanzi || "");
            utterance.lang = "zh-CN";
            utterance.rate = 0.78;
            window.speechSynthesis.speak(utterance);
        });
        return modal;
    }

    window.openLabDetail = function(id) {
        const item = window.getLabComponentsCatalog().find(entry => entry.id === id);
        if (!item) return;
        const modal = ensureLabDetailModal();
        const area = LAB_CATEGORY_NAMES[item.category] || "REPOSITORIO INDUSTRIAL";
        modal.dataset.pinyin = item.pinyin || "";
        modal.dataset.hanzi = item.hanzi || "";
        modal.querySelector("#labDetailIcon").textContent = item.icon || "🔧";
        modal.querySelector("#labDetailHanzi").textContent = item.hanzi || "";
        modal.querySelector("#labDetailPinyin").textContent = item.pinyin || "";
        modal.querySelector("#labDetailCategory").textContent = area;
        modal.querySelector("#labDetailName").textContent = item.name || "Componente";
        modal.querySelector("#labDetailDescription").textContent = item.desc || "Sin descripción disponible.";
        modal.querySelector("#labDetailCharacterCount").textContent = `${Array.from(item.hanzi || "").length} ${Array.from(item.hanzi || "").length === 1 ? "Hanzi" : "Hanzi"}`;
        modal.querySelector("#labDetailArea").textContent = area;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("lab-detail-open");
        modal.querySelector(".lab-detail-close").focus();
    };

    window.closeLabDetail = function() {
        const modal = document.getElementById("labDetailModal");
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lab-detail-open");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    };

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") window.closeLabDetail();
    });

    window.renderLabComponents = function(filterCat = "all", searchTerm = "") {
        const container = document.getElementById("labComponentsContainer");
        if (!container) return;
        container.replaceChildren();

        const catalog = window.getLabComponentsCatalog();
        const q = String(searchTerm || "").toLowerCase();
        const filtered = catalog.filter(item => {
            const matchesCat = filterCat === "all" || item.category === filterCat;
            const matchesSearch =
                item.name.toLowerCase().includes(q) ||
                item.hanzi.includes(searchTerm || "") ||
                item.pinyin.toLowerCase().includes(q) ||
                (item.desc && item.desc.toLowerCase().includes(q));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="lab-empty-state"><span>⌕</span><strong>Sin resultados</strong><small>No encontramos componentes con ese criterio.</small></div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "lab-component-card";
            card.setAttribute("aria-label", `Abrir ficha de ${item.name}`);
            card.innerHTML = `
                <span class="lab-card-index">${escapeHTML(item.id.toUpperCase())}</span>
                <span class="lab-card-icon">${escapeHTML(item.icon || "🔧")}</span>
                <span class="lab-card-hanzi">${escapeHTML(item.hanzi)}</span>
                <span class="lab-card-pinyin">${escapeHTML(item.pinyin)}</span>
                <span class="lab-card-name">${escapeHTML(item.name)}</span>
                <span class="lab-card-open">INSPECCIONAR <b>↗</b></span>`;
            card.addEventListener("click", () => window.openLabDetail(item.id));
            container.appendChild(card);
        });
    };

    window.filterLabCategory = function(cat, btn) {
        document.querySelectorAll(".lab-tab-btn").forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");
        const searchVal = document.getElementById("labSearchInput")?.value || "";
        window.renderLabComponents(cat, searchVal);
    };

    window.filterLabComponents = function(query) {
        const activeTab = document.querySelector(".lab-tab-btn.active");
        let cat = "all";
        if (activeTab) {
            const text = activeTab.textContent;
            if (text.includes("Eléctrico")) cat = "world_1";
            else if (text.includes("Mecánico")) cat = "world_2";
            else if (text.includes("Neumático")) cat = "world_3";
            else if (text.includes("Robótica")) cat = "world_4";
        }
        window.renderLabComponents(cat, query);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            if (typeof window.renderLabComponents === "function") window.renderLabComponents();
        });
    } else {
        setTimeout(() => {
            if (typeof window.renderLabComponents === "function") window.renderLabComponents();
        }, 0);
    }
})();
