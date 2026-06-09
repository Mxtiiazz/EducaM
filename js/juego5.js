// Verificación de progresión
const progreso = Number(localStorage.getItem("progresoJuegos")) || 0;
if (progreso < 4) {
    alert("¡Debes completar el Juego 4 primero!");
    window.location.href = "juego4.html";
}

let xp = Number(localStorage.getItem("xp")) || 0;
let nivel = Number(localStorage.getItem("nivel")) || 1;

let aciertos = 0;
const totalAciertos = 4;

// Audios
const sndClick = new Audio("sonidos/click.mp3");
const sndSuccess = new Audio("sonidos/success.mp3");
const sndError = new Audio("sonidos/error.mp3");
const sndCofre = new Audio("sonidos/cofre_abierto.ogg");

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
            hablar("Juego cinco. Desafio final en la Mazmorra Matematica. Resuelve las cuatro operaciones de los cofres arrastrando sus llaves numericas para abrirlos.");
        });
    } else {
        hablar("Juego cinco. Desafio final en la Mazmorra Matematica. Resuelve las cuatro operaciones de los cofres arrastrando sus llaves numericas para abrirlos.");
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
    // Escuchar clicks en llaves
    document.querySelectorAll(".dungeon-key").forEach(key => {
        key.addEventListener("click", () => {
            sndClick.play().catch(() => {});
            const val = key.getAttribute("data-val");
            hablar("Llave número " + val);
        });
    });

    // Escuchar clicks en cofres
    document.querySelectorAll(".chest-container").forEach(chest => {
        chest.addEventListener("click", () => {
            sndClick.play().catch(() => {});
            const type = chest.getAttribute("data-type");
            const op = chest.querySelector(".operation-badge").textContent;
            
            let descOp = op;
            descOp = descOp.replace("+", "más");
            descOp = descOp.replace("-", "menos");
            descOp = descOp.replace("×", "por");
            descOp = descOp.replace("÷", "dividido en");
            
            hablar("Cofre de " + type + ". Operación " + descOp);
        });
    });
}

// Configurar Drag & Drop
function configurarDragAndDrop() {
    const keys = document.querySelectorAll(".dungeon-key");
    const chests = document.querySelectorAll(".chest-container");

    keys.forEach(key => {
        key.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", key.id);
            const val = key.getAttribute("data-val");
            hablar("Arrastrando llave número " + val);
            sndClick.play().catch(() => {});
        });
    });

    chests.forEach(chest => {
        chest.addEventListener("dragover", (e) => {
            if (chest.classList.contains("solved")) return;
            e.preventDefault();
        });

        chest.addEventListener("dragenter", (e) => {
            if (chest.classList.contains("solved")) return;
            e.preventDefault();
            chest.classList.add("hover");
        });

        chest.addEventListener("dragleave", () => {
            chest.classList.remove("hover");
        });

        chest.addEventListener("drop", (e) => {
            e.preventDefault();
            chest.classList.remove("hover");

            if (chest.classList.contains("solved")) return;

            const keyId = e.dataTransfer.getData("text/plain");
            const key = document.getElementById(keyId);

            if (!key) return;

            const keyVal = key.getAttribute("data-val");
            const chestRes = chest.getAttribute("data-res");

            if (keyVal === chestRes) {
                // Correcto
                chest.classList.add("solved");
                
                // Audio
                sndCofre.play().catch(() => {
                    sndSuccess.play().catch(() => {});
                });

                // Abrir cofre visualmente
                const img = chest.querySelector("img.chest-img");
                if (img) {
                    img.src = "img/cofre_abierto.png";
                }

                // Colocar llave
                key.remove();
                const keyBadge = document.createElement("div");
                keyBadge.className = "placed-key";
                keyBadge.textContent = keyVal;
                chest.appendChild(keyBadge);

                aciertos++;
                const type = chest.getAttribute("data-type");
                hablar("¡Correcto! El cofre de " + type + " se ha abierto.");

                if (aciertos === totalAciertos) {
                    completarNivel();
                }
            } else {
                // Incorrecto
                sndError.play().catch(() => {});
                hablar("Incorrecto. Esta llave no abre este cofre.");
            }
        });
    });
}

function completarNivel() {
    const progresoActual = Number(localStorage.getItem("progresoJuegos")) || 0;
    if (progresoActual < 5) {
        localStorage.setItem("progresoJuegos", "5");
        agregarXP(25); // Premio de XP
    }

    // Confeti
    if (typeof confetti === "function") {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    }

    // Mostrar tesoro
    document.getElementById("treasureBox").style.display = "block";

    hablar("¡Felicidades! Lograste abrir todos los cofres de la mazmorra y encontraste el gran tesoro final. Presiona siguiente para recibir tu recompensa.");
    
    document.getElementById("btnSiguiente").removeAttribute("disabled");
}

function reiniciarJuego() {
    sndClick.play().catch(() => {});
    window.location.reload();
}

function irASiguienteJuego() {
    sndClick.play().catch(() => {});
    window.location.href = "final.html";
}
