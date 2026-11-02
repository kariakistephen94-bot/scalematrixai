const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const HEAD_Y = 0.4;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * A small real-time 3D character ("Dana") built from primitives and lit with
 * three.js. It renders to its own WebGL canvas; the film draws that canvas
 * into its 2D scene every frame. three.js is loaded on demand.
 *
 * state: { t, yaw, pitch, talk 0..1, smile 0..1 }
 */
export async function createAvatar({ size = 320 } = {}) {
  const THREE = await import("three");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, -0.35, 9.4);
  camera.lookAt(0, -0.35, 0);

  const mat = (color, roughness = 0.6, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const skin = mat(0xe0a47f, 0.62);
  const skinDeep = mat(0xcf8f69, 0.65);
  const hair = mat(0x2b1a16, 0.38, 0.12);
  const blazer = mat(0x5b51d9, 0.7);
  const blazerLight = mat(0x7a70f0, 0.7);
  const shirt = mat(0xf6f3ff, 0.85);
  const eyeMat = mat(0x1a1216, 0.15);
  const mouthMat = mat(0x4b1721, 0.5);
  const shine = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const blush = new THREE.MeshBasicMaterial({
    color: 0xff8f9a,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const lipMat = mat(0xb5524f, 0.45);

  const sphere = (m, sx, sy, sz, x = 0, y = 0, z = 0, seg = 40) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, seg, seg * 0.7), m);
    mesh.scale.set(sx, sy, sz);
    mesh.position.set(x, y, z);
    return mesh;
  };

  // ---- body -----------------------------------------------------------
  const body = new THREE.Group();
  scene.add(body);
  body.add(sphere(blazer, 1.58, 0.98, 0.86, 0, -1.78, -0.05, 56));
  body.add(sphere(shirt, 0.44, 0.5, 0.3, 0, -1.2, 0.62));
  for (const s of [-1, 1]) {
    const lapel = sphere(blazerLight, 0.2, 0.52, 0.1, s * 0.34, -1.25, 0.72);
    lapel.rotation.z = -s * 0.42;
    body.add(lapel);
  }
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.36, 0.8, 32),
    skinDeep,
  );
  neck.position.set(0, -0.62, -0.02);
  body.add(neck);

  // ---- head -----------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, HEAD_Y, 0);
  scene.add(head);
  head.add(sphere(skin, 0.93, 1.05, 0.97, 0, 0, 0, 64));
  head.add(sphere(hair, 1.0, 1.26, 0.92, 0, -0.18, -0.3, 56)); // bob behind
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 40, 0, TAU, 0, Math.PI * 0.5),
    hair,
  );
  cap.scale.set(0.93 * 1.05, 1.05 * 1.06, 0.97 * 1.06);
  cap.rotation.x = -0.56;
  cap.position.y = 0.02;
  head.add(cap);
  for (const s of [-1, 1]) {
    const fringe = sphere(hair, 0.55, 0.27, 0.36, s * 0.34, 0.6, 0.7, 32);
    fringe.rotation.z = s * -0.5;
    fringe.rotation.y = s * 0.25;
    head.add(fringe);
    head.add(sphere(skinDeep, 0.12, 0.2, 0.1, s * 0.92, -0.02, 0, 24)); // ears
  }

  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.34, 0.08, 0.895);
    eye.add(sphere(eyeMat, 0.115, 0.16, 0.07, 0, 0, 0, 24));
    eye.add(sphere(shine, 0.034, 0.034, 0.03, 0.035, 0.06, 0.06, 12));
    head.add(eye);
    eyes.push(eye);
    const brow = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.026, 0.2, 4, 10),
      hair,
    );
    brow.rotation.z = Math.PI / 2 + s * 0.12;
    brow.position.set(s * 0.34, 0.37, 0.845);
    head.add(brow);
    const cheek = sphere(blush, 0.16, 0.1, 0.03, s * 0.56, -0.2, 0.76, 20);
    cheek.rotation.y = s * 0.7;
    head.add(cheek);
  }
  head.add(sphere(skinDeep, 0.085, 0.1, 0.09, 0, -0.14, 0.945, 24)); // nose

  const arc = Math.PI * 0.72;
  const smileGeo = new THREE.TorusGeometry(0.2, 0.028, 10, 36, arc);
  const smile = new THREE.Mesh(smileGeo, lipMat);
  smile.rotation.z = -Math.PI / 2 - arc / 2;
  smile.position.set(0, -0.36, 0.865);
  head.add(smile);
  const mouth = sphere(mouthMat, 0.13, 0.02, 0.05, 0, -0.45, 0.855, 20);
  head.add(mouth);

  // ---- light ----------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6a60ea, 0.9));
  const key = new THREE.DirectionalLight(0xfff0e4, 2.5);
  key.position.set(3, 4, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fa8ff, 0.9);
  fill.position.set(-4, 1, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xc4b5ff, 1.8);
  rim.position.set(-2, 3, -5);
  scene.add(rim);

  let blinkAt = 1.2;
  let yaw = 0;
  let pitch = 0;
  let open = 0;
  let smileAmt = 0.25;

  function update({
    t,
    yaw: ty = 0,
    pitch: tp = 0,
    talk = 0,
    smile: ts = 0.3,
  }) {
    yaw = lerp(yaw, ty, 0.08);
    pitch = lerp(pitch, tp, 0.08);
    head.rotation.y = yaw + Math.sin(t * 0.7) * 0.05;
    head.rotation.x = pitch + Math.sin(t * 1.1) * 0.025;
    head.rotation.z = Math.sin(t * 0.5) * 0.03;
    const breathe = Math.sin(t * 1.7) * 0.02;
    head.position.y = HEAD_Y + breathe;
    body.position.y = breathe * 0.5;
    body.rotation.y = head.rotation.y * 0.3;

    if (t > blinkAt) blinkAt = t + 2.6 + Math.random() * 2.4;
    const since = t - (blinkAt - 0.0);
    const bp = clamp(1 - Math.abs(((t % 3.1) - 0.1) / 0.09));
    const lid = 1 - 0.92 * (t % 3.1 < 0.2 ? bp : 0);
    eyes.forEach((e) => (e.scale.y = lid));
    void since;

    smileAmt = lerp(smileAmt, ts, 0.1);
    const talkOpen =
      talk *
      clamp(0.35 + 0.65 * Math.abs(Math.sin(t * 11) * Math.sin(t * 4.3 + 1)));
    open = lerp(open, talkOpen, 0.35);
    mouth.scale.y = 0.02 + open * 0.13;
    mouth.scale.x = 0.13 + smileAmt * 0.04;
    smile.scale.y = 0.35 + smileAmt * 0.95;
    smile.position.y = -0.36 + (1 - smileAmt) * 0.02 - open * 0.02;
  }

  return {
    canvas: renderer.domElement,
    update,
    render: () => renderer.render(scene, camera),
    dispose() {
      scene.traverse((o) => {
        o.geometry?.dispose();
      });
      [
        skin,
        skinDeep,
        hair,
        blazer,
        blazerLight,
        shirt,
        eyeMat,
        mouthMat,
        shine,
        blush,
        lipMat,
      ].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
