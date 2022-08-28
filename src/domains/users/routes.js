const express = require('express');
const router = express.Router();

// Custom functions
const { createNewUser, authenticateUser, getUsers, updateEmail, updateName, updatePassword, updatePhone, updatePhoto, getAvatar} = require("./controller");
const { sendOTPVerificationEmail } = require("../email_verification_otp/controller");

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        let {name, email, password, phone } = req.body; 
        name = name.trim();
        email = email.trim();
        password = password.trim();
        if (name == "" || email == "" || password == "" || phone == "")
            throw Error("Empty fields");
        else if (!/^[a-zA-Z א-ת]*$/.test(name)) 
            throw Error("Invalid name");
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) 
            throw Error("Invalid email");
        else if (password.length < 8) 
            throw Error("password is too short!");
        else if (phone.length != 9)
            throw Error("Invalid phone number");
        else {
           //valid credentials
            const newUser = await createNewUser({
                name,
                email,
                password,
                phone
            });
            const emailData = await sendOTPVerificationEmail(newUser);
            res.json({
                status: "PENDING",
                message: "Verification email sent",
                data: emailData, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });     
    }
})

// Sign In
router.post('/signin', async (req, res) => {
    try {
        let {email, password, company} = req.body;
        email = email.trim();
        password = password.trim();
        company = company.trim();
        if (email == "" || password == "" || company == "") 
            throw Error("Empty fields"); 
        const authenticatedUser = await authenticateUser(email, password, company);
        res.json({
            status: "SUCCESS",
            message: "Signin successfully",
            data: authenticatedUser, 
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})

// Get Users
router.post('/getUsers', async (req, res) => {
    try {
        const users = await getUsers();
        res.json({
            status: "SUCCESS",
            message: "Get Users successfully",
            data: users, 
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})

router.post('/updateEmail', async (req,res) => {
    try {
        let {email, newEmail } = req.body; 
        email = email.trim();
        newEmail = newEmail.trim();
        if (email == '' || newEmail == '')
            throw Error("Empty fields");
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) 
            throw Error("Invalid email");
        else {
            const user = await updateEmail({
                email,
                newEmail,
            });
            res.json({
                status: "SUCCESS",
                message: "Update Email successfully",
                data: user, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})
router.post('/updateName', async (req,res) => {
    try {
        let {email, newName } = req.body; 
        email = email.trim();
        newName = newName.trim();
        if (email == '' || newName == '')
            throw Error("Empty fields");
        else if (!/^[a-zA-Z א-ת]*$/.test(newName)) 
            throw Error("Invalid name");
        else {
            const user = await updateName({
                email,
                newName,
            });
            res.json({
                status: "SUCCESS",
                message: "Update Name successfully",
                data: user, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})
router.post('/updatePassword', async (req,res) => {
    try {
        let {email, password, newPassword } = req.body; 
        email = email.trim();
        password = password.trim();
        if (email == '' ||  password == "" || newPassword)
            throw Error("Empty fields");
        else if (newPassword.length < 8 || password.length < 8) 
            throw Error("password is too short!");
        else {
            const user = await updatePassword({
                email,
                password,
                newPassword
            });
            res.json({
                status: "SUCCESS",
                message: "Update User successfully",
                data: user, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})
router.post('/updatePhone', async (req,res) => {
    try {
        let {email, newPhone } = req.body; 
        email = email.trim();
        if (email == '' || newPhone == '')
            throw Error("Empty fields");
        else if (newPhone <= 500000000 || newPhone >= 599999999)
            throw Error("Invalid phone number");
        else {
            const user = await updatePhone({
                email,
                newPhone,
            });
            res.json({
                status: "SUCCESS",
                message: "Update Phone successfully",
                data: user, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})
router.post('/updatePhoto', async (req,res) => {
    try {
        let {email, photo } = req.body; 
        email = email.trim();
        if (email == '' )
            throw Error("Empty fields");
        else {
            const user = await updatePhoto({
                email,
                photo,
            });
            res.json({
                status: "SUCCESS",
                message: "Update Photo successfully",
                data: user, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})

router.post('/getAvatar', async (req,res) => {
    try {
        let {email } = req.body; 
        email = email.trim();
        if (email == '' )
            throw Error("Empty fields");
        else {
            const avatar = await getAvatar({
                email,
            });
            res.json({
                status: "SUCCESS",
                message: "get avatar successfully",
                data: avatar, 
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