
/* =========================================
   ZIDONG CORE 2.0
   HANZI LAB ENGINE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const components = {
        silk: {
            title: "纟 — Semantic component",
            description:
                "纟 es la forma simplificada del radical 糸. Está relacionado históricamente con hilo, seda y fibras. Nos da una pista semántica sobre el carácter 缆."
        },

        lan: {
            title: "览 — Phonetic component",
            description:
                "览 aporta principalmente una pista fonética. Se pronuncia lǎn, igual que 缆. No debemos asumir que todos sus componentes indican directamente el significado."
        }
    };

    const buttons = document.querySelectorAll(".component-card");
    const detail = document.getElementById("component-detail");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const component = components[button.dataset.component];

            if (!component || !detail) return;

            buttons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            const title = document.createElement("h4");
            title.textContent = component.title;

            const paragraph = document.createElement("p");
            paragraph.textContent = component.description;

            detail.replaceChildren(title, paragraph);

        });

    });

    console.log("Hanzi Lab Engine: READY");

});

/* =========================================
   HANZI LAB - LEARNING CENTER INTEGRATION
========================================= */

function showHanziLab() {

    document.querySelector("#hanziLabContent").style.display = "block";

    document.querySelector("#learning .module-grid").style.display = "none";

    document.querySelector("#learning .welcome").style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });

}

function hideHanziLab() {

    document.querySelector("#hanziLabContent").style.display = "none";

    document.querySelector("#learning .module-grid").style.display = "grid";

    document.querySelector("#learning .welcome").style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });

}
