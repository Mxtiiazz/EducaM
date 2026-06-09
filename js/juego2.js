// Verificación de progresión
const progreso = Number(localStorage.getItem("progresoJuegos")) || 0;
if (progreso < 1) {
    alert("¡Debes completar el Juego 1 primero!");
    window.location.href = "juego1.html";
}

let xp = Number(localStorage.getItem("xp")) || 0;
let nivel = Number(localStorage.getItem("nivel")) || 1;

let aciertos = 0;
const totalAciertos = 3;

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
            hablar("Juego dos. Resta de Manzanas. Arrastra cada operacion de resta al cofre que tenga el resultado correcto.");
        });
    } else {
        hablar("Juego dos. Resta de Manzanas. Arrastra cada operacion de resta al cofre que tenga el resultado correcto.");
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
    // Escuchar clicks en las cartas de operaciones
    document.querySelectorAll(".draggable-card").forEach(card => {
        card.addEventListener("click", () => {
            sndClick.play().catch(() => {});
            const op = card.getAttribute("data-op");
            const textoVoz = op.replace("-", "menos");
            hablar(textoVoz);
        });
    });

    // Escuchar clicks en los cofres receptores
    document.querySelectorAll(".drop-target").forEach(target => {
        target.addEventListener("click", () => {
            sndClick.play().catch(() => {});
            const res = target.getAttribute("data-res");
            hablar("Resultado " + res);
        });
    });
}

function configurarDragAndDrop() {
    const cards = document.querySelectorAll(".draggable-card");
    const targets = document.querySelectorAll(".drop-target");

    cards.forEach(card => {
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", card.id);
            const op = card.getAttribute("data-op");
            hablar("Arrastrando " + op.replace("-", "menos"));
            sndClick.play().catch(() => {});
        });
    });

    targets.forEach(target => {
        target.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        target.addEventListener("dragenter", (e) => {
            e.preventDefault();
            target.classList.add("hover");
        });

        target.addEventListener("dragleave", () => {
            target.classList.remove("hover");
        });

        target.addEventListener("drop", (e) => {
            e.preventDefault();
            target.classList.remove("hover");

            const cardId = e.dataTransfer.getData("text/plain");
            const card = document.getElementById(cardId);

            if (!card) return;

            const resCard = card.getAttribute("data-res");
            const resTarget = target.getAttribute("data-res");

            if (resCard === resTarget) {
                // Correcto
                sndSuccess.play().catch(() => {});
                target.appendChild(card);
                card.setAttribute("draggable", "false");
                card.style.cursor = "default";
                
                // Abrir cofre
                const img = target.querySelector("img");
                if (img) {
                    img.src = "img/cofre_abierto.png";
                }

                aciertos++;
                hablar("¡Correcto! " + card.getAttribute("data-op") + " es igual a " + resTarget);

                if (aciertos === totalAciertos) {
                    completarNivel();
                }
            } else {
                // Incorrecto
                sndError.play().catch(() => {});
                hablar("Incorrecto. Inténtalo de nuevo.");
            }
        });
    });
}

function completarNivel() {
    const progresoActual = Number(localStorage.getItem("progresoJuegos")) || 0;
    if (progresoActual < 2) {
        localStorage.setItem("progresoJuegos", "2");
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

    hablar("¡Excelente! Completaste el Juego dos de Restas. Presiona siguiente para avanzar al Juego tres.");
    
    // Activar botón Siguiente
    document.getElementById("btnSiguiente").removeAttribute("disabled");
}

function reiniciarJuego() {
    sndClick.play().catch(() => {});
    window.location.reload();
}

function irASiguienteJuego() {
    sndClick.play().catch(() => {});
    window.location.href = "juego3.html";
}
