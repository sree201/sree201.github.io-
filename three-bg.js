/* ==========================================================================
   Neural network hero background — vanilla Three.js
   A field of glowing nodes connected like a neural net, with slow
   auto-rotation and gentle mouse parallax. Degrades gracefully if WebGL
   or Three.js is unavailable, and renders a single static frame when the
   visitor prefers reduced motion.
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('neural-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const heroSection = canvas.closest('.hero') || canvas.parentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 768;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power'
        });
    } catch (err) {
        return; // No WebGL support — CSS gradient backdrop still carries the hero.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;

    // -- Build a soft glow sprite for the node points ------------------------
    function buildGlowTexture() {
        const size = 128;
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
    }

    const glowTexture = buildGlowTexture();

    // -- Nodes -----------------------------------------------------------------
    const NODE_COUNT = isSmallScreen ? 55 : 130;
    const BOUNDS = { x: 9, y: 5.5, zMin: -5, zMax: 3 };

    const cyan = new THREE.Color(0x00e5ff);
    const violet = new THREE.Color(0xa855f7);

    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    const nodePoints = [];

    for (let i = 0; i < NODE_COUNT; i++) {
        const x = (Math.random() * 2 - 1) * BOUNDS.x;
        const y = (Math.random() * 2 - 1) * BOUNDS.y;
        const z = BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        nodePoints.push(new THREE.Vector3(x, y, z));

        const mixed = cyan.clone().lerp(violet, Math.random());
        colors[i * 3] = mixed.r;
        colors[i * 3 + 1] = mixed.g;
        colors[i * 3 + 2] = mixed.b;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.16,
        map: glowTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    // -- Edges: connect nearby nodes to read as a "neural network" -----------
    const MAX_DIST = 3.1;
    const MAX_EDGES = isSmallScreen ? 90 : 220;
    const linePositions = [];
    let edgeCount = 0;

    outer:
    for (let i = 0; i < nodePoints.length && edgeCount < MAX_EDGES; i++) {
        for (let j = i + 1; j < nodePoints.length; j++) {
            if (nodePoints[i].distanceTo(nodePoints[j]) < MAX_DIST) {
                linePositions.push(
                    nodePoints[i].x, nodePoints[i].y, nodePoints[i].z,
                    nodePoints[j].x, nodePoints[j].y, nodePoints[j].z
                );
                edgeCount++;
                if (edgeCount >= MAX_EDGES) break outer;
            }
        }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8b7bd8,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

    const group = new THREE.Group();
    group.add(lines);
    group.add(points);
    group.rotation.x = 0.15;
    scene.add(group);

    // -- Sizing ------------------------------------------------------------
    function resize() {
        const rect = heroSection.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // -- Mouse parallax ------------------------------------------------------
    let targetX = 0, targetY = 0;
    window.addEventListener('pointermove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // -- Render loop -----------------------------------------------------------
    const clock = new THREE.Clock();

    function renderFrame() {
        const t = clock.getElapsedTime();
        pointsMaterial.opacity = 0.75 + Math.sin(t * 0.6) * 0.15;
        renderer.render(scene, camera);
    }

    if (prefersReducedMotion) {
        renderFrame(); // static single frame — no animation loop
        return;
    }

    // Pause rendering once the hero scrolls out of view — saves battery on
    // long scroll sessions since the canvas is invisible anyway.
    let isVisible = true;
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        io.observe(heroSection);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        group.rotation.y += 0.0011;
        group.rotation.x += (targetY * 0.12 - group.rotation.x + 0.15) * 0.02;
        camera.position.x += (targetX * 0.6 - camera.position.x) * 0.03;
        camera.lookAt(scene.position);

        renderFrame();
    }
    animate();
})();
