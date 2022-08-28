const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema({
    UserId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const OTPVerification = mongoose.model('OTPVerification', OTPVerificationSchema);

module.exports = OTPVerification;