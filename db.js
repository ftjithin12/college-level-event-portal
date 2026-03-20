const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'event_portal.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize Schema
        db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`);

            // Registrations table
            db.run(`CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                branch TEXT NOT NULL,
                semester TEXT NOT NULL,
                phone TEXT NOT NULL,
                event_id TEXT NOT NULL,
                status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Feedback table
            db.run(`CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                subject TEXT NOT NULL,
                details TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Insert default admin user if not exists
            const defaultUser = 'admin';
            const defaultPass = 'admin123';
            
            db.get(`SELECT id FROM users WHERE username = ?`, [defaultUser], (err, row) => {
                if (!err && !row) {
                    bcrypt.hash(defaultPass, 10, (err, hash) => {
                        if (!err) {
                            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [defaultUser, hash]);
                            console.log('Default admin seeded.');
                        }
                    });
                }
            });
        });
    }
});

module.exports = db;
