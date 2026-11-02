class MasonryGrid {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.items = options.items || [];
        this.hasMounted = false;
        this.resizeObserver = null;
        this.width = 0;
        this.height = 0;
        this.activeFeaturedId = null;
        this.isMobile = window.innerWidth < 768;

        // Initialize HUD elements
        this.hudEl = null;
        this.modalEl = null;

        this.init();
    }

    async init() {
        // Add CSS styling rules
        this.injectStyles();

        // Setup Modal (shared between desktop and mobile)
        this.createModal();

        if (this.isMobile) {
            this.initMobile();
        } else {
            this.initDesktop();
        }
    }

    // ===================== MOBILE: Auto-scrolling dual marquee =====================
    initMobile() {
        this.container.className = 'marquee-showcase';

        // Split items into two rows
        const half = Math.ceil(this.items.length / 2);
        const row1Items = this.items.slice(0, half);
        const row2Items = this.items.slice(half);

        // Build a marquee row: duplicate content for seamless loop
        const buildRow = (items, directionClass) => {
            const row = document.createElement('div');
            row.className = `marquee-row ${directionClass}`;

            const track = document.createElement('div');
            track.className = 'marquee-track';

            // Render items twice for seamless infinite loop
            for (let copy = 0; copy < 2; copy++) {
                items.forEach((item) => {
                    const card = document.createElement('div');
                    card.className = 'marquee-card';
                    card.onclick = () => {
                        // Tactile press & pop animation before modal opens
                        gsap.to(card, {
                            scale: 0.95,
                            duration: 0.1,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.inOut",
                            onComplete: () => this.openModal(item)
                        });
                    };
                    card.innerHTML = `
                        <img src="${item.img}" alt="${item.title}" loading="lazy" decoding="async" class="marquee-card-img" />
                        <div class="marquee-card-overlay">
                            <span class="marquee-card-cat">${item.category}</span>
                            <span class="marquee-card-title">${item.title}</span>
                        </div>
                    `;
                    track.appendChild(card);
                });
            }

            row.appendChild(track);
            return row;
        };

        this.container.appendChild(buildRow(row1Items, 'marquee-left'));
        this.container.appendChild(buildRow(row2Items, 'marquee-right'));
    }

    // ===================== DESKTOP: Full GSAP scattered wall =====================
    initDesktop() {
        this.container.classList.add('relative', 'overflow-hidden', 'bg-black/20', 'rounded-3xl', 'border', 'border-white/10');
        this.container.style.height = '650px';
        this.container.style.minHeight = '650px';

        // Setup HUD
        this.createHUD();

        // Handle resizing
        this.resizeObserver = new ResizeObserver(([entry]) => {
            this.width = entry.contentRect.width;
            this.height = entry.contentRect.height;
            this.render();
        });
        this.resizeObserver.observe(this.container);

        // Render grid
        this.render();

        // Setup Moments interaction
        this.setupMomentsInteraction();
    }

    injectStyles() {
        if (document.getElementById('moments-styles')) return;
        const style = document.createElement('style');
        style.id = 'moments-styles';
        style.innerHTML = `
            /* ---- Desktop scattered wall ---- */
            .moments-cell {
                position: absolute;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.08);
                cursor: pointer;
                background-size: cover;
                background-position: center;
                transition: border-color 0.3s ease, filter 0.3s ease;
                filter: grayscale(0.2) contrast(1.1);
            }
            .moments-cell:hover {
                border-color: rgba(255, 75, 139, 0.4);
                filter: grayscale(0) contrast(1.05);
            }
            .moments-hud-panel {
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                background: rgba(9, 9, 11, 0.75);
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
            }
            .moments-modal-overlay {
                z-index: 99900 !important;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            .moments-modal-box {
                position: relative;
                width: 100%;
                max-width: 920px;
                max-height: 85vh;
                max-height: 85dvh;
                display: flex;
                flex-direction: column;
                background: #09090b;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 1.25rem;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                transform: scale(0.95);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
            }
            @media (min-width: 768px) {
                .moments-modal-box {
                    flex-direction: row;
                    height: 520px;
                    max-height: 80vh;
                    border-radius: 1.5rem;
                }
            }
            .moments-modal-img {
                width: 100%;
                height: 200px;
                flex-shrink: 0;
                background-size: cover;
                background-position: center;
                position: relative;
            }
            @media (min-width: 640px) {
                .moments-modal-img {
                    height: 240px;
                }
            }
            @media (min-width: 768px) {
                .moments-modal-img {
                    width: 58%;
                    height: 100%;
                }
            }
            .moments-modal-details {
                width: 100%;
                flex: 1 1 auto;
                min-height: 0;
                overflow-y: auto;
                padding: 1.25rem 1.25rem 1.25rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: #09090b;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                box-sizing: border-box;
            }
            @media (min-width: 768px) {
                .moments-modal-details {
                    width: 42%;
                    height: 100%;
                    border-top: none;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2.25rem 2rem 2rem;
                }
            }
            .moments-close-x {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                z-index: 30;
                width: 2rem;
                height: 2rem;
                border-radius: 9999px;
                background: rgba(0, 0, 0, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                transition: all 0.2s ease;
            }
            .moments-close-x:hover,
            .moments-close-x:active {
                background: rgba(0, 0, 0, 0.9);
                border-color: rgba(255, 255, 255, 0.4);
                transform: scale(0.95);
            }
            @media (min-width: 768px) {
                .moments-close-x {
                    top: 1rem;
                    right: 1rem;
                }
            }
            .moments-close-btn {
                margin-top: 1.25rem;
                flex-shrink: 0;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.18);
                color: #ffffff;
                font-family: monospace, Courier New, Courier;
                font-size: 0.75rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                font-weight: 700;
                padding: 0.75rem 1.25rem;
                border-radius: 9999px;
                width: 100%;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .moments-close-btn:hover,
            .moments-close-btn:active {
                background: rgba(255, 255, 255, 0.18);
                border-color: rgba(255, 255, 255, 0.35);
                transform: scale(0.98);
            }

            /* ---- Mobile auto-scrolling marquee ---- */
            .marquee-showcase {
                width: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .marquee-row {
                overflow: hidden;
                width: 100%;
            }
            .marquee-track {
                display: flex;
                gap: 12px;
                width: max-content;
                will-change: transform;
            }
            .marquee-left .marquee-track {
                animation: marqueeScrollLeft 30s linear infinite;
            }
            .marquee-right .marquee-track {
                animation: marqueeScrollRight 35s linear infinite;
            }
            .marquee-showcase.paused .marquee-track {
                animation-play-state: paused;
            }
            @keyframes marqueeScrollLeft {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            @keyframes marqueeScrollRight {
                0%   { transform: translateX(-50%); }
                100% { transform: translateX(0); }
            }
            .marquee-card {
                flex: 0 0 auto;
                width: 55vw;
                max-width: 240px;
                height: 160px;
                border-radius: 16px;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                border: 1px solid rgba(255,255,255,0.08);
                background: rgba(0,0,0,0.3);
            }
            .marquee-card-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            .marquee-card:active .marquee-card-img {
                transform: scale(1.05);
            }
            .marquee-card-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px 12px;
                background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, transparent 100%);
                display: flex;
                flex-direction: column;
                gap: 1px;
            }
            .marquee-card-cat {
                font-size: 7px;
                font-family: monospace;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #ff4b8b;
                font-weight: 700;
            }
            .marquee-card-title {
                font-size: 12px;
                font-weight: 700;
                color: white;
                line-height: 1.3;
            }
        `;
        document.head.appendChild(style);
    }

    createHUD() {
        this.hudEl = document.createElement('div');
        this.hudEl.className = 'absolute bottom-6 left-6 right-6 md:right-auto md:w-96 p-6 rounded-2xl moments-hud-panel z-30 transition-all duration-300 pointer-events-auto text-left';
        this.hudEl.style.opacity = '0';
        this.hudEl.innerHTML = `
            <div id="hud-category" class="text-[9px] font-mono tracking-widest text-brand-pink font-bold uppercase mb-1">MOVING CURSOR</div>
            <h3 id="hud-title" class="text-lg font-bold text-white mb-2 leading-snug">Hover the photos wall</h3>
            <p id="hud-desc" class="text-xs text-slate-400 font-mono leading-relaxed">Move your cursor to part the photography wall and highlight a moment.</p>
        `;
        this.container.appendChild(this.hudEl);
    }

    createModal() {
        this.modalEl = document.createElement('div');
        this.modalEl.className = 'fixed inset-0 z-[99900] flex items-center justify-center p-3 sm:p-6 md:p-10 moments-modal-overlay opacity-0 pointer-events-none transition-all duration-300';
        this.modalEl.style.zIndex = '99900';
        this.modalEl.innerHTML = `
            <div class="moments-modal-box" id="modal-box">
                <!-- Floating Close Button (Top-Right) -->
                <button type="button" id="modal-close-x" class="moments-close-x" title="Close moment" aria-label="Close modal">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>

                <!-- Left Image Slot -->
                <div class="moments-modal-img" id="modal-img">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950"></div>
                </div>

                <!-- Right details panel -->
                <div class="moments-modal-details">
                    <div class="space-y-3 sm:space-y-4">
                        <div>
                            <span id="modal-cat" class="text-[11px] font-mono tracking-widest text-brand-pink font-bold uppercase block">CATEGORY</span>
                            <h2 id="modal-title" class="text-xl sm:text-2xl md:text-3xl font-heading font-normal italic text-white mt-1 sm:mt-1.5 leading-tight">Moment Title</h2>
                        </div>
                        <p id="modal-desc" class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">Detailed moment description goes here.</p>
                    </div>
                    
                    <button type="button" id="modal-close" class="moments-close-btn">
                        CLOSE MOMENT
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modalEl);

        // Add close event listeners
        const closeBtn = this.modalEl.querySelector('#modal-close');
        if (closeBtn) closeBtn.onclick = () => this.closeModal();

        const closeIconBtn = this.modalEl.querySelector('#modal-close-x');
        if (closeIconBtn) closeIconBtn.onclick = () => this.closeModal();

        this.modalEl.onclick = (e) => {
            if (e.target === this.modalEl) this.closeModal();
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modalEl.classList.contains('pointer-events-none')) {
                this.closeModal();
            }
        });
    }

    openModal(item) {
        const modalImg = this.modalEl.querySelector('#modal-img');
        const modalTitle = this.modalEl.querySelector('#modal-title');
        const modalCat = this.modalEl.querySelector('#modal-cat');
        const modalDesc = this.modalEl.querySelector('#modal-desc');
        const modalBox = this.modalEl.querySelector('#modal-box');

        modalImg.style.backgroundImage = `url(${item.img})`;
        modalTitle.innerText = item.title;
        modalCat.innerText = item.category;
        modalDesc.innerText = item.desc;

        this.modalEl.classList.remove('opacity-0', 'pointer-events-none');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');

        if (this.isMobile) {
            this.container.classList.add('paused');
        }
    }

    closeModal() {
        const modalBox = this.modalEl.querySelector('#modal-box');
        modalBox.classList.remove('scale-100');
        modalBox.classList.add('scale-95');
        this.modalEl.classList.add('opacity-0', 'pointer-events-none');

        if (this.isMobile) {
            this.container.classList.remove('paused');
        }
    }

    // ===================== Desktop grid + interaction (unchanged) =====================

    calculateGrid() {
        const gridItems = [
            // Row 1
            { id: "1", xFactor: 0.05, yFactor: 0.12, wFactor: 0.18, hFactor: 0.35 },
            { id: "2", xFactor: 0.26, yFactor: 0.08, wFactor: 0.20, hFactor: 0.28 },
            { id: "3", xFactor: 0.49, yFactor: 0.15, wFactor: 0.22, hFactor: 0.32 },
            { id: "4", xFactor: 0.74, yFactor: 0.08, wFactor: 0.20, hFactor: 0.26 },
            
            // Row 2
            { id: "5", xFactor: 0.08, yFactor: 0.52, wFactor: 0.22, hFactor: 0.38 },
            { id: "6", xFactor: 0.34, yFactor: 0.48, wFactor: 0.18, hFactor: 0.36 },
            { id: "7", xFactor: 0.56, yFactor: 0.54, wFactor: 0.20, hFactor: 0.34 },
            { id: "8", xFactor: 0.79, yFactor: 0.46, wFactor: 0.16, hFactor: 0.42 },

            // Scattered / Overlay elements
            { id: "9", xFactor: 0.18, yFactor: 0.36, wFactor: 0.12, hFactor: 0.22 },
            { id: "10", xFactor: 0.44, yFactor: 0.34, wFactor: 0.14, hFactor: 0.24 },
            { id: "11", xFactor: 0.66, yFactor: 0.28, wFactor: 0.15, hFactor: 0.26 },
            { id: "12", xFactor: 0.88, yFactor: 0.22, wFactor: 0.10, hFactor: 0.38 }
        ];

        const containerWidth = this.width || this.container.offsetWidth || 1000;
        const containerHeight = this.height || this.container.offsetHeight || 650;

        return gridItems.map(gridInfo => {
            const item = this.items.find(i => i.id === gridInfo.id) || {};
            const x = gridInfo.xFactor * containerWidth;
            const y = gridInfo.yFactor * containerHeight;
            const w = gridInfo.wFactor * containerWidth;
            const h = gridInfo.hFactor * containerHeight;
            return {
                ...item,
                x, y, w, h
            };
        });
    }

    render() {
        const gridItems = this.calculateGrid();

        gridItems.forEach((item) => {
            let el = this.container.querySelector(`[data-key="${item.id}"]`);

            if (!el) {
                el = document.createElement('div');
                el.className = 'moments-cell';
                el.setAttribute('data-key', item.id);
                el.style.backgroundImage = `url(${item.img})`;
                el.onclick = () => {
                    // Tactile press & pop animation before modal opens
                    gsap.to(el, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut",
                        onComplete: () => this.openModal(item)
                    });
                };

                this.container.appendChild(el);
            }

            // Apply base position and size
            gsap.set(el, {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
                opacity: 1
            });
        });

        this.hasMounted = true;

        // Fade in HUD after first render so it doesn't flash before images load
        if (this.hudEl && !this._hudRevealed) {
            this._hudRevealed = true;
            gsap.to(this.hudEl, { opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' });
        }
    }

    setupMomentsInteraction() {
        const activeHoverScale = 1.05;

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            const gridItems = this.calculateGrid();
            
            // Interaction Parameters
            const radius = 260;
            const maxPush = 60;
            const fadeRadius = 110;

            let closestItem = null;
            let minDistance = Infinity;

            gridItems.forEach((item) => {
                const el = this.container.querySelector(`[data-key="${item.id}"]`);
                if (!el) return;

                const itemX = item.x + item.w / 2;
                const itemY = item.y + item.h / 2;

                const dx = itemX - mx;
                const dy = itemY - my;
                const dist = Math.hypot(dx, dy);

                if (dist < minDistance) {
                    minDistance = dist;
                    closestItem = item;
                }

                let targetX = item.x;
                let targetY = item.y;
                let targetOpacity = 1;
                let targetScale = 1;

                if (dist < radius) {
                    const factor = 1 - dist / radius;
                    const pushFactor = Math.pow(factor, 2);

                    targetX = item.x + (dist > 0 ? (dx / dist) : 0) * maxPush * pushFactor;
                    targetY = item.y + (dist > 0 ? (dy / dist) : 0) * maxPush * pushFactor;

                    if (dist < fadeRadius) {
                        const fadeFactor = dist / fadeRadius;
                        targetOpacity = 0.15 + 0.85 * Math.pow(fadeFactor, 1.5);
                    }
                }

                gsap.to(el, {
                    x: targetX,
                    y: targetY,
                    opacity: targetOpacity,
                    scale: targetScale,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });

            // Update HUD
            if (closestItem && closestItem.id !== this.activeFeaturedId) {
                this.activeFeaturedId = closestItem.id;
                this.updateHUD(closestItem);
            }
        });

        this.container.addEventListener('mouseleave', () => {
            const gridItems = this.calculateGrid();
            gridItems.forEach((item) => {
                const el = this.container.querySelector(`[data-key="${item.id}"]`);
                if (el) {
                    gsap.to(el, {
                        x: item.x,
                        y: item.y,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                }
            });

            // Reset HUD
            this.activeFeaturedId = null;
            const categoryEl = this.hudEl.querySelector('#hud-category');
            const titleEl = this.hudEl.querySelector('#hud-title');
            const descEl = this.hudEl.querySelector('#hud-desc');
            
            gsap.to([categoryEl, titleEl, descEl], {
                opacity: 0.5,
                y: -3,
                duration: 0.3,
                stagger: 0.05,
                onComplete: () => {
                    categoryEl.innerText = "MOVING CURSOR";
                    titleEl.innerText = "Hover the photos wall";
                    descEl.innerText = "Move your cursor to part the photography wall and highlight a moment.";
                    gsap.to([categoryEl, titleEl, descEl], { opacity: 1, y: 0, duration: 0.3 });
                }
            });
        });
    }

    updateHUD(item) {
        const categoryEl = this.hudEl.querySelector('#hud-category');
        const titleEl = this.hudEl.querySelector('#hud-title');
        const descEl = this.hudEl.querySelector('#hud-desc');

        gsap.killTweensOf([categoryEl, titleEl, descEl]);

        gsap.to([categoryEl, titleEl, descEl], {
            opacity: 0,
            y: 5,
            duration: 0.15,
            stagger: 0.03,
            onComplete: () => {
                categoryEl.innerText = item.category;
                titleEl.innerText = item.title;
                descEl.innerText = item.desc;
                
                gsap.fromTo([categoryEl, titleEl, descEl], 
                    { opacity: 0, y: -5 },
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
                );
            }
        });
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.modalEl && this.modalEl.parentNode) {
            this.modalEl.parentNode.removeChild(this.modalEl);
        }
    }
}

// Auto-initialize when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('masonry-container') && typeof masonryItems !== 'undefined') {
            window.momentMasonry = new MasonryGrid('masonry-container', {
                items: masonryItems
            });
        }
    });
} else {
    if (document.getElementById('masonry-container') && typeof masonryItems !== 'undefined') {
        window.momentMasonry = new MasonryGrid('masonry-container', {
            items: masonryItems
        });
    }
}
