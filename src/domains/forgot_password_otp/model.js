const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPPasswordResetSchema = new Schema({
    UserId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const OTPPasswordReset = mongoose.model('OTPPasswordReset', OTPPasswordResetSchema);

module.exports = OTPPasswordReset;