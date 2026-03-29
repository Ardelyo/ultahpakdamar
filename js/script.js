gsap.registerPlugin(ScrollTrigger);

/* =========================================
   1. SMOOTH SCROLL (Lenis)
   ========================================= */
const lenis = new Lenis({
    duration: 1.8, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0, 0);

/* =========================================
   2. CUSTOM CURSOR
   ========================================= */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

// Check if device is touch-capable
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Ring follows with easing
    gsap.ticker.add(() => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    });
}

// Add hover logic for interactive elements
const attachHoverEffects = () => {
    if (isTouchDevice) return; // Skip hover effects on touch devices
    const interactives = document.querySelectorAll('.interactive-hover, .polaroid, .reveal-word.highlight');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover-active'));
    });
};

/* =========================================
   3. MAGIC DUST (Canvas Particles)
   ========================================= */
const canvas = document.getElementById('magic-dust');
const ctx = canvas.getContext('2d');
let particles =[];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        // Slightly affected by mouse position (subtle parallax)
        let dx = (mouseX - canvas.width/2) * 0.001;
        this.x += this.speedX + dx;
        this.y += this.speedY;

        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(251, 191, 36, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const isMobileDevice = window.innerWidth < 768;
const particleCount = isMobileDevice ? 40 : 70;
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* =========================================
   3.1 STAR FIELD (Act 5)
   ========================================= */
const starField = document.getElementById('star-field');
const sCtx = starField.getContext('2d');
let stars = [];

function resizeStars() {
    starField.width = window.innerWidth;
    starField.height = window.innerHeight;
}
window.addEventListener('resize', resizeStars);
resizeStars();

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * starField.width;
        this.y = Math.random() * starField.height;
        this.size = Math.random() * 1.5;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.8 + 0.2;
        this.speed = Math.random() * 0.02 + 0.01;
    }
    draw() {
        sCtx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sCtx.fill();
        this.alpha += this.speed;
        if (this.alpha > this.maxAlpha || this.alpha < 0) this.speed *= -1;
    }
}

const starCount = isMobileDevice ? 80 : 150;
for (let i = 0; i < starCount; i++) stars.push(new Star());

function animateStars() {
    sCtx.clearRect(0, 0, starField.width, starField.height);
    stars.forEach(s => s.draw());
    requestAnimationFrame(animateStars);
}
animateStars();

/* =========================================
   4. GLOBAL COLOR SHIFT (Blue to Warm Festivity)
   ========================================= */
/* =========================================
   4. GLOBAL COLOR SHIFT (Instant "Cuts")
   ========================================= */
const setColors = (c1, c2, c3) => {
    gsap.set(":root", { "--color-1": c1, "--color-2": c2, "--color-3": c3 });
};

// Act 1: Initial (Blue/Deep)
setColors("#1e3a8a", "#3b82f6", "#0f172a");

// Initialize all scenes to visible with correct initial opacity to prevent "disappearing" bug
gsap.set(["#gateway", "#polaroidScene", "#impactScene", "#sceneQuotes", "#horizon"], { opacity: 1, visibility: "visible" });

// Cuts based on scroll position
ScrollTrigger.create({
    trigger: "#polaroidScene", start: "top 50%",
    onEnter: () => setColors("#6d28d9", "#8b5cf6", "#1e1b4b"), // Purple Transition
    onLeaveBack: () => setColors("#1e3a8a", "#3b82f6", "#0f172a")
});

ScrollTrigger.create({
    trigger: "#impactScene", start: "top 50%",
    onEnter: () => setColors("#ea580c", "#f59e0b", "#431407"), // Warm/Orange
    onLeaveBack: () => setColors("#6d28d9", "#8b5cf6", "#1e1b4b")
});

/* =========================================
   5. ACT 1: THE GATEWAY
   ========================================= */
const portalText = document.querySelector('.portal-text');
const gatewayTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#gateway", 
        start: "top top", 
        end: "+=150%", 
        pin: true, 
        scrub: 1,
        onLeave: () => gsap.set("#gateway", { pointerEvents: "none" }),
        onLeaveBack: () => gsap.set("#gateway", { pointerEvents: "auto", opacity: 1 })
    }
});

// INITIAL SETTINGS
gsap.set(portalText, { scale: 1, opacity: 1 });

gatewayTl.to("#gatewaySubtitle", { opacity: 0, y: -20, duration: 0.5 }, 0);
gatewayTl.to(portalText, { 
    scale: 150, 
    opacity: 0,
    ease: "expo.in", 
    duration: 5 
}, 0);

gatewayTl.to("#gateway", { 
    autoAlpha: 0,
    duration: 0.5, 
    ease: "power2.in"
}, 4.5);

/* =========================================
   6. ACT 2: 3D POLAROID RUSH + PARALLAX
   ========================================= */
const polaroidCam = document.getElementById('polaroidCam');
const imageUrls = [
    "assets/image1.webp",
    "assets/image2.webp",
    "assets/image3.webp",
    "assets/image4.webp",
    "assets/image5.webp",
    "assets/image6.webp",
    "assets/image7.webp",
    "assets/image8.webp",
    "assets/image9.webp",
    "assets/image10.webp"
];
const funCaptions =["Tawa", "Diskusi", "Mimpi", "Tugas Terlambat", "Inspirasi", "Numpang Ngadem", "Ide Gila", "Jejak", "Cerita", "Semangat"];

imageUrls.forEach((url, i) => {
    const div = document.createElement('div');
    div.className = 'polaroid interactive-hover'; // Tambah kelas agar bereaksi saat mouseover
    div.innerHTML = `
        <div class="polaroid-img-wrapper">
            <img src="${url}" alt="Memory ${i+1}">
        </div>
        <div class="polaroid-caption">${funCaptions[i % funCaptions.length]}</div>
    `;
    polaroidCam.appendChild(div);
});

// Kamera Parallax Mengikuti Mouse (Disabled on Touch)
if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        const xRot = (e.clientX / window.innerWidth - 0.5) * 20; // max 10deg
        const yRot = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(polaroidCam, {
            rotationY: xRot, rotationX: -yRot, 
            ease: "power2.out", duration: 1.5
        });
    });
}

const polaroids = gsap.utils.toArray('.polaroid');
const rushTl = gsap.timeline({
    scrollTrigger: { trigger: "#polaroidScene", start: "top top", end: "+=3000", scrub: 0.5, pin: true }
});

rushTl.to("#polaroidBgText", { z: -1000, scale: 1.2, opacity: 0.1, ease: "none" }, 0);

polaroids.forEach((p, i) => {
    const isMobile = window.innerWidth < 768;
    const xSpread = isMobile ? window.innerWidth * 0.35 : window.innerWidth * 0.7;
    const ySpread = isMobile ? window.innerHeight * 0.5 : window.innerHeight * 0.5;
    
    const xPos = gsap.utils.random(-xSpread, xSpread);
    const yPos = gsap.utils.random(-ySpread, ySpread);
    const startZ = isMobile ? gsap.utils.random(-3000, -1500) : gsap.utils.random(-5000, -3000); 
    const endZ = isMobile ? 1500 : 1200; // Fly further past camera on mobile
    const rot = gsap.utils.random(-30, 30);

    // Simpan variabel state awal via custom attribute
    p.dataset.z = startZ; p.dataset.rot = rot; p.dataset.x = xPos;

    gsap.set(p, {
        x: xPos, y: yPos, z: startZ, rotationZ: rot,
        xPercent: -50, yPercent: -50, opacity: 0,
        filter: "blur(20px) brightness(0.5)"
    });

    const startTime = i * 0.08; 
    rushTl.to(p, { z: endZ, rotationZ: rot + (xPos > 0 ? 20 : -20), ease: "power3.in", duration: 2 }, startTime);
    rushTl.to(p, { opacity: 1, filter: "blur(0px) brightness(1)", ease: "power1.inOut", duration: 1.2 }, startTime);
    rushTl.to(p, { opacity: 0, filter: "blur(15px)", ease: "power2.in", duration: 0.3 }, startTime + 1.7);
});

/* =========================================
   7. ACT 3: THE IMPACT (Text Scrub Reveal)
   ========================================= */
const revealTextEl = document.getElementById("revealText");
const words = revealTextEl.innerText.trim().split(/\s+/);

// Single initialization check
if (!revealTextEl.querySelector('.reveal-word')) {
    revealTextEl.innerHTML = "";
    words.forEach(word => {
        const span = document.createElement("span");
        span.className = "reveal-word";
        const wLower = word.toLowerCase();
        if(wLower.includes("pengajar") || wLower.includes("ide-ide") || wLower.includes("arsitek") || wLower.includes("keberanian") || wLower.includes("menyenangkan") || wLower.includes("usia") || wLower.includes("selamat")) {
            span.classList.add("highlight");
        }
        span.innerText = word;
        revealTextEl.appendChild(span);
    });
}

// Cinematic Reveal: Blur to Focus + Slowdown
const impactWords = gsap.utils.toArray(".reveal-word");
const impactTl = gsap.timeline({
    scrollTrigger: { 
        trigger: "#impactScene", 
        start: "top top", 
        end: "+=3000", // Extra long for reading speed
        pin: true, 
        scrub: 1 
    }
});

impactTl.fromTo(impactWords, 
    { 
        opacity: 0.1, // Increased from 0 to be slightly visible
        filter: "blur(10px)", // Reduced from 20px
        scale: 0.9,
        color: "rgba(255,255,255,0.2)"
    },
    { 
        opacity: 1, 
        filter: "blur(0px)", 
        scale: 1.0, 
        color: "#ffffff",
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out", 
        immediateRender: false,
        onStart: function() {
            // This context is the individual tween within the stagger
            // Get the element being animated
            this.targets().forEach(el => el.classList.add('active'));
        }
    }
);

// Highlighting words: stronger glow and solid color
impactTl.to(".reveal-word.highlight", {
    color: "#FBBF24",
    textShadow: "0 0 40px rgba(251, 191, 36, 0.9)",
    fontWeight: 700,
    duration: 0.5,
    stagger: 0.1
}, "-=0.3");

/* =========================================
   8. ACT 4: INTERACTIVE ENVELOPES
   ========================================= */
const envelopes = gsap.utils.toArray('.envelope');
const quotesTl = gsap.timeline({
    scrollTrigger: { trigger: "#sceneQuotes", start: "top top", end: "+=3000", pin: true, scrub: 1 }
});

envelopes.forEach((env, i) => {
    // Initial reveal of the envelope - cascading
    quotesTl.fromTo(env, 
        { opacity: 0, y: 150, z: -500, rotationX: -45, scale: 0.8 },
        { opacity: 1, y: 0, z: 0, rotationX: 0, scale: 1, duration: 2, ease: "expo.out" }
    );
    quotesTl.to({}, { duration: 1 }); // Pause for each envelope
    if (i !== envelopes.length - 1) {
        quotesTl.to(env, { opacity: 0, y: -100, scale: 1.1, duration: 1, ease: "power3.in" });
    }

    // Interactive Trigger: Open on Click
    env.addEventListener('click', (e) => {
        // If clicking inside the card when it's open, don't toggle (unless clicking a close button, but we don't have one)
        if (env.classList.contains('is-open') && e.target.closest('.letter-content')) {
            return;
        }

        const isOpen = env.classList.toggle('is-open');
        
        // Hide mobile hint after first interaction
        const mobileHint = document.getElementById('mobileHint');
        if (mobileHint) {
            gsap.to(mobileHint, { opacity: 0, duration: 0.5, onComplete: () => mobileHint.style.display = 'none' });
        }
        
        if (isOpen) {
            // Initial animation pop, then let CSS handle the rest
            gsap.fromTo(env.querySelector('.envelope-card'), 
                { opacity: 0, scale: 0.8, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.75)" }
            );
            // Add a little shake to the envelope
            gsap.to(env, { rotationZ: "random(-2, 2)", duration: 0.1, repeat: 3, yoyo: true });
        } else {
            const card = env.querySelector('.envelope-card');
            gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.in", onComplete: () => {
                const scrollArea = card.querySelector('.letter-content');
                if (scrollArea) scrollArea.scrollTop = 0;
            }});
        }
    });
});

/* =========================================
   9. ACT 5: THE CELEBRATION (Confetti + Final)
   ========================================= */
let confettiFired = false;
function triggerConfetti() {
    if(confettiFired) return;
    confettiFired = true;
    let duration = 3 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
            colors:['#ea580c', '#f59e0b', '#ffffff', '#FBBF24']
        });
        confetti({
            particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
            colors:['#ea580c', '#f59e0b', '#ffffff', '#FBBF24']
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

const horizonTl = gsap.timeline({
    scrollTrigger: { 
        trigger: "#horizon", start: "top 50%", end: "bottom bottom", scrub: 1,
        onEnter: triggerConfetti // Panggil efek confetti saat masuk ke seksi ini
    }
});

// horizonTl.to("#horizonGlow", { opacity: 1, scale: 1.5, duration: 2 }, 0); // Removed for sharper transitions
horizonTl.fromTo(".final-quote-line1", { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "back.out(1.7)" }, 0.2);
horizonTl.fromTo(".final-quote-line2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.8);
horizonTl.fromTo(".final-quote-line3", { y: 80, opacity: 0, filter: "blur(20px)", rotationX: 20 }, { y: 0, opacity: 1, filter: "blur(0px)", rotationX: 0, duration: 2, ease: "power4.out" }, 1.4);
horizonTl.fromTo("#finalCredit", { opacity: 0, y: 30, letterSpacing: "1em" }, { opacity: 1, y: 0, letterSpacing: "0.3em", duration: 2, ease: "power2.out" }, 3);

// Star Field Activation Trigger
ScrollTrigger.create({
    trigger: "#horizon",
    start: "top 20%",
    onEnter: () => document.body.classList.add('show-stars'),
    onLeaveBack: () => document.body.classList.remove('show-stars')
});

// Pasang event pendeteksi hover kursor
attachHoverEffects();

/* =========================================
   10. MUSIC CONTROL LOGIC
   ========================================= */
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-control');
const musicText = musicToggle.querySelector('.music-text');
let isInitialPlay = true;

// Persistence
const musicState = localStorage.getItem('music_enabled');
if (musicState === 'false') {
    bgMusic.muted = true;
    musicToggle.classList.add('muted');
    musicText.innerText = "PAUSED";
}

const togglePlay = () => {
    if (bgMusic.paused || bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().catch(e => console.log("User interaction required"));
        musicToggle.classList.remove('muted');
        musicToggle.classList.add('playing');
        musicText.innerText = "PLAYING";
        localStorage.setItem('music_enabled', 'true');
    } else {
        bgMusic.pause();
        musicToggle.classList.add('muted');
        musicToggle.classList.remove('playing');
        musicText.innerText = "PAUSED";
        localStorage.setItem('music_enabled', 'false');
    }
};

musicToggle.addEventListener('click', togglePlay);

// Autoplay initialization on first interaction
const initAudio = () => {
    if (isInitialPlay && localStorage.getItem('music_enabled') !== 'false') {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicToggle.classList.add('playing');
                musicText.innerText = "PLAYING";
            }).catch(ae => {
                console.log("Audio play blocked by browser. User must click first.");
            });
        }
        isInitialPlay = false;
    }
    // Only remove listeners if audio actually started playing or if we've tried once
    if (!isInitialPlay) {
        window.removeEventListener('scroll', initAudio);
        window.removeEventListener('click', initAudio);
        window.removeEventListener('touchstart', initAudio);
    }
};

window.addEventListener('scroll', initAudio, { passive: true });
window.addEventListener('click', initAudio, { passive: true });
window.addEventListener('touchstart', initAudio, { passive: true });

/* =========================================
   11. CINEMATIC AUTOPLAY ENGINE
   ========================================= */
const autoplayToggle = document.getElementById('autoplay-control');
const autoplayText = autoplayToggle.querySelector('.music-text');
let isAutoplay = false;
let autoplayTimeline = null;

const stopAutoplay = () => {
    isAutoplay = false;
    autoplayToggle.classList.remove('active');
    autoplayText.innerText = "CINEMATIC MODE";
    if (autoplayTimeline) {
        autoplayTimeline.kill();
        autoplayTimeline = null;
    }
    // Close any open envelopes
    const openEnvelopes = document.querySelectorAll('.envelope.is-open');
    openEnvelopes.forEach(env => {
        env.classList.remove('is-open');
        const card = env.querySelector('.envelope-card');
        if (card) gsap.set(card, { opacity: 0, scale: 0.9, y: 50 });
    });
    lenis.start();
};

const startAutoplay = () => {
    isAutoplay = true;
    autoplayToggle.classList.add('active');
    autoplayText.innerText = "PLAYING TOUR";
    lenis.stop(); // Stop manual scrolling
    
    // Ensure music is playing
    if (bgMusic.paused) togglePlay();

    autoplayTimeline = gsap.timeline({
        onComplete: stopAutoplay
    });

    // 1. Initial Scroll to Top
    autoplayTimeline.to(window, {
        duration: 2,
        scrollTo: { y: 0, autoKill: false },
        ease: "power2.inOut"
    });

    // 2. Section Sequence: Gateway -> Polaroid -> Impact -> Quotes
    
    // 1. Initial Reset & Audio
    autoplayTimeline.add(() => {
        if (bgMusic.paused) togglePlay();
        // Force reset any open interactions
        envelopes.forEach(e => e.classList.remove('autoplay-active', 'is-open'));
    });

    // 2. Gateway Progress
    autoplayTimeline.to(gatewayTl, { progress: 1, duration: 5, ease: "slow(0.7, 0.7, false)" });

    // 3. Polaroid Progress
    autoplayTimeline.to(rushTl, { progress: 1, duration: 10, ease: "none" }, "+=0.5");

    // 4. Impact Progress
    autoplayTimeline.to(impactTl, { progress: 1, duration: 8, ease: "none" }, "+=0.5");

    // 5. Envelope Sequence (Manual Drive)
    envelopes.forEach((env, i) => {
        // Move to envelopes
        autoplayTimeline.to(quotesTl, { progress: (i + 1) / envelopes.length, duration: 3, ease: "power2.inOut" }, "+=1");
        
        // Open
        autoplayTimeline.add(() => {
            env.classList.add('autoplay-active');
        }, "+=0.5");

        autoplayTimeline.to({}, { duration: 1.5 }); // Animation wait

        const scrollArea = env.querySelector('.letter-content');
        if (scrollArea && env.classList.contains('envelope--long')) {
            autoplayTimeline.to(scrollArea, {
                scrollTop: scrollArea.scrollHeight - scrollArea.clientHeight,
                duration: 10,
                ease: "none"
            }, "+=0.5");
            autoplayTimeline.to({}, { duration: 2 }); 
        } else {
            autoplayTimeline.to({}, { duration: 4 }); 
        }

        // Close
        autoplayTimeline.add(() => {
            env.classList.remove('autoplay-active');
        }, "+=0.5");
    });

    // 6. Final Horizon
    autoplayTimeline.to(horizonTl, { progress: 1, duration: 5, ease: "power1.out" }, "+=1");
};

autoplayToggle.addEventListener('click', () => {
    if (isAutoplay) stopAutoplay();
    else startAutoplay();
});

// Manual Override: Stop if user interacts
const handleManualInteraction = () => {
    if (isAutoplay) {
        console.log("Manual interaction detected, stopping autoplay...");
        stopAutoplay();
    }
};

window.addEventListener('wheel', handleManualInteraction, { passive: true });
window.addEventListener('touchstart', handleManualInteraction, { passive: true });
window.addEventListener('keydown', handleManualInteraction, { passive: true });