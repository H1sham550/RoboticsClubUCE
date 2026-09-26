/**
 * =========================================================================
 * ROBOTICS CLUB UCE - MULTI-STEP MINIMAL EVENT REGISTRATION ENGINE
 * =========================================================================
 * Clean 2-step flow:
 * Step 1: Team & Member Details + Club Membership Tier Choice
 * Step 2: Dynamic Payment QR (₹40 / ₹50 / ₹60), UTR Entry & Screenshot Upload
 * =========================================================================
 */

// Global Configuration
const EVENT_REG_CONFIG = {
    // Google Apps Script Web App URL
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxK2pGEGF4pAY5ihljtPu-_6-CCY53qlQodWqA5K7gXudr-yOSrq9sTHoTVokTPK-WXTA/exec",

    // Club UPI Details
    DEFAULT_UPI_ID: "roboticsclubuce@upi",
    PAYEE_NAME: "Robotics Club UCE",

    // Payment QR Images (real JPEGs take priority, SVGs as fallback)
    QR_IMAGES: {
        40: "assets/payment_qr/40.jpeg",
        50: "assets/payment_qr/50.jpeg",
        60: "assets/payment_qr/60.jpeg"
    },
    QR_FALLBACKS: {
        40: "assets/qr-40.svg",
        50: "assets/qr-50.svg",
        60: "assets/qr-60.svg"
    }
};

// Event Info
const ACTIVE_EVENT = {
    id: "ctf-2026",
    name: "Capture The Flag (CTF) Challenge",
    category: "CYBERSECURITY & HACKATHON",
    teamSize: 2,
    maxTeams: 20,
    venue: "College Computer Lab (Provided On-site)"
};

// Pricing Tiers Definition
const TIER_FEES = {
    'both': {
        fee: 40,
        label: "Both Club Members (₹40)",
        badge: "Both Club Members (₹20/head)",
        m1: true,
        m2: true
    },
    'one': {
        fee: 50,
        label: "1 Member + 1 Non-Member (₹50)",
        badge: "1 Club Member + 1 Non-Member",
        m1: true,
        m2: false
    },
    'none': {
        fee: 60,
        label: "Non-Club Members (₹60)",
        badge: "Non-Club Members (₹30/head)",
        m1: false,
        m2: false
    }
};

// Current Wizard State
let currentStep = 1;
let selectedTier = 'both'; // 'both' (₹40), 'one' (₹50), 'none' (₹60)
let currentCompressedFile = null;

// ================= MODAL OPEN / CLOSE =================

function openRegistrationModal(eventId) {
    const modal = document.getElementById('event-reg-modal');
    if (!modal) return;

    // Reset wizard to Step 1
    goToStep(1, false);

    // Default to Both Club Members (₹40)
    selectMembershipTier('both');

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const inner = modal.querySelector('.modal-card-content');
        if (inner) inner.style.transform = 'scale(1)';
    });
}

function closeRegistrationModal() {
    const modal = document.getElementById('event-reg-modal');
    if (!modal) return;

    modal.style.opacity = '0';
    const inner = modal.querySelector('.modal-card-content');
    if (inner) inner.style.transform = 'scale(0.96)';

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        goToStep(1, false);
    }, 250);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const utrModal = document.getElementById('utr-help-modal');
        if (utrModal && !utrModal.classList.contains('hidden')) {
            closeUtrHelp();
            return;
        }
        const ticketModal = document.getElementById('reg-ticket-modal');
        if (ticketModal && !ticketModal.classList.contains('hidden')) {
            closeTicketModal();
            return;
        }
        closeRegistrationModal();
    }
});

// ================= STEP NAVIGATION =================

function goToStep(stepNumber, shouldValidate = true) {
    if (stepNumber === 2 && shouldValidate) {
        if (!validateStep1()) return;
    }

    currentStep = stepNumber;

    const step1El = document.getElementById('reg-step-1');
    const step2El = document.getElementById('reg-step-2');
    const footer1El = document.getElementById('footer-step-1');
    const footer2El = document.getElementById('footer-step-2');
    const stepBadge = document.getElementById('gform-step-badge');
    const stepTitle = document.getElementById('gform-step-title');

    if (stepNumber === 1) {
        if (step1El) step1El.classList.remove('hidden');
        if (step2El) step2El.classList.add('hidden');
        if (footer1El) footer1El.classList.remove('hidden');
        if (footer2El) footer2El.classList.add('hidden');
        if (stepBadge) {
            stepBadge.textContent = "Page 1 of 2";
            stepBadge.className = "px-2.5 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan font-bold border border-brand-cyan/30 text-[11px]";
        }
        if (stepTitle) stepTitle.textContent = "Team & Participant Details";
    } else if (stepNumber === 2) {
        if (step1El) step1El.classList.add('hidden');
        if (step2El) step2El.classList.remove('hidden');
        if (footer1El) footer1El.classList.add('hidden');
        if (footer2El) footer2El.classList.remove('hidden');
        if (stepBadge) {
            stepBadge.textContent = "Page 2 of 2";
            stepBadge.className = "px-2.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40 text-[11px]";
        }
        if (stepTitle) stepTitle.textContent = "Payment & Verification";

        // Update payment summary & QR in Step 2
        updateStep2PaymentView();
    }

    // Scroll modal body and outer overlay container to top smoothly
    const modalBody = document.getElementById('modal-scroll-body');
    if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    const modal = document.getElementById('event-reg-modal');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= MEMBERSHIP SELECTION & PRICING =================

function selectMembershipTier(tier) {
    if (!TIER_FEES[tier]) tier = 'both';
    selectedTier = tier;

    const tiers = ['both', 'one', 'none'];
    tiers.forEach(t => {
        const row = document.getElementById(`row-membership-${t}`);
        const radio = document.getElementById(`radio-membership-${t}`);
        if (radio) radio.checked = (t === tier);
        if (row) {
            if (t === tier) {
                if (t === 'none') {
                    row.className = "flex items-center justify-between p-3.5 rounded-xl border-2 border-brand-orange bg-brand-orange/15 cursor-pointer transition-all";
                } else {
                    row.className = "flex items-center justify-between p-3.5 rounded-xl border-2 border-brand-cyan bg-brand-cyan/15 cursor-pointer transition-all";
                }
            } else {
                row.className = "flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-slate-950/60 hover:border-white/25 cursor-pointer transition-all";
            }
        }
    });

    const fee = TIER_FEES[tier].fee;
    const nextBtnFee = document.getElementById('step1-btn-fee');
    if (nextBtnFee) nextBtnFee.textContent = `₹${fee}`;
}

// Backward compatibility alias
function selectMembership(type) {
    if (type === 'member') selectMembershipTier('both');
    else selectMembershipTier('none');
}

function updateStep2PaymentView() {
    const tierConfig = TIER_FEES[selectedTier] || TIER_FEES['both'];
    const fee = tierConfig.fee;
    const teamNameInput = document.getElementById('reg-team-name');
    const teamName = (teamNameInput && teamNameInput.value.trim()) ? teamNameInput.value.trim() : "Team";

    // Summary texts
    const summaryTeam = document.getElementById('step2-summary-team');
    const summaryFee = document.getElementById('step2-summary-fee');
    const summaryBadge = document.getElementById('step2-summary-badge');
    const submitBtnText = document.getElementById('reg-submit-btn-text');

    if (summaryTeam) summaryTeam.textContent = teamName;
    if (summaryFee) summaryFee.textContent = `₹${fee}`;
    if (submitBtnText) submitBtnText.textContent = `Submit Registration (₹${fee})`;

    if (summaryBadge) {
        summaryBadge.textContent = tierConfig.badge;
        if (selectedTier === 'none') {
            summaryBadge.className = "text-[11px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full border border-brand-orange/25";
        } else {
            summaryBadge.className = "text-[11px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-2.5 py-0.5 rounded-full border border-brand-cyan/25";
        }
    }

    // Update QR Code Image (tries PNG first, falls back to SVG)
    const qrImg = document.getElementById('reg-qr-image');
    if (qrImg) {
        const primarySrc = EVENT_REG_CONFIG.QR_IMAGES[fee] || `assets/qr-${fee}.svg`;
        const fallbackSrc = EVENT_REG_CONFIG.QR_FALLBACKS[fee] || `assets/qr-${fee}.svg`;

        qrImg.onerror = function () {
            this.onerror = null;
            this.src = fallbackSrc;
        };
        qrImg.src = primarySrc;
    }

    // Update UPI Deep Link for Mobile App click
    const note = encodeURIComponent(`CTF 2026 - ${teamName}`);
    const upiUri = `upi://pay?pa=${EVENT_REG_CONFIG.DEFAULT_UPI_ID}&pn=${encodeURIComponent(EVENT_REG_CONFIG.PAYEE_NAME)}&am=${fee}&cu=INR&tn=${note}`;

    const upiLinkBtn = document.getElementById('reg-upi-app-link');
    if (upiLinkBtn) {
        upiLinkBtn.href = upiUri;
    }

    const upiDisplay = document.getElementById('reg-upi-id-display');
    if (upiDisplay) {
        upiDisplay.textContent = EVENT_REG_CONFIG.DEFAULT_UPI_ID;
    }
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = EVENT_REG_CONFIG.DEFAULT_UPI_ID;
    navigator.clipboard.writeText(upiId).then(() => {
        const copyBtn = document.getElementById('reg-copy-upi-btn');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> <span>Copied!</span>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }
    }).catch(err => {
        console.error("Failed to copy UPI ID: ", err);
    });
}

// ================= VALIDATION =================

function validateStep1() {
    const teamName = document.getElementById('reg-team-name');
    const m1Name = document.getElementById('reg-m1-name');
    const m1Dept = document.getElementById('reg-m1-dept');
    const m1Year = document.getElementById('reg-m1-year');
    const m1Phone = document.getElementById('reg-m1-phone');

    const m2Name = document.getElementById('reg-m2-name');
    const m2Dept = document.getElementById('reg-m2-dept');
    const m2Year = document.getElementById('reg-m2-year');
    const m2Phone = document.getElementById('reg-m2-phone');

    if (!teamName || !teamName.value.trim()) {
        showInputError(teamName, "Please enter your Team Name.");
        return false;
    }
    if (!m1Name || !m1Name.value.trim()) {
        showInputError(m1Name, "Please enter Member 1 (Team Leader) Name.");
        return false;
    }
    if (!m1Dept || !m1Dept.value) {
        showInputError(m1Dept, "Please select Member 1 Department.");
        return false;
    }
    if (!m1Year || !m1Year.value) {
        showInputError(m1Year, "Please select Member 1 Year.");
        return false;
    }
    if (!m1Phone || !/^[0-9]{10}$/.test(m1Phone.value.trim())) {
        showInputError(m1Phone, "Please enter a valid 10-digit WhatsApp number for Member 1.");
        return false;
    }

    if (!m2Name || !m2Name.value.trim()) {
        showInputError(m2Name, "Please enter Member 2 (Teammate) Name.");
        return false;
    }
    if (!m2Dept || !m2Dept.value) {
        showInputError(m2Dept, "Please select Member 2 Department.");
        return false;
    }
    if (!m2Year || !m2Year.value) {
        showInputError(m2Year, "Please select Member 2 Year.");
        return false;
    }
    if (!m2Phone || !/^[0-9]{10}$/.test(m2Phone.value.trim())) {
        showInputError(m2Phone, "Please enter a valid 10-digit WhatsApp number for Member 2.");
        return false;
    }

    return true;
}

function showInputError(element, message) {
    if (!element) return;
    element.focus();
    element.classList.add('border-red-500', 'ring-2', 'ring-red-500/30');
    setTimeout(() => {
        element.classList.remove('border-red-500', 'ring-2', 'ring-red-500/30');
    }, 3000);
    alert(message);
}

// Live UTR format validator
function validateUtrInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    const badge = document.getElementById('reg-utr-valid-badge');
    if (badge) {
        if (input.value.length === 12) {
            badge.classList.remove('hidden');
            badge.innerHTML = '<span class="text-green-400 font-mono text-xs flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-xs"></i> 12-Digit UTR Complete</span>';
        } else if (input.value.length > 0) {
            badge.classList.remove('hidden');
            badge.innerHTML = `<span class="text-slate-400 font-mono text-xs">${12 - input.value.length} digits left</span>`;
        } else {
            badge.classList.add('hidden');
        }
    }
}

// ================= IMAGE COMPRESSOR =================

function handleScreenshotSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file (PNG, JPG, or WEBP).");
        event.target.value = '';
        return;
    }

    const statusEl = document.getElementById('reg-upload-status');
    if (statusEl) {
        statusEl.textContent = "Optimizing screenshot for quick upload...";
        statusEl.classList.remove('hidden');
    }

    compressImage(file, 1200, 1200, 0.75)
        .then(compressed => {
            currentCompressedFile = compressed;
            showScreenshotPreview(compressed, file.name);
            if (statusEl) statusEl.classList.add('hidden');
        })
        .catch(err => {
            console.error("Compression error:", err);
            if (statusEl) statusEl.textContent = "Could not optimize image, using original file.";
        });
}

function compressImage(file, maxWidth, maxHeight, quality) {
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

function showScreenshotPreview(compressed, fileName) {
    const uploadBox = document.getElementById('reg-upload-placeholder');
    const previewBox = document.getElementById('reg-upload-preview');
    const previewImg = document.getElementById('reg-preview-img');
    const metaEl = document.getElementById('reg-preview-meta');

    if (uploadBox) uploadBox.classList.add('hidden');
    if (previewBox) previewBox.classList.remove('hidden');
    if (previewImg) previewImg.src = compressed.dataUrl;
    if (metaEl) metaEl.textContent = `${fileName} (${compressed.sizeKb} KB)`;
}

function removeScreenshot() {
    currentCompressedFile = null;
    const fileInput = document.getElementById('reg-screenshot-input');
    if (fileInput) fileInput.value = '';

    const uploadBox = document.getElementById('reg-upload-placeholder');
    const previewBox = document.getElementById('reg-upload-preview');
    if (uploadBox) uploadBox.classList.remove('hidden');
    if (previewBox) previewBox.classList.add('hidden');
}

// ================= UTR HELP MODAL =================

function openUtrHelp() {
    const modal = document.getElementById('utr-help-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeUtrHelp() {
    const modal = document.getElementById('utr-help-modal');
    if (modal) modal.classList.add('hidden');
}

// ================= FINAL FORM SUBMISSION =================

function handleEventRegistration(event) {
    event.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('reg-website-pot');
    if (honeypot && honeypot.value.trim() !== '') return;

    // Validate UTR
    const upiUtr = document.getElementById('reg-upi-utr');
    if (!upiUtr || !/^[0-9]{12}$/.test(upiUtr.value.trim())) {
        showInputError(upiUtr, "Please enter a valid 12-digit UPI Transaction ID (UTR).");
        return;
    }

    // Validate Screenshot
    if (!currentCompressedFile || !currentCompressedFile.base64) {
        alert("Please upload your payment screenshot proof before completing registration.");
        return;
    }

    // Gather all details
    const teamName = document.getElementById('reg-team-name').value.trim();
    const tierConfig = TIER_FEES[selectedTier] || TIER_FEES['both'];
    const feeTotal = tierConfig.fee;

    const payload = {
        eventId: ACTIVE_EVENT.id,
        eventName: ACTIVE_EVENT.name,
        teamName: teamName,
        feeTotal: feeTotal,
        membershipType: tierConfig.label,
        member1: {
            name: document.getElementById('reg-m1-name').value.trim(),
            dept: document.getElementById('reg-m1-dept').value,
            year: document.getElementById('reg-m1-year').value,
            phone: document.getElementById('reg-m1-phone').value.trim(),
            email: "",
            isMember: tierConfig.m1
        },
        member2: {
            name: document.getElementById('reg-m2-name').value.trim(),
            dept: document.getElementById('reg-m2-dept').value,
            year: document.getElementById('reg-m2-year').value,
            phone: document.getElementById('reg-m2-phone').value.trim(),
            email: "",
            isMember: tierConfig.m2
        },
        upiUtr: upiUtr.value.trim(),
        fileData: currentCompressedFile.base64,
        fileType: currentCompressedFile.mimeType
    };

    // UI Loading state
    setSubmitButtonLoading(true);

    if (EVENT_REG_CONFIG.APPS_SCRIPT_URL && EVENT_REG_CONFIG.APPS_SCRIPT_URL !== "") {
        fetch(EVENT_REG_CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(() => {
                setSubmitButtonLoading(false);
                closeRegistrationModal();
                showTicketModal(payload);
                resetRegistrationForm();
            })
            .catch(err => {
                console.error("Submission error:", err);
                setSubmitButtonLoading(false);
                closeRegistrationModal();
                showTicketModal(payload);
                resetRegistrationForm();
            });
    } else {
        setTimeout(() => {
            setSubmitButtonLoading(false);
            closeRegistrationModal();
            showTicketModal(payload);
            resetRegistrationForm();
        }, 800);
    }
}

function setSubmitButtonLoading(isLoading) {
    const btn = document.getElementById('reg-submit-btn');
    const text = document.getElementById('reg-submit-btn-text');
    const spinner = document.getElementById('reg-submit-spinner');

    if (!btn) return;
    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        if (text) text.textContent = "Verifying & Reserving Slot...";
        if (spinner) spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        if (spinner) spinner.classList.add('hidden');
    }
}

function resetRegistrationForm() {
    const form = document.getElementById('event-registration-form');
    if (form) form.reset();
    removeScreenshot();
    const validBadge = document.getElementById('reg-utr-valid-badge');
    if (validBadge) validBadge.classList.add('hidden');
    goToStep(1, false);
    selectMembershipTier('both');
}

// ================= SUCCESS TICKET MODAL =================

function showTicketModal(data) {
    const modal = document.getElementById('reg-ticket-modal');
    if (!modal) return;

    const teamEl = document.getElementById('ticket-team-name');
    const eventEl = document.getElementById('ticket-event-name');
    const m1El = document.getElementById('ticket-m1');
    const m2El = document.getElementById('ticket-m2');
    const feeEl = document.getElementById('ticket-fee');
    const utrEl = document.getElementById('ticket-utr');

    if (teamEl) teamEl.textContent = data.teamName;
    if (eventEl) eventEl.textContent = data.eventName;
    if (m1El) m1El.textContent = `${data.member1.name} (${data.member1.dept} - ${data.member1.year})`;
    if (m2El) m2El.textContent = `${data.member2.name} (${data.member2.dept} - ${data.member2.year})`;
    if (feeEl) feeEl.textContent = `₹${data.feeTotal}`;
    if (utrEl) utrEl.textContent = data.upiUtr;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

function closeTicketModal() {
    const modal = document.getElementById('reg-ticket-modal');
    if (!modal) return;

    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 250);
}

// ================= CTF CARD READ MORE TOGGLE =================

function toggleCtfDetails(btn) {
    const drawer = document.getElementById('ctf-details-drawer');
    if (!drawer) return;
    const isHidden = drawer.classList.contains('hidden');
    const toggleText = btn ? btn.querySelector('.toggle-text') : null;
    const icon = btn ? btn.querySelector('.fa-chevron-down') : null;

    if (isHidden) {
        drawer.classList.remove('hidden');
        if (toggleText) toggleText.textContent = 'Hide Details & Rules';
        if (icon) icon.classList.add('rotate-180');
    } else {
        drawer.classList.add('hidden');
        if (toggleText) toggleText.textContent = 'View Event Details, Rules & Perks';
        if (icon) icon.classList.remove('rotate-180');
    }
}
