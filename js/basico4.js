let xp = Number(
    localStorage.getItem("xp")
) || 0;

let nivel = Number(
    localStorage.getItem("nivel")
) || 1;


// ===== VOZ =====

function hablar(texto) {

    speechSynthesis.cancel();

    let mensaje = new SpeechSynthesisUtterance(texto);

    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;

    speechSynthesis.speak(mensaje);
}

const temas = [

{
titulo:"➕ SUMA",

texto:
"La suma sirve para juntar cantidades. Ejemplo: 5 diamantes más 3 diamantes son 8 diamantes.",

html:`

<p class="explicacion-corta">
La suma sirve para juntar cantidades.
</p>

<div class="suma-demo">

    <div id="grupo1" class="grupo-items grupo-suma"></div>

    <div class="operador">+</div>

    <div id="grupo2" class="grupo-items grupo-suma"></div>

</div>

<div id="resultadoSuma"></div>

`
},

{
titulo:"➖ RESTA",

texto:
"La resta sirve para quitar cantidades. Ejemplo: 8 manzanas menos 3 manzanas son 5 manzanas.",

html:`

<p class="explicacion-corta">
La resta sirve para quitar cantidades.
</p>

<div class="suma-demo">

    <div id="grupoResta1"
        class="grupo-items grupo-suma">
    </div>

    <div class="operador">−</div>

    <div id="grupoResta2"
        class="grupo-items grupo-suma">
    </div>

</div>

<div id="resultadoResta"></div>

`
},

{
titulo:"✖ MULTIPLICACIÓN",

texto:
"La multiplicación sirve para repetir grupos iguales. Ejemplo: 4 grupos de 2 lingotes son 8 lingotes.",

html:`

<p class="explicacion-corta">
La multiplicación sirve para repetir grupos iguales.
</p>

<div class="suma-demo">

    <div id="grupoMulti1"
        class="grupo-items grupo-suma">
    </div>

    <div class="operador">×</div>

    <div id="grupoMulti2"
        class="grupo-items grupo-suma">
    </div>

</div>

<div id="resultadoMulti"></div>

`
},

{
titulo:"➗ DIVISIÓN",

texto:
"La división sirve para repartir cantidades en partes iguales. Ejemplo: 8 dividido en 2 es igual a 4.",

html:`

<p class="explicacion-corta">
La división sirve para repartir cantidades en partes iguales.
</p>

<div class="suma-demo">

    <div id="grupoDivision1"
        class="grupo-items grupo-suma">
    </div>

    <div class="operador">÷</div>

    <div id="grupoDivision2"
        class="grupo-items grupo-suma">
    </div>

</div>

<div id="resultadoDivision"></div>

`
}

];   

let temaActual = 0;

let temasVistos = [
    false,
    false,
    false,
    false
];


let explicacionVista = false;

function cargarTema(){
    hablar(
        "Tema actual. " +
        tema.titulo
    );

    explicacionVista = temasVistos[temaActual];

    let tema = temas[temaActual];

    document.getElementById("tituloTema").innerHTML =
        tema.titulo;

    document.getElementById("contenidoTema").innerHTML =
        tema.html;

    const btnSiguiente =
        document.getElementById("btnSiguiente");

    if(btnSiguiente){

        btnSiguiente.disabled =
            !temasVistos[temaActual];
    }

    const btnAnterior =
        document.getElementById("btnAnterior");

    if(btnAnterior){

        if(temaActual === 0){

            btnAnterior.style.visibility =
                "hidden";

        }else{

            btnAnterior.style.visibility =
                "visible";
        }
    }

    const btnExplicacion =
        document.getElementById("btnExplicacion");

    if(btnExplicacion){

        if(temaActual === 0){

            btnExplicacion.onclick =
                animarSuma;

        }else if(temaActual === 1){

            btnExplicacion.onclick =
                animarResta;

        }else if(temaActual === 2){

            btnExplicacion.onclick =
                animarMultiplicacion;

        }else if(temaActual === 3){

            btnExplicacion.onclick =
                animarDivision;
        }

        if(temasVistos[temaActual]){

            btnExplicacion.innerHTML =
                "🔁 Repetir";

        }else{

            btnExplicacion.innerHTML =
                "▶ Iniciar";
        }
    }

    if(temaActual === temas.length - 1){

        btnSiguiente.innerHTML =
            "🎮 Ir al Juego";

        btnSiguiente.onclick =
            mostrarModalFinal;

    }else{

        btnSiguiente.innerHTML =
            "Siguiente →";

        btnSiguiente.onclick =
            siguienteTema;

    }
}

function siguienteTema(){

    if(!temasVistos[temaActual]){
        return;
    }

    if(temaActual < temas.length - 1){

        temaActual++;

        cargarTema();
    }
}

function anteriorTema(){

    if(temaActual > 0){

        temaActual--;

        cargarTema();
    }
}

function animarSuma(){

    if(explicacionVista){

        let repetir = confirm(
            "¿Quieres volver a escuchar la explicación?"
        );

        if(!repetir){
            return;
        }
    }

    explicacionVista = true;

    if(!temasVistos[temaActual]){

        agregarXP(25);
    }

    temasVistos[temaActual] = true;

    document.getElementById(
        "btnSiguiente"
    ).disabled = false;

    let boton =
        document.getElementById("btnExplicacion");

    if(boton){

        boton.innerHTML =
            "🔁 Repetir";
    }

    let grupo1 =
        document.getElementById("grupo1");

    let grupo2 =
        document.getElementById("grupo2");

    let resultado =
        document.getElementById("resultadoSuma");

    if(!grupo1){
        return;
    }

    grupo1.innerHTML = "";
    grupo2.innerHTML = "";
    resultado.innerHTML = "";

    hablar(
        "La suma sirve para juntar cantidades. Tenemos cinco diamantes."
    );

    for(let i = 0; i < 5; i++){

        setTimeout(()=>{

            grupo1.innerHTML +=
            '<img src="img/diamante.png">';

        }, i * 350);

    }

    setTimeout(()=>{

        hablar(
            "Ahora agregamos tres diamantes más."
        );

        for(let i = 0; i < 3; i++){

            setTimeout(()=>{

                grupo2.innerHTML +=
                '<img src="img/diamante.png">';

            }, i * 350);

        }

    },2200);

    setTimeout(()=>{

        hablar(
            "Al juntarlos obtenemos ocho diamantes."
        );

        resultado.innerHTML =
        `
        <div class="resultado-final">

            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">
            <img src="img/diamante.png">

            <div class="texto-resultado">
                8 Diamantes
            </div>

        </div>
        `;

    },4200);
}

function animarResta(){

    if(explicacionVista){

        let repetir = confirm(
            "¿Quieres volver a escuchar la explicación?"
        );

        if(!repetir){
            return;
        }
    }

    explicacionVista = true;

    if(!temasVistos[temaActual]){

        agregarXP(25);
    }

    temasVistos[temaActual] = true;

    document.getElementById(
        "btnSiguiente"
    ).disabled = false;

    let boton =
        document.getElementById("btnExplicacion");

    if(boton){

        boton.innerHTML =
            "🔁 Repetir";
    }

    let grupo1 =
        document.getElementById("grupoResta1");

    let grupo2 =
        document.getElementById("grupoResta2");

    let resultado =
        document.getElementById("resultadoResta");

    if(!grupo1){
        return;
    }

    grupo1.innerHTML = "";
    grupo2.innerHTML = "";
    resultado.innerHTML = "";

    hablar(
        "Tenemos ocho manzanas."
    );

    for(let i = 0; i < 8; i++){

        setTimeout(()=>{

            grupo1.innerHTML +=
            '<img src="img/manzana.png">';

        }, i * 250);
    }

    setTimeout(()=>{

        hablar(
            "Ahora quitamos tres manzanas."
        );

        for(let i = 0; i < 3; i++){

            setTimeout(()=>{

                grupo2.innerHTML +=
                '<img src="img/manzana.png">';

            }, i * 250);

        }

    },2500);

    setTimeout(()=>{

        hablar(
            "Ahora nos quedan cinco manzanas."
        );

        resultado.innerHTML =
        `
        <div class="resultado-final">

            <img src="img/manzana.png">
            <img src="img/manzana.png">
            <img src="img/manzana.png">
            <img src="img/manzana.png">
            <img src="img/manzana.png">

            <div class="texto-resultado">
                5 Manzanas
            </div>

        </div>
        `;

    },4500);
}

function animarMultiplicacion(){

    if(explicacionVista){

        let repetir = confirm(
            "¿Quieres volver a escuchar la explicación?"
        );

        if(!repetir){
            return;
        }
    }

    explicacionVista = true;

    if(!temasVistos[temaActual]){

        agregarXP(25);
    }

    temasVistos[temaActual] = true;

    document.getElementById(
        "btnSiguiente"
    ).disabled = false;

    document.getElementById(
        "btnExplicacion"
    ).innerHTML =
        "🔁 Repetir";

    let grupo1 =
        document.getElementById("grupoMulti1");

    let grupo2 =
        document.getElementById("grupoMulti2");

    let resultado =
        document.getElementById("resultadoMulti");

    grupo1.innerHTML = "";
    grupo2.innerHTML = "";
    resultado.innerHTML = "";

    hablar(
        "Tenemos cuatro grupos."
    );

    for(let i = 0; i < 4; i++){

        setTimeout(()=>{

            grupo1.innerHTML +=
            '<img src="img/oro.png">';

        }, i * 350);

    }

    setTimeout(()=>{

        hablar(
            "Cada grupo tiene dos lingotes."
        );

        for(let i = 0; i < 2; i++){

            setTimeout(()=>{

                grupo2.innerHTML +=
                '<img src="img/oro.png">';

            }, i * 350);

        }

    },1800);

    setTimeout(()=>{

        hablar(
            "Cuatro por dos es igual a ocho."
        );

        resultado.innerHTML =
        `
        <div class="resultado-final">

            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">
            <img src="img/oro.png">

            <div class="texto-resultado">
                8 Lingotes
            </div>

        </div>
        `;

    },3800);
}

function animarDivision(){

    if(explicacionVista){

        let repetir = confirm(
            "¿Quieres volver a escuchar la explicación?"
        );

        if(!repetir){
            return;
        }
    }

    explicacionVista = true;

    if(!temasVistos[temaActual]){

        agregarXP(25);
    }

    temasVistos[temaActual] = true;

    document.getElementById(
        "btnSiguiente"
    ).disabled = false;

    document.getElementById(
        "btnExplicacion"
    ).innerHTML =
        "🔁 Repetir";

    let grupo1 =
        document.getElementById("grupoDivision1");

    let grupo2 =
        document.getElementById("grupoDivision2");

    let resultado =
        document.getElementById("resultadoDivision");

    grupo1.innerHTML = "";
    grupo2.innerHTML = "";
    resultado.innerHTML = "";

    hablar(
        "Tenemos ocho esmeraldas."
    );

    for(let i = 0; i < 8; i++){

        setTimeout(()=>{

            grupo1.innerHTML +=
            '<img src="img/esmeralda.png">';

        }, i * 250);

    }

    setTimeout(()=>{

        hablar(
            "Las repartimos entre dos aldeanos."
        );

        for(let i = 0; i < 2; i++){

            setTimeout(()=>{

                grupo2.innerHTML +=
                '<img src="img/aldeano.png">';

            }, i * 350);

        }

    },2500);

    setTimeout(()=>{

        hablar(
            "Cada aldeano recibe cuatro esmeraldas."
        );

        resultado.innerHTML =
        `
        <div class="resultado-final">

            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">

            <div class="texto-resultado">
                4 para cada aldeano
            </div>

        </div>
        `;

        if(
            temasVistos[0] &&
            temasVistos[1] &&
            temasVistos[2] &&
            temasVistos[3]
        ){

            mostrarConfeti();

            setTimeout(()=>{

                mostrarModalFinal();

            },1500);
        }

    },4500);
}

function iniciarJuego(){

    window.location.href =
        "juego1.html";
}

window.onload = () => {

    actualizarHUD();

    cargarTema();

    setTimeout(()=>{

        hablar(
            "Hola aventurero. Hoy aprenderemos suma, resta, multiplicación y división en Minecraft."
        );

    },500);

};

function agregarXP(cantidad){
    hablar(
        "Experiencia obtenida."
    );

    xp += cantidad;

    if(xp >= 100){

        xp = 0;

        nivel++;

    }

    localStorage.setItem(
        "xp",
        xp
    );

    localStorage.setItem(
        "nivel",
        nivel
    );

    actualizarHUD();
}

function actualizarHUD(){

    document.getElementById(
        "xpLevel"
    ).textContent = nivel;

    document.getElementById(
        "xpFill"
    ).style.width =
        xp + "%";
}

function mostrarConfeti(){

    confetti({

        particleCount: 200,

        spread: 180,

        origin:{
            y:0.6
        }
    });

    hablar(
        "¡Felicidades! Has subido al nivel " + nivel
    );
}

function mostrarModalFinal(){

    document.getElementById(
        "modalFinal"
    ).style.display = "flex";

    hablar(
        "Has completado todas las explicaciones. ¿Quieres comenzar el juego?"
    );
}

function cerrarModal(){

    document.getElementById(
        "modalFinal"
    ).style.display = "none";
}

function sonidoBoton(){

    let audio = new Audio(
        "sonidos/click.mp3"
    );

    audio.play();
}