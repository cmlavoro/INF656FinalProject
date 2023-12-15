const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Contact", contactSchema);