let xp = Number(
    localStorage.getItem("xp")
) || 0;

let nivel = Number(
    localStorage.getItem("nivel")
) || 1;

let temaActual = 0;
let explicacionVista = false;
let animacionEnCurso = false;
let navegacionEnCurso = false;
let vozVersion = 0;

const temasVistos = [
    false,
    false,
    false,
    false
];

const temas = [
    {
        titulo: "SUMA",
        texto:
            "La suma sirve para juntar cantidades. Ejemplo: cinco diamantes mas tres diamantes son ocho diamantes.",
        html: `
            <p class="explicacion-corta">
                La suma sirve para juntar cantidades.
            </p>

            <div class="suma-demo">
                <div id="grupo1" class="grupo-items grupo-suma"></div>
                <div class="operador">+</div>
                <div id="grupo2" class="grupo-items grupo-suma"></div>
            </div>

            <div class="formula-operacion">5 + 3 = 8</div>
            <div id="resultadoSuma"></div>
        `
    },
    {
        titulo: "RESTA",
        texto:
            "La resta sirve para quitar cantidades. Ejemplo: ocho manzanas menos tres manzanas son cinco manzanas.",
        html: `
            <p class="explicacion-corta">
                La resta sirve para quitar cantidades.
            </p>

            <div class="suma-demo">
                <div id="grupoResta1" class="grupo-items grupo-suma"></div>
                <div class="operador">-</div>
                <div id="grupoResta2" class="grupo-items grupo-suma"></div>
            </div>

            <div class="formula-operacion">8 - 3 = 5</div>
            <div id="resultadoResta"></div>
        `
    },
    {
        titulo: "MULTIPLICACION",
        texto:
            "La multiplicacion sirve para repetir grupos iguales. Ejemplo: cuatro grupos de dos lingotes son ocho lingotes.",
        html: `
            <p class="explicacion-corta">
                La multiplicacion sirve para repetir grupos iguales.
            </p>

            <div class="grupos-multiplicacion">
                <div class="grupo-multi">
                    <img class="cofre-mini" src="img/cofre_cerrado.png" alt="Cofre 1">
                    <span>Cofre 1</span>
                    <div id="grupoMulti1" class="items-grupo"></div>
                </div>

                <div class="grupo-multi">
                    <img class="cofre-mini" src="img/cofre_cerrado.png" alt="Cofre 2">
                    <span>Cofre 2</span>
                    <div id="grupoMulti2" class="items-grupo"></div>
                </div>

                <div class="grupo-multi">
                    <img class="cofre-mini" src="img/cofre_cerrado.png" alt="Cofre 3">
                    <span>Cofre 3</span>
                    <div id="grupoMulti3" class="items-grupo"></div>
                </div>

                <div class="grupo-multi">
                    <img class="cofre-mini" src="img/cofre_cerrado.png" alt="Cofre 4">
                    <span>Cofre 4</span>
                    <div id="grupoMulti4" class="items-grupo"></div>
                </div>
            </div>

            <div class="formula-operacion">4 x 2 = 8</div>
            <div id="resultadoMulti"></div>
        `
    },
    {
        titulo: "DIVISION",
        texto:
            "La division sirve para repartir cantidades en partes iguales. Ejemplo: ocho dividido en dos es igual a cuatro.",
        html: `
            <p class="explicacion-corta">
                La division sirve para repartir cantidades en partes iguales.
            </p>

            <div class="division-reparto">
                <div class="esmeraldas-iniciales">
                    <span class="etiqueta-seccion">Esmeraldas</span>
                    <div id="grupoDivision1" class="grupo-items grupo-suma"></div>
                </div>

                <div class="aldeanos-reparto">
                    <div class="aldeano-reparto">
                        <img src="img/aldeano.png" alt="Aldeano 1">
                        <span>Aldeano 1</span>
                        <div id="aldeano1Items" class="items-aldeano"></div>
                    </div>

                    <div class="aldeano-reparto">
                        <img src="img/aldeano.png" alt="Aldeano 2">
                        <span>Aldeano 2</span>
                        <div id="aldeano2Items" class="items-aldeano"></div>
                    </div>
                </div>
            </div>

            <div class="formula-operacion">8 / 2 = 4</div>
            <div id="resultadoDivision"></div>
        `
    }
];

const numerosVoz = [
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho"
];

function esperar(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function detenerVoz(){
    vozVersion++;

    if("speechSynthesis" in window){
        speechSynthesis.cancel();
    }
}

function hablar(texto){
    return new Promise((resolve) => {
        if(!("speechSynthesis" in window)){
            resolve();
            return;
        }

        const versionActual =
            vozVersion;

        const mensaje =
            new SpeechSynthesisUtterance(texto);

        mensaje.lang = "es-ES";
        mensaje.rate = 0.9;
        mensaje.pitch = 1;
        mensaje.volume = 1;

        mensaje.onend = () => {
            resolve();
        };

        mensaje.onerror = () => {
            resolve();
        };

        if(versionActual !== vozVersion){
            resolve();
            return;
        }

        speechSynthesis.speak(mensaje);
    });
}

function cargarTema(){
    detenerVoz();

    const tema = temas[temaActual];

    explicacionVista = temasVistos[temaActual];

    document.getElementById("tituloTema").innerHTML =
        tema.titulo;

    document.getElementById("contenidoTema").innerHTML =
        tema.html;

    const btnSiguiente =
        document.getElementById("btnSiguiente");

    if(btnSiguiente){
        if(temaActual === temas.length - 1){
            btnSiguiente.innerHTML =
                "Ir al Juego";

            btnSiguiente.onclick =
                () => mostrarModalFinal(true);
        }else{
            btnSiguiente.innerHTML =
                "Siguiente →";

            btnSiguiente.onclick =
                siguienteTema;
        }
    }

    const btnAnterior =
        document.getElementById("btnAnterior");

    if(btnAnterior){
        btnAnterior.style.visibility =
            temaActual === 0 ? "hidden" : "visible";
    }

    const btnExplicacion =
        document.getElementById("btnExplicacion");

    if(btnExplicacion){
        const animaciones = [
            animarSuma,
            animarResta,
            animarMultiplicacion,
            animarDivision
        ];

        btnExplicacion.onclick =
            animaciones[temaActual];

        btnExplicacion.innerHTML =
            temasVistos[temaActual] ? "Repetir" : "Iniciar";
    }

    bloquearBotones(animacionEnCurso || navegacionEnCurso);
}

async function anunciarTema(){
    if(animacionEnCurso){
        return;
    }

    const tema = temas[temaActual];

    await hablar("Tema actual.");

    if(animacionEnCurso){
        return;
    }

    await hablar(tema.titulo);
}

async function siguienteTema(){
    if(animacionEnCurso || navegacionEnCurso || !temasVistos[temaActual]){
        return;
    }

    sonidoBoton();

    if(temaActual < temas.length - 1){
        navegacionEnCurso = true;
        bloquearBotones(true);
        detenerVoz();

        temaActual++;
        cargarTema();
        await anunciarTema();

        bloquearBotones(false);
        navegacionEnCurso = false;
    }
}

async function anteriorTema(){
    if(animacionEnCurso || navegacionEnCurso){
        return;
    }

    sonidoBoton();

    if(temaActual > 0){
        navegacionEnCurso = true;
        bloquearBotones(true);
        detenerVoz();

        temaActual--;
        cargarTema();
        await anunciarTema();

        bloquearBotones(false);
        navegacionEnCurso = false;
    }
}

function bloquearBotones(bloquear){
    const btnAnterior =
        document.getElementById("btnAnterior");

    const btnSiguiente =
        document.getElementById("btnSiguiente");

    const btnExplicacion =
        document.getElementById("btnExplicacion");

    if(btnAnterior){
        btnAnterior.disabled = bloquear;
    }

    if(btnSiguiente){
        btnSiguiente.disabled =
            bloquear || !temasVistos[temaActual];
    }

    if(btnExplicacion){
        btnExplicacion.disabled = bloquear;
    }
}

function agregarXP(cantidad){
    xp += cantidad;

    if(xp >= 100){
        xp = 0;
        nivel++;
    }

    localStorage.setItem("xp", xp);
    localStorage.setItem("nivel", nivel);

    actualizarHUD();
}

function marcarTemaVisto(){
    if(!temasVistos[temaActual]){
        temasVistos[temaActual] = true;
        agregarXP(25);
    }

    explicacionVista = true;

    bloquearBotones(animacionEnCurso || navegacionEnCurso);

    const btnExplicacion =
        document.getElementById("btnExplicacion");

    if(btnExplicacion){
        btnExplicacion.innerHTML =
            "Repetir";
    }
}

async function iniciarExplicacion(animacion){
    if(animacionEnCurso){
        return;
    }

    if(explicacionVista){
        const repetir = confirm(
            "Quieres volver a escuchar la explicacion?"
        );

        if(!repetir){
            return;
        }
    }

    sonidoBoton();

    animacionEnCurso = true;

    bloquearBotones(true);

    detenerVoz();
    marcarTemaVisto();

    try{
        await animacion();
    }finally{
        animacionEnCurso = false;

        bloquearBotones(false);
    }
}

function limpiarElemento(id){
    const elemento =
        document.getElementById(id);

    if(elemento){
        elemento.innerHTML = "";
    }

    return elemento;
}

function agregarImagen(contenedor, src, alt){
    const img =
        document.createElement("img");

    img.src = src;
    img.alt = alt;

    contenedor.appendChild(img);

    return img;
}

function agregarItemNumerado(contenedor, src, alt, numero){
    const item =
        document.createElement("div");

    item.className =
        "item-contado";

    const img =
        document.createElement("img");

    img.src = src;
    img.alt = alt;

    const etiqueta =
        document.createElement("span");

    etiqueta.textContent =
        numero;

    item.appendChild(img);
    item.appendChild(etiqueta);
    contenedor.appendChild(item);

    return item;
}

async function agregarYContar(contenedor, cantidad, src, alt, desde = 0){
    for(let i = 0; i < cantidad; i++){
        agregarItemNumerado(
            contenedor,
            src,
            alt,
            desde + i + 1
        );

        await esperar(350);
        await hablar(numerosVoz[desde + i]);
    }
}

async function contarEnContenedor(contenedor, cantidad, src, alt, desde = 0){
    contenedor.innerHTML = "";
    contenedor.classList.add("conteo-final");

    await agregarYContar(
        contenedor,
        cantidad,
        src,
        alt,
        desde
    );
}

function mostrarResultado(id, src, alt, cantidad, texto){
    const resultado =
        limpiarElemento(id);

    if(!resultado){
        return;
    }

    resultado.classList.remove("conteo-final");

    const contenido =
        document.createElement("div");

    contenido.className =
        "resultado-final";

    agregarItemNumerado(
        contenido,
        src,
        alt,
        cantidad
    );

    const etiqueta =
        document.createElement("div");

    etiqueta.className =
        "texto-resultado";

    etiqueta.textContent =
        texto;

    contenido.appendChild(etiqueta);
    resultado.appendChild(contenido);
}

async function animarSuma(){
    await iniciarExplicacion(async () => {
        const grupo1 = limpiarElemento("grupo1");
        const grupo2 = limpiarElemento("grupo2");
        limpiarElemento("resultadoSuma");

        if(!grupo1 || !grupo2){
            return;
        }

        await hablar("La suma sirve para juntar cantidades.");
        await hablar("Tenemos cinco diamantes.");
        await agregarYContar(
            grupo1,
            5,
            "img/diamante.png",
            "Diamante"
        );

        await hablar("Ahora agregamos tres diamantes mas.");
        await agregarYContar(
            grupo2,
            3,
            "img/diamante.png",
            "Diamante"
        );

        mostrarResultado(
            "resultadoSuma",
            "img/diamante.png",
            "Diamante",
            8,
            "8 Diamantes"
        );

        await hablar("Cinco mas tres es igual a ocho.");
        await hablar("Contemos juntos el resultado final.");
        await contarEnContenedor(
            limpiarElemento("resultadoSuma"),
            8,
            "img/diamante.png",
            "Diamante"
        );
        mostrarResultado(
            "resultadoSuma",
            "img/diamante.png",
            "Diamante",
            8,
            "8 Diamantes"
        );
    });
}

async function animarResta(){
    await iniciarExplicacion(async () => {
        const grupo1 = limpiarElemento("grupoResta1");
        const grupo2 = limpiarElemento("grupoResta2");
        limpiarElemento("resultadoResta");

        if(!grupo1 || !grupo2){
            return;
        }

        await hablar("La resta sirve para quitar cantidades.");
        await hablar("Tenemos ocho manzanas.");
        await agregarYContar(
            grupo1,
            8,
            "img/manzana.png",
            "Manzana"
        );

        await hablar("Ahora quitamos tres manzanas.");

        for(let i = 0; i < 3; i++){
            const manzanas =
                grupo1.querySelectorAll(".item-contado");

            const manzana =
                manzanas[manzanas.length - 1];

            if(manzana){
                manzana.classList.add("manzana-eliminada");
            }

            await esperar(300);

            if(manzana){
                manzana.remove();
            }

            agregarItemNumerado(
                grupo2,
                "img/manzana.png",
                "Manzana quitada",
                i + 1
            );

            await esperar(350);
            await hablar("Quitamos " + numerosVoz[i] + ".");
        }

        await hablar("Contemos las manzanas que quedaron.");
        await contarEnContenedor(
            limpiarElemento("resultadoResta"),
            5,
            "img/manzana.png",
            "Manzana"
        );

        mostrarResultado(
            "resultadoResta",
            "img/manzana.png",
            "Manzana",
            5,
            "5 Manzanas"
        );

        await hablar("Ahora quedan cinco manzanas.");
        await hablar("Ocho menos tres es igual a cinco.");
    });
}

async function animarMultiplicacion(){
    await iniciarExplicacion(async () => {
        const grupos = [
            limpiarElemento("grupoMulti1"),
            limpiarElemento("grupoMulti2"),
            limpiarElemento("grupoMulti3"),
            limpiarElemento("grupoMulti4")
        ];

        limpiarElemento("resultadoMulti");

        if(grupos.some((grupo) => !grupo)){
            return;
        }

        await hablar("La multiplicacion sirve para repetir grupos iguales.");
        await hablar("Aqui no multiplicamos lingotes por lingotes.");
        await hablar("Multiplicaremos dos lingotes por cuatro cofres.");
        await hablar("Eso significa que pondremos dos lingotes en cada cofre.");

        await esperar(500);
        await hablar("Miremos los cuatro cofres.");

        for(let grupo = 0; grupo < grupos.length; grupo++){
            await hablar("Cofre " + numerosVoz[grupo] + ".");

            for(let item = 0; item < 2; item++){
                agregarItemNumerado(
                    grupos[grupo],
                    "img/oro.png",
                    "Lingote",
                    item + 1
                );

                await esperar(350);
                await hablar(numerosVoz[item]);
            }
        }

        await hablar("Ahora contamos todos los lingotes juntos.");
        await contarEnContenedor(
            limpiarElemento("resultadoMulti"),
            8,
            "img/oro.png",
            "Lingote"
        );

        mostrarResultado(
            "resultadoMulti",
            "img/oro.png",
            "Lingote",
            8,
            "8 Lingotes"
        );

        await hablar("Dos mas dos mas dos mas dos es igual a ocho.");
        await hablar("Dos lingotes por cuatro cofres forman ocho lingotes.");
    });
}

async function animarDivision(){
    await iniciarExplicacion(async () => {
        const grupo1 = limpiarElemento("grupoDivision1");
        const aldeano1 = limpiarElemento("aldeano1Items");
        const aldeano2 = limpiarElemento("aldeano2Items");
        limpiarElemento("resultadoDivision");

        if(!grupo1 || !aldeano1 || !aldeano2){
            return;
        }

        await hablar("La division sirve para repartir cantidades en partes iguales.");
        await hablar("Tenemos ocho esmeraldas.");
        await agregarYContar(
            grupo1,
            8,
            "img/esmeralda.png",
            "Esmeralda"
        );

        await hablar("Las repartimos entre dos aldeanos.");
        await hablar("Entregaremos una esmeralda a cada aldeano por turno.");

        for(let i = 0; i < 8; i++){
            const destino =
                i % 2 === 0 ? aldeano1 : aldeano2;

            const numeroAldeano =
                i % 2 === 0 ? "uno" : "dos";

            const esmeraldas =
                grupo1.querySelectorAll(".item-contado");

            const esmeralda =
                esmeraldas[0];

            if(esmeralda){
                esmeralda.remove();
            }

            agregarItemNumerado(
                destino,
                "img/esmeralda.png",
                "Esmeralda",
                destino.children.length + 1
            );

            await esperar(450);
            await hablar(
                "Una esmeralda para el aldeano " + numeroAldeano + "."
            );
        }

        await hablar("Ahora cada aldeano tiene la misma cantidad.");
        await hablar("Contemos las esmeraldas de un aldeano.");
        await contarEnContenedor(
            limpiarElemento("resultadoDivision"),
            4,
            "img/esmeralda.png",
            "Esmeralda"
        );

        mostrarResultado(
            "resultadoDivision",
            "img/esmeralda.png",
            "Esmeralda",
            4,
            "4 para cada aldeano"
        );

        await hablar("Cada aldeano recibe cuatro esmeraldas.");
        await hablar("Ocho dividido en dos es igual a cuatro.");

        if(
            temasVistos[0] &&
            temasVistos[1] &&
            temasVistos[2] &&
            temasVistos[3]
        ){
            mostrarConfeti();
            await esperar(1200);
            await hablar(
                "Completaste el aprendizaje. Puedes comenzar el juego cuando estes listo."
            );
            await mostrarModalFinal(false);
        }
    });
}

function iniciarJuego(){
    sonidoBoton();
    window.location.href =
        "juego1.html";
}

function actualizarHUD(){
    document.getElementById("xpLevel").textContent =
        nivel;

    document.getElementById("xpFill").style.width =
        xp + "%";
}

function mostrarConfeti(){
    if(typeof confetti === "function"){
        confetti({
            particleCount: 200,
            spread: 180,
            origin: {
                y: 0.6
            }
        });
    }
}

async function mostrarModalFinal(narrar = true){
    if(animacionEnCurso && narrar){
        return;
    }

    document.getElementById("modalFinal").style.display =
        "flex";

    if(narrar){
        await hablar(
            "Completaste el aprendizaje. Puedes comenzar el juego cuando estes listo."
        );
    }
}

function cerrarModal(){
    sonidoBoton();
    document.getElementById("modalFinal").style.display =
        "none";
}

function sonidoBoton(){
    const audio =
        new Audio("sonidos/click.mp3");

    audio.play().catch(() => {});
}

window.onload = async () => {
    actualizarHUD();
    cargarTema();

    // Si la pantalla de carga esta activa, esperamos a que termine
    if (document.getElementById("pantalla-carga-overlay")) {
        window.addEventListener("pantallaCargaTerminada", async () => {
            await esperar(300); // Pequeña pausa para que se desvanezca el overlay
            iniciarIntroVoz();
        });
    } else {
        // Fallback si no hay pantalla de carga
        await esperar(500);
        iniciarIntroVoz();
    }
};

async function iniciarIntroVoz() {
    if(animacionEnCurso || navegacionEnCurso){
        return;
    }

    await hablar("Hola aventurero.");

    if(animacionEnCurso || navegacionEnCurso){
        return;
    }

    await hablar(
        "Hoy aprenderemos suma, resta, multiplicacion y division en Minecraft."
    );

    if(animacionEnCurso || navegacionEnCurso){
        return;
    }

    await anunciarTema();
}
