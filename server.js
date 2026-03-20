const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'event_portal_super_secret_key', // In production, use a secure env variable
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '/')));

// API Routes

// 1. Authentication Check API
app.get('/api/check_auth', (req, res) => {
    if (req.session.adminId) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// 2. Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Username and password required' });
    }

    db.get(`SELECT id, password FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Error checking password' });

            if (isMatch) {
                req.session.adminId = user.id;
                res.json({ status: 'success', message: 'Login successful' });
            } else {
                res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            }
        });
    });
});

// 3. Logout API
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ status: 'success', message: 'Logged out successfully' });
    });
});

// Middleware to protect admin routes
const requireAuth = (req, res, next) => {
    if (!req.session.adminId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    next();
};

// 4. Register API (Public)
app.post('/api/register', (req, res) => {
    const { fullName, email, branch, semester, phone, event } = req.body;

    if (!fullName || !email || !branch || !semester || !phone || !event) {
        return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    const sql = `INSERT INTO registrations (full_name, email, branch, semester, phone, event_id, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`;
    
    db.run(sql, [fullName, email, branch, semester, phone, event], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', message: 'Failed to register.' });
        }
        res.json({ status: 'success', message: 'Registration successful!', id: this.lastID });
    });
});

// 5. Submit Feedback API (Public)
app.post('/api/submit_feedback', (req, res) => {
    const { feedbackType, subject, details } = req.body;

    if (!feedbackType || !subject || !details) {
        return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    const sql = `INSERT INTO feedback (type, subject, details) VALUES (?, ?, ?)`;
    
    db.run(sql, [feedbackType, subject, details], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', message: 'Failed to submit feedback.' });
        }
        res.json({ status: 'success', message: 'Feedback submitted!' });
    });
});

// 6. Get Registrations API (Protected)
app.get('/api/get_registrations', requireAuth, (req, res) => {
    db.all(`SELECT * FROM registrations ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to retrieve registrations' });
        }
        res.json({ status: 'success', data: rows });
    });
});

// 7. Get Feedback API (Protected)
app.get('/api/get_feedback', requireAuth, (req, res) => {
    db.all(`SELECT * FROM feedback ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to retrieve feedback' });
        }
        res.json({ status: 'success', data: rows });
    });
});

// 8. Get Stats API (Protected)
app.get('/api/get_stats', requireAuth, (req, res) => {
    const stats = {
        total_registrations: 0,
        pending_review: 0,
        total_feedback: 0
    };

    db.get(`SELECT COUNT(*) as count FROM registrations`, [], (err, row) => {
        if (!err && row) stats.total_registrations = row.count;
        
        db.get(`SELECT COUNT(*) as count FROM registrations WHERE status = 'Pending'`, [], (err, row) => {
            if (!err && row) stats.pending_review = row.count;
            
            db.get(`SELECT COUNT(*) as count FROM feedback`, [], (err, row) => {
                if (!err && row) stats.total_feedback = row.count;
                res.json({ status: 'success', data: stats });
            });
        });
    });
});

// 9. Update Status API (Protected)
app.post('/api/update_status', requireAuth, (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }

    db.run(`UPDATE registrations SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) return res.status(500).json({ status: 'error', message: 'Failed to update status' });
        res.json({ status: 'success', message: 'Status updated' });
    });
});

// 10. Delete Registration API (Protected)
app.post('/api/delete_registration', requireAuth, (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ status: 'error', message: 'Missing ID' });
    }

    db.run(`DELETE FROM registrations WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ status: 'error', message: 'Failed to delete registration' });
        res.json({ status: 'success', message: 'Registration deleted' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
