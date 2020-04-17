const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

router.post('/session', sessionController.create);
router.delete('/session', sessionController.delete);

module.exports = router;