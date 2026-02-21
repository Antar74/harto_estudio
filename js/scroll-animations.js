// Scroll Animations for MANIFIESTO page
// Based on Codrops ScrollAnimationsGrid Demo 3

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and Lenis are loaded
    if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
        console.error('GSAP or Lenis not loaded');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Get all project elements
    const projectElements = [...document.querySelectorAll('.project')];
    
    if (projectElements.length === 0) {
        console.warn('No project elements found');
        return;
    }

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
        lerp: 0.1,        // Smooth interpolation factor
        smooth: true,     // Enable smooth scroll
        duration: 1.2,    // Scroll duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Animation frame loop for Lenis
    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Apply animations to each project (exclude project--1)
    projectElements.forEach((project, index) => {
        // Skip project--1 (index 0)
        if (index === 0) return;
        
        const imgWrap = project.querySelector('.project__img-wrap');
        const img = project.querySelector('img');
        
        if (!imgWrap || !img) {
            console.warn(`Project ${index + 1} missing image elements`);
            return;
        }

        // Generate random horizontal movement for reduced intensity
        const xPercentRandomVal = gsap.utils.random(-25, 25); // Reduced intensity: -25% to +25%
        
        // Create timeline for this project
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: project,
                start: "top bottom",    // When project top hits viewport bottom
                end: "bottom top",      // When project bottom hits viewport top
                scrub: true,            // Smooth scroll-linked animation
                invalidateOnRefresh: true
            }
        });

        // Set initial state and transform origin
        tl.set(imgWrap, {
            transformOrigin: `${xPercentRandomVal < 0 ? 0 : 100}% 100%`,
            scale: 0.8,                // Start slightly smaller
            opacity: 0                // Start invisible
        });

        // Enter animation: scale up and fade in
        tl.to(imgWrap, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });

        // Exit animation: scale down and move horizontally
        tl.to(imgWrap, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        }, "+=0.2"); // Start exit animation after 0.2s of being fully visible

        // Horizontal movement for exit
        tl.to(project, {
            xPercent: xPercentRandomVal,
            duration: 0.4,
            ease: "power2.in"
        }, "-=0.4"); // Sync with scale animation

        // Add slight rotation for more dynamic effect
        tl.to(imgWrap, {
            rotation: gsap.utils.random(-5, 5),
            duration: 0.4,
            ease: "power2.in"
        }, "-=0.4");

        // Create separate ScrollTrigger for horizontal movement
        gsap.to(project, {
            xPercent: xPercentRandomVal,
            ease: 'none',
            scrollTrigger: {
                trigger: project,
                start: "center bottom",
                end: "center top",
                scrub: true
            }
        });
    });

    // Remove loading class when animations are ready
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);

    // Handle window resize
    ScrollTrigger.addEventListener('refresh', () => {
        lenis.resize();
    });

    // Initial refresh
    ScrollTrigger.refresh();
});