const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const FIRST_ADMIN = 'amelia';
const ROLE_BOSS = 'BOSS';
const ROLE_USER = 'USER';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User needs a password']
    },
    social: {
        facebookId: String,
        googleId: String
    },
    role: {
        type: String,
        enum: [ROLE_BOSS, ROLE_USER],
        default: ROLE_USER
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    if (user.isAdmin()) {
        user.role = 'BOSS';
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash;
                    next();
                })
        })
        .catch(error => next(error));
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.isAdmin = function() {
    return this.role === ROLE_BOSS || this.username === 'amelia';
} 

const User = mongoose.model('User', userSchema);
module.exports = User;