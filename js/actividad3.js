let nivel = 1;
let xpNivel = 0;

// ====== SONIDOS ======
let sonidoCorrecto = new Audio("sonidos/correcto.mp3");
let sonidoError = new Audio("sonidos/error.mp3");
let sonidoLogro = new Audio("sonidos/logro.mp3");
let sonidoClick = new Audio("sonidos/click.mp3");

let sonidoCofreAbrir = new Audio("sonidos/cofre_abierto.ogg");
let sonidoCofreCerrar = new Audio("sonidos/cofre_cerrado.ogg");

// ====== CONTROL COFRE ======
let cofreAbierto = false;

// ====== SISTEMA DE VOZ ======
let colaVoz = [];
let hablando = false;

function hablar(texto) {
    if (colaVoz.includes(texto)) return;

    colaVoz.push(texto);

    if (!hablando) reproducirCola();
}

function reproducirCola() {
    if (colaVoz.length === 0) {
        hablando = false;
        return;
    }

    hablando = true;

    let texto = colaVoz.shift();

    let mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    mensaje.volume = 1;

    mensaje.onend = () => {
        reproducirCola();
    };

    speechSynthesis.speak(mensaje);
}

function limpiarVoz() {
    speechSynthesis.cancel();
    colaVoz = [];
    hablando = false;
}

// ====== REPRODUCIR SONIDOS ======
function reproducir(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ====== DESBLOQUEAR AUDIO (IMPORTANTE EN CHROME) ======
let audioDesbloqueado = false;

function desbloquearAudio() {
    if (audioDesbloqueado) return;

    sonidoCofreAbrir.play().then(() => {
        sonidoCofreAbrir.pause();
        sonidoCofreAbrir.currentTime = 0;
    }).catch(() => {});

    sonidoCofreCerrar.play().then(() => {
        sonidoCofreCerrar.pause();
        sonidoCofreCerrar.currentTime = 0;
    }).catch(() => {});

    audioDesbloqueado = true;
}

// ====== XP VISUAL ======
function actualizarXP() {
    let progreso = (xpNivel / 5) * 100;

    let xpFill = document.getElementById("xpFill");
    let xpLevel = document.getElementById("xpLevel");

    if (xpFill) xpFill.style.width = progreso + "%";
    if (xpLevel) xpLevel.innerHTML = xpNivel;
}

function subirXP() {
    xpNivel++;
    actualizarXP();
}

// ====== COFRE ======
function abrirCofre() {
    if (cofreAbierto) return;

    cofreAbierto = true;
    document.getElementById("imgCofre").src = "img/cofre_abierto.png";
    reproducir(sonidoCofreAbrir);
}

function cerrarCofre() {
    if (!cofreAbierto) return;

    cofreAbierto = false;
    document.getElementById("imgCofre").src = "img/cofre_cerrado.png";
    reproducir(sonidoCofreCerrar);
}

// ====== AYUDA ======
function repetirAyuda() {
    limpiarVoz();
    hablar("Arrastra las manzanas al cofre en orden del uno al cinco.");
}

// ====== INICIO ======
window.onload = () => {
    actualizarXP();

    setTimeout(() => {
        hablar("Arrastra las manzanas al cofre en orden del uno al cinco.");
    }, 800);

    configurarDragDrop();
    configurarCofreEventos();

    document.addEventListener("click", desbloquearAudio, { once: true });
};

// ====== DRAG & DROP ======
function configurarDragDrop() {
    let items = document.querySelectorAll(".item-manzana");
    let cofre = document.getElementById("cofre");

    items.forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("num", item.dataset.num);
        });
    });

    cofre.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    cofre.addEventListener("drop", (e) => {
        e.preventDefault();

        let numero = parseInt(e.dataTransfer.getData("num"));
        verificar(numero);

        cerrarCofre();
    });
}

// ====== COFRE EVENTOS ======
function configurarCofreEventos() {
    let cofre = document.getElementById("cofre");

    // Hover normal
    cofre.addEventListener("mouseenter", () => {
        abrirCofre();
    });

    cofre.addEventListener("mouseleave", () => {
        cerrarCofre();
    });

    // Drag events
    cofre.addEventListener("dragenter", (e) => {
        e.preventDefault();
        abrirCofre();
    });

    cofre.addEventListener("dragover", (e) => {
        e.preventDefault();
        abrirCofre();
    });

    cofre.addEventListener("dragleave", () => {
        cerrarCofre();
    });
}

// ====== VERIFICAR ORDEN ======
function verificar(numero) {
    if (nivel > 5) return;

    reproducir(sonidoClick);

    if (numero === nivel) {
        reproducir(sonidoCorrecto);

        document.getElementById("mensaje").innerHTML = "✅ Correcto!";
        document.getElementById("mensaje").style.color = "lime";

        hablar("" + numero);

        // eliminar manzana usada
        let item = document.querySelector(`.item-manzana[data-num="${numero}"]`);
        if (item) item.style.display = "none";

        subirXP();
        nivel++;

        if (nivel <= 5) {
            document.getElementById("instruccion").innerHTML =
                "Ahora arrastra la manzana número " + nivel;

            setTimeout(() => {
                hablar("Ahora arrastra la manzana número " + nivel);
            }, 900);

        } else {
            setTimeout(() => {
                finalizar();
            }, 1500);
        }

    } else {
        reproducir(sonidoError);

        document.getElementById("mensaje").innerHTML = "❌ Debes seguir el orden";
        document.getElementById("mensaje").style.color = "red";

        hablar("Debes seguir el orden");
    }
}

// ====== FINALIZAR ======
function finalizar() {
    limpiarVoz();

    document.getElementById("instruccion").innerHTML =
        "🎉 ¡Felicitaciones! Guardaste todas las manzanas";

    document.getElementById("mensaje").innerHTML = "🏆 ¡Actividad completada!";
    document.getElementById("mensaje").style.color = "yellow";

    reproducir(sonidoLogro);
    hablar("Felicitaciones. Completaste la actividad.");

    // subir nivel global
    let nivelGlobal = parseInt(localStorage.getItem("nivelGlobal")) || 0;
    nivelGlobal++;
    localStorage.setItem("nivelGlobal", nivelGlobal);

    lanzarConfeti();

    setTimeout(() => {
        document.getElementById("opcionesFinal").style.display = "block";
        hablar("¿Quieres repetir la actividad?");
    }, 2000);
}

// ====== REINICIAR ======
function reiniciarActividad() {
    limpiarVoz();

    nivel = 1;
    xpNivel = 0;
    actualizarXP();

    document.getElementById("mensaje").innerHTML = "";
    document.getElementById("mensaje").style.color = "white";

    document.getElementById("opcionesFinal").style.display = "none";

    document.getElementById("instruccion").innerHTML =
        "Arrastra las manzanas al cofre en orden del 1 al 5";

    // mostrar manzanas otra vez
    let items = document.querySelectorAll(".item-manzana");
    items.forEach(item => item.style.display = "block");

    setTimeout(() => {
        hablar("Arrastra las manzanas al cofre en orden del uno al cinco.");
    }, 600);
}

// ====== SALIR ======
function salirBienvenida() {
    limpiarVoz();
    window.location.href = "bienvenida.html";
}

// ====== CONFETI ======
function lanzarConfeti() {
    for (let i = 0; i < 80; i++) {
        let confeti = document.createElement("div");
        confeti.classList.add("confeti");

        confeti.style.left = Math.random() * 100 + "vw";
        confeti.style.backgroundColor =
            "hsl(" + Math.random() * 360 + ", 100%, 50%)";
        confeti.style.animationDuration = (Math.random() * 2 + 2) + "s";

        document.body.appendChild(confeti);

        setTimeout(() => {
            confeti.remove();
        }, 3000);
    }
}