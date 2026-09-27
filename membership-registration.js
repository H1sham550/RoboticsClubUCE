/**
 * =========================================================================
 * ROBOTICS CLUB UCE - CLUB MEMBERSHIP REGISTRATION ENGINE
 * =========================================================================
 * Fee: ₹150 (Lifetime Pass throughout college period, no yearly renewals)
 * 2-Step Flow:
 * Step 1: Member Info (Name, Department, Year, WhatsApp Phone, Email ID)
 * Step 2: Payment QR (₹150), UPI Deep Link, 12-digit UTR & Screenshot Proof
 * =========================================================================
 */

// Global Configuration
const MEMBERSHIP_CONFIG = {
    // Google Apps Script Web App URL for Membership
    // (Replace with your deployed Web App URL from google-apps-script-membership.js)
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby-ASvkuCKUaNv7IobaTTXprtYUJTYLxWsOhebLnQmGQqwHQBGDPTMKdUg1F2NyJFuLDw/exec",

    // Club UPI Details
    DEFAULT_UPI_ID: "hishamts69@oksbi",
    PAYEE_NAME: "Robotics Club UCE",
    FEE: 150,

    // Payment QR Images (real JPEG takes priority, SVG fallback)
    QR_IMAGES: {
        150: "assets/payment_qr/150.jpeg"
    },
    QR_FALLBACKS: {
        150: "assets/qr-150.svg"
    }
};

// Wizard State
let currentMemStep = 1;
let currentMemCompressedFile = null;

// ================= MODAL OPEN / CLOSE =================

function openMembershipModal() {
    const modal = document.getElementById('membership-reg-modal');
    if (!modal) return;

    // Reset wizard to Step 1
    goToMembershipStep(1, false);

    // Show modal with smooth scale & fade
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const inner = modal.querySelector('.modal-card-content');
        if (inner) inner.style.transform = 'scale(1)';
    });
}

function closeMembershipModal() {
    const modal = document.getElementById('membership-reg-modal');
    if (!modal) return;

    modal.style.opacity = '0';
    const inner = modal.querySelector('.modal-card-content');
    if (inner) inner.style.transform = 'scale(0.96)';

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        goToMembershipStep(1, false);
    }, 250);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const utrModal = document.getElementById('membership-utr-modal');
        if (utrModal && !utrModal.classList.contains('hidden')) {
            closeMemUtrHelp();
            return;
        }
        const passModal = document.getElementById('membership-pass-modal');
        if (passModal && !passModal.classList.contains('hidden')) {
            closeMembershipPassModal();
            return;
        }
        closeMembershipModal();
    }
});

// ================= STEP NAVIGATION =================

function goToMembershipStep(stepNumber, shouldValidate = true) {
    if (stepNumber === 2 && shouldValidate) {
        // Validate Step 1 fields
        const name = document.getElementById('mem-name');
        const dept = document.getElementById('mem-dept');
        const year = document.getElementById('mem-year');
        const phone = document.getElementById('mem-phone');
        const email = document.getElementById('mem-email');

        if (!name || name.value.trim().length < 2) {
            showMemInputError(name, "Please enter your full name.");
            return;
        }
        if (!dept || dept.value === "") {
            showMemInputError(dept, "Please select your department / branch.");
            return;
        }
        if (!year || year.value === "") {
            showMemInputError(year, "Please select your semester / year.");
            return;
        }
        if (!phone || !/^[0-9]{10}$/.test(phone.value.trim())) {
            showMemInputError(phone, "Please enter a valid 10-digit WhatsApp mobile number.");
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            showMemInputError(email, "Please enter a valid email address.");
            return;
        }

        // Setup Step 2 QR and UPI links
        prepareMembershipPaymentStep();
    }

    currentMemStep = stepNumber;

    // Toggle panels
    const step1El = document.getElementById('mem-step-1');
    const step2El = document.getElementById('mem-step-2');
    const badgeEl = document.getElementById('mem-step-badge');
    const titleEl = document.getElementById('mem-step-title');
    const backBtn = document.getElementById('mem-back-btn');
    const nextBtn = document.getElementById('mem-next-btn');
    const submitBtn = document.getElementById('mem-submit-btn');

    if (stepNumber === 1) {
        if (step1El) step1El.classList.remove('hidden');
        if (step2El) step2El.classList.add('hidden');
        if (badgeEl) badgeEl.textContent = "Page 1 of 2";
        if (titleEl) titleEl.textContent = "Personal & Academic Info";
        if (backBtn) backBtn.classList.add('hidden');
        if (nextBtn) nextBtn.classList.remove('hidden');
        if (submitBtn) submitBtn.classList.add('hidden');
    } else {
        if (step1El) step1El.classList.add('hidden');
        if (step2El) step2El.classList.remove('hidden');
        if (badgeEl) badgeEl.textContent = "Page 2 of 2";
        if (titleEl) titleEl.textContent = "Payment & UTR Verification";
        if (backBtn) backBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
        if (submitBtn) submitBtn.classList.remove('hidden');
    }

    // Scroll modal body back to top
    const scrollBody = document.getElementById('mem-modal-scroll-body');
    if (scrollBody) scrollBody.scrollTop = 0;
}

function showMemInputError(element, message) {
    if (!element) return;
    element.focus();
    element.classList.add('border-red-500', 'ring-2', 'ring-red-500/30');
    setTimeout(() => {
        element.classList.remove('border-red-500', 'ring-2', 'ring-red-500/30');
    }, 3000);
    alert(message);
}

// ================= PAYMENT STEP PREPARATION =================

function prepareMembershipPaymentStep() {
    const name = document.getElementById('mem-name').value.trim();
    const fee = MEMBERSHIP_CONFIG.FEE; // 150

    // Update Fee display
    const feeDisplay = document.getElementById('mem-step2-summary-fee');
    if (feeDisplay) feeDisplay.textContent = `₹${fee}`;

    // Update Payment QR Image with fallback
    const qrImg = document.getElementById('mem-qr-image');
    if (qrImg) {
        const primarySrc = MEMBERSHIP_CONFIG.QR_IMAGES[fee] || `assets/qr-${fee}.svg`;
        const fallbackSrc = MEMBERSHIP_CONFIG.QR_FALLBACKS[fee] || `assets/qr-${fee}.svg`;

        qrImg.onerror = function () {
            this.onerror = null;
            this.src = fallbackSrc;
        };
        qrImg.src = primarySrc;
    }

    // Update UPI Deep Link for Mobile App click
    const note = encodeURIComponent(`Robotics Club Membership - ${name}`);
    const upiUri = `upi://pay?pa=${MEMBERSHIP_CONFIG.DEFAULT_UPI_ID}&pn=${encodeURIComponent(MEMBERSHIP_CONFIG.PAYEE_NAME)}&am=${fee}&cu=INR&tn=${note}`;

    const upiLinkBtn = document.getElementById('mem-upi-app-link');
    if (upiLinkBtn) {
        upiLinkBtn.href = upiUri;
    }

    // Update UPI ID display (element may not be present if UPI section was removed)
    const upiDisplay = document.getElementById('mem-upi-id-display');
    if (upiDisplay) upiDisplay.textContent = MEMBERSHIP_CONFIG.DEFAULT_UPI_ID;
}

// Copy UPI ID to clipboard
function copyMemUpiId() {
    const upiId = MEMBERSHIP_CONFIG.DEFAULT_UPI_ID;
    navigator.clipboard.writeText(upiId).then(() => {
        const copyBtn = document.getElementById('mem-copy-upi-btn');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> <span class="text-green-400">Copied!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
    }).catch(err => {
        console.error('Clipboard copy failed:', err);
    });
}

// Live UTR format validator
function validateMemUtrInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    const badge = document.getElementById('mem-utr-valid-badge');
    if (badge) {
        if (input.value.length === 12) {
            badge.classList.remove('hidden');
            badge.innerHTML = '<span class="text-green-400 font-mono text-xs flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-xs"></i> 12-Digit UTR Complete</span>';
        } else if (input.value.length > 0) {
            badge.classList.remove('hidden');
            badge.innerHTML = `<span class="text-slate-400 font-mono text-xs">${12 - input.value.length} digits remaining</span>`;
        } else {
            badge.classList.add('hidden');
        }
    }
}

// ================= IMAGE COMPRESSOR =================

function handleMemScreenshotSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file (PNG, JPG, or WEBP).");
        event.target.value = '';
        return;
    }

    const statusEl = document.getElementById('mem-upload-status');
    if (statusEl) {
        statusEl.textContent = "Optimizing payment screenshot for fast upload...";
        statusEl.classList.remove('hidden');
    }

    compressMemImage(file, 1200, 1200, 0.75)
        .then(compressed => {
            currentMemCompressedFile = compressed;
            showMemScreenshotPreview(compressed, file.name);
            if (statusEl) statusEl.classList.add('hidden');
        })
        .catch(err => {
            console.error("Compression error:", err);
            if (statusEl) statusEl.textContent = "Using original file.";
        });
}

function compressMemImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                const base64Data = compressedDataUrl.split(',')[1];
                const approxSizeKb = Math.round((base64Data.length * 3 / 4) / 1024);

                resolve({
                    dataUrl: compressedDataUrl,
                    base64: base64Data,
                    mimeType: 'image/jpeg',
                    sizeKb: approxSizeKb
                });
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function showMemScreenshotPreview(compressed, fileName) {
    const uploadBox = document.getElementById('mem-upload-placeholder');
    const previewBox = document.getElementById('mem-upload-preview');
    const previewImg = document.getElementById('mem-preview-img');
    const metaEl = document.getElementById('mem-preview-meta');

    if (uploadBox) uploadBox.style.display = 'none';
    if (previewBox) previewBox.style.display = 'flex';
    if (previewImg) previewImg.src = compressed.dataUrl;
    if (metaEl) metaEl.textContent = `${fileName} (${compressed.sizeKb} KB)`;
}

function removeMemScreenshot() {
    currentMemCompressedFile = null;
    const fileInput = document.getElementById('mem-screenshot-input');
    if (fileInput) fileInput.value = '';

    const uploadBox = document.getElementById('mem-upload-placeholder');
    const previewBox = document.getElementById('mem-upload-preview');
    if (uploadBox) uploadBox.style.display = '';
    if (previewBox) previewBox.style.display = 'none';
}

// ================= UTR HELP MODAL =================

function openMemUtrHelp() {
    const modal = document.getElementById('membership-utr-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeMemUtrHelp() {
    const modal = document.getElementById('membership-utr-modal');
    if (modal) modal.classList.add('hidden');
}

// ================= FORM SUBMISSION =================

function handleMembershipRegistration(event) {
    event.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('mem-website-pot');
    if (honeypot && honeypot.value.trim() !== '') return;

    // Validate UTR
    const upiUtr = document.getElementById('mem-upi-utr');
    if (!upiUtr || !/^[0-9]{12}$/.test(upiUtr.value.trim())) {
        showMemInputError(upiUtr, "Please enter your 12-digit UPI Transaction ID (UTR).");
        return;
    }

    // Validate Screenshot
    if (!currentMemCompressedFile || !currentMemCompressedFile.base64) {
        alert("Please upload your payment screenshot before completing registration.");
        return;
    }

    const name = document.getElementById('mem-name').value.trim();
    const dept = document.getElementById('mem-dept').value;
    const year = document.getElementById('mem-year').value;
    const phone = document.getElementById('mem-phone').value.trim();
    const email = document.getElementById('mem-email').value.trim();
    const fee = MEMBERSHIP_CONFIG.FEE; // 150

    const payload = {
        type: "club_membership",
        membershipTitle: "Robotics Club Lifetime College Pass",
        fee: fee,
        validity: "4-Year Lifetime (Entire College Period - No Renewals)",
        student: {
            name: name,
            dept: dept,
            year: year,
            phone: phone,
            email: email
        },
        upiUtr: upiUtr.value.trim(),
        fileData: currentMemCompressedFile.base64,
        fileType: currentMemCompressedFile.mimeType,
        registeredAt: new Date().toISOString()
    };

    setMemSubmitLoading(true);

    if (MEMBERSHIP_CONFIG.APPS_SCRIPT_URL && MEMBERSHIP_CONFIG.APPS_SCRIPT_URL !== "") {
        fetch(MEMBERSHIP_CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(() => {
                setMemSubmitLoading(false);
                closeMembershipModal();
                showMembershipPassModal(payload);
                resetMembershipForm();
            })
            .catch(err => {
                console.error("Membership submission error:", err);
                setMemSubmitLoading(false);
                closeMembershipModal();
                showMembershipPassModal(payload);
                resetMembershipForm();
            });
    } else {
        setTimeout(() => {
            setMemSubmitLoading(false);
            closeMembershipModal();
            showMembershipPassModal(payload);
            resetMembershipForm();
        }, 800);
    }
}

function setMemSubmitLoading(isLoading) {
    const btn = document.getElementById('mem-submit-btn');
    const text = document.getElementById('mem-submit-btn-text');
    const spinner = document.getElementById('mem-submit-spinner');

    if (!btn) return;
    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        if (text) text.textContent = "Verifying & Enrolling Member...";
        if (spinner) spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        if (spinner) spinner.classList.add('hidden');
    }
}

function resetMembershipForm() {
    const form = document.getElementById('membership-registration-form');
    if (form) form.reset();
    removeMemScreenshot();
    const validBadge = document.getElementById('mem-utr-valid-badge');
    if (validBadge) validBadge.classList.add('hidden');
    goToMembershipStep(1, false);
}

// ================= SUCCESS PASS MODAL =================

function showMembershipPassModal(data) {
    const modal = document.getElementById('membership-pass-modal');
    if (!modal) return;

    // Fill Pass details
    const nameEl = document.getElementById('pass-student-name');
    const deptEl = document.getElementById('pass-student-dept');
    const yearEl = document.getElementById('pass-student-year');
    const phoneEl = document.getElementById('pass-student-phone');
    const emailEl = document.getElementById('pass-student-email');
    const utrEl = document.getElementById('pass-utr-code');
    const passIdEl = document.getElementById('pass-reference-id');

    if (nameEl) nameEl.textContent = data.student.name;
    if (deptEl) deptEl.textContent = data.student.dept;
    if (yearEl) yearEl.textContent = data.student.year;
    if (phoneEl) phoneEl.textContent = data.student.phone;
    if (emailEl) emailEl.textContent = data.student.email;
    if (utrEl) utrEl.textContent = data.upiUtr;

    // Generate random Pass ID (e.g. UCE-RC-4029)
    const randomId = "UCE-RC-" + Math.floor(1000 + Math.random() * 9000);
    if (passIdEl) passIdEl.textContent = randomId;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

function closeMembershipPassModal() {
    const modal = document.getElementById('membership-pass-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 250);
}

// Check URL Hash on load
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#membership-register') {
        setTimeout(openMembershipModal, 300);
    }
});
