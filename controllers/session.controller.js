const mongoose = require('mongoose');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');

module.exports.create = (req, res, next) => {
    const book = new Book(req.body);
    book.save()
      .then(() => {
        res.status(201).json(book);
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
  