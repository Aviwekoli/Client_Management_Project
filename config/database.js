// config/database.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8743811',         
    password: 'QinVKHIC5A', 
    database: 'sql8743811'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database.');
    }
});

module.exports = db;