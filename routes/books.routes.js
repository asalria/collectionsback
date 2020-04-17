const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books.controller');
const booksMiddleware = require('../middleware/books.middleware');

router.get('/', bookController.list);
router.get('/:id', booksMiddleware.checkValidId, bookController.get);
router.post('/', bookController.create);
router.put('/:id', booksMiddleware.checkValidId, bookController.edit);
router.delete('/:id', booksMiddleware.checkValidId, bookController.delete);

module.exports = router;