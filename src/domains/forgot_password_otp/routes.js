const express = require('express');
const router = express.Router();

// Custom functions
const { sendOTPPasswordResetEmail, passwordReset } = require("./controller");

// Request Password Reset
router.post('/requestPasswordReset', async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) 
            throw Error("Empty user details are not allowed");
        else {
            const UserData = await sendOTPPasswordResetEmail(email);
            res.json({
                status: "PENDING",
                message: "Password reset email sent", 
                // data: { UserData },
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
    
})

// Reset the password
router.post('/passwordReset', async (req, res) => {
    try {
        let {email, otp, newPassword} = req.body;
        if (!email || !otp || !newPassword)
            throw Error("Empty fields are not allowed");
        else {
            const OTPPasswordResetRecords = await passwordReset(email, otp, newPassword);
            res.json({
                status: "SUCCESS",
                message: `User password reset successed.`,
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

module.exports = router;
