// controllers/clientController.js
const db = require('../config/database');
const { validationResult } = require('express-validator');

exports.list = (req, res) => {
    console.log(req.body);
    db.query('SELECT c.id, c.name, c.client_code, COUNT(l.contact_id) AS linked_accounts FROM clients c LEFT JOIN client_contact_link l ON c.id = l.client_id GROUP BY c.id ORDER BY c.name ASC', (err, results) => {
        if (err) throw err;
        res.render('clients', { clients: results });
    });
};

exports.create = (req, res) => {
    const { name } = req.body;
    const clientCode = generateClientCode(name);

    db.query('INSERT INTO clients (name, client_code) VALUES (?, ?)', [name, clientCode], (err) => {
        if (err) throw err;
        res.redirect('/clients');
    });
};

exports.create = (req, res) => {
    const { name } = req.body;

    // Fetch existing client codes to ensure uniqueness
    db.query('SELECT client_code FROM clients', (err, results) => {
        if (err) throw err;

        // Extract existing codes
        const existingCodes = results.map(client => client.client_code);

        // Generate new client code
        const clientCode = generateClientCode(name, existingCodes);

        db.query('INSERT INTO clients (name, client_code) VALUES (?, ?)', [name, clientCode], (err) => {
            if (err) throw err;
            res.redirect('/clients'); // Redirect after saving
        });
    });
};

function generateClientCode(clientName, existingCodes) {
    // Normalize the client name
    const normalizedName = clientName.trim().toUpperCase();
    
    // Generate alpha part based on the normalized name
    let alphaPart = '';

    if (normalizedName.includes(' ')) {
        // Split by whitespace and get first letters
        const words = normalizedName.split(/\s+/);
        alphaPart = words.map(word => word.charAt(0)).join('').substring(0, 3); // Get initials and limit to 3 characters
    } else {
        // If single name, take the first three characters
        alphaPart = normalizedName.substring(0, 3);
        
        // If the name has less than 3 characters, pad it with the next letter
        if (alphaPart.length < 3) {
            alphaPart += String.fromCharCode('A'.charCodeAt(0) + alphaPart.length); // Add next letter
        }
    }

    // Ensure alphaPart is exactly 3 characters
    while (alphaPart.length < 3) {
        alphaPart += 'A'; // Pad with 'A' if still less than 3
    }

    // Find existing numeric suffixes for the alphaPart
    const existingNumbers = existingCodes
        .filter(code => code.startsWith(alphaPart))
        .map(code => parseInt(code.substring(3))) // Extract numeric part
        .sort((a, b) => a - b); // Sort numerics

    // Determine the next numeric part
    let nextNumericPart = 1; // Start from 1
    if (existingNumbers.length > 0) {
        nextNumericPart = existingNumbers[existingNumbers.length - 1] + 1; // Increment the highest existing number
    }

    // Format the numeric part to ensure it is 3 digits
    const numericPart = nextNumericPart.toString().padStart(3, '0');

    return alphaPart + numericPart; // Return the complete client code
}
