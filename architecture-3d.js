/* ==========================================================================
   3D layered system-architecture visualization
   Five stacked "platform" rings (Client -> API -> AI/ML -> Data -> Infra),
   connected by animated beams, auto-rotating with drag-to-orbit support.
   Only initialized once the gated architecture section is unlocked (see
   script.js's unlockArchitecture()), via window.initArchScene(). Exposes
   window.setArchActiveLayer(key) so the 2D legend cycle in script.js can
   pulse the matching 3D layer in sync.
   ========================================================================== */

(function () {
    'use strict';

    let initialized = false;
    let setActiveLayerImpl = null;

    window.setArchActiveLayer = function (key) {
        if (setActiveLayerImpl) setActiveLayerImpl(key);
    };

    window.initArchScene = function () {
        if (initialized) return;
        initialized = true;

        const canvas = document.getElementById('arch-canvas');
        const container = canvas && canvas.closest('.arch-visual');
        if (!canvas || !container || typeof THREE === 'undefined') return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        } catch (err) {
            return; // No WebGL -- the card background still reads fine empty.
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 1.2, 10);
        camera.lookAt(0, 0, 0);

        function buildGlowTexture() {
            const size = 128;
            const c = document.createElement('canvas');
            c.width = c.height = size;
            const ctx = c.getContext('2d');
            const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            return new THREE.CanvasTexture(c);
        }
        const glowTexture = buildGlowTexture();

        const LAYER_KEYS = ['client', 'api', 'ai', 'data', 'infra'];
        const LAYER_COLORS = [0x00e5ff, 0x4fc3f7, 0xa855f7, 0xd166c8, 0xec4899];
        const LAYER_Y = [4, 2, 0, -2, -4];
        const RING_RADIUS = 2.3;

        const group = new THREE.Group();
        scene.add(group);

        const layers = {}; // key -> { ring, sprites: [], baseScale, targetScale, targetOpacity, currentOpacity }

        LAYER_KEYS.forEach((key, i) => {
            const color = LAYER_COLORS[i];
            const y = LAYER_Y[i];

            const ringGeo = new THREE.TorusGeometry(RING_RADIUS, 0.035, 12, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = y;
            group.add(ring);

            const sprites = [];
            for (let s = 0; s < 4; s++) {
                const angle = (s / 4) * Math.PI * 2;
                const spriteMat = new THREE.SpriteMaterial({
                    map: glowTexture,
                    color,
                    transparent: true,
                    opacity: 0.9,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });
                const sprite = new THREE.Sprite(spriteMat);
                sprite.position.set(Math.cos(angle) * RING_RADIUS, y, Math.sin(angle) * RING_RADIUS);
                sprite.scale.set(0.5, 0.5, 0.5);
                group.add(sprite);
                sprites.push(sprite);
            }

            layers[key] = { ring, sprites, targetScale: 1, currentScale: 1, targetOpacity: 0.55, currentOpacity: 0.55 };
        });

        // Vertical connecting beams between consecutive layers
        for (let i = 0; i < LAYER_Y.length - 1; i++) {
            const beamGeo = new THREE.CylinderGeometry(0.012, 0.012, LAYER_Y[i] - LAYER_Y[i + 1], 8, 1, true);
            const beamMat = new THREE.MeshBasicMaterial({
                color: 0x8b7bd8,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.y = (LAYER_Y[i] + LAYER_Y[i + 1]) / 2;
            group.add(beam);
        }

        group.rotation.x = 0.15;
        group.rotation.y = 0.6;

        setActiveLayerImpl = function (key) {
            LAYER_KEYS.forEach((k) => {
                const isActive = k === key;
                layers[k].targetScale = isActive ? 1.16 : 1;
                layers[k].targetOpacity = isActive ? 1 : 0.5;
            });
        };

        function resize() {
            const rect = container.getBoundingClientRect();
            const width = Math.max(rect.width, 1);
            const height = Math.max(rect.height, 1);
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        // Drag-to-orbit
        let isDragging = false;
        let lastX = 0;
        let autoRotateResumeAt = 0;

        canvas.style.cursor = 'grab';
        canvas.addEventListener('pointerdown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            canvas.style.cursor = 'grabbing';
        });
        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const delta = e.clientX - lastX;
            lastX = e.clientX;
            group.rotation.y += delta * 0.008;
        });
        window.addEventListener('pointerup', () => {
            if (isDragging) autoRotateResumeAt = performance.now() + 1500;
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        function renderFrame() {
            LAYER_KEYS.forEach((k) => {
                const layer = layers[k];
                layer.currentScale += (layer.targetScale - layer.currentScale) * 0.12;
                layer.currentOpacity += (layer.targetOpacity - layer.currentOpacity) * 0.12;
                layer.ring.scale.set(layer.currentScale, layer.currentScale, layer.currentScale);
                layer.ring.material.opacity = layer.currentOpacity;
                layer.sprites.forEach((sprite) => {
                    sprite.material.opacity = 0.5 + layer.currentOpacity * 0.5;
                    sprite.scale.set(0.4 + layer.currentScale * 0.2, 0.4 + layer.currentScale * 0.2, 1);
                });
            });
            renderer.render(scene, camera);
        }

        if (prefersReducedMotion) {
            renderFrame();
            return;
        }

        let isVisible = true;
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => { isVisible = entries[0].isIntersecting; }, { threshold: 0 });
            io.observe(container);
        }

        function animate() {
            requestAnimationFrame(animate);
            if (!isVisible) return;

            if (!isDragging && performance.now() > autoRotateResumeAt) {
                group.rotation.y += 0.0018;
            }
            renderFrame();
        }
        animate();
    };
})();
