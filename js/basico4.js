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

<button
class="boton-mc"
onclick="animarSuma()">

▶ Ver ejemplo

</button>

<div id="resultadoSuma"></div>

`
},

{
titulo:"➖ RESTA",

texto:
"La resta sirve para quitar cantidades. Ejemplo: 8 manzanas menos 3 manzanas son 5 manzanas.",

html:`

<div class="operacion-demo">

    <div class="grupo-items">

        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">

    </div>

    <span class="simbolo">−</span>

    <div class="grupo-items">

        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">

    </div>

    <span class="simbolo">=</span>

    <div class="grupo-items">

        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">
        <img src="img/manzana.png">

    </div>

</div>

<p>
8 manzanas - 3 manzanas = 5 manzanas
</p>

`
},

{
titulo:"✖ MULTIPLICACIÓN",

texto:
"La multiplicación sirve para repetir grupos iguales. Ejemplo: 4 por 2 es igual a 8.",

html:`

<h2>4 grupos de 2 lingotes</h2>

<div class="grupos-multi">

    <div class="grupo">
        <img src="img/oro.png">
        <img src="img/oro.png">
    </div>

    <div class="grupo">
        <img src="img/oro.png">
        <img src="img/oro.png">
    </div>

    <div class="grupo">
        <img src="img/oro.png">
        <img src="img/oro.png">
    </div>

    <div class="grupo">
        <img src="img/oro.png">
        <img src="img/oro.png">
    </div>

</div>

<h2>4 × 2 = 8</h2>

`
},

{
titulo:"➗ DIVISIÓN",

texto:
"La división sirve para repartir cantidades en partes iguales. Ejemplo: 8 dividido en 2 es igual a 4.",

html:`

<h2>Repartimos 8 esmeraldas entre 2 aldeanos</h2>

<div class="division-demo">

    <div class="aldeano">

        👨

        <div>
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
        </div>

    </div>

    <div class="aldeano">

        👨

        <div>
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
            <img src="img/esmeralda.png">
        </div>

    </div>

</div>

<h2>8 ÷ 2 = 4</h2>

`
}

];

let temaActual = 0;

function cargarTema(){

    let tema = temas[temaActual];

    document.getElementById("tituloTema").innerHTML =
        tema.titulo;

    document.getElementById("contenidoTema").innerHTML =
        tema.html;

    let inicio =
        document.getElementById("contenedorInicio");

    if(temaActual === 3){

        inicio.innerHTML = `
            <button
                class="boton-mc"
                onclick="iniciarJuego()">

                🎮 Comenzar Juego 1

            </button>
        `;

    }else{

        inicio.innerHTML = "";
    }
}

function siguienteTema(){

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

function escucharTema(){

    hablar(
        temas[temaActual].texto
    );
}

function animarSuma(){

    let grupo1 =
        document.getElementById("grupo1");

    let grupo2 =
        document.getElementById("grupo2");

    let resultado =
        document.getElementById("resultadoSuma");

    if(!grupo1) return;

    grupo1.innerHTML = "";
    grupo2.innerHTML = "";
    resultado.innerHTML = "";

    hablar(
        "La suma sirve para juntar cantidades. Tenemos cinco diamantes."
    );

    for(let i=0;i<5;i++){

        setTimeout(()=>{

            grupo1.innerHTML +=
            '<img src="img/diamante.png">';

        }, i*350);
    }

    setTimeout(()=>{

        hablar(
        "Ahora agregamos tres diamantes más."
        );

        for(let i=0;i<3;i++){

            setTimeout(()=>{

                grupo2.innerHTML +=
                '<img src="img/diamante.png">';

            }, i*350);

        }

    },2200);

    setTimeout(()=>{

        hablar(
        "Al juntarlos obtenemos ocho diamantes."
        );

        resultado.innerHTML =
        `
        <h2>
        5 💎 + 3 💎 = 8 💎
        </h2>
        `;

    },4200);
}

function iniciarJuego(){

    window.location.href =
        "juego1.html";
}

window.onload = () => {

    cargarTema();

    setTimeout(() => {

        escucharTema();

    }, 800);
};