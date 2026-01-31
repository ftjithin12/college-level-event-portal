// State
let isLoggedIn = false;
let pendingTarget = null;

// DOM Elements
const navItems = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const closeLoginBtn = document.getElementById('close-login');
const loginError = document.getElementById('login-error');

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');

        // Check Auth for Admin
        if (targetId === 'admin' && !isLoggedIn) {
            pendingTarget = item; // Remember where they wanted to go
            openLoginModal();
            return;
        }

        navigateTo(targetId);
        updateActiveNav(item);
    });
});

function navigateTo(targetId) {
    pages.forEach(page => {
        if (page.id === targetId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

function updateActiveNav(activeItem) {
    navItems.forEach(nav => nav.classList.remove('active'));
    activeItem.classList.add('active');
}

// Login Modal Logic
function openLoginModal() {
    loginModal.classList.add('open');
    loginForm.reset();
    loginError.textContent = '';
}

function closeLoginModal() {
    loginModal.classList.remove('open');
    pendingTarget = null;
}

closeLoginBtn.addEventListener('click', closeLoginModal);

// Close on outside click
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLoginModal();
});

// Mock Auth
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        closeLoginModal();

        // Resume navigation to Admin
        if (pendingTarget) {
            const targetId = pendingTarget.getAttribute('data-target');
            navigateTo(targetId);
            updateActiveNav(pendingTarget);
        }

        alert('Welcome Admin!');
    } else {
        loginError.textContent = 'Invalid credentials (try admin / admin123)';
    }
});
