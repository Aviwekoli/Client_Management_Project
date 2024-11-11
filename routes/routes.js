// // routes/routes.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer(); 
// const ClientController = require('../controllers/clientController');
// const ContactController = require('../controllers/contactController');
// const { body } = require('express-validator');

// // Root route
// router.get('/', (req, res) => {
//     res.render('index'); // Render the index view
// });

// //Client Routes
// router.get('/clients', ClientController.list);
// router.post('/clients', upload.none(), [
//     body('name').notEmpty().withMessage('Client name is required.')
// ], ClientController.create);


// // Contact Routes
// router.get('/contacts', ContactController.list);
// router.post('/contacts', upload.none(), [
//     body('name').notEmpty().withMessage('Contact name is required.'),
//     body('surname').notEmpty().withMessage('Contact surname is required.'),
//     body('email').isEmail().withMessage('Invalid email format.')
// ], ContactController.create);

// router.post('/clients/link-contact', ClientController.linkContact);

// module.exports = router;

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

// Client Routes
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

// Link multiple contacts to a client
router.post('/clients/linkContacts', upload.none(), ClientController.linkContacts);

// Add this route to fetch linked contacts for a specific client
router.get('/clients/:clientId/linkedContacts', ClientController.getLinkedContacts);

router.get('/contacts/json', ContactController.listJSON);

module.exports = router;
