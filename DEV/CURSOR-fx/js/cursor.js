import { getMousePos, getWinSize, isFirefox } from './cursor-utils.js';

let mousepos = {x: 0, y: 0};

const updateMousePos = ev => {
    mousepos = getMousePos(ev);
};
  
window.addEventListener('mousemove', updateMousePos);
window.addEventListener('pointermove', updateMousePos, { passive: true });

let winsize = getWinSize();

window.addEventListener('resize', () => {
    winsize = getWinSize();
});

export class GooCursor {
    DOM = {
        el: null,
        inner: null,
        cells: null,
    };
    cellSize;
    rows;
    columns;
    settings = {
        ttl: 0.2
    };

    constructor(DOM_el) {
        this.DOM.el = DOM_el;
        this.DOM.inner = this.DOM.el.querySelector('.cursor__inner');

        if ( !isFirefox() ) {
            this.DOM.inner.style.filter = 'url(#gooey)';
        }

        this.settings.ttl = this.DOM.el.getAttribute('data-ttl') || this.settings.ttl;
        
        this.layout();
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('resize', () => this.layout());

        const handleMove = () => {
            const cell = this.getCellAtCursor();
          
            if (cell === null || this.cachedCell === cell) return;
            this.cachedCell = cell;
            gsap.set(cell, { opacity: 1 });
            gsap.to(cell, { duration: 0.4, ease: 'power1', opacity: 0, delay: this.settings.ttl });
        }

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('pointermove', handleMove, { passive: true });
    }

    layout() {
        this.columns = parseInt(getComputedStyle(this.DOM.el).getPropertyValue('--columns')) || 25;
        this.cellSize = winsize.width / this.columns;
        this.rows = Math.ceil(winsize.height / this.cellSize);
        this.cellsTotal = this.rows * this.columns;
        
        let innerStr = '';
        this.DOM.inner.innerHTML = '';
        
        const customColorsAttr = this.DOM.el.getAttribute('data-custom-colors');
        let customColorsArr;
        let customColorsTotal = 0;
        if ( customColorsAttr ) {
            customColorsArr = this.DOM.el.getAttribute('data-custom-colors').split(',');
            customColorsTotal = customColorsArr ? customColorsArr.length : 0;
        }
        
        for (let i = 0; i < this.cellsTotal; ++i) {
            const row = Math.floor(i / this.columns);
            const col = i % this.columns;
            const x = col * this.cellSize;
            const y = row * this.cellSize;
            
            if (customColorsTotal === 0) {
                innerStr += `<div class="cursor__inner-box" style="left:${x}px;top:${y}px;width:${this.cellSize}px;height:${this.cellSize}px;"></div>`;
            } else {
                const scale = gsap.utils.random(0.5, 2);
                const color = customColorsArr[Math.round(gsap.utils.random(0, customColorsTotal - 1))];
                innerStr += `<div class="cursor__inner-box" style="left:${x}px;top:${y}px;width:${this.cellSize}px;height:${this.cellSize}px;transform:scale(${scale});background:${color};"></div>`;
            }
        }
        
        this.DOM.inner.innerHTML = innerStr;
        this.DOM.cells = this.DOM.inner.children;
    }

    getCellAtCursor() {
        const columnIndex = Math.floor(mousepos.x / this.cellSize);
        const rowIndex = Math.floor(mousepos.y / this.cellSize);
        const cellIndex = rowIndex * this.columns + columnIndex;

        if ( cellIndex >= this.cellsTotal || cellIndex < 0 ) {
            return null;
        }

        return this.DOM.cells[cellIndex];
    }
}
