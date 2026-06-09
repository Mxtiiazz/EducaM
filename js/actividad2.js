let nivel = 0;

// ====== NIVEL GLOBAL GUARDADO (SE ACUMULA ENTRE ACTIVIDADES) ======
let nivelGlobal = parseInt(localStorage.getItem("nivel")) || 1;

// ====== PROGRESO DE ESTA ACTIVIDAD (0 a 5) ======
let xpProgreso = 0;

// ====== SONIDOS ======
let sonidoCorrecto = new Audio("sonidos/correcto.mp3");
let sonidoError = new Audio("sonidos/error.mp3");
let sonidoLogro = new Audio("sonidos/logro.mp3");
let sonidoClick = new Audio("sonidos/click.mp3");

function reproducir(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// ====== SISTEMA DE VOZ CON COLA ======
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

// ====== XP HUD ======
function actualizarXP() {
    let progreso = (xpProgreso / 5) * 100;

    let xpFill = document.getElementById("xpFill");
    let xpLevel = document.getElementById("xpLevel");

    if (xpFill) xpFill.style.width = progreso + "%";
    if (xpLevel) xpLevel.innerHTML = nivelGlobal;
}

function subirXP() {
    xpProgreso++;
    actualizarXP();
}

// ====== CREAR MANZANAS ======
function crearManzanas() {
    let zona = document.getElementById("zonaManzanas");
    zona.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        let manzana = document.createElement("div");
        manzana.classList.add("manzana");

        manzana.innerHTML = `
            <img src="img/manzana.png" alt="Manzana">
            <div class="numero" id="num${i}"></div>
        `;

        manzana.addEventListener("click", () => seleccionar(i));
        zona.appendChild(manzana);
    }
}

// ====== COMENZAR ======
function comenzar() {
    reproducir(sonidoClick);
    limpiarVoz();

    nivel = 1;
    xpProgreso = 0;
    actualizarXP();

    document.getElementById("mensaje").innerHTML = "";
    document.getElementById("mensaje").style.color = "white";

    document.getElementById("instruccion").innerHTML =
        "🎧 Haz clic en la manzana número 1";

    document.getElementById("btnComenzar").style.display = "none";
    document.getElementById("opcionesFinal").style.display = "none";

    crearManzanas();

    setTimeout(() => {
        hablar("Haz clic en la manzana número uno");
    }, 500);
}

// ====== SELECCIONAR ======
function seleccionar(numeroElegido) {
    if (nivel > 5) return;

    reproducir(sonidoClick);

    let manzanas = document.querySelectorAll(".manzana");
    let manzanaActual = manzanas[numeroElegido - 1];

    manzanas.forEach(m => {
        m.classList.remove("manzana-correcta");
        m.classList.remove("manzana-error");
    });

    if (numeroElegido === nivel) {
        subirXP();

        manzanaActual.classList.add("manzana-correcta");
        document.getElementById("num" + numeroElegido).innerHTML = numeroElegido;

        setTimeout(() => {
            reproducir(sonidoCorrecto);
            document.getElementById("mensaje").innerHTML = "✅ ¡Muy bien!";
            document.getElementById("mensaje").style.color = "lime";
            hablar("" + numeroElegido);
        }, 300);

        nivel++;

        if (nivel <= 5) {
            document.getElementById("instruccion").innerHTML =
                "🎧 Haz clic en la manzana número " + nivel;

            setTimeout(() => {
                hablar("Ahora haz clic en la manzana número " + nivel);
            }, 900);

        } else {
            setTimeout(() => {
                finalizar();
            }, 1200);
        }

    } else {
        manzanaActual.classList.add("manzana-error");

        setTimeout(() => {
            reproducir(sonidoError);
            document.getElementById("mensaje").innerHTML = "❌ Debes seguir el orden";
            document.getElementById("mensaje").style.color = "red";
            hablar("Debes seguir el orden");
        }, 300);
    }
}

// ====== FINALIZAR ======
function finalizar() {
    limpiarVoz();

    // COMPLETA PROGRESO VISUAL
    xpProgreso = 5;

    // SUBE NIVEL GLOBAL Y LO GUARDA
    nivelGlobal++;
    localStorage.setItem("nivel", nivelGlobal);

    // ACTUALIZA HUD YA CON EL NIVEL NUEVO
    actualizarXP();

    document.getElementById("instruccion").innerHTML =
        "🎉 ¡Felicitaciones! Contaste del 1 al 5";

    document.getElementById("mensaje").innerHTML =
        "🏆 ¡Subiste al nivel " + nivelGlobal + "!";
    document.getElementById("mensaje").style.color = "yellow";

    reproducir(sonidoLogro);

    lanzarConfeti();

    hablar(
        "Felicitaciones. Subiste al nivel " + nivelGlobal +
        ". ¿Quieres pasar al siguiente nivel del cofre?"
    );

    setTimeout(() => {
        document.getElementById("opcionesFinal").style.display = "block";
    }, 6000);
}

// ====== REINICIAR ======
function reiniciarActividad() {
    reproducir(sonidoClick);
    limpiarVoz();

    nivel = 1;
    xpProgreso = 0;
    actualizarXP();

    document.getElementById("mensaje").innerHTML = "";
    document.getElementById("mensaje").style.color = "white";

    document.getElementById("opcionesFinal").style.display = "none";
    document.getElementById("btnComenzar").style.display = "none";

    for (let i = 1; i <= 5; i++) {
        let num = document.getElementById("num" + i);
        if (num) num.innerHTML = "";
    }

    document.getElementById("instruccion").innerHTML =
        "🎧 Haz clic en la manzana número 1";

    setTimeout(() => {
        hablar("Haz clic en la manzana número uno");
    }, 500);
}

// ====== SALIR ======
function salirBienvenida() {
    limpiarVoz();
    reproducir(sonidoClick);
    setTimeout(() => {
        window.location.href = "bienvenida.html";
    }, 200);
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

// ====== MOSTRAR NIVEL AL CARGAR PÁGINA ======
window.onload = () => {
    actualizarXP();
};

function irActividad3() {
    reproducir(sonidoClick);
    speechSynthesis.cancel();

    let mensaje = new SpeechSynthesisUtterance(
        "Entrando al siguiente nivel del cofre"
    );

    mensaje.lang = "es-ES";
    mensaje.rate = 1;

    mensaje.onend = () => {
        window.location.href = "actividad3.html";
    };

    speechSynthesis.speak(mensaje);
}