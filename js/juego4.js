// Verificación de progresión
const progreso = Number(localStorage.getItem("progresoJuegos")) || 0;
if (progreso < 3) {
    alert("¡Debes completar el Juego 3 primero!");
    window.location.href = "juego3.html";
}

let xp = Number(localStorage.getItem("xp")) || 0;
let nivel = Number(localStorage.getItem("nivel")) || 1;

// Audios
const sndClick = new Audio("sonidos/click.mp3");
const sndSuccess = new Audio("sonidos/success.mp3");
const sndError = new Audio("sonidos/error.mp3");

// Control de narración por voz
function hablar(texto) {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const mensaje = new SpeechSynthesisUtterance(texto);
        mensaje.lang = "es-ES";
        mensaje.rate = 0.9;
        window.speechSynthesis.speak(mensaje);
    }
}

// Inicialización
window.onload = () => {
    actualizarHUD();
    configurarDragAndDrop();
    configurarHablarElementos();
    
    // Si la pantalla de carga esta activa, esperamos a que termine
    if (document.getElementById("pantalla-carga-overlay")) {
        window.addEventListener("pantallaCargaTerminada", () => {
            hablar("Juego cuatro. Division de Esmeraldas. Reparte las ocho esmeraldas en partes iguales entre los dos aldeanos. Luego presiona Verificar.");
        });
    } else {
        hablar("Juego cuatro. Division de Esmeraldas. Reparte las ocho esmeraldas en partes iguales entre los dos aldeanos. Luego presiona Verificar.");
    }
};

function actualizarHUD() {
    document.getElementById("xpLevel").textContent = nivel;
    document.getElementById("xpFill").style.width = xp + "%";
}

function agregarXP(cantidad) {
    xp += cantidad;
    if (xp >= 100) {
        xp = 0;
        nivel++;
    }
    localStorage.setItem("xp", xp);
    localStorage.setItem("nivel", nivel);
    actualizarHUD();
}

function configurarHablarElementos() {
    // Escuchar clicks en esmeraldas
    document.querySelectorAll(".draggable-emerald").forEach(em => {
        em.addEventListener("click", (e) => {
            e.stopPropagation();
            sndClick.play().catch(() => {});
            hablar("Esmeralda");
        });
    });

    // Escuchar clicks en aldeanos
    document.querySelectorAll(".villager-box").forEach(box => {
        box.addEventListener("click", () => {
            sndClick.play().catch(() => {});
            const name = box.querySelector(".villager-name").textContent;
            hablar(name);
        });
    });
}

function configurarDragAndDrop() {
    const emeralds = document.querySelectorAll(".draggable-emerald");
    const dropzones = document.querySelectorAll(".dropzone, #emeraldsSource");

    emeralds.forEach(em => {
        em.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", em.id);
            hablar("Arrastrando esmeralda");
            sndClick.play().catch(() => {});
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        zone.addEventListener("dragenter", (e) => {
            e.preventDefault();
            if (zone.classList.contains("dropzone")) {
                zone.classList.add("hover");
            }
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("hover");
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("hover");

            const emId = e.dataTransfer.getData("text/plain");
            const em = document.getElementById(emId);

            if (!em) return;

            // Mover la esmeralda a la zona correspondiente
            zone.appendChild(em);
            sndClick.play().catch(() => {});
            
            if (zone.id === "emeraldsSource") {
                hablar("Esmeralda devuelta al inventario");
            } else {
                const numAldeano = zone.getAttribute("data-id");
                hablar("Esmeralda entregada al aldeano " + numAldeano);
            }
        });
    });
}

function verificarReparto() {
    const dz1 = document.getElementById("dropzone1");
    const dz2 = document.getElementById("dropzone2");

    const cant1 = dz1.children.length;
    const cant2 = dz2.children.length;

    if (cant1 === 4 && cant2 === 4) {
        // Correcto
        sndSuccess.play().catch(() => {});
        
        // Desactivar drag en esmeraldas
        document.querySelectorAll(".draggable-emerald").forEach(em => {
            em.setAttribute("draggable", "false");
            em.style.cursor = "default";
        });

        const progresoActual = Number(localStorage.getItem("progresoJuegos")) || 0;
        if (progresoActual < 4) {
            localStorage.setItem("progresoJuegos", "4");
            agregarXP(25); // Premio de XP
        }

        // Confeti
        if (typeof confetti === "function") {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }

        hablar("¡Correcto! Ocho dividido en dos es igual a cuatro. Cada aldeano tiene exactamente cuatro esmeraldas. Presiona siguiente para avanzar al desafío final.");
        
        document.getElementById("btnSiguiente").removeAttribute("disabled");
    } else {
        // Incorrecto
        sndError.play().catch(() => {});
        hablar("Incorrecto. El reparto no es equitativo. Ambos aldeanos deben recibir la misma cantidad. Ocho dividido entre dos es cuatro.");
    }
}

function reiniciarJuego() {
    sndClick.play().catch(() => {});
    window.location.reload();
}

function irASiguienteJuego() {
    sndClick.play().catch(() => {});
    window.location.href = "juego5.html";
}
