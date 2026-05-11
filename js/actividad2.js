let nivel = 0;

let sonidoCorrecto = new Audio("sonidos/correcto.mp3");
let sonidoError = new Audio("sonidos/error.mp3");
let sonidoLogro = new Audio("sonidos/logro.mp3");
let sonidoClick = new Audio("sonidos/click.mp3");

function reproducir(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function hablar(texto) {
    speechSynthesis.cancel();

    let mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    mensaje.volume = 1;

    speechSynthesis.speak(mensaje);
}

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

        manzana.onclick = () => seleccionar(i);

        zona.appendChild(manzana);
    }
}

function comenzar() {
    nivel = 1;

    document.getElementById("mensaje").innerHTML = "";
    document.getElementById("instruccion").innerHTML =
        "🎧 Haz clic en la manzana número 1";

    crearManzanas();

    setTimeout(() => {
        hablar("Haz clic en la manzana número uno");
    }, 500);
}

function seleccionar(numeroElegido) {
    reproducir(sonidoClick);

    // Selecciona la manzana clickeada
    let manzanas = document.querySelectorAll(".manzana");
    let manzanaActual = manzanas[numeroElegido - 1];

    // limpiar efectos anteriores
    manzanas.forEach(m => {
        m.classList.remove("manzana-correcta");
        m.classList.remove("manzana-error");
    });

    if (numeroElegido === nivel) {

        // efecto correcto
        manzanaActual.classList.add("manzana-correcta");

        document.getElementById("num" + numeroElegido).innerHTML = numeroElegido;

        setTimeout(() => {
            reproducir(sonidoCorrecto);
            document.getElementById("mensaje").innerHTML = "✅ ¡Muy bien!";
            document.getElementById("mensaje").style.color = "green";
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
            finalizar();
        }

    } else {
        // efecto error
        manzanaActual.classList.add("manzana-error");

        setTimeout(() => {
            reproducir(sonidoError);
            document.getElementById("mensaje").innerHTML = "❌ Debes seguir el orden";
            document.getElementById("mensaje").style.color = "red";
            hablar("Debes seguir el orden");
        }, 300);
    }
}

function finalizar() {
    document.getElementById("instruccion").innerHTML =
        "🎉 ¡Felicitaciones! Contaste del 1 al 5";

    document.getElementById("mensaje").innerHTML = "🏆 ¡Excelente trabajo!";
    document.getElementById("mensaje").style.color = "blue";

    reproducir(sonidoLogro);
    hablar("Felicitaciones. Contaste del uno al cinco.");

    lanzarConfeti();

    setTimeout(() => {
        window.location.href = "bienvenida.html";
    }, 4000);
}

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