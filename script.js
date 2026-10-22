// ===================================================================
// PRESENTATION SCRIPT: BLoC with StreamBuilder (3D ULTRA EDITION)
// Includes Three.js Interactive 3D Reactor, 3D Perspective Card Tilt,
// Web Audio Synthesizer, Ambient Canvas, and Step Walkthrough.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const progressBar = document.getElementById('progressBar');
  const themeToggle = document.getElementById('themeToggle');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const overviewToggle = document.getElementById('overviewToggle');
  const overviewDrawer = document.getElementById('overviewDrawer');
  const closeDrawer = document.getElementById('closeDrawer');
  const drawerGrid = document.getElementById('drawerGrid');
  const notesToggleBtn = document.getElementById('notesToggleBtn');
  const notesModal = document.getElementById('notesModal');
  const closeNotes = document.getElementById('closeNotes');
  const notesBody = document.getElementById('notesBody');
  const notesSlideNum = document.getElementById('notesSlideNum');
  const autoPlayBtn = document.getElementById('autoPlayBtn');
  const restartBtn = document.getElementById('restartBtn');
  const soundToggle = document.getElementById('soundToggle');
  const laserToggle = document.getElementById('laserToggle');
  const printBtn = document.getElementById('printBtn');
  const laserPointer = document.getElementById('laserPointer');

  let currentSlide = 1;
  const totalSlides = slides.length;
  let autoPlayInterval = null;
  let soundEnabled = true;
  let laserEnabled = false;

  totalSlidesNum.textContent = totalSlides;

  // ===================================================================
  // 1. NATIVE WEB AUDIO SYNTHESIZER
  // ===================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal = 0.08) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playSlideSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  function playPacketSound() {
    playTone(720, 'triangle', 0.08, 0.06);
  }

  function playRebuildSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.04, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.35);
      });
    } catch (e) {}
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggle.classList.toggle('active-tool', soundEnabled);
      if (soundEnabled) playTone(440, 'sine', 0.1);
    });
  }

  // ===================================================================
  // 2. LASER POINTER FOR PROJECTORS (Key: L)
  // ===================================================================
  function toggleLaser() {
    laserEnabled = !laserEnabled;
    laserToggle.classList.toggle('active-tool', laserEnabled);
    laserPointer.style.display = laserEnabled ? 'block' : 'none';
    document.body.style.cursor = laserEnabled ? 'none' : 'default';
    if (laserEnabled) playTone(880, 'sine', 0.1);
  }
  if (laserToggle) laserToggle.addEventListener('click', toggleLaser);

  window.addEventListener('mousemove', (e) => {
    if (!laserEnabled) return;
    laserPointer.style.left = `${e.clientX}px`;
    laserPointer.style.top = `${e.clientY}px`;
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // ===================================================================
  // 3. AMBIENT BACKGROUND PARTICLES
  // ===================================================================
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = 45;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)'
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ===================================================================
  // 4. INTERACTIVE 3D PERSPECTIVE CARD TILT
  // ===================================================================
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ===================================================================
  // 5. THREE.JS INTERACTIVE 3D REACTOR SCENE (Slide 8)
  // ===================================================================
  let pulseCube = null;
  let ringMesh = null;
  let streamParticles = null;

  function initThreeScene() {
    const threeCanvas = document.getElementById('threeCanvas');
    const container = document.getElementById('threeContainer');
    if (!threeCanvas || !container || typeof THREE === 'undefined') return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Dead center camera with ample margin
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 50);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 2, 50);
    pointLightPurple.position.set(-2, -2, 2);
    scene.add(pointLightPurple);

    // 1. Central 3D BLoC Glass Cube (Comfortably scaled to prevent clipping)
    const cubeGeo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    pulseCube = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(pulseCube);

    // Wireframe edges on cube
    const wireGeo = new THREE.EdgesGeometry(cubeGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x67e8f9, linewidth: 2 });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    pulseCube.add(wireLines);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.OctahedronGeometry(0.5, 1);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    pulseCube.add(innerCore);

    // 3. Orbiting Reactive Rings (Scaled down to fit inside frame with generous margin)
    const ringGeo = new THREE.TorusGeometry(1.3, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    const ringGeo2 = new THREE.TorusGeometry(1.55, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    scene.add(ringMesh2);

    // 4. Stream Particle Helix
    const partCount = 70;
    const partGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const angle = (i / partCount) * Math.PI * 4;
      const radius = 1.35 + Math.sin(i) * 0.2;
      posArr[i * 3] = Math.cos(angle) * radius;
      posArr[i * 3 + 1] = (i / partCount - 0.5) * 1.8;
      posArr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const partMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.07, transparent: true, opacity: 0.8 });
    streamParticles = new THREE.Points(partGeo, partMat);
    scene.add(streamParticles);

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    threeCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      pulseCube.rotation.y += deltaX * 0.01;
      pulseCube.rotation.x += deltaY * 0.01;
      ringMesh.rotation.y += deltaX * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile/tablet
    threeCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });
    window.addEventListener('touchend', () => { isDragging = false; });
    threeCanvas.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;
      pulseCube.rotation.y += deltaX * 0.01;
      pulseCube.rotation.x += deltaY * 0.01;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Render loop
    function render3D() {
      requestAnimationFrame(render3D);
      if (!isDragging) {
        pulseCube.rotation.y += 0.008;
        pulseCube.rotation.x += 0.004;
      }
      ringMesh.rotation.z += 0.012;
      ringMesh2.rotation.x += 0.01;
      streamParticles.rotation.y -= 0.015;
      innerCore.rotation.y -= 0.02;
      renderer.render(scene, camera);
    }
    render3D();

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // Trigger visual 3D pulse when events fire
  function pulse3DReactor() {
    if (!pulseCube) return;
    pulseCube.scale.set(1.25, 1.25, 1.25);
    pulseCube.material.color.setHex(0x10b981);
    setTimeout(() => {
      pulseCube.scale.set(1, 1, 1);
      pulseCube.material.color.setHex(0x38bdf8);
    }, 350);
  }

  // Initialize Three.js after short delay
  setTimeout(initThreeScene, 300);

  // ===================================================================
  // 6. SPEAKER NOTES DATABASE (With Khmer Presentation Cues)
  // ===================================================================
  const speakerNotes = {
    1: `
      <p><strong>Slide 1: Introduction | សេចក្តីផ្តើម</strong></p>
      <p>Good morning/afternoon Teacher Tolah and classmates. Today I am presenting my research assignment from Lesson 6: <em>"Bloc with StreamBuilder"</em>.</p>
      <p class="khmer-font" style="color: #38bdf8;">ជំរាបសួរលោកគ្រូ និងមិត្តភក្តិទាំងអស់គ្នា។ ថ្ងៃនេះខ្ញុំសូមធ្វើបទបង្ហាញអំពីកិច្ចការស្រាវជ្រាវមេរៀនទី ៦៖ "Bloc ជាមួយ StreamBuilder" ដែលជាគ្រឹះដំបូងបំផុតនៃការគ្រប់គ្រង State ដោយប្រើ Dart Stream សុទ្ធ។</p>
    `,
    2: `
      <p><strong>Slide 2: Origin & Foundation | ប្រវត្តិ និងមូលដ្ឋានគ្រឹះ</strong></p>
      <p>Explain why Google originally created BLoC during Google I/O 2018:</p>
      <ul>
        <li>It uses <strong>zero third-party packages</strong>.</li>
        <li>Point out that <code>StreamBuilder</code> is a core widget provided by Flutter SDK itself.</li>
      </ul>
      <p class="khmer-font" style="color: #38bdf8;">ពន្យល់លោកគ្រូថា BLoC ត្រូវបានបង្កើតឡើងតាំងពី Google I/O 2018 ដោយប្រើ Dart Stream សុទ្ធ ១០០% ពុំបាច់ដំឡើង Package ក្រៅឡើយ ហើយ StreamBuilder ជា Widget ស្រាប់របស់ Flutter។</p>
    `,
    3: `
      <p><strong>Slide 3: Architecture & Cute Mascot | ស្ថាបត្យកម្ម & រូបតុក្កតា</strong></p>
      <p>Walk the audience through the 5 steps shown in the cute banner with Dash and Robot:</p>
      <ul>
        <li>1. UI triggers user event.</li>
        <li>2. Event enters Sink.</li>
        <li>3. StreamController computes logic.</li>
        <li>4. Stream emits state.</li>
        <li>5. StreamBuilder updates screen.</li>
      </ul>
      <p class="khmer-font" style="color: #38bdf8;">បង្ហាញរូបតុក្កតាគួរឱ្យស្រឡាញ់ និងពន្យល់ ៥ ជំហាន៖ ប៊ូតុង UI ➔ ច្រក Sink ➔ BLoC គិតលេខ ➔ បំពង់ Stream ➔ StreamBuilder Rebuild UI ឡើងវិញ។</p>
    `,
    4: `
      <p><strong>Slide 4: The 4 Core Pillars | សសរស្តម្ភទាំង ៤</strong></p>
      <p>Contrast Sink and Stream with the 4 crystal pedestals:</p>
      <ul>
        <li><strong>StreamController:</strong> Coordinates the two (ម៉ាស៊ីនគ្រប់គ្រង).</li>
        <li><strong>Sink:</strong> Write-only input (ច្រកចូល).</li>
        <li><strong>Stream:</strong> Read-only output pipeline (បំពង់ចេញ).</li>
        <li><strong>StreamBuilder:</strong> The subscriber in widget tree (Widget បង្ហាញ UI).</li>
      </ul>
    `,
    5: `
      <p><strong>Slide 5: Pure Dart BLoC Code | កូដ BLoC</strong></p>
      <p>Highlight Dash typing clean Dart code:</p>
      <ul>
        <li>Notice we only import <code>dart:async</code>.</li>
        <li>Emphasize: <code>dispose()</code> is mandatory to close stream controllers, preventing memory leaks!</li>
      </ul>
    `,
    6: `
      <p><strong>Slide 6: Consuming with StreamBuilder | ការប្រើ StreamBuilder</strong></p>
      <p>Explain the UI integration with the cute Lego illustration:</p>
      <ul>
        <li><code>_bloc = CounterBloc();</code> initialized in <code>initState</code> once.</li>
        <li><code>initialData: 0</code> prevents null snapshot on initial mount.</li>
        <li><code>_bloc.dispose()</code> called inside <code>dispose()</code>.</li>
      </ul>
    `,
    7: `
      <p><strong>Slide 7: AsyncSnapshot & 3 Robots | ស្ថានភាព ConnectionState</strong></p>
      <p>Point to the 3 cute robots and defensive error guarding:</p>
      <ul>
        <li><code>waiting:</code> Robot with loading spinner (Stream connected, awaiting 1st event).</li>
        <li><code>active:</code> Robot with active stream emitting numbers (Normal active state).</li>
        <li><code>done:</code> Robot with checkered flag (Stream closed by BLoC dispose).</li>
        <li><strong>Research Defense:</strong> Always inspect <code>snapshot.hasError</code> to prevent red screen crashes when network/logic errors occur!</li>
      </ul>
    `,
    8: `
      <p><strong>Slide 8: Interactive 3D Simulator | សាកល្បង 3D Demo</strong></p>
      <p><em>(Action required)</em> Click and drag to rotate the 3D BLoC Reactor Cube! Then click +, -, or Reset on the phone mockup to demonstrate real-time state reactivity!</p>
    `,
    9: `
      <p><strong>Slide 9: Comparison & Arena Showdown | ការប្រៀបធៀប</strong></p>
      <p>Show Dash and Sparky high-fiving in the Flutter Arena comparing pure StreamBuilder vs flutter_bloc library.</p>
    `,
    10: `
      <p><strong>Slide 10: Common Pitfalls & Dash Valve | វិធានការប្រុងប្រយ័ត្ន</strong></p>
      <p>Point to Dash turning the valve: <strong>CLOSE & DISPOSE = LEAK PREVENTED!</strong></p>
      <ul>
        <li><strong>Critical Gotcha 1:</strong> Never instantiate BLoC in <code>build()</code>! It causes memory leaks and resets state on every hot reload or frame rebuild.</li>
        <li><strong>Architecture Rule 2:</strong> Single-subscription streams only permit 1 listener. Use <code>StreamController.broadcast()</code> if multiple widgets need the stream.</li>
        <li><strong>Gold Rule 3:</strong> Always invoke <code>controller.close()</code> inside State's <code>dispose()</code>!</li>
      </ul>
    `,
    11: `
      <p><strong>Slide 11: Summary & A+ Trophy | សង្ខេប</strong></p>
      <p>Dash holding the 1st place trophy summarizing all 4 academic research findings:</p>
      <ul>
        <li><strong>Pure Dart Reactivity:</strong> Zero 3rd party runtime dependencies.</li>
        <li><strong>Decoupled Architecture:</strong> Complete separation between UI Widgets and Business Logic.</li>
        <li><strong>Performance Benchmark:</strong> Targeted scoped rebuilds reduce CPU/GPU draw overhead by ~85% vs full-screen <code>setState()</code>.</li>
        <li><strong>100% Isolated Unit Testing:</strong> BLoC logic tests directly with standard <code>dart test</code> in milliseconds without needing Flutter Engine or device emulators.</li>
      </ul>
    `,
    12: `
      <p><strong>Slide 12: Conclusion & Q&A | បញ្ចប់</strong></p>
      <p>Thank the teacher and invite questions from the audience with the celebration artwork.</p>
    `
  };

  // ===================================================================
  // 7. SLIDE NAVIGATION & TRANSITIONS
  // ===================================================================
  function updateSlide(targetIndex) {
    if (targetIndex < 1 || targetIndex > totalSlides) return;
    playSlideSound();

    slides.forEach((slide) => {
      const idx = parseInt(slide.dataset.slide, 10);
      slide.classList.remove('active', 'prev-slide');
      if (idx === targetIndex) slide.classList.add('active');
      else if (idx < targetIndex) slide.classList.add('prev-slide');
    });

    currentSlide = targetIndex;
    currentSlideNum.textContent = currentSlide;

    const percent = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${percent}%`;

    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    notesSlideNum.textContent = currentSlide;
    notesBody.innerHTML = speakerNotes[currentSlide] || '<p>No notes for this slide.</p>';

    document.querySelectorAll('.drawer-card').forEach((card) => {
      card.classList.toggle('active-card', parseInt(card.dataset.slide, 10) === currentSlide);
    });
  }

  function nextSlide() {
    if (currentSlide < totalSlides) updateSlide(currentSlide + 1);
  }

  function prevSlide() {
    if (currentSlide > 1) updateSlide(currentSlide - 1);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  if (restartBtn) restartBtn.addEventListener('click', () => updateSlide(1));

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        updateSlide(1);
        break;
      case 'End':
        e.preventDefault();
        updateSlide(totalSlides);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'o':
      case 'O':
        toggleOverview();
        break;
      case 'n':
      case 'N':
        toggleNotes();
        break;
      case 't':
      case 'T':
        toggleTheme();
        break;
      case 'l':
      case 'L':
        toggleLaser();
        break;
      case 'p':
      case 'P':
        window.print();
        break;
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }
  fullscreenToggle.addEventListener('click', toggleFullscreen);

  function toggleTheme() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      themeToggle.textContent = '🌓';
    } else {
      document.body.setAttribute('data-theme', 'light');
      themeToggle.textContent = '☀️';
    }
  }
  themeToggle.addEventListener('click', toggleTheme);

  // Overview Drawer Metadata & Grid Builder
  const slideDeckData = [
    {
      num: 1,
      title: 'BLoC with StreamBuilder',
      khmer: 'ស្វែងយល់អំពី BLoC & StreamBuilder',
      tag: 'Executive Intro',
      img: 'assets/cute_title_mascot.jpg'
    },
    {
      num: 2,
      title: 'Why "Bloc with StreamBuilder"?',
      khmer: 'ប្រវត្តិដើម និងមូលដ្ឋានគ្រឹះ Google I/O',
      tag: 'Foundations',
      img: 'assets/cute_google_io_origin.jpg'
    },
    {
      num: 3,
      title: 'Architecture Blueprint',
      khmer: 'ស្ថាបត្យកម្មលំហូរទិន្នន័យ Reactive Flow',
      tag: 'Core Concept',
      img: 'assets/cute_bloc_streambuilder.jpg'
    },
    {
      num: 4,
      title: 'The 4 Core Pillars',
      khmer: 'សសរស្តម្ភគន្លឹះទាំង ៤ នៃ BLoC',
      tag: 'Architecture',
      img: 'assets/cute_4_pillars.jpg'
    },
    {
      num: 5,
      title: 'Step 1: Pure Dart BLoC',
      khmer: 'ការបង្កើត BLoC ដោយមិនប្រើ External Package',
      tag: 'Implementation',
      img: 'assets/cute_dash_coding.jpg'
    },
    {
      num: 6,
      title: 'Step 2: StreamBuilder in UI',
      khmer: 'ការភ្ជាប់ Widget ជាមួយ StreamBuilder',
      tag: 'Implementation',
      img: 'assets/cute_streambuilder_lego.jpg'
    },
    {
      num: 7,
      title: 'AsyncSnapshot Lifecycle',
      khmer: 'ស្ថានភាពទិន្នន័យ ConnectionState ទាំង ៣',
      tag: 'Lifecycle',
      img: 'assets/cute_connection_states.jpg'
    },
    {
      num: 8,
      title: 'Interactive 3D Simulation',
      khmer: 'ការពិសោធន៍ដំណើរការ Reactive Stream ជាក់ស្តែង',
      tag: 'Interactive 3D',
      img: 'assets/bloc_streambuilder_banner.jpg'
    },
    {
      num: 9,
      title: 'StreamBuilder vs flutter_bloc',
      khmer: 'ការប្រៀបធៀប BLoC សុទ្ធ vs បណ្ណាល័យជំនួយ',
      tag: 'Comparison',
      img: 'assets/cute_comparison_showdown.jpg'
    },
    {
      num: 10,
      title: 'Pitfalls & Memory Leaks',
      khmer: 'កំហុសឆ្គងទូទៅ និងវិធីដោះស្រាយ Memory Leak',
      tag: 'Best Practices',
      img: 'assets/cute_memory_leak_fix.jpg'
    },
    {
      num: 11,
      title: 'Research Summary',
      khmer: 'សង្ខេបលទ្ធផលស្រាវជ្រាវសំខាន់ៗ',
      tag: 'Summary',
      img: 'assets/cute_summary_trophy.jpg'
    },
    {
      num: 12,
      title: 'Conclusion & Q&A',
      khmer: 'សេចក្តីសន្និដ្ឋាន សំណួរ-ចម្លើយ & ក្រេឌីត',
      tag: 'Conclusion',
      img: 'assets/cute_thankyou_flutter.jpg'
    }
  ];

  function buildOverviewGrid() {
    drawerGrid.innerHTML = '';
    slideDeckData.forEach((item) => {
      const idx = item.num;
      const isActive = idx === currentSlide;

      const card = document.createElement('div');
      card.className = `drawer-card ${isActive ? 'active-card' : ''}`;
      card.dataset.slide = idx;
      card.innerHTML = `
        <div class="drawer-card-thumb-wrap">
          <img src="${item.img}" alt="${item.title}" class="drawer-card-thumb" loading="lazy">
          <span class="drawer-card-tag">${item.tag}</span>
          <span class="drawer-card-num">SLIDE ${String(idx).padStart(2, '0')}</span>
          ${isActive ? '<span class="drawer-current-badge">● CURRENT</span>' : ''}
        </div>
        <div class="drawer-card-info">
          <div class="drawer-card-title">${item.title}</div>
          <div class="drawer-card-khmer khmer-font">${item.khmer}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        updateSlide(idx);
        overviewDrawer.classList.remove('open');
      });

      drawerGrid.appendChild(card);
    });
  }

  function toggleOverview() {
    overviewDrawer.classList.toggle('open');
    if (overviewDrawer.classList.contains('open')) buildOverviewGrid();
  }
  overviewToggle.addEventListener('click', toggleOverview);
  closeDrawer.addEventListener('click', () => overviewDrawer.classList.remove('open'));

  function toggleNotes() {
    notesModal.classList.toggle('open');
    notesToggleBtn.classList.toggle('active');
  }
  notesToggleBtn.addEventListener('click', toggleNotes);
  closeNotes.addEventListener('click', () => {
    notesModal.classList.remove('open');
    notesToggleBtn.classList.remove('active');
  });

  autoPlayBtn.addEventListener('click', () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      autoPlayBtn.classList.remove('active');
      autoPlayBtn.innerHTML = '▶ Auto Play';
    } else {
      autoPlayBtn.classList.add('active');
      autoPlayBtn.innerHTML = '⏸ Pause';
      autoPlayInterval = setInterval(() => {
        if (currentSlide < totalSlides) nextSlide();
        else updateSlide(1);
      }, 7000);
    }
  });

  updateSlide(1);

  // ===================================================================
  // 8. INTERACTIVE SIMULATOR + 3D REACTOR TRIGGER
  // ===================================================================
  let counterValue = 0;
  let rebuildCount = 0;
  let isSimulating = false;

  const simCount = document.getElementById('simCount');
  const simBoundary = document.getElementById('simBoundary');
  const simIncBtn = document.getElementById('simIncBtn');
  const simDecBtn = document.getElementById('simDecBtn');
  const simResetBtn = document.getElementById('simResetBtn');
  const consoleLogs = document.getElementById('consoleLogs');
  const clearLogsBtn = document.getElementById('clearLogs');

  const nodeUI = document.getElementById('nodeUI');
  const nodeSink = document.getElementById('nodeSink');
  const nodeBloc = document.getElementById('nodeBloc');
  const nodeStream = document.getElementById('nodeStream');
  const nodeBuilder = document.getElementById('nodeBuilder');

  const eventPacket = document.getElementById('eventPacket');
  const processPacket = document.getElementById('processPacket');
  const statePacket = document.getElementById('statePacket');
  const consumerPacket = document.getElementById('consumerPacket');

  const eventBadge = document.getElementById('eventBadge');
  const blocInternalState = document.getElementById('blocInternalState');
  const renderBadge = document.getElementById('renderBadge');

  const step1Btn = document.getElementById('step1Btn');
  const step2Btn = document.getElementById('step2Btn');
  const step3Btn = document.getElementById('step3Btn');
  const step4Btn = document.getElementById('step4Btn');
  const step5Btn = document.getElementById('step5Btn');

  function logMessage(type, msg) {
    if (!consoleLogs) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    div.textContent = `[${time}] ${msg}`;
    consoleLogs.appendChild(div);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      consoleLogs.innerHTML = '';
      logMessage('info', 'Console logs cleared.');
    });
  }

  function animatePacket(packetElem, duration, onComplete) {
    packetElem.style.opacity = '1';
    packetElem.style.transition = `left ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    packetElem.style.left = '100%';
    playPacketSound();

    setTimeout(() => {
      packetElem.style.opacity = '0';
      packetElem.style.transition = 'none';
      packetElem.style.left = '0%';
      if (onComplete) onComplete();
    }, duration);
  }

  function triggerBlocEvent(eventType) {
    if (isSimulating) return;
    isSimulating = true;

    eventBadge.textContent = eventType;
    eventBadge.style.color = '#38bdf8';
    nodeUI.classList.add('active-node');
    playTone(380, 'sine', 0.1);
    pulse3DReactor(); // Trigger 3D reactor pulse!

    logMessage('event', `UI Event dispatched: ${eventType}`);

    animatePacket(eventPacket, 380, () => {
      nodeUI.classList.remove('active-node');
      nodeSink.classList.add('active-node');
      logMessage('event', `eventSink.add(${eventType}) received event.`);

      setTimeout(() => {
        nodeSink.classList.remove('active-node');
        animatePacket(processPacket, 320, () => {
          nodeBloc.classList.add('active-node');

          const prevValue = counterValue;
          if (eventType === 'CounterIncremented') counterValue++;
          else if (eventType === 'CounterDecremented') counterValue--;
          else if (eventType === 'CounterReset') counterValue = 0;

          blocInternalState.textContent = `Internal: ${counterValue}`;
          logMessage('state', `CounterBloc calculated state: ${prevValue} ➔ ${counterValue}`);

          setTimeout(() => {
            nodeBloc.classList.remove('active-node');
            animatePacket(statePacket, 320, () => {
              nodeStream.classList.add('active-node');
              logMessage('state', `counterStream emitted state: ${counterValue}`);

              setTimeout(() => {
                nodeStream.classList.remove('active-node');
                animatePacket(consumerPacket, 320, () => {
                  nodeBuilder.classList.add('active-node');

                  rebuildCount++;
                  renderBadge.textContent = `Rebuilt: #${rebuildCount}`;
                  simCount.textContent = counterValue;

                  simBoundary.classList.add('flash');
                  simCount.classList.add('bump');
                  playRebuildSound();

                  logMessage('rebuild', `StreamBuilder triggered builder() with snapshot.data = ${counterValue}`);

                  setTimeout(() => {
                    simBoundary.classList.remove('flash');
                    simCount.classList.remove('bump');
                    nodeBuilder.classList.remove('active-node');
                    eventBadge.textContent = 'idle';
                    eventBadge.style.color = 'var(--text-muted)';
                    isSimulating = false;
                  }, 400);
                });
              }, 80);
            });
          }, 200);
        });
      }, 120);
    });
  }

  if (simIncBtn) simIncBtn.addEventListener('click', () => triggerBlocEvent('CounterIncremented'));
  if (simDecBtn) simDecBtn.addEventListener('click', () => triggerBlocEvent('CounterDecremented'));
  if (simResetBtn) simResetBtn.addEventListener('click', () => triggerBlocEvent('CounterReset'));

  if (step1Btn) {
    step1Btn.addEventListener('click', () => {
      nodeUI.classList.add('active-node');
      eventBadge.textContent = 'Button Tapped';
      playTone(400, 'sine', 0.1);
      logMessage('event', '[Step 1] User taps FloatingActionButton in UI.');
      setTimeout(() => nodeUI.classList.remove('active-node'), 1000);
    });
  }

  if (step2Btn) {
    step2Btn.addEventListener('click', () => {
      nodeSink.classList.add('active-node');
      playTone(500, 'sine', 0.1);
      logMessage('event', '[Step 2] Event dispatched into Sink: _bloc.eventSink.add(...)');
      setTimeout(() => nodeSink.classList.remove('active-node'), 1000);
    });
  }

  if (step3Btn) {
    step3Btn.addEventListener('click', () => {
      nodeBloc.classList.add('active-node');
      pulse3DReactor();
      playTone(600, 'sine', 0.1);
      logMessage('state', '[Step 3] StreamController listener evaluates business logic.');
      setTimeout(() => nodeBloc.classList.remove('active-node'), 1000);
    });
  }

  if (step4Btn) {
    step4Btn.addEventListener('click', () => {
      nodeStream.classList.add('active-node');
      playTone(700, 'sine', 0.1);
      logMessage('state', '[Step 4] State emitted onto Stream: _stateController.sink.add(counter)');
      setTimeout(() => nodeStream.classList.remove('active-node'), 1000);
    });
  }

  if (step5Btn) {
    step5Btn.addEventListener('click', () => {
      nodeBuilder.classList.add('active-node');
      simBoundary.classList.add('flash');
      simCount.classList.add('bump');
      playRebuildSound();
      logMessage('rebuild', '[Step 5] StreamBuilder receives snapshot and rebuilds target widget.');
      setTimeout(() => {
        nodeBuilder.classList.remove('active-node');
        simBoundary.classList.remove('flash');
        simCount.classList.remove('bump');
      }, 1000);
    });
  }
});
