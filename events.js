// ================= EVENTS PAGE: Gallery Toggle & Lightbox =================

function toggleGallery(galleryId, btn) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    const isHidden = gallery.classList.contains('hidden');
    gallery.classList.toggle('hidden');
    if (isHidden) {
        btn.classList.add('gallery-open');
        btn.querySelector('span').textContent = 'Hide Photos';
    } else {
        btn.classList.remove('gallery-open');
        btn.querySelector('span').textContent = 'View Photos';
    }
}

// Navigable Lightbox State
let currentGalleryImages = [];
let currentImgIndex = -1;

function openLightbox(src, imgEl) {
    const overlay = document.getElementById('photo-lightbox');
    const img = document.getElementById('lightbox-img');
    
    const gallery = imgEl.closest('.event-photo-gallery');
    if (gallery) {
        const imgs = Array.from(gallery.querySelectorAll('img'));
        currentGalleryImages = imgs.map(i => i.src);
        currentImgIndex = imgs.indexOf(imgEl);
    } else {
        currentGalleryImages = [src];
        currentImgIndex = 0;
    }

    updateNavigation();
    img.src = src;
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        img.style.transform = 'scale(1)';
    });
}

function closeLightbox() {
    const overlay = document.getElementById('photo-lightbox');
    const img = document.getElementById('lightbox-img');
    overlay.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function updateNavigation() {
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (currentGalleryImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
}

function prevLightboxImage(event) {
    if (event) event.stopPropagation();
    if (currentGalleryImages.length <= 1) return;
    currentImgIndex = (currentImgIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    changeImage(currentGalleryImages[currentImgIndex]);
}

function nextLightboxImage(event) {
    if (event) event.stopPropagation();
    if (currentGalleryImages.length <= 1) return;
    currentImgIndex = (currentImgIndex + 1) % currentGalleryImages.length;
    changeImage(currentGalleryImages[currentImgIndex]);
}

function changeImage(newSrc) {
    const img = document.getElementById('lightbox-img');
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    setTimeout(() => {
        img.src = newSrc;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 150);
}

// Keyboard listener for navigation
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('photo-lightbox');
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        nextLightboxImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        prevLightboxImage();
    } else if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Set up touch & click handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Touch events for swipes on mobile (with zoom & multi-touch protection)
    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let isMultiTouch = false;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            isMultiTouch = true;
        } else {
            isMultiTouch = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            isMultiTouch = true;
        }
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (isMultiTouch) {
            if (e.touches.length === 0) isMultiTouch = false;
            return;
        }

        // Prevent photo switching if browser is zoomed in
        if (window.visualViewport && window.visualViewport.scale > 1.05) {
            return;
        }

        if (e.changedTouches.length > 0) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            handleSwipe(touchDuration);
        }
    }, { passive: true });

    function handleSwipe(duration) {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only trigger if fast horizontal swipe (duration < 400ms, abs(deltaX) > 60px, horizontal dominant)
        if (duration < 400 && Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < 0) {
                nextLightboxImage();
            } else {
                prevLightboxImage();
            }
        }
    }

    // Attach click-to-open handlers to all gallery images
    document.querySelectorAll('.event-photo-gallery img').forEach(img => {
        img.onclick = (e) => {
            e.stopPropagation();
            openLightbox(img.src, img);
        };
    });
});
