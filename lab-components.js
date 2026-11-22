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
            container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--muted); font-size:12px;">No se encontraron componentes en el laboratorio.</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "panel";
            card.style.background = "var(--surface)";
            card.style.border = "1px solid var(--border)";
            card.style.borderRadius = "14px";
            card.style.padding = "14px";
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.gap = "12px";

            card.innerHTML = `
                <div style="font-size:28px; background:var(--surface-light); width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border);">${item.icon}</div>
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:var(--cyan); font-size:13.5px; font-family:'Noto Sans SC';">${item.hanzi}</strong>
                        <small style="color:var(--muted); font-size:9.5px;">${item.pinyin}</small>
                    </div>
                    <h4 style="color:#fff; font-size:12px; margin-top:2px;">${item.name}</h4>
                    <p style="font-size:10px; color:var(--muted); margin-top:2px; line-height:1.3;">${item.desc}</p>
                </div>
            `;
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
