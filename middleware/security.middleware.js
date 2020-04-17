const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.isAdmin = (req, res, next) => {
    User.findById(req.user._id).then((user) => {
        if( user.role == "ADMIN" ){
            next();
        } else {
            res.redirect("/");
        }
      }); 
}