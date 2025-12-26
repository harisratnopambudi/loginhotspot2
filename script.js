document.addEventListener('DOMContentLoaded', () => {

    // --- Copy to Clipboard Functionality ---
    const copyElements = document.querySelectorAll('.copy-trigger');
    copyElements.forEach(el => {
        el.addEventListener('click', () => {
            const text = el.getAttribute('data-copy');
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast(`Copied: ${text}`, 'success');
                }).catch(err => {
                    console.error('Copy failed', err);
                    showToast('Failed to copy', 'error');
                });
            }
        });
    });

    // --- Login Form Handling ---
    const loginForm = document.querySelector('form[action*="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const btn = loginForm.querySelector('button[type="submit"]');
            if (btn) {
                // Only run spinner if not blocked by cooldown overlay
                if (!btn.disabled) {
                    btn.classList.add('loading');
                    setTimeout(() => {
                        btn.disabled = true;
                    }, 100);
                }
            }
        });
    }

    // --- Menu Search Filter (DOM-based) ---
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.menu-item');

            items.forEach(item => {
                const name = item.querySelector('.item-name')?.innerText.toLowerCase() || '';
                if (name.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- Slideshow Logic ---
    let slideIndex = 0;
    const slides = document.getElementsByClassName("slide");

    if (slides.length > 0) {
        showSlides();
    }

    function showSlides() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 4000); // Change image every 4 seconds
    }
});

// --- Toast Notification (Helper for script.js internal usage) ---
// Note: The protection script has its own showToast function. 
// If they conflict, the one loaded last (inline protection) might override globally, 
// which is fine as long as it handles the logic. 
// However, since script.js loads via <script src> and protection is inline at body end, 
// we should check if it exists or use our own name if needed. 
// But the protection script defines it inside an IIFE (mostly) or global? 
// Protection script defines `showToast` inside IIFE? 
// Wait, the protection script defines `showToast` inside the IIFE `(function () { ... })()`. 
// So it is NOT global. We need our own here for the copy function.

function showToast(msg, type = 'success') {
    // Try to find the toast container defined by protection script
    let container = document.getElementById('toastContainer');

    // If not found (protection inactive?), fallback to simple toast
    if (!container) {
        let toast = document.querySelector('.toast-fallback');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast toast-fallback'; // Use toast class for style
            if (type === 'error') toast.style.border = '1px solid #ef4444';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
        return;
    }

    // If container exists, use the protection style toast structure
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    // Simple icons for fallback
    const icons = {
        error: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        success: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        warning: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
    };

    // Add toast to container
    toast.innerHTML = `${icons[type] || icons.success}<span>${msg}</span>`;
    container.appendChild(toast);

    // Remove after timeout
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
