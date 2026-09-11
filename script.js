/* ==========================================================================
   Srinath Koyi — AI/ML Engineer Portfolio — interactions
   Vanilla JS. GSAP/ScrollTrigger are used when available for smoother
   scroll-linked motion, but every feature has a plain-JS/CSS fallback so
   the page stays fully usable if the CDN scripts fail to load.
   ========================================================================== */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';

    if (hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ---------------------------------------------------------------------
       Preloader
       ------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.getElementById('preloader-progress');

    function revealHero() {
        const heroReveals = document.querySelectorAll('.hero [data-reveal]');
        heroReveals.forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), 120 * i);
        });
    }

    (function runPreloader() {
        let progress = 0;
        const start = Date.now();
        const minDisplay = 500;

        const tick = setInterval(() => {
            progress = Math.min(progress + Math.random() * 18, 92);
            if (preloaderProgress) preloaderProgress.style.width = progress + '%';
        }, 120);

        function finish() {
            clearInterval(tick);
            if (preloaderProgress) preloaderProgress.style.width = '100%';
            const elapsed = Date.now() - start;
            const wait = Math.max(minDisplay - elapsed, 0);
            setTimeout(() => {
                if (preloader) preloader.classList.add('is-hidden');
                revealHero();
            }, wait + 200);
        }

        if (document.readyState === 'complete') {
            finish();
        } else {
            window.addEventListener('load', finish);
            setTimeout(finish, 3500); // safety net if 'load' never fires cleanly
        }
    })();

    /* ---------------------------------------------------------------------
       Profile image load handler
       ------------------------------------------------------------------- */
    const profileImg = document.getElementById('profile-img');
    const profilePlaceholder = document.getElementById('profile-placeholder');
    if (profileImg) {
        const showLoaded = () => {
            profileImg.classList.add('loaded');
            if (profilePlaceholder) profilePlaceholder.style.display = 'none';
        };
        profileImg.addEventListener('load', showLoaded);
        profileImg.addEventListener('error', () => {
            if (profilePlaceholder) profilePlaceholder.style.display = 'flex';
        });
        if (profileImg.complete && profileImg.naturalHeight !== 0) showLoaded();
    }

    /* ---------------------------------------------------------------------
       Custom cursor
       ------------------------------------------------------------------- */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && hasFinePointer) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;

        window.addEventListener('pointermove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        (function trailRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(trailRing);
        })();

        const interactiveSelector = 'a, button, .magnetic, [data-tilt], .skill-tag, input, textarea';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) cursorRing.classList.add('is-active');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) cursorRing.classList.remove('is-active');
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    /* ---------------------------------------------------------------------
       Scroll progress bar + navbar state + active nav link (single scroll
       handler, rAF-throttled)
       ------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIds = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
    const navSections = navIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    let scrollTicking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollProgress) {
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }

        if (navbar) navbar.classList.toggle('is-scrolled', scrollY > 40);

        let current = navSections[0] ? navSections[0].id : '';
        navSections.forEach((section) => {
            if (scrollY >= section.offsetTop - 220) current = section.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.nav === current);
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(onScroll);
            scrollTicking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------------------------------------------------------------------
       Mobile menu
       ------------------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    function toggleMenu() {
        navMenu.classList.toggle('is-active');
        hamburger.classList.toggle('is-active');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
            });
        });
    }

    /* ---------------------------------------------------------------------
       Reveal-on-scroll for [data-reveal]
       (hero elements are revealed separately once the preloader hides)
       ------------------------------------------------------------------- */
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'))
        .filter((el) => !el.closest('.hero'));

    if (hasScrollTrigger && !prefersReducedMotion) {
        revealTargets.forEach((el) => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => el.classList.add('is-visible')
            });
        });
    } else if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------------------------------------------------------------------
       Animated counters
       ------------------------------------------------------------------- */
    const counters = document.querySelectorAll('[data-counter]');
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        const counterIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach((el) => counterIO.observe(el));
    } else {
        counters.forEach((el) => {
            el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
        });
    }

    /* ---------------------------------------------------------------------
       Typed role text
       ------------------------------------------------------------------- */
    const typedEl = document.getElementById('typed-role');
    const roles = ['AI/ML Engineer', 'GenAI & LLM Engineer', 'RAG Systems Builder', 'Agentic AI Engineer', 'MLOps Practitioner'];

    if (typedEl) {
        if (prefersReducedMotion) {
            typedEl.textContent = roles[0];
        } else {
            let roleIndex = 0, charIndex = 0, deleting = false;

            function typeTick() {
                const current = roles[roleIndex];
                if (!deleting) {
                    charIndex++;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === current.length) {
                        deleting = true;
                        setTimeout(typeTick, 1600);
                        return;
                    }
                } else {
                    charIndex--;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === 0) {
                        deleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                    }
                }
                setTimeout(typeTick, deleting ? 35 : 65);
            }
            setTimeout(typeTick, 900);
        }
    }

    /* ---------------------------------------------------------------------
       Experience timeline — scroll-synced progress line
       ------------------------------------------------------------------- */
    const timelineEl = document.querySelector('.timeline');
    const timelineFill = document.getElementById('timeline-fill');

    if (timelineEl && timelineFill) {
        if (hasScrollTrigger && !prefersReducedMotion) {
            gsap.to(timelineFill, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineEl,
                    start: 'top 70%',
                    end: 'bottom 55%',
                    scrub: 0.6
                }
            });
        } else {
            const updateFill = () => {
                const rect = timelineEl.getBoundingClientRect();
                const vh = window.innerHeight;
                const total = rect.height + vh * 0.3;
                const covered = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
                timelineFill.style.height = Math.min((covered / total) * 100, 100) + '%';
            };
            window.addEventListener('scroll', updateFill, { passive: true });
            updateFill();
        }
    }

    /* ---------------------------------------------------------------------
       Magnetic buttons + tilt cards (fine-pointer devices only)
       ------------------------------------------------------------------- */
    if (hasFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('.magnetic').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                if (hasGSAP) {
                    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
                } else {
                    el.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
            el.addEventListener('pointerleave', () => {
                if (hasGSAP) {
                    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
                } else {
                    el.style.transform = 'translate(0, 0)';
                }
            });
        });

        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.style.transform = 'perspective(900px)';
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                const rotateY = px * 10;
                const rotateX = py * -10;
                const glow = card.querySelector('.project-glow');
                if (glow) {
                    glow.style.opacity = '1';
                    glow.style.right = `${(0.5 - px) * 60}%`;
                    glow.style.top = `${(0.5 + py) * 60}%`;
                }
                if (hasGSAP) {
                    gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
                } else {
                    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
            card.addEventListener('pointerleave', () => {
                if (hasGSAP) {
                    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
                } else {
                    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
                }
            });
        });
    }

    /* ---------------------------------------------------------------------
       RAG pipeline stage detail popup
       ------------------------------------------------------------------- */
    const STAGE_CONTENT = {
        ingestion: {
            icon: 'fa-solid fa-file-lines',
            title: 'Ingestion',
            body: "Every RAG pipeline starts with pulling in the raw source material — policy documents, support tickets, and knowledge-base articles for the Enterprise Document Intelligence Assistant I built. I normalize formats and strip noise here so nothing downstream trips over a malformed PDF or an inconsistent field.",
            proof: 'Enterprise Document Intelligence Assistant'
        },
        chunking: {
            icon: 'fa-solid fa-scissors',
            title: 'Chunking',
            body: "Rather than naive fixed-length splits, I break documents into semantically coherent chunks and tag each with metadata (source, section, date). That chunking + metadata filtering strategy cut irrelevant retrieval results and reduced manual document review time.",
            proof: '-34% manual document review time'
        },
        embeddings: {
            icon: 'fa-solid fa-shapes',
            title: 'Embeddings',
            body: "Each chunk gets converted into a vector embedding — using OpenAI or Azure OpenAI embedding models depending on the deployment — that captures its semantic meaning. That's what lets the system match a question to the right content even when the wording doesn't overlap at all.",
            proof: 'OpenAI API / Azure OpenAI'
        },
        vectorstore: {
            icon: 'fa-solid fa-database',
            title: 'Vector Store',
            body: "Embeddings get indexed in a vector database for fast similarity search at scale. I've built with FAISS, ChromaDB, Pinecone, and Weaviate depending on the project's hosting and latency needs.",
            proof: 'FAISS · ChromaDB · Pinecone · Weaviate'
        },
        retrieval: {
            icon: 'fa-solid fa-magnifying-glass',
            title: 'Retrieval',
            body: "At query time, the user's question gets embedded and matched against the vector store by similarity search, combined with metadata filtering to cut noise. This is the work that improved search accuracy on the internal knowledge assistant I built for support teams.",
            proof: '+32% search accuracy'
        },
        llm: {
            icon: 'fa-solid fa-brain',
            title: 'LLM Generation',
            body: "Retrieved context gets passed to an LLM (OpenAI API / Azure OpenAI via LangChain) to generate a grounded answer instead of a hallucinated one. I spend real time on prompt engineering and failure-case testing here, not just the first draft that comes back.",
            proof: '-25% inaccurate responses'
        },
        validated: {
            icon: 'fa-solid fa-circle-check',
            title: 'Validated Answer',
            body: 'Before anything ships, I validate generated answers against the source documents alongside QA — "it sounds right" isn\'t good enough for production. That validation loop is what reduced unsupported LLM responses before rollout.',
            proof: '-26% unsupported LLM responses'
        }
    };

    const stageModal = document.getElementById('stage-modal');
    const stagePanelIcon = document.getElementById('stage-panel-icon');
    const stagePanelTitle = document.getElementById('stage-panel-title');
    const stagePanelBody = document.getElementById('stage-panel-body');
    const stagePanelProof = document.getElementById('stage-panel-proof');

    function openStage(key) {
        const data = STAGE_CONTENT[key];
        if (!stageModal || !data) return;

        stagePanelIcon.innerHTML = `<i class="${data.icon}"></i>`;
        stagePanelTitle.textContent = data.title;
        stagePanelBody.textContent = data.body;
        stagePanelProof.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${data.proof}`;

        stageModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeStage() {
        if (!stageModal) return;
        stageModal.hidden = true;
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.pipeline-node[data-stage]').forEach((btn) => {
        btn.addEventListener('click', () => openStage(btn.dataset.stage));
    });

    if (stageModal) {
        stageModal.querySelectorAll('[data-close-stage]').forEach((el) => {
            el.addEventListener('click', closeStage);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !stageModal.hidden) closeStage();
        });
    }

    /* ---------------------------------------------------------------------
       One-to-one message chat box
       ------------------------------------------------------------------- */
    const CONTACT_PHONE = '12092458426'; // digits only, for the WhatsApp deep link
    const CONTACT_EMAIL = 'srinath.koyi@applywizard.ai';

    const fabMessageBtn = document.getElementById('fab-message');
    const chatModal = document.getElementById('chat-modal');
    const chatForm = document.getElementById('chat-form');
    const chatTextarea = document.getElementById('chat-message');

    function openChat() {
        if (!chatModal) return;
        chatModal.hidden = false;
        document.body.style.overflow = 'hidden';
        setTimeout(() => chatTextarea && chatTextarea.focus(), 50);
    }

    function closeChat() {
        if (!chatModal) return;
        chatModal.hidden = true;
        document.body.style.overflow = '';
    }

    if (fabMessageBtn && chatModal) {
        fabMessageBtn.addEventListener('click', openChat);
        chatModal.querySelectorAll('[data-close-chat]').forEach((el) => {
            el.addEventListener('click', closeChat);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !chatModal.hidden) closeChat();
        });
    }

    if (chatForm) {
        chatForm.querySelectorAll('[data-send-channel]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const message = (chatTextarea.value || '').trim();
                if (!message) {
                    chatTextarea.focus();
                    return;
                }
                const channel = btn.dataset.sendChannel;
                if (channel === 'whatsapp') {
                    window.open(`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
                } else if (channel === 'email') {
                    const subject = encodeURIComponent('Message from your portfolio site');
                    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
                }
                chatTextarea.value = '';
                closeChat();
            });
        });
    }

    /* ---------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------- */
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
