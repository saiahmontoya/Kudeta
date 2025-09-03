(function () {
    // CONFIG
    const LOGO_PATH = "assets/kdtglobe.PNG";
    const ROTATION_SPEED = 0.01;             // tweak spin speed
    const SCALE = 2.2;                        // overall size multiplier
  
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
  
    // transparent canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // ensure fully transparent clear
    renderer.setClearAlpha(0);
    renderer.setClearColor(0x0a0a0a, 1);  // match your --bg hex
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
  
    // LIGHTS (subtle, to keep it “flat logo” but still 3D)
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.35);
    dir.position.set(1, 1, 1);
    scene.add(dir);
  
    // GEOMETRY: Thin cylinder like a coin
    const radius = 1.2 * SCALE;
    const height = 0.06 * SCALE;
    const radialSegments = 64;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
  
    // MATERIALS
    const loader = new THREE.TextureLoader();
    loader.load(
      LOGO_PATH,
      (tex) => {
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
  
        // two faces (top & bottom) show the logo
        const faceMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true, // support PNG transparency
          depthWrite: false,
        });
        // thin rim (keep dark so it reads 3D)
        const edgeMat = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.4, roughness: 0.6 });
  
        // CylinderGroups materials order: [side, top, bottom]
        const mat = [edgeMat, faceMat, faceMat];
  
        const coin = new THREE.Mesh(geometry, mat);
        // Rotate so logo faces camera
        coin.rotation.x = Math.PI / 2;
        scene.add(coin);
  
        // Animate
        let running = true;
        function animate() {
          if (!running) return;
          coin.rotation.z += ROTATION_SPEED; // spin
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }
        animate();
  
        // Pause when tab not visible or else ur shit will lag
        document.addEventListener("visibilitychange", () => {
          running = !document.hidden;
          if (running) animate();
        }
      );
      },
      undefined,
      (err) => {
        console.warn("Could not load texture:", LOGO_PATH, err);
      }
    );
  
    // RESIZE
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
      })();
  