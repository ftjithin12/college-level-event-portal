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

// --- API Integrations ---

// Registration Form Submission
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
        btn.disabled = true;

        const formData = new FormData(this);

        fetch('api/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            if (data.status === 'success') {
                alert('Registration Successful!');
                this.reset();
                // Optionally switch page or stay
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('A network error occurred. Please try again later.');
        });
    });
}

// Feedback Form Submission
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Submitting...';
        btn.disabled = true;

        const formData = new FormData(this);

        fetch('api/submit_feedback.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            btn.innerHTML = originalText;
            btn.disabled = false;

            if (data.status === 'success') {
                alert('Thank you for your feedback!');
                this.reset();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('A network error occurred. Please try again later.');
        });
    });
}

// Fetch Registrations for Admin Dashboard
function fetchRegistrations() {
    fetch('api/get_registrations.php')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const tableBody = document.querySelector('.table-container tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = ''; // Clear existing rows
            
            data.data.forEach(reg => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div style="font-weight: 500">${reg.full_name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted)">${reg.email}</div>
                    </td>
                    <td>${reg.branch}</td>
                    <td>${reg.event_id}</td>
                    <td>
                        <span class="tag success">Registered</span>
                    </td>
                    <td>
                        <button class="icon-btn" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                        <button class="icon-btn" title="Delete"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            
            // Optionally update stats cards (Total Registrations)
             const totalRegElement = document.getElementById('stat-total-reg');
             if(totalRegElement) {
                 totalRegElement.textContent = data.data.length;
             }
        }
    })
    .catch(error => console.error('Error fetching registrations:', error));
}

