// Combined Gooey Cursor Effect - Exact Codrops Reference Implementation
(function() {
    'use strict';
    
    // Utils
    const getMousePos = e => ({ x: e.clientX, y: e.clientY });
    const getWinSize = () => ({ width: window.innerWidth, height: window.innerHeight });
    const isFirefox = () => navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // State
    let mousepos = { x: 0, y: 0 };
    let winsize = getWinSize();
    
    // Mouse tracking
    window.addEventListener('mousemove', e => { mousepos = getMousePos(e); });
    window.addEventListener('pointermove', e => { mousepos = getMousePos(e); }, { passive: true });
    window.addEventListener('resize', () => { winsize = getWinSize(); });
    
    // GooCursor Class - Matches Codrops implementation exactly
    class GooCursor {
        constructor(DOM_el) {
            this.DOM = {
                el: DOM_el,
                inner: DOM_el.querySelector('.cursor__inner'),
                cells: null
            };
            this.cellSize = 0;
            this.rows = 0;
            this.columns = 0;
            this.cachedCell = null;
            this.settings = { ttl: 0.2 };
            
            // Apply filter (skip for Firefox)
            if (!isFirefox()) {
                this.DOM.inner.style.filter = 'url(#gooey)';
            }
            
            this.settings.ttl = this.DOM.el.getAttribute('data-ttl') || 0.4; // Increased for longer trail
            this.layout();
            this.initEvents();
        }
        
        initEvents() {
            window.addEventListener('resize', () => this.layout());
            
            const handleMove = () => {
                const cell = this.getCellAtCursor();
                if (cell === null || this.cachedCell === cell) return;
                this.cachedCell = cell;
                
                if (typeof gsap !== 'undefined') {
                    gsap.set(cell, { opacity: 1 });
                    gsap.to(cell, { duration: 0.6, ease: 'power2', opacity: 0, delay: this.settings.ttl });
                } else {
                    cell.style.opacity = 1;
                    setTimeout(() => { cell.style.opacity = 0; }, this.settings.ttl * 1000);
                }
            };
            
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('pointermove', handleMove, { passive: true });
        }
        
        layout() {
            // Get columns from CSS variable
            const columnsVar = getComputedStyle(this.DOM.el).getPropertyValue('--columns');
            this.columns = parseInt(columnsVar) || 25;
            
            // Calculate cell size from CSS --size variable
            this.cellSize = winsize.width / this.columns;
            this.rows = Math.ceil(winsize.height / this.cellSize);
            this.cellsTotal = this.rows * this.columns;
            
            // Build cells - simple grid cells without any styling
            let innerStr = '';
            this.DOM.inner.innerHTML = '';
            
            for (let i = 0; i < this.cellsTotal; i++) {
                // Simple cell - border-radius controlled by CSS --cursor-radius variable
                innerStr += '<div class="cursor__inner-box"></div>';
            }
            
            this.DOM.inner.innerHTML = innerStr;
            this.DOM.cells = this.DOM.inner.children;
        }
        
        getCellAtCursor() {
            const columnIndex = Math.floor(mousepos.x / this.cellSize);
            const rowIndex = Math.floor(mousepos.y / this.cellSize);
            const cellIndex = rowIndex * this.columns + columnIndex;
            
            if (cellIndex >= this.cellsTotal || cellIndex < 0) return null;
            return this.DOM.cells[cellIndex];
        }
    }
    
    // Initialize on DOM ready
    function init() {
        const cursorEl = document.querySelector('.cursor');
        if (!cursorEl) {
            console.error('Gooey Cursor: Cursor element not found');
            return;
        }
        
        console.log('Gooey Cursor: Initializing...');
        
        const goo = new GooCursor(cursorEl);
        
        // Click radial effect - half duration as requested
        window.addEventListener('click', () => {
            if (typeof gsap === 'undefined') return;
            
            const clickedCell = goo.getCellAtCursor();
            if (!clickedCell || !goo.DOM.cells) return;
            
            const startIndex = [...goo.DOM.cells].indexOf(clickedCell);
            
            gsap.timeline()
                .addLabel('start', 0)
                .to(goo.DOM.cells, {
                    duration: 0.8,
                    ease: 'power3',
                    opacity: 1,
                    stagger: {
                        from: startIndex,
                        each: 0.015,
                        grid: [goo.rows, goo.columns]
                    }
                }, 'start')
                .to(goo.DOM.cells, {
                    duration: 0.8,
                    ease: 'power2',
                    opacity: 0,
                    stagger: {
                        from: startIndex,
                        each: 0.02,
                        grid: [goo.rows, goo.columns]
                    }
                }, 'start+=0.3');
        });
        
        console.log('Gooey Cursor: Initialized!');
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
