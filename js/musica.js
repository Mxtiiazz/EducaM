// ====== GESTOR DE MÚSICA DE FONDO PERSISTENTE ======

const PLAYLIST = [
    "sonidos/C418 - Moog City 2 (Minecraft Volume Beta).mp3",
    "sonidos/C418 - Sweden - Minecraft Volume Alpha.mp3",
    "sonidos/C418 - Wet Hands - Minecraft Volume Alpha.mp3",
    "sonidos/C418 - Subwoofer Lullaby - Minecraft Volume Alpha.mp3",
    "sonidos/C418 - Haggstrom - Minecraft Volume Alpha.mp3",
    "sonidos/C418 - Floating Trees (Minecraft Volume Beta).mp3",
    "sonidos/C418 - Mutation (Minecraft Volume Beta).mp3",
    "sonidos/C418 - Strad (Minecraft Volume Beta).mp3"
];

let bgAudio = null;
let indicePistaActual = 0;
let musicaDesbloqueada = false;

function iniciarMusicaPersistente() {
    // Recuperar estado guardado
    let pistaGuardada = localStorage.getItem("musica_pista");
    let tiempoGuardado = parseFloat(localStorage.getItem("musica_tiempo")) || 0;

    if (pistaGuardada) {
        indicePistaActual = PLAYLIST.indexOf(pistaGuardada);
        if (indicePistaActual === -1) indicePistaActual = 0;
    }

    crearReproductor(tiempoGuardado);
}

function crearReproductor(tiempoInicio) {
    const rutaPista = PLAYLIST[indicePistaActual];

    bgAudio = new Audio(rutaPista);
    bgAudio.loop = false;
    bgAudio.volume = 0.15;
    bgAudio.preload = "auto";

    // Esperar a que los metadatos carguen antes de buscar el tiempo guardado
    bgAudio.addEventListener("loadedmetadata", () => {
        if (tiempoInicio > 0 && tiempoInicio < bgAudio.duration) {
            bgAudio.currentTime = tiempoInicio;
        }
        // Intentar reproducir una vez que el audio esté listo
        intentarReproducir();
    });

    // Guardar progreso continuamente
    bgAudio.addEventListener("timeupdate", () => {
        localStorage.setItem("musica_pista", PLAYLIST[indicePistaActual]);
        localStorage.setItem("musica_tiempo", bgAudio.currentTime);
    });

    // Cambiar a la siguiente canción al terminar
    bgAudio.addEventListener("ended", () => {
        siguienteCancion();
    });

    // Forzar la carga del archivo de audio
    bgAudio.load();

    // Intentar reproducir de inmediato (puede fallar por autoplay)
    intentarReproducir();

    // Registrar desbloqueo en cualquier interacción del usuario
    document.addEventListener("click", desbloquearMusica);
    document.addEventListener("keydown", desbloquearMusica);
    document.addEventListener("touchstart", desbloquearMusica);
}

function desbloquearMusica() {
    if (musicaDesbloqueada) return;
    musicaDesbloqueada = true;

    intentarReproducir();

    // Limpiar los listeners una vez desbloqueada
    document.removeEventListener("click", desbloquearMusica);
    document.removeEventListener("keydown", desbloquearMusica);
    document.removeEventListener("touchstart", desbloquearMusica);
}

function intentarReproducir() {
    if (!bgAudio) return;
    if (!bgAudio.paused) return; // Ya está sonando

    let promesa = bgAudio.play();
    if (promesa !== undefined) {
        promesa.catch(() => {
            // Autoplay bloqueado, se reproducirá cuando el usuario interactúe
        });
    }
}

function siguienteCancion() {
    if (!bgAudio) return;
    bgAudio.pause();

    indicePistaActual = (indicePistaActual + 1) % PLAYLIST.length;

    bgAudio.src = PLAYLIST[indicePistaActual];
    bgAudio.currentTime = 0;
    localStorage.setItem("musica_pista", PLAYLIST[indicePistaActual]);
    localStorage.setItem("musica_tiempo", 0);

    bgAudio.load();
    intentarReproducir();
}

// Guardar estado antes de salir de la página
window.addEventListener("beforeunload", () => {
    if (bgAudio && !bgAudio.paused) {
        localStorage.setItem("musica_pista", PLAYLIST[indicePistaActual]);
        localStorage.setItem("musica_tiempo", bgAudio.currentTime);
    }
});

// Iniciar al cargar el script
iniciarMusicaPersistente();
