const mongoose = require('mongoose');
const Book = require('../models/book.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  Book.find()
    .then(books => res.json(books))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Book.findById(id)
    .then(book => {
      if (book) {
        res.json(book)
      } else {
        next(new ApiError(`Book not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  const book = new Book(req.body);
  book.save()
    .then(() => {
      res.status(201).json(Book);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error);
        next(new ApiError(error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    })
}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;
  Book.findByIdAndRemove(id)
    .then(book => {
      if (book) {
        res.status(204).json()
      } else {
        next(new ApiError(`Book not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;
  Book.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(book => {
      if (book) {
        res.status(200).json(book)
      } else {
        next(new ApiError(`Book not found`, 404));
      }
    }).catch(error => next(error));
}