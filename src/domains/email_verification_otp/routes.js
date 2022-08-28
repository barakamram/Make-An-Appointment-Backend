const express = require('express');
const router = express.Router();

// Custom functions
const { verifyEmail, resendEmail } = require("./controller");

// Verify OTP Email
router.post('/verifyOTP', async (req, res) => {
    try {
        let { userId, otp } = req.body;
        if (!userId || !otp) 
            throw Error("Empty otp details are not allowed");
        else {
            const OTPVerificationRecords = await verifyEmail(userId, otp);
            res.json({
                status: "VERIFIED",
                message: `User email verified successfully.`,
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Resend OTP Verification
router.post('/resendOTPVerificationCode', async (req,res) => {
    try {
        let{ userId, email } =req.body;
        if(!userId || !email) 
            throw Error("Empty user details are not allowed");
        else {
            await resendEmail(userId, email);
            res.json({
                status: "PENDING",
                message: "OTP Verification email sent",
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
})

module.exports = router;
