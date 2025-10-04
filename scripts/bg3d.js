(function () {
  // CONFIG
  const LOGO_PATH = "assets/kdtglobe.png"; // logo texture
  const ROTATION_SPEED = 0.01;  // spin speed
  const SCALE = 2.2;            // overall size multiplier

  // SETUP
  const container = document.getElementById("bg3d");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0);
  renderer.setClearColor(0x0a0a0a, 1); // matches site bg
  container.appendChild(renderer.domElement);

  // LIGHTS (subtle, to keep flat logo but readable in 3D)
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.25);
  dir.position.set(1, 1, 1);
  scene.add(dir);

  // GEOMETRY: flat circle
  const radius = 1.5 * SCALE;
  const geometry = new THREE.CircleGeometry(radius, 128);

  // TEXTURE + MATERIAL
  const loader = new THREE.TextureLoader();
  loader.load(
    LOGO_PATH,
    (tex) => {
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide, // logo visible front & back
      });

      const globe = new THREE.Mesh(geometry, mat);
      scene.add(globe);

      // ANIMATION LOOP
      let running = true;
      function animate() {
        if (!running) return;
        globe.rotation.y += ROTATION_SPEED; // spin cleanly
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      // Pause when tab not visible
      document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
        if (running) animate();
      });
    },
    undefined,
    (err) => {
      console.warn("Could not load texture:", LOGO_PATH, err);
    }
  );

  // RESIZE HANDLER
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);
})();
