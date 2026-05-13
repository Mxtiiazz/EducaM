console.log("speechSynthesis disponible:", "speechSynthesis" in window);

let voces = [];

speechSynthesis.onvoiceschanged = () => {
    voces = speechSynthesis.getVoices();
};

let avatarElegido = "";

let sonidoError = new Audio("sonidos/error.mp3");
let sonidoAvatar = new Audio("sonidos/avatar.mp3");
let sonidoSuccess = new Audio("sonidos/success.mp3");
let sonidoClick = new Audio("sonidos/click.mp3");

// Función para reproducir sonido sin bug
function reproducirSonido(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// HABLAR CON CALLBACK (cuando termina)
function hablar(texto, callback = null) {
    speechSynthesis.cancel();

    let mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    mensaje.volume = 1;

    let vocesDisponibles = speechSynthesis.getVoices();

    if (vocesDisponibles.length > 0) {
        let vozEspanol = vocesDisponibles.find(v => v.lang.includes("es"));
        if (vozEspanol) mensaje.voice = vozEspanol;
    }

    mensaje.onend = () => {
        if (callback) callback();
    };

    speechSynthesis.speak(mensaje);
}

function seleccionarAvatar(e, avatar) {
    avatarElegido = avatar;

    // quitar selección anterior
    let avatares = document.querySelectorAll(".avatares img");
    avatares.forEach(img => img.classList.remove("avatar-seleccionado"));

    // marcar seleccionado
    e.target.classList.add("avatar-seleccionado");

    document.getElementById("mensaje").innerHTML = "✅ Avatar seleccionado";

    reproducirSonido(sonidoClick);

    setTimeout(() => {
        reproducirSonido(sonidoAvatar);
    }, 500);

    setTimeout(() => {
        hablar("Avatar seleccionado");
    }, 1200);
}

function validarIngreso() {
    let nombre = document.getElementById("nombre").value.trim().slice(0, 16);
    document.getElementById("nombre").value = nombre;

    reproducirSonido(sonidoClick);

    // Caso 1: nada escrito y nada seleccionado
    if (nombre === "" && avatarElegido === "") {
        document.getElementById("mensaje").innerHTML =
            "❌ Debes escribir tu nombre y seleccionar un avatar";

        setTimeout(() => {
            reproducirSonido(sonidoError);
        }, 300);

        setTimeout(() => {
            hablar("Debes escribir tu nombre y seleccionar un avatar");
        }, 900);
    }

    // Caso 2: escribió nombre pero no avatar
    else if (nombre !== "" && avatarElegido === "") {
        document.getElementById("mensaje").innerHTML =
            "❌ Debes seleccionar un avatar";

        setTimeout(() => {
            reproducirSonido(sonidoError);
        }, 300);

        setTimeout(() => {
            hablar("Debes seleccionar un avatar");
        }, 900);
    }

    // Caso 3: seleccionó avatar pero no escribió nombre
    else if (nombre === "" && avatarElegido !== "") {
        document.getElementById("mensaje").innerHTML =
            "❌ Debes escribir tu nombre";

        setTimeout(() => {
            reproducirSonido(sonidoError);
        }, 300);

        setTimeout(() => {
            hablar("Debes escribir tu nombre");
        }, 900);
    }

    // Caso 4: todo correcto
    else {
        document.getElementById("mensaje").innerHTML =
            "🎉 Bien hecho, " + nombre;

        lanzarConfeti();

        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("avatarUsuario", avatarElegido);

        reproducirSonido(sonidoSuccess);

        // AHORA ESPERA QUE TERMINE LA VOZ PARA CAMBIAR DE PÁGINA
        setTimeout(() => {
            hablar("Bien hecho " + nombre, () => {
                window.location.href = "bienvenida.html";
            });
        }, 700);
    }
}

function lanzarConfeti() {
    for (let i = 0; i < 60; i++) {
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

// Frases del título
let frases = [
    "¡Aprende jugando!",
    "¡Modo creativo!",
    "¡Hora de aprender!",
    "¡Bienvenido aventurero!",
    "¡Nivel completado!",
    "¡Cuenta manzanas!",
    "¡Construye tu mente!",
    "¡Eres un pro!"
];

let splash = document.getElementById("splash");

if (splash) {
    splash.innerHTML = frases[Math.floor(Math.random() * frases.length)];
}