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
