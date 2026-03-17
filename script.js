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
        
        // Fetch dashboard data when entering the admin tab
        if (targetId === 'admin' && isLoggedIn) {
            fetchDashboardData();
        }
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

// Real Auth via API
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Logging in...';
    submitBtn.disabled = true;

    fetch('api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (data.status === 'success') {
            isLoggedIn = true;
            closeLoginModal();

            // Resume navigation to Admin
            if (pendingTarget) {
                const targetId = pendingTarget.getAttribute('data-target');
                navigateTo(targetId);
                updateActiveNav(pendingTarget);
                
                // Fetch fresh data when entering admin panel
                fetchDashboardData();
            }
        } else {
            loginError.textContent = data.message || 'Invalid credentials';
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
        loginError.textContent = 'Server error. Try again.';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

// Check Session on Load
function checkSession() {
    fetch('api/check_auth.php')
    .then(res => res.json())
    .then(data => {
        isLoggedIn = data.authenticated;
    })
    .catch(err => console.error('Error checking session:', err));
}

// Call on load
document.addEventListener('DOMContentLoaded', checkSession);

// Updated Admin data fetcher (Calls stats, registrations, and feedback)
function fetchDashboardData() {
    fetchRegistrations();
    fetchStats();
    fetchFeedback();
}

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
    .then(response => {
        if (!response.ok) throw new Error('Unauthorized');
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            const tableBody = document.querySelector('.table-container tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            data.data.forEach(reg => {
                const tr = document.createElement('tr');
                const statusClass = reg.status === 'Confirmed' ? 'success' : 'pending';
                
                tr.innerHTML = `
                    <td>
                        <div style="font-weight: 500">${reg.full_name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted)">${reg.email}</div>
                    </td>
                    <td>${reg.branch}</td>
                    <td>${reg.event_id}</td>
                    <td>
                        <span class="tag ${statusClass}">${reg.status}</span>
                    </td>
                    <td>
                        <button class="icon-btn" title="Toggle Status" onclick="toggleStatus(${reg.id}, '${reg.status}')"><i class="ph ph-arrows-left-right"></i></button>
                        <button class="icon-btn" title="Delete" onclick="deleteReg(${reg.id})"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    })
    .catch(error => {
        if(error.message === 'Unauthorized') {
             isLoggedIn = false;
             navigateTo('registration');
        }
        console.error('Error:', error);
    });
}

function fetchStats() {
    fetch('api/get_stats.php')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('stat-total-reg').textContent = data.data.total_registrations;
            document.getElementById('stat-pending-rev').textContent = data.data.pending_review;
            document.getElementById('stat-total-feedback').textContent = data.data.total_feedback;
        }
    })
    .catch(err => console.error(err));
}

function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Pending' ? 'Confirmed' : 'Pending';
    fetch('api/update_status.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            fetchDashboardData();
        } else {
            alert(data.message);
        }
    });
}

function deleteReg(id) {
    if(!confirm('Are you sure you want to delete this registration?')) return;
    
    fetch('api/delete_registration.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            fetchDashboardData();
        } else {
            alert(data.message);
        }
    });
}

// Placeholder for Feedback fetching (needs HTML container to render)
function fetchFeedback() {
    fetch('api/get_feedback.php')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            const container = document.getElementById('feedback-list');
            if (!container) return;
            container.innerHTML = '';
            
            if (!data.data || data.data.length === 0) {
                container.innerHTML = '<p style="padding: 1rem; color: var(--text-muted); text-align: center;">No feedback has been submitted yet.</p>';
                return;
            }

            data.data.forEach(item => {
                container.innerHTML += `
                    <div style="padding: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <strong>${item.subject}</strong>
                            <span class="tag pending">${item.type}</span>
                        </div>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin:0;">${item.details}</p>
                        <small style="color: var(--text-muted); display:block; margin-top: 0.5rem;">${item.created_at}</small>
                    </div>
                `;
            });
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('api/logout.php')
        .then(() => {
            isLoggedIn = false;
            alert('Logged out successfully');
            navigateTo('registration');
            updateActiveNav(document.querySelector('[data-target="registration"]'));
        });
    });
}
