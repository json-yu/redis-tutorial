const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController.js');

router.get('/', 
    apiController.checkCache, 
    apiController.callForHelp, 
    (req, res) => res.status(200).json(res.locals.hero)
);

module.exports = router;