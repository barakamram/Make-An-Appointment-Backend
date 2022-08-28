const OTPPasswordReset = require("./model");
const User = require("../users/model");
const generateOTP = require("../../util/generateOTP");
const hashData = require("../../util/hashData");
const sendEmail = require("../../util/sendEmail");
const verifyHashedData = require("../../util/verifyHashedData");

// Send OTP Password Reset Email
const sendOTPPasswordResetEmail = async ( email ) => { 
    try {
        const otp = await generateOTP();
        const fetchedUsers = await User.find({ email });
        if (!fetchedUsers.length) 
            throw Error("Email hasn't been found in system. Please sign up!");
        else {
            if (!fetchedUsers[0].verified) 
                throw Error("Email hasn't been verified yet. Check your inbox.");
            else {
                await OTPPasswordReset.deleteMany({ email });
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "Password Reset",
                    html: `<p>We heard that you lost your password</p><p>Don't worry, Enter <b>${otp}</b> in the app to reset your pasword</p>
                    <p>This code <b>expires in 1 hour</b>.</p>`,
                };
                // hash the otp
                const hashedOTP = await hashData(otp);
                const newOTPPasswordReset = await new OTPPasswordReset({
                    userId: fetchedUsers[0]._id,
                    otp: hashedOTP,
                    createdAt: Date.now(), 
                    expiresAt: Date.now() + 3600000,
                });
                // await OTPPasswordReset.deleteMany({ email });
                // save OTP record
                await newOTPPasswordReset.save();
                await sendEmail(mailOptions);
                return {
                    userId: fetchedUsers[0]._id,
                    email,
                };
            }
        }
    } catch (error) {
        throw error;
    }       
};

// Reset the password
const passwordReset = async (email, otp, newPassword) => {
    try { 
        const OTPPasswordResetRecords = await OTPPasswordReset.find({ email });
        if (OTPPasswordResetRecords.length <= 0) 
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or login.");
        else {
            const { expiresAt } = OTPPasswordResetRecords[0];
            const hashedOTP = OTPPasswordResetRecords[0].otp;
            if (expiresAt < Date.now()) {
                // otp record has expired
                await OTPPasswordReset.deleteMany({ email });
                throw Error("Code has expired. Please request again."); 
            } else {
                const validOTP = await verifyHashedData(otp, hashedOTP);
                const hashedPassword = await hashData(newPassword);
                if (!validOTP) 
                    throw Error("Invalid code passed. Check your inbox.");
                else {
                    await User.updateOne({ email: email }, { password: hashedPassword });
                    await OTPPasswordReset.deleteMany({ email });
                    return OTPPasswordResetRecords;
                }
            }
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTPPasswordResetEmail, passwordReset };
