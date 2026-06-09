// ====== PANTALLA DE CARGA ESTILO XBOX ONE CON PANORAMA INDEPENDIENTE ======

(function () {
    // 1. Catálogo de consejos (Minecraft + Matemáticas de 4° Básico) - Sin acentos ni eñes
    const CONSEJOS = [
        "La obsidiana solo se puede picar con un pico de diamante o de netherita.",
        "Sabias que una division te dice cuantas veces un numero contiene a otro?",
        "Si multiplicas cualquier numero por cero, el resultado siempre sera cero.",
        "Los aldeanos cartografos te pueden vender mapas para encontrar templos marinos.",
        "Sabias que un periodo bisiesto tiene 366 dias en lugar de 365?",
        "No mires directamente a los ojos de un Enderman a menos que quieras pelear.",
        "Para calcular el perimetro de un cuadrado, solo debes sumar la medida de sus cuatro lados.",
        "Puedes usar un balde de agua para amortiguar una caida alta. ¡Es el famoso MLG!",
        "La multiplicacion es una forma rapida de sumar el mismo numero varias veces.",
        "Los creepers le temen a los gatos. ¡Ten siempre un felino cerca de tu base!",
        "Las fracciones nos ayudan a representar partes iguales de un objeto entero.",
        "El oro se pica mas rapido, pero su durabilidad es menor que la del hierro."
    ];

    // Estados de carga
    const ESTADOS = [
        { pct: 0, txt: "Inicializando servidor...", sub: "Cargando librerias..." },
        { pct: 20, txt: "Generando terreno...", sub: "Ubicando cofres y lingotes..." },
        { pct: 45, txt: "Invocando aldeanos...", sub: "Repartiendo esmeraldas equitativamente..." },
        { pct: 70, txt: "Preparando mazmorra...", sub: "Cerrando cofres con llaves numericas..." },
        { pct: 90, txt: "Ubicando diamantes...", sub: "Afilando picos de hierro..." },
        { pct: 100, txt: "Mundo listo!", sub: "Generacion completada con exito." }
    ];

    let scene, camera, renderer, cameraPivot, animationFrameId, clock;
    let progreso = 0;
    let cargandoThree = false;

    // Iniciar creación del DOM al cargar el documento
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", crearPantallaCarga);
    } else {
        crearPantallaCarga();
    }

    // 2. Crear inyección del HTML en el Body
    function crearPantallaCarga() {
        // Evitar duplicados
        if (document.getElementById("pantalla-carga-overlay")) return;

        // Crear contenedor overlay
        const overlay = document.createElement("div");
        overlay.id = "pantalla-carga-overlay";

        // Seleccionar un consejo aleatorio
        const consejoAleatorio = CONSEJOS[Math.floor(Math.random() * CONSEJOS.length)];

        // Estructura HTML idéntica a la referencia de Xbox One
        overlay.innerHTML = `
            <div id="panorama-carga"></div>
            
            <!-- Logo superior -->
            <div class="loading-logo-container">
                <img src="img/minecraft_title.png" class="loading-logo" alt="Minecraft">
            </div>

            <!-- Contenedor central de barra y estado -->
            <div class="loading-middle-container">
                <div class="loading-status-text" id="load-status">Inicializando servidor...</div>
                <div class="loading-bar-container">
                    <div class="loading-bar-fill" id="load-bar-fill"></div>
                </div>
                <div class="loading-substatus-text" id="load-substatus">Cargando librerias...</div>
                <div class="click-to-continue" id="load-continue">CONTINUAR</div>
            </div>

            <!-- Panel de consejos inferior -->
            <div class="loading-tips-panel">
                <div class="loading-tips-title">CONSEJO UTIL</div>
                <div class="loading-tips-content">${consejoAleatorio}</div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Iniciar carga de dependencias 3D
        verificarYIniciar3D();

        // Iniciar simulación de barra de progreso
        iniciarSimulacionProgreso();
    }

    // 3. Cargar Three.js si no existe
    function verificarYIniciar3D() {
        if (window.THREE) {
            inicializarPanorama3D();
        } else if (!cargandoThree) {
            cargandoThree = true;
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            script.onload = () => {
                inicializarPanorama3D();
            };
            document.head.appendChild(script);
        }
    }

    // 4. Inicializar motor 3D y cargar texturas del panorama independiente
    function inicializarPanorama3D() {
        const container = document.getElementById("panorama-carga");
        if (!container || !window.THREE) return;

        scene = new THREE.Scene();
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        cameraPivot = new THREE.Object3D();
        scene.add(cameraPivot);
        cameraPivot.add(camera);

        // Posicionamiento de cámara idéntico a panorama.js
        camera.position.set(0, 0, 0.1);
        camera.rotation.x = -0.15;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Cargar cubemap de panorama_carga/
        const loader = new THREE.CubeTextureLoader();
        
        // Mismo orden que el script original
        const texture = loader.load([
            "panorama_carga/panorama_1.png", // +X
            "panorama_carga/panorama_3.png", // -X
            "panorama_carga/panorama_4.png", // +Y
            "panorama_carga/panorama_5.png", // -Y
            "panorama_carga/panorama_0.png", // +Z
            "panorama_carga/panorama_2.png"  // -Z
        ], () => {
            // Textura cargada correctamente
            renderer.render(scene, camera);
        }, undefined, (err) => {
            console.warn("No se pudieron cargar algunas imágenes en panorama_carga/, usando panorama/ original como fallback.");
            // Fallback al panorama original si no hay imágenes en panorama_carga/
            const fallbackTexture = loader.load([
                "panorama/panorama_1.png",
                "panorama/panorama_3.png",
                "panorama/panorama_4.png",
                "panorama/panorama_5.png",
                "panorama/panorama_0.png",
                "panorama/panorama_2.png"
            ]);
            scene.background = fallbackTexture;
        });

        scene.background = texture;

        // Loop de animación
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            // Rotación suave del panorama
            cameraPivot.rotation.y -= 0.04 * delta;
            renderer.render(scene, camera);
        }

        animate();

        // Controlar resize del navegador
        window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 5. Simular barra de progreso
    function iniciarSimulacionProgreso() {
        const barFill = document.getElementById("load-bar-fill");
        const statusText = document.getElementById("load-status");
        const substatusText = document.getElementById("load-substatus");
        const continueBtn = document.getElementById("load-continue");

        const intervalo = setInterval(() => {
            if (progreso >= 100) {
                clearInterval(intervalo);
                progreso = 100;
                
                // Mostrar botón continuar y ocultar subtexto y barra
                if (barFill) barFill.style.width = "100%";
                setTimeout(() => {
                    if (substatusText) substatusText.style.display = "none";
                    if (statusText) statusText.innerText = "¡Mundo cargado!";
                    if (continueBtn) {
                        continueBtn.style.display = "block";
                        // Permitir hacer clic en cualquier lugar para entrar
                        const overlay = document.getElementById("pantalla-carga-overlay");
                        if (overlay) {
                            overlay.style.cursor = "pointer";
                            overlay.addEventListener("click", finalizarCarga);
                        }
                    }
                }, 200);
                return;
            }

            // Aumento aleatorio progresivo
            progreso += Math.floor(Math.random() * 8) + 4;
            if (progreso > 100) progreso = 100;

            if (barFill) {
                barFill.style.width = `${progreso}%`;
            }

            // Actualizar textos según el rango actual
            const estadoActual = ESTADOS.reduce((prev, curr) => {
                return (progreso >= curr.pct) ? curr : prev;
            });

            if (statusText) statusText.innerText = estadoActual.txt;
            if (substatusText) substatusText.innerText = estadoActual.sub;

        }, 120);
    }

    // 6. Destruir componentes y cerrar pantalla con transición suave
    function finalizarCarga(event) {
        // Prevenir doble ejecución
        const overlay = document.getElementById("pantalla-carga-overlay");
        if (!overlay || overlay.style.opacity === "0") return;

        // Desbloquear la música si el script de música está presente
        if (typeof window.desbloquearMusica === "function") {
            window.desbloquearMusica();
        }

        // Avisar a otros scripts que la pantalla de carga terminó
        window.dispatchEvent(new CustomEvent("pantallaCargaTerminada"));

        // Animación fade-out
        overlay.style.opacity = "0";

        // Remover del DOM y limpiar memoria después de la transición
        setTimeout(() => {
            // Cancelar animación
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Remover resize listener
            window.removeEventListener("resize", onWindowResize);

            // Liberar recursos Three.js
            if (renderer) {
                renderer.dispose();
                const canvas = container = document.getElementById("panorama-carga");
                if (canvas) canvas.innerHTML = "";
            }

            // Remover el elemento del DOM
            overlay.remove();
        }, 800);
    }
})();
