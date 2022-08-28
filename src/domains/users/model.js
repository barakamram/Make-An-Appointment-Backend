const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean
    },
    avatar: String,
    company: String,
    appointments: [{
        provider: {
            type: String,
            required: true,
        },
        proname: {
            type: String,
            required: true,
        },
        slot_date: {
            type: String,
            required: true,
        },
        slot_start: {
            type: String,
            required: true,
        },
        slot_end: {
            type: String,
        },
        service: {
            type: String,
        },
        price: {
            type: Number,
        },
        date: {
            type: Date,
        },
        payment: {
            type: String,
        },
        required: false,
    }]
});

UserSchema.index({email: 'text'});
const User = mongoose.model('User', UserSchema);

module.exports = User;