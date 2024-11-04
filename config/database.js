// config/database.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         
    password: 'Aviwe@6263', 
    database: 'client_management'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database.');
    }
});

module.exports = db;