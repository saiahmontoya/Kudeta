// scripts/bg3d.js
(function () {
  // CONFIG
  const LOGO_PATH = "/assets/kdtglobe.PNG"; // exact case; leading slash is critical on Pages
  const ROTATION_SPEED = -0.0028;            // tweak spin speed
  const SCALE = 2.8;                         // overall size

  function init() {
    const container = document.getElementById("bg3d");
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // Lights (subtle)
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.35);
    dir.position.set(1, 1, 1);
    scene.add(dir);

    // Geometry + Material (transparent PNG)
    const radius = 1.25 * SCALE;
    const geometry = new THREE.CircleGeometry(radius, 128);

    const loader = new THREE.TextureLoader();
    loader.load(
      LOGO_PATH,
      (tex) => {
        if (tex.colorSpace !== undefined) {
          // for r160+
          tex.colorSpace = THREE.SRGBColorSpace;
        }
        const material = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animate
        function animate() {
          requestAnimationFrame(animate);
          mesh.rotation.z += ROTATION_SPEED;
          renderer.render(scene, camera);
        }
        animate();
      },
      undefined,
      (err) => {
        console.error("Failed to load texture:", LOGO_PATH, err);
      }
    );

    // Resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
