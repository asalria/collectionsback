const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    editorial: {
        type: String,
        required: [true, 'The phone brand is required']
    },
    isbn:{
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: [true, 'The phone name is required']
    },
    ilustrator:{
        type: String,
        default: ''
    },
    language:{
        type: String,
        default: ''
    },
    year:{
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    onlineBookstore: {
        type: [String],
        default: []
    },
    comments: {
        type: String,
        default: ''
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
 });

 const Book = mongoose.model('Book', bookSchema);
 module.exports = Book;
