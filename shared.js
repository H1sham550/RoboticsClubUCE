// ================= ROBOTICS CLUB UCE GLOBAL INTERACTIVE SCRIPTS =================

// Toast message display
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
        toastMessage.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
}

// Live neon leaves spawning generator
const maxLeaves = 25; // Optimized for performance, especially on mobile
const leafArray = [];
let mouseX = -1000;
let mouseY = -1000;

let videoRafPending = false;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Background video 3D Parallax effect (RAF-throttled to prevent jank)
    if (!videoRafPending) {
        videoRafPending = true;
        requestAnimationFrame(() => {
            const video = document.getElementById('bg-video');
            if (video) {
                const x = (window.innerWidth / 2 - mouseX) / 45;
                const y = (window.innerHeight / 2 - mouseY) / 45;
                video.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
            }
            videoRafPending = false;
        });
    }
});

class NeonLeaf {
    constructor(container) {
        this.container = container;
        this.reset();
    }

    update() {
        // Gravity / Wind drift
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.vAngle;

        // Mouse Repeller Physics
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
            const force = (180 - dist) / 12;
            const angleRad = Math.atan2(dy, dx);
            this.x += Math.cos(angleRad) * force;
            this.y += Math.sin(angleRad) * force;
        }

        // Render style
        if (this.element) {
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg)`;
        }

        // Boundary check
        if (this.y > window.innerHeight + 100 || this.x < -100 || this.x > window.innerWidth + 100) {
            this.reset();
        }
    }

    reset() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'leaf';
            if (this.container) {
                this.container.appendChild(this.element);
            }
        }
        
        this.size = Math.random() * 10 + 6;
        this.element.style.width = this.size + 'px';
        this.element.style.height = (this.size * 1.3) + 'px';
        
        // Spawn randomly from the top
        this.x = Math.random() * window.innerWidth;
        this.y = -50 - (Math.random() * 200);
        this.vx = (Math.random() * 1.5) - 0.75;
        this.vy = Math.random() * 1.5 + 1.2;
        this.angle = Math.random() * 360;
        this.vAngle = (Math.random() * 1.5) - 0.75;
    }
}

function initLeaves() {
    if (window.innerWidth < 768) return; // Disable on mobile to prevent scrolling lag
    const leafContainer = document.getElementById('leaf-container');
    if (!leafContainer) return;

    for (let i = 0; i < maxLeaves; i++) {
        leafArray.push(new NeonLeaf(leafContainer));
    }

    function animate() {
        leafArray.forEach(leaf => leaf.update());
        requestAnimationFrame(animate);
    }
    animate();
}

// Dummy Certificate Validation Database Check (indexed by Registration Number)
const dummyCertDB = {
    'UCE26041': {
        name: 'Aditya Verma',
        certificates: [
            { event: '2-Day Arduino Learning Workshop', role: 'Participant Pass', date: 'May 12, 2026', link: 'https://drive.google.com/drive/folders/dummy-ard-1' },
            { event: 'Algorithmic Coding Competition', role: 'Winner (1st Place)', date: 'June 15, 2026', link: 'https://drive.google.com/drive/folders/dummy-code-1' }
        ]
    },
    'UCE26085': {
        name: 'Neha Kumari',
        certificates: [
            { event: 'Free VR Experience Event', role: 'Volunteer Organizer', date: 'April 10, 2026', link: 'https://drive.google.com/drive/folders/dummy-vr-1' }
        ]
    }
};

function verifyCertificate() {
    const certInput = document.getElementById('cert-input');
    const resultBox = document.getElementById('cert-result');
    const errorBox = document.getElementById('cert-error');
    
    if (!certInput || !resultBox || !errorBox) return;

    const query = certInput.value.trim().toUpperCase(); // Case-insensitive lookup
    resultBox.classList.add('hidden');
    errorBox.classList.add('hidden');

    if (dummyCertDB[query]) {
        const studentName = document.getElementById('cert-student-name');
        const regNo = document.getElementById('cert-reg-no');
        const certList = document.getElementById('cert-list');
        
        if (studentName) studentName.innerText = dummyCertDB[query].name;
        if (regNo) regNo.innerText = query;
        
        if (certList) {
            certList.innerHTML = ''; // Clear previous searches
            
            dummyCertDB[query].certificates.forEach(cert => {
                const item = document.createElement('div');
                item.className = 'p-3 bg-white/5 border border-white/10 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-brand-cyan/35 transition-colors';
                item.innerHTML = `
                    <div>
                        <span class="text-[9px] font-mono text-brand-cyan uppercase tracking-widest block">${cert.event}</span>
                        <span class="text-white font-bold block text-xs mt-0.5">${cert.role}</span>
                        <span class="text-[9px] text-slate-500 block">AWARDED: ${cert.date}</span>
                    </div>
                    <a href="${cert.link}" target="_blank" class="px-3 py-1.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded font-mono text-[9px] text-brand-cyan font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 self-end sm:self-auto">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> View PDF
                    </a>
                `;
                certList.appendChild(item);
            });
        }
        
        resultBox.classList.remove('hidden');
    } else {
        errorBox.classList.remove('hidden');
    }
}

// Payment Processing simulation (paused)
function processPayment() {
    showToast("Registrations are closed. Reopening when new 1st year students arrive!");
}

// Google Apps Script Web App URL for Google Sheets suggestions collection
// Replace this placeholder string with your deployed Apps Script URL (e.g. https://script.google.com/macros/s/.../exec)
const SUGGESTIONS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwGqLZ2mGYoAR9GCQesVHIZuqnBxqyYymUpjeNuvPXazMAu0dl9PzFzIEAC2P7peyhAsw/exec";

// Student Suggestion Submission Form
function submitSuggestion() {
    const suggestName = document.getElementById('suggest-name');
    const suggestReg = document.getElementById('suggest-reg');
    const suggestText = document.getElementById('suggest-text');
    const suggestCategory = document.getElementById('suggest-category');
    
    if (!suggestText || suggestText.value.trim() === "") return;

    const name = suggestName ? suggestName.value.trim() : "Anonymous";
    const regNo = suggestReg ? suggestReg.value.trim() : "N/A";
    const category = suggestCategory ? suggestCategory.value : "other";
    const suggestion = suggestText.value.trim();

    // Show sending state
    showSuggestionAlert("Sending suggestion...", "sending");

    // If WebApp URL is configured, send the suggestion to Google Sheets
    if (SUGGESTIONS_WEBAPP_URL && SUGGESTIONS_WEBAPP_URL !== "") {
        fetch(SUGGESTIONS_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors', // Prevents CORS checks block on Apps Script redirect
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, regNo, category, suggestion })
        })
        .then(() => {
            showSuggestionAlert("Suggestion Submitted Successfully!", "success");
            if (suggestName) suggestName.value = "";
            if (suggestReg) suggestReg.value = "";
            suggestText.value = "";
        })
        .catch(err => {
            console.error("Error sending to Google Sheets:", err);
            showSuggestionAlert("Suggestion Saved Locally!", "success");
        });
    } else {
        // Fallback local simulation if no URL is set yet
        showSuggestionAlert("Suggestion Submitted Successfully!", "success");
        if (suggestName) suggestName.value = "";
        if (suggestReg) suggestReg.value = "";
        suggestText.value = "";
    }
}

// Centered fullscreen suggestion alert modal
function showSuggestionAlert(message, type) {
    // Remove existing modal if present
    const existing = document.getElementById('suggestion-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'suggestion-alert-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);opacity:0;transition:opacity 0.3s ease;';

    const isSending = type === 'sending';
    const iconHTML = isSending
        ? '<div style="width:64px;height:64px;border:3px solid rgba(255,75,139,0.3);border-top-color:#ff4b8b;border-radius:50%;animation:spin 0.8s linear infinite;"></div>'
        : '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#ff4b8b,#ff6b35);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(255,75,139,0.4);animation:popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275);"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>';

    overlay.innerHTML = `
        <div style="text-align:center;padding:40px 32px;max-width:380px;background:rgba(18,18,21,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.5);animation:slideUp 0.35s ease;">
            <div style="margin-bottom:20px;display:flex;justify-content:center;">${iconHTML}</div>
            <h3 style="color:white;font-size:18px;font-weight:700;margin:0 0 8px 0;font-family:system-ui,sans-serif;">${message}</h3>
            ${!isSending ? '<p style="color:rgba(255,255,255,0.5);font-size:12px;font-family:monospace;margin:0;">Thank you for helping us improve the club!</p>' : ''}
            ${!isSending ? '<button onclick="this.closest(\'#suggestion-alert-overlay\').remove()" style="margin-top:20px;padding:10px 32px;background:rgba(255,75,139,0.1);border:1px solid rgba(255,75,139,0.3);border-radius:8px;color:#ff4b8b;font-size:12px;font-weight:700;font-family:monospace;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all 0.2s;">Got it</button>' : ''}
        </div>
        <style>
            @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            @keyframes popIn { from { transform:scale(0); } to { transform:scale(1); } }
            @keyframes spin { to { transform:rotate(360deg); } }
        </style>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Click backdrop to close (only for success state)
    if (!isSending) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (document.getElementById('suggestion-alert-overlay')) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        }, 5000);
    }
}

// Mobile Menu toggling system
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.classList.add('overflow-hidden');
        });
    }

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        }
    };

    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Active navigation link highlighting
function highlightNav() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const navItems = document.querySelectorAll('.nav-btn');
    
    navItems.forEach(btn => {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-slate-300');
    });

    if (path.includes('team.html')) {
        const item = document.getElementById('nav-team');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('events.html')) {
        const item = document.getElementById('nav-events');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('certificate.html')) {
        const item = document.getElementById('nav-certificate');
        if (item) item.classList.add('active', 'text-white');
    } else if (hash.includes('#membership')) {
        const item = document.getElementById('nav-membership');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('suggestions.html')) {
        const item = document.getElementById('nav-suggestions');
        if (item) item.classList.add('active', 'text-white');
    } else if (hash.includes('#about') || path.endsWith('/') || path.includes('index.html')) {
        const item = document.getElementById('nav-about');
        if (item) item.classList.add('active', 'text-white');
    }
}

// Lock background video container height on mobile to prevent address bar scroll resize/zoom jitter
function lockBgHeightMobile() {
    const bgContainer = document.querySelector('.fixed.inset-0.z-0');
    if (bgContainer && window.innerWidth < 768) {
        bgContainer.style.height = (window.innerHeight + 80) + 'px';
        bgContainer.style.bottom = 'auto';
    }
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    lockBgHeightMobile();
    initLeaves();
    initMobileMenu();
    highlightNav();
});

// Update active highlight when hash changes
window.addEventListener('hashchange', highlightNav);
