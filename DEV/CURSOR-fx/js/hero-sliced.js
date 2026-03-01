/**
 * Optimized Sliced Text Effect for "Harto _ estudio" Logo
 * Staggered animation with Effect 1 - Horizontal Slide
 * Integrated with original hero.css positioning and styling
 */

class SlicedTextItem {
    constructor(DOM_el, totalCells = null) {
        this.DOM = {
            el: DOM_el,
            inner: null,
            innerWrap: null
        };
        
        const cssSplits = getComputedStyle(DOM_el).getPropertyValue('--gsplits');
        if (cssSplits) {
            this.totalCells = parseInt(cssSplits.trim(), 10);
        } else {
            this.totalCells = totalCells || 6;
        }
        
        // Special handling for dash character
        if (DOM_el.dataset.text === '_') {
            this.totalCells = 8; // Extra slices for dash visibility
        }
        
        this.layout();
        this.setCSSValues();
        this.setInitialState();
    }
    
    layout() {
        let newHTML = '';
        for (let i = 0; i < this.totalCells; ++i) {
            newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${this.DOM.el.dataset.text}</span></span>`;
        }
        this.DOM.el.innerHTML = newHTML;
        this.DOM.innerWrap = this.DOM.el.querySelectorAll('.gtext__box');
        this.DOM.inner = this.DOM.el.querySelectorAll('.gtext__box-inner');
    }
    
    setCSSValues() {
        const computedWidth = window.getComputedStyle(this.DOM.inner[0]).width;
        this.DOM.el.style.setProperty('--text-width', computedWidth);
        this.DOM.el.style.setProperty('--gsplits', this.totalCells);
        
        const offset = parseFloat(computedWidth) / this.totalCells;
        this.DOM.inner.forEach((inner, pos) => {
            gsap.set(inner, { left: offset * -pos });
        });
        
        this.DOM.innerWrap.forEach((box) => {
            box.style.width = `${offset}px`;
        });
    }
    
    setInitialState() {
        // Start with text apart and visible
        gsap.set(this.DOM.inner, {
            xPercent: (pos) => {
                // Effect 1: Clean horizontal slide apart
                if (pos < this.totalCells/2) {
                    return -15 * (pos + 1); // Left slices move left
                } else {
                    return 15 * (pos - this.totalCells/2 + 1); // Right slices move right
                }
            },
            opacity: 0
        });
    }
    
    autoReveal(delay = 0) {
        return gsap.to(this.DOM.inner, {
            xPercent: 0,
            opacity: 1,
            duration: 1.6, // Slower animation as requested
            stagger: 0.05, // Staggered slice reveal
            ease: 'power2.out',
            delay: delay
        });
    }
    
    scrollDisappear() {
        return gsap.to(this.DOM.inner, {
            xPercent: (pos) => {
                // Effect 1: Horizontal slide apart
                if (pos < this.totalCells/2) {
                    return -20 * (pos + 1); // Left slices move left
                } else {
                    return 20 * (pos - this.totalCells/2 + 1); // Right slices move right
                }
            },
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '15% top',
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }
}

class HeroSlicedText {
    constructor() {
        this.items = [];
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            return;
        }
        
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Find all logo lines with sliced text effect
        const textElements = document.querySelectorAll('.hero__logo-line.gtext');
        
        if (textElements.length === 0) {
            return;
        }
        
        // Create sliced text items for each line
        textElements.forEach((element, index) => {
            const item = new SlicedTextItem(element);
            this.items.push(item);
        });
        
        // Remove loading class after structure is ready
        document.body.classList.remove('loading');
        
        // Start animations after short delay
        setTimeout(() => {
            this.startAnimations();
        }, 300);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        this.isInitialized = true;
    }
    
    startAnimations() {
        // Create a timeline for coordinated animations
        const tl = gsap.timeline();
        
        // Auto-reveal each line with staggered timing
        this.items.forEach((item, index) => {
            tl.add(item.autoReveal(index * 0.1), index * 0.1);
        });
        
        // Add scroll disappear animations for all elements
        this.items.forEach(item => {
            item.scrollDisappear();
        });
        
        return tl;
    }
    
    handleResize() {
        this.items.forEach(item => {
            item.setCSSValues();
        });
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
    
    destroy() {
        // Remove resize listener
        window.removeEventListener('resize', this.handleResize);
        
        // Kill all ScrollTrigger instances
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.killAll();
        }
        
        this.items = [];
        this.isInitialized = false;
    }
}

class SectionSlicedText {
    constructor() {
        this.items = [];
        this.isInitialized = false;
        this.resizeTimeout = null;
        this.init();
    }
    
    init() {
        if (typeof gsap === 'undefined') {
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        const textElements = document.querySelectorAll('.oficina__title .gtext');
        
        if (textElements.length === 0) {
            return;
        }
        
        textElements.forEach((element, index) => {
            const item = new SlicedTextItem(element);
            this.items.push(item);
        });
        
        setTimeout(() => {
            this.startAnimations();
        }, 300);
        
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        this.isInitialized = true;
    }
    
    startAnimations() {
        this.items.forEach((item, index) => {
            const parentSection = item.DOM.el.closest('.oficina');
            
            if (parentSection) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: parentSection,
                        start: 'top 70%',
                        toggleActions: 'play',
                        invalidateOnRefresh: true
                    }
                });
                
                tl.add(item.autoReveal(0), 0);
            }
        });
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const textElements = document.querySelectorAll('.oficina__title .gtext');
            let needsRecreation = false;
            
            textElements.forEach((el, idx) => {
                if (this.items[idx]) {
                    const currentSplits = this.items[idx].totalCells;
                    const cssSplits = parseInt(getComputedStyle(el).getPropertyValue('--gsplits').trim(), 10);
                    if (currentSplits !== cssSplits) {
                        needsRecreation = true;
                    }
                }
            });
            
            if (needsRecreation) {
                this.destroy();
                this.init();
            } else {
                this.items.forEach(item => {
                    item.setCSSValues();
                });
            }
            
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 200);
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.killAll();
        }
        
        this.items = [];
        this.isInitialized = false;
    }
}

/**
 * Initialize sliced text effect when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure everything is ready
    setTimeout(() => {
        window.heroSlicedText = new HeroSlicedText();
        window.sectionSlicedText = new SectionSlicedText();
        
    }, 100);
});

/**
 * Handle page visibility changes for better performance
 */
document.addEventListener('visibilitychange', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (window.heroSlicedText) {
        window.heroSlicedText.destroy();
    }
    if (window.sectionSlicedText) {
        window.sectionSlicedText.destroy();
    }
});