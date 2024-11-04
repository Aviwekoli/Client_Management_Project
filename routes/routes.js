// routes/routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const ClientController = require('../controllers/clientController');
const ContactController = require('../controllers/contactController');
const { body } = require('express-validator');

// Root route
router.get('/', (req, res) => {
    res.render('index'); // Render the index view
});

//Client Routes
router.get('/clients', ClientController.list);
router.post('/clients', upload.none(), [
    body('name').notEmpty().withMessage('Client name is required.')
], ClientController.create);


// Contact Routes
router.get('/contacts', ContactController.list);
router.post('/contacts', upload.none(), [
    body('name').notEmpty().withMessage('Contact name is required.'),
    body('surname').notEmpty().withMessage('Contact surname is required.'),
    body('email').isEmail().withMessage('Invalid email format.')
], ContactController.create);

module.exports = router;