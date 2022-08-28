const OTPVerification = require("./model");
const User = require("../users/model");
const generateOTP = require("../../util/generateOTP");
const hashData = require("../../util/hashData");
const sendEmail = require("../../util/sendEmail");
const verifyHashedData = require("../../util/verifyHashedData");

// Send OTP Verification Email
const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = await generateOTP();
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email adddress and complete the signup and login into your account.</p>
            <p>This code <b>expires in 1 hour</b>.</p>`,
        };
        const hashedOTP = await hashData(otp);
        const newOTPVerification = await new OTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        // save OTP record
        await newOTPVerification.save();
        await sendEmail(mailOptions);
        return {
            userId: _id,
            email,
        };
    } catch (error) {
        throw error;
    }     
};

// Verify OTP Email
const verifyEmail = async (userId, otp) => {
    try { 
        const OTPVerificationRecords = await OTPVerification.find({ userId });
        if (OTPVerificationRecords.length <= 0) 
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or login.");
        else {
            const { expiresAt } = OTPVerificationRecords[0];
            const hashedOTP = OTPVerificationRecords[0].otp;
            if (expiresAt < Date.now()) {
                // otp record has expired
                await OTPVerification.deleteMany({ userId });
                throw Error("Code has expired. Please request again."); 
            } else {
                const validOTP = await verifyHashedData(otp, hashedOTP);

                if(!validOTP) 
                    throw Error("Invalid code passed. Check your inbox.");
                else {
                    await User.updateOne({ _id: userId }, {verified: true });
                    await OTPVerification.deleteMany({ userId });
                    return OTPVerificationRecords;
                }
            }
        }
    } catch (error) {
        throw error;
    }
};

// Resend OTP Verification 
const resendEmail = async (userId, email) => {
    try {
        await OTPVerification.deleteMany({ userId });
        sendOTPVerificationEmail({ _id: userId, email });
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTPVerificationEmail, verifyEmail, resendEmail };
