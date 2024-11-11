const db = require('../config/database');
const { validationResult } = require('express-validator');

exports.list = (req, res) => {
    db.query(
        'SELECT c.id, c.name, c.surname, c.email, COUNT(l.client_id) AS linked_clients FROM contacts c LEFT JOIN client_contact_link l ON c.id = l.contact_id GROUP BY c.id ORDER BY CONCAT(c.surname, " ", c.name) ASC',
        (err, results) => {
            if (err) throw err;
            res.render('contacts', { contacts: results });
        }
    );
};

exports.create = (req, res) => {
    console.log(req.body);
    const { name, surname, email } = req.body;
    db.query('INSERT INTO contacts (name, surname, email) VALUES (?, ?, ?)', [name, surname, email], (err) => {
        if (err) throw err;
        res.redirect('/contacts');
    });
};

exports.listJSON = (req, res) => {
    db.query(
        'SELECT c.id, c.name, c.surname, c.email, COUNT(l.client_id) AS linked_clients FROM contacts c LEFT JOIN client_contact_link l ON c.id = l.contact_id GROUP BY c.id ORDER BY CONCAT(c.surname, " ", c.name) ASC',
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json(results); // Send the results as JSON
        }
    );
};

// Get linked clients for a contact
exports.getLinkedClients = (req, res) => {
    const contactId = req.params.contactId;
    db.query(
        'SELECT cl.id, cl.name, cl.client_code FROM clients cl INNER JOIN client_contact_link l ON cl.id = l.client_id WHERE l.contact_id = ?',
        [contactId],
        (err, results) => {
            if (err) throw err;
            res.json(results); // Send the linked clients as JSON
        }
    );
};

// Link clients to a contact
exports.linkClients = (req, res) => {
    const { contactId, linkIds } = req.body;
    
    if (!contactId || !Array.isArray(linkIds)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Delete existing links
    db.query('DELETE FROM client_contact_link WHERE contact_id = ?', [contactId], (err) => {
        if (err) throw err;

        // Insert new links
        const values = linkIds.map(clientId => [clientId, contactId]);
        db.query(
            'INSERT INTO client_contact_link (client_id, contact_id) VALUES ?',
            [values],
            (err) => {
                if (err) throw err;
                res.status(200).json({ message: 'Clients linked successfully' });
            }
        );
    });
};