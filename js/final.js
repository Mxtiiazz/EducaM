// Verificación de progresión
const progreso = Number(localStorage.getItem("progresoJuegos")) || 0;
if (progreso < 5) {
    alert("¡Aún no completas todos los desafíos!");
    window.location.href = "juego5.html";
}

const xp = Number(localStorage.getItem("xp")) || 0;
const nivel = Number(localStorage.getItem("nivel")) || 1;

// Audios
const sndClick = new Audio("sonidos/click.mp3");
const sndSuccess = new Audio("sonidos/success.mp3");

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
    // Render de estadísticas
    document.getElementById("finalNivel").textContent = nivel;
    document.getElementById("finalXP").textContent = xp + "%";

    // Si la pantalla de carga esta activa, esperamos a que termine
    if (document.getElementById("pantalla-carga-overlay")) {
        window.addEventListener("pantallaCargaTerminada", () => {
            // Sonido de celebración
            sndSuccess.play().catch(() => {});
            // Confeti recurrente
            lanzarConfetiContinuo();
            // Inicializar skin de celebración
            inicializarCelebracion();
            // Narrar victoria
            hablar("Felicitaciones! Completaste todos los juegos y te convertiste en un experto matematico de Minecraft. Has alcanzado el nivel " + nivel);
        });
    } else {
        // Sonido de celebración
        sndSuccess.play().catch(() => {});
        // Confeti recurrente
        lanzarConfetiContinuo();
        // Inicializar skin de celebración
        inicializarCelebracion();
        // Narrar victoria
        hablar("Felicitaciones! Completaste todos los juegos y te convertiste en un experto matematico de Minecraft. Has alcanzado el nivel " + nivel);
    }
};

let finalViewer = null;
let animationFrameIdCelebrar = null;

function inicializarCelebracion() {
    console.log("=== INICIALIZANDO VISOR 3D DE CELEBRACIÓN ===");
    const canvas = document.getElementById("skinCanvasFinal");
    if (!canvas) {
        console.error("No se encontró el canvas #skinCanvasFinal");
        return;
    }
    if (typeof skinview3d === "undefined") {
        console.error("La librería skinview3d no está cargada en final.html");
        return;
    }

    try {
        // Crear el visor 3D del personaje
        finalViewer = new skinview3d.SkinViewer({
            canvas: canvas,
            width: 200,
            height: 250,
            skin: "img/steve.png"
        });

        console.log("Instancia de SkinViewer creada con éxito:", finalViewer);

        // Cámara centrada en el personaje (mirando al centro del torso)
        finalViewer.camera.position.set(0, 8, 40);
        finalViewer.camera.lookAt(0, 8, 0);
        finalViewer.background = null; // Fondo transparente

        // Sin rotación inicial — el personaje empieza de frente y centrado
        finalViewer.playerObject.rotation.y = 0;
        finalViewer.playerObject.position.x = 0;

        // Bucle para la animación de aplauso suave y balanceo
        let angulo = 0;
        
        function animarCelebracion() {
            animationFrameIdCelebrar = requestAnimationFrame(animarCelebracion);
            
            // Velocidad del bucle — lenta y natural
            angulo += 0.025;

            if (finalViewer.playerObject) {
                // 1. Balanceo suave del cuerpo (giro leve de lado a lado)
                finalViewer.playerObject.rotation.y = Math.sin(angulo * 0.4) * 0.25;

                // 2. Respiración sutil (sube y baja apenas)
                finalViewer.playerObject.position.y = Math.sin(angulo * 0.6) * 0.15;

                // Mantener centrado en X siempre
                finalViewer.playerObject.position.x = 0;

                // Acceso seguro a las extremidades del skin
                const skin = finalViewer.playerObject.skin;
                if (skin) {
                    // 3. Brazos levantados al cielo en forma de V
                    // Z positivo en left = abre hacia afuera/arriba
                    // Z negativo en right = abre hacia afuera/arriba
                    const ondaBrazos = Math.sin(angulo * 0.8) * 0.12;
                    
                    if (skin.leftArm) {
                        skin.leftArm.rotation.x = -0.15; // Ligeramente al frente
                        skin.leftArm.rotation.y = 0;
                        skin.leftArm.rotation.z = 2.0 + ondaBrazos; // V más abierta, sin tocar el torso
                    }
                    if (skin.rightArm) {
                        skin.rightArm.rotation.x = -0.15;
                        skin.rightArm.rotation.y = 0;
                        skin.rightArm.rotation.z = -2.0 - ondaBrazos; // Espejo
                    }

                    // 4. Piernas firmes y centradas
                    if (skin.leftLeg) {
                        skin.leftLeg.rotation.x = 0;
                        skin.leftLeg.rotation.z = 0;
                    }
                    if (skin.rightLeg) {
                        skin.rightLeg.rotation.x = 0;
                        skin.rightLeg.rotation.z = 0;
                    }

                    // 5. Cabeza mirando ligeramente hacia arriba (celebrando)
                    if (skin.head) {
                        skin.head.rotation.x = -0.2 + Math.sin(angulo * 0.6) * 0.05;
                        skin.head.rotation.y = Math.sin(angulo * 0.4) * 0.1;
                    }
                }
            }

            // Forzar renderizado del canvas en cada frame
            finalViewer.render();
        }

        animarCelebracion();
        console.log("Bucle de animación animarCelebracion() iniciado.");

    } catch (error) {
        console.error("Error al inicializar o animar la celebración en 3D:", error);
    }
}

function lanzarConfetiContinuo() {
    const duracion = 5 * 1000;
    const fin = Date.now() + duracion;

    const interval = setInterval(() => {
        if (Date.now() > fin) {
            return clearInterval(interval);
        }

        confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: {
                x: Math.random(),
                // Al azar de la izquierda o derecha
                y: Math.random() - 0.2
            }
        });
    }, 200);
}

function reiniciarProgreso() {
    sndClick.play().catch(() => {});
    // Reiniciar progreso de juegos pero mantener XP / Nivel del jugador
    localStorage.setItem("progresoJuegos", "0");
    hablar("Reiniciando progreso. ¡A jugar de nuevo!");
    setTimeout(() => {
        window.location.href = "basico4.html";
    }, 1000);
}

function irATodos() {
    sndClick.play().catch(() => {});
    // Redirige a todos.html o la raíz
    window.location.href = "todos.html";
}
