const express = require('express');
const router = express.Router();

const userRoutes = require("../domains/users");
const ProviderRoutes = require("./../domains/provider");
const EmailVerificationOTPRoutes = require("./../domains/email_verification_otp");
const ForgotPasswordOTPRoutes = require("./../domains/forgot_password_otp");
const AppointmentsRoutes = require("./../domains/appointments");
// const ServicesRoutes = require("./../domains/services");
const companyRoutes = require("./../domains/company");

router.use("/users", userRoutes);
router.use("/provider", ProviderRoutes);
router.use("/email_verification_otp", EmailVerificationOTPRoutes);
router.use("/forgot_password_otp", ForgotPasswordOTPRoutes);
router.use("/appointments", AppointmentsRoutes);
// router.use("/services", ServicesRoutes);
router.use("/company", companyRoutes);

module.exports = router;