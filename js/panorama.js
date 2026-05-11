// Script Background de Minecraft
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
let clock = new THREE.Clock();

let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

let camera_pivot = new THREE.Object3D();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("panorama").appendChild(renderer.domElement);

// Cargar cubemap (6 imágenes)
let loader = new THREE.CubeTextureLoader();
let texture = loader.load([
    "panorama/panorama_1.png",
    "panorama/panorama_3.png",
    "panorama/panorama_4.png",
    "panorama/panorama_5.png",
    "panorama/panorama_0.png",
    "panorama/panorama_2.png"
]);

scene.background = texture;

// Cámara dentro del cubo
scene.add(camera_pivot);
camera_pivot.add(camera);

camera.position.set(0, 0, 0.1);
camera.rotation.x = -0.15;

// Animación
function animate() {
    requestAnimationFrame(animate);

    let delta = clock.getDelta();
    camera_pivot.rotation.y -= 0.05 * delta;

    renderer.render(scene, camera);
}

animate();

// Ajustar tamaño
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});