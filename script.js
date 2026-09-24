// ============================================================
// ASTREON SYSTEMS — Premium Script v4.0
// Crimson · Scarlet · Blood Red Theme
// ============================================================

// ============================================================
// 1. THREE.JS — Red Neon Circuit Background
// ============================================================
const initThreeJS = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 180);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── LAYER 1: Deep star field (warm red-white stars) ────
    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i]     = (Math.random() - 0.5) * 2000;
        starPos[i + 1] = (Math.random() - 0.5) * 2000;
        starPos[i + 2] = (Math.random() - 0.5) * 800 - 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        color: 0xffcccc,   // warm pinkish-white stars
        size: 0.6,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ─── LAYER 2: Neon red particle nodes ───────────────────
    const nodeCount = 120;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = new Float32Array(nodeCount * 3);
    const nodeVel = [];

    for (let i = 0; i < nodeCount * 3; i += 3) {
        nodePos[i]     = (Math.random() - 0.5) * 700;
        nodePos[i + 1] = (Math.random() - 0.5) * 500;
        nodePos[i + 2] = (Math.random() - 0.5) * 300;
        nodeVel.push({
            x: (Math.random() - 0.5) * 0.08,
            y: (Math.random() - 0.5) * 0.08,
            z: (Math.random() - 0.5) * 0.04,
        });
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = new THREE.PointsMaterial({
        color: 0xff2222,   // neon red nodes
        size: 2.2,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
    });
    const nodeSystem = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodeSystem);

    // ─── LAYER 3: Crimson connection lines ──────────────────
    const lineMat = new THREE.LineBasicMaterial({
        color: 0xcc1133,   // crimson lines
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });
    const lineGeo = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // Deep blood-red accent lines
    const darkLineMat = new THREE.LineBasicMaterial({
        color: 0x8b0000,   // deep blood red
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });
    const darkLineGeo = new THREE.BufferGeometry();
    const darkLineMesh = new THREE.LineSegments(darkLineGeo, darkLineMat);
    scene.add(darkLineMesh);

    // ─── LAYER 4: Red circuit grid plane ────────────────────
    const gridHelper = new THREE.GridHelper(2000, 60, 0x2a0005, 0x2a0005);
    gridHelper.position.y = -120;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    scene.add(gridHelper);

    // ─── LAYER 5: Floating torus rings (red shades) ─────────
    const rings = [];
    const ringData = [
        { radius: 80,  tube: 0.4,  color: 0xff2222, opacity: 0.1,  rx: 1.2, ry: 0.3, speed: 0.003 },
        { radius: 130, tube: 0.3,  color: 0x8b0000, opacity: 0.08, rx: 0.5, ry: 1.0, speed: 0.002 },
        { radius: 200, tube: 0.25, color: 0xdc143c, opacity: 0.05,  rx: 0.8, ry: 0.6, speed: 0.0015 },
    ];

    ringData.forEach(r => {
        const geo = new THREE.TorusGeometry(r.radius, r.tube, 8, 80);
        const mat = new THREE.MeshBasicMaterial({
            color: r.color,
            transparent: true,
            opacity: r.opacity,
            blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = r.rx;
        mesh.rotation.y = r.ry;
        scene.add(mesh);
        rings.push({ mesh, speed: r.speed });
    });

    // ─── LAYER 6: Glowing red orbs ──────────────────────────
    const orbs = [];
    const orbData = [
        { x: 100,  y: 50,  z: -80,  color: 0xcc1133, size: 8, speed: 0.008 },
        { x: -80,  y: -40, z: -60,  color: 0x8b0000, size: 6, speed: 0.012 },
        { x: 40,   y: -70, z: -100, color: 0xff4444, size: 5, speed: 0.006 },
    ];

    orbData.forEach(d => {
        const geo = new THREE.SphereGeometry(d.size, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
            color: d.color,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(d.x, d.y, d.z);
        scene.add(mesh);
        orbs.push({ mesh, origY: d.y, speed: d.speed, phase: Math.random() * Math.PI * 2 });
    });

    // ─── Mouse parallax ─────────────────────────────────────
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    // ─── Animation loop ──────────────────────────────────────
    let t = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        t += 0.01;

        // Smooth camera parallax
        targetX += (mouseX * 8 - targetX) * 0.03;
        targetY += (mouseY * 5 - targetY) * 0.03;
        camera.position.x = targetX;
        camera.position.y = -targetY + scrollY * 0.02;

        // Update particle nodes + build connection lines
        const pos = nodeSystem.geometry.attributes.position.array;
        const redLines  = [];
        const darkLines = [];

        for (let i = 0, j = 0; i < nodeCount; i++, j += 3) {
            pos[j]     += nodeVel[i].x;
            pos[j + 1] += nodeVel[i].y;
            pos[j + 2] += nodeVel[i].z;

            if (Math.abs(pos[j])     > 350) nodeVel[i].x *= -1;
            if (Math.abs(pos[j + 1]) > 250) nodeVel[i].y *= -1;
            if (Math.abs(pos[j + 2]) > 150) nodeVel[i].z *= -1;

            for (let k = i + 1; k < nodeCount; k++) {
                const kj = k * 3;
                const dx = pos[j] - pos[kj];
                const dy = pos[j + 1] - pos[kj + 1];
                const dz = pos[j + 2] - pos[kj + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 70) {
                    if (k % 3 === 0) {
                        darkLines.push(pos[j], pos[j+1], pos[j+2], pos[kj], pos[kj+1], pos[kj+2]);
                    } else {
                        redLines.push(pos[j], pos[j+1], pos[j+2], pos[kj], pos[kj+1], pos[kj+2]);
                    }
                }
            }
        }

        nodeSystem.geometry.attributes.position.needsUpdate = true;
        lineMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(redLines, 3));
        darkLineMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(darkLines, 3));

        // Slow rotation
        nodeSystem.rotation.y += 0.0004;
        nodeSystem.rotation.x += 0.0001;
        lineMesh.rotation.y = nodeSystem.rotation.y;
        lineMesh.rotation.x = nodeSystem.rotation.x;
        darkLineMesh.rotation.y = nodeSystem.rotation.y;
        darkLineMesh.rotation.x = nodeSystem.rotation.x;

        // Rings
        rings.forEach((r, i) => {
            r.mesh.rotation.y += r.speed;
            r.mesh.rotation.z += r.speed * 0.4;
            r.mesh.material.opacity = 0.1 + Math.sin(t * 0.5 + i) * 0.05;
        });

        // Orbs
        orbs.forEach(orb => {
            orb.mesh.position.y = orb.origY + Math.sin(t * orb.speed * 60 + orb.phase) * 15;
            orb.mesh.material.opacity = 0.2 + Math.sin(t + orb.phase) * 0.1;
        });

        // Pulse grid
        gridHelper.material.opacity = 0.22 + Math.sin(t * 0.3) * 0.1;
        gridHelper.position.y = -120 - scrollY * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ============================================================
// 2. PRELOADER — Red Cinematic Intro
// ============================================================
const initGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);

    const introTl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            document.querySelector('.navbar').classList.remove('hidden-onload');
            document.querySelector('main').classList.remove('hidden-onload');
            document.querySelector('footer').classList.remove('hidden-onload');
            document.getElementById('preloader').style.display = 'none';
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 150);
            playEntrance();
        }
    });

    // ─── Cinematic sequence ───────────────────────────────────
    introTl
        // 1. Background glow fades in
        .to('.preloader-bg', { opacity: 1, duration: 1.2, ease: 'power2.inOut' })

        // 2. Enchantment glow blooms
        .to('.enchantment-glow', { opacity: 1, scale: 1.6, duration: 1.5, ease: 'power2.out' }, '-=0.8')

        // 3. Small overline "Astreon Systems" appears first
        .to('.pb-overline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=1')

        // 4. BIG headline slams in with blur
        .fromTo('.pb-headline',
            { opacity: 0, scale: 1.3, filter: 'blur(25px)' },
            { opacity: 1, scale: 1,   filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
        '-=0.4')

        // 5. Tagline fades in below
        .to('.pb-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')

        // 6. Hold for reading
        .to({}, { duration: 1.6 })

        // 7. All fades out upward
        .to('.pb-tagline',  { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' })
        .to('.pb-headline', { opacity: 0, y: -20, filter: 'blur(10px)', duration: 0.5, ease: 'power2.in' }, '-=0.2')
        .to('.pb-overline', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' }, '-=0.3')
        .to('.enchantment-glow', { opacity: 0, duration: 0.8, ease: 'power2.in' }, '-=0.4')

        // 8. Preloader dissolves
        .to('#preloader', { opacity: 0, duration: 1, ease: 'power2.inOut' }, '-=0.3');

    // ─── Hero page entrance ───────────────────────────────────
    function playEntrance() {
        gsap.timeline()
            .from('.navbar', { y: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
            .from('.hero-title .line-white:first-child', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .from('.line-gradient', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
            .from('.line-gradient-sub', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .from('.line-small', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
            .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .from('.hero-actions',  { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
            .from('.neural-wrapper', { x: 80, opacity: 0, scale: 0.85, duration: 1.2, ease: 'power3.out' }, '-=0.8');
    }

    // ─── Scroll nav tint ─────────────────────────────────────
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        window.scrollY > 60
            ? nav.classList.add('scrolled')
            : nav.classList.remove('scrolled');
    });

    // ─── SCROLL-TRIGGERED SECTION REVEALS ────────────────────

    gsap.from('.about-title-col', {
        scrollTrigger: { trigger: '.about', start: 'top 78%' },
        x: -50, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.about-text-col', {
        scrollTrigger: { trigger: '.about', start: 'top 78%' },
        x: 50, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.stat-box', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
        y: 30, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)'
    });

    gsap.from('.services .section-header', {
        scrollTrigger: { trigger: '.services', start: 'top 80%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.fromTo('.service-card', 
        { y: 60, opacity: 0 },
        {
            scrollTrigger: { trigger: '.services-bento', start: 'top 85%' },
            y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out'
        }
    );

    gsap.from('.process .section-header', {
        scrollTrigger: { trigger: '.process', start: 'top 80%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.timeline-item', {
        scrollTrigger: { trigger: '.timeline-container', start: 'top 72%' },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out'
    });

    gsap.from('.why-us .section-header', {
        scrollTrigger: { trigger: '.why-us', start: 'top 80%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.fromTo('.why-feat-card', 
        { y: 40, opacity: 0 },
        {
            scrollTrigger: { trigger: '.why-grid-premium', start: 'top 85%' },
            y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out'
        }
    );

    gsap.from('.contact .section-header', {
        scrollTrigger: { trigger: '.contact', start: 'top 80%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.contact-info', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 78%' },
        x: -40, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 78%' },
        x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2
    });

    gsap.from('.founder-elegance', {
        scrollTrigger: { trigger: '.founder', start: 'top 78%' },
        y: 50, opacity: 0, scale: 0.96, duration: 1.1, ease: 'power3.out'
    });
};

// ============================================================
// 4. NEURAL NETWORK CANVAS — Live AI Visualization
// ============================================================
const initNeuralNetwork = () => {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2, cy = H / 2;

    // Layer definitions [x%, y%] normalized
    const layers = [
        // Input layer (left)
        [{ x: 0.14, y: 0.25 }, { x: 0.14, y: 0.40 }, { x: 0.14, y: 0.55 }, { x: 0.14, y: 0.70 }, { x: 0.14, y: 0.85 }],
        // Hidden 1
        [{ x: 0.32, y: 0.20 }, { x: 0.32, y: 0.35 }, { x: 0.32, y: 0.50 }, { x: 0.32, y: 0.65 }, { x: 0.32, y: 0.80 }],
        // Hidden 2 — the core
        [{ x: 0.50, y: 0.28 }, { x: 0.50, y: 0.44 }, { x: 0.50, y: 0.60 }, { x: 0.50, y: 0.76 }],
        // Hidden 3
        [{ x: 0.68, y: 0.20 }, { x: 0.68, y: 0.35 }, { x: 0.68, y: 0.50 }, { x: 0.68, y: 0.65 }, { x: 0.68, y: 0.80 }],
        // Output layer (right)
        [{ x: 0.86, y: 0.25 }, { x: 0.86, y: 0.42 }, { x: 0.86, y: 0.58 }, { x: 0.86, y: 0.75 }],
    ];

    // Convert to pixel coords
    const nodes = layers.map(layer =>
        layer.map(n => ({ px: n.x * W, py: n.y * H, pulse: Math.random(), speed: 0.006 + Math.random() * 0.008 }))
    );

    // Build edges between consecutive layers
    const edges = [];
    for (let li = 0; li < nodes.length - 1; li++) {
        for (const a of nodes[li]) {
            for (const b of nodes[li + 1]) {
                edges.push({ a, b, t: Math.random(), speed: 0.004 + Math.random() * 0.006 });
            }
        }
    }

    let frame = 0;

    const draw = () => {
        ctx.clearRect(0, 0, W, H);
        frame++;

        // Radial background glow
        const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.5);
        bg.addColorStop(0,   'rgba(80, 5, 15, 0.55)');
        bg.addColorStop(0.5, 'rgba(20, 1, 4, 0.3)');
        bg.addColorStop(1,   'transparent');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, cy, W * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw edges
        for (const e of edges) {
            e.t += e.speed;
            if (e.t > 1) e.t = 0;

            // Base edge
            ctx.beginPath();
            ctx.moveTo(e.a.px, e.a.py);
            ctx.lineTo(e.b.px, e.b.py);
            ctx.strokeStyle = 'rgba(220, 20, 60, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Travelling signal pulse
            const px = e.a.px + (e.b.px - e.a.px) * e.t;
            const py = e.a.py + (e.b.py - e.a.py) * e.t;
            const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 7);
            pulseGrad.addColorStop(0, 'rgba(255, 80, 80, 0.7)');
            pulseGrad.addColorStop(0.5, 'rgba(220, 20, 60, 0.2)');
            pulseGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(px, py, 7, 0, Math.PI * 2);
            ctx.fillStyle = pulseGrad;
            ctx.fill();
        }

        // Draw nodes
        nodes.forEach((layer, li) => {
            layer.forEach((n, ni) => {
                n.pulse += n.speed;
                const glow = 0.5 + Math.sin(n.pulse) * 0.45;
                const isCore = li === 2;
                const r = isCore ? 6 : 4;

                // Outer glow
                const outerGlow = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, r * 3.5);
                outerGlow.addColorStop(0, `rgba(220, 20, 60, ${glow * 0.15})`);
                outerGlow.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(n.px, n.py, r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = outerGlow;
                ctx.fill();

                // Node fill
                const nodeGrad = ctx.createRadialGradient(n.px - r * 0.3, n.py - r * 0.3, 0, n.px, n.py, r);
                if (isCore) {
                    nodeGrad.addColorStop(0, `rgba(255, 120, 120, ${0.9 + glow * 0.1})`);
                    nodeGrad.addColorStop(1, `rgba(180, 10, 30, ${0.8 + glow * 0.2})`);
                } else {
                    nodeGrad.addColorStop(0, `rgba(255, 80, 80, ${0.7 + glow * 0.2})`);
                    nodeGrad.addColorStop(1, `rgba(139, 0, 0, ${0.6 + glow * 0.2})`);
                }
                ctx.beginPath();
                ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
                ctx.fillStyle = nodeGrad;
                ctx.fill();

                // Node border
                ctx.beginPath();
                ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 100, 100, ${0.5 + glow * 0.4})`;
                ctx.lineWidth = isCore ? 1.5 : 1;
                ctx.stroke();
            });
        });

        // Central AI hex indicator (toned down)
        const t = frame * 0.012;
        const hexGlow = 0.4 + Math.sin(t) * 0.2;
        const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15);
        hg.addColorStop(0, `rgba(220, 20, 60, ${hexGlow})`);
        hg.addColorStop(0.5, `rgba(180, 10, 30, ${hexGlow * 0.4})`);
        hg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        requestAnimationFrame(draw);
    };

    draw();
};

// ============================================================
// 5. SERVICE CARD 3D TILT
// ============================================================
const initCardTilt = () => {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s ease';
        });
    });
};

// ============================================================
// 6. SMOOTH SCROLL
// ============================================================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            const navH = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - navH,
                behavior: 'smooth'
            });
        });
    });
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') initThreeJS();
    if (typeof gsap  !== 'undefined') initGSAP();
    initCursorTrail();
    initNeuralNetwork();
    initSmoothScroll();
    setTimeout(initCardTilt, 500);
});
