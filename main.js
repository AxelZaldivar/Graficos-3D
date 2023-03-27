import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//inicialización
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//ondas
const geometry = new THREE.TorusKnotGeometry(10, 3, 20, 50, 13, 5);
const material = new THREE.MeshStandardMaterial({
  color: 0x405FDF,
  wireframe: true,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//fondo
const spaceTexture = (scene.background = new THREE.TextureLoader().load("../img/port.jpg"));
scene.background = spaceTexture;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

//estrellas
function addStars() {
  const geometry = new THREE.OctahedronGeometry(.2, 1, .1);
  const material = new THREE.MeshStandardMaterial({ color: 0xF3FF00,   wireframe: true});
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(2000).fill().forEach(addStars);

//cuadrado
const astrTextura = new THREE.TextureLoader().load("../img/astronauta.jpg");

const astronauta = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: astrTextura })
);
scene.add(astronauta);

//planeta
const texturaPlaneta = new THREE.TextureLoader().load("../img/planeta.png");

const planeta = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 16),
  new THREE.MeshBasicMaterial({
    map: texturaPlaneta,
  })
);
scene.add(planeta);
planeta.position.z = 30;
planeta.position.setX(-10);

//scroll
function moveCamera() {
  const top = document.body.getBoundingClientRect().top;
  planeta.position.z = top * 0.05;
  planeta.position.x = top * 0.072;
  planeta.rotation.y = top * 0.05;

  astronauta.position.z = top * 0.01;
  astronauta.position.x = top * 0.001;

  astronauta.rotation.z = top * 0.01;
  astronauta.rotation.x = top * 0.01;
  astronauta.rotation.Y = top * 0.01;

  camera.position.z = top * -0.01;
  camera.position.x = top * -0.0002;
  camera.rotation.y = top * -0.0002;
}

document.body.onscroll = moveCamera;

//funcion que carga todo
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();