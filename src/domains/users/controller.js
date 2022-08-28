const User = require("./model");
const hashData = require("../../util/hashData");
const verifyHashedData = require("../../util/verifyHashedData");

// Sign Up
const createNewUser = async (data) => {
    try {
        const { name, email, password, phone } = data;  
        // Checking if user already exist
        const existingUser = await User.find({ email });
        if (existingUser.length) 
            throw Error("user already exists");
        else {     
            // hash password
            const hashedPassword = await hashData(password);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                phone,
                verified: false,
                view: 'burger',
                company: ''
                // theme: 'white'
            });   
            // save user
            const createdUser = await newUser.save();
            return createdUser;
        }
    } catch (error) {
        throw error;
    }
};

// Sign In
const authenticateUser = async (email, password, company) => {
    try {
        const fetchedUsers = await User.find({ email });
        if (!fetchedUsers.length) 
            throw Error("Invalid credentials entered!");
        else {
            if (!fetchedUsers[0].verified) 
                throw Error("Email hasn't been verified yet. Check your inbox.");
            else {
                const hashedPassword = fetchedUsers[0].password;
                const passwordMatch = await verifyHashedData(password, hashedPassword);
                if (!passwordMatch) 
                    throw Error("Invalid password entered!");
                else {
                    await User.updateOne({ email: email }, { company: company });            
                    return User.find({ email }); 
                }
            }
        }
    } catch (error) {
        throw error;
    }
};

// Get Users
const getUsers = async () => {
    try {
        const users = await User.find();
        // Check if specific day is exists
        // if (users.length > 0) { 
            console.log(users[0]);

            const array = users; 
            let arr = [];
            // // Check if appointment time is available
            for (let index = 0; index < array.length; index++) {
                if (array[index].verified) {
                    arr.push({
                        index: index,
                        email: array[index].email,
                        name: array[index].name,
                        phone: array[index].phone,
                    });  
                }             
            }
            return arr;
        // }
    } catch (error) {
        throw error;
    }
};
const updateEmail = async (data) => {
    try {
        const { email, newEmail } = data;  
        // Checking if user exist
        const existingUser = await User.find({ email });
        const existingEmail = await User.find({ newEmail });
        if (existingEmail.length == 0) 
            throw Error("user already exists");
        else if (existingUser.length) {
            await User.updateOne({ email: email }, { email: newEmail });           
            // return await User.find({ newEmail });
        }
    } catch (error) {
        throw error;
    }

}
const updateName = async (data) => {
    try {
        const { email, newName } = data;  
        // Checking if user exist
        const existingUser = await User.find({ email });
        if (existingUser.length) {
            await User.updateOne({ email: email }, { name: newName });           
            return User.find({ email });
        }
    } catch (error) {
        throw error;
    }

}
const updatePassword = async (data) => {
    try {
        const { email, password, newPassword } = data;  
        // Checking if user exist
        const existingUser = await User.find({ email });
        if (existingUser.length) {
            const hashedPassword = fetchedUsers[0].password;
                const passwordMatch = await verifyHashedData(password, hashedPassword);
                if (!passwordMatch) 
                    throw Error("Invalid password entered!");
                else {
                    const hashedPassword = await hashData(newPassword);
                    await User.updateOne({ email: email }, { password: hashedPassword });           
                    return User.find({ email });
                }
        }
    } catch (error) {
        throw error;
    }

}
const updatePhone = async (data) => {
    try {
        const { email, newPhone } = data;  
        // Checking if user exist
        const existingUser = await User.find({ email });
        // console.log(existingUser);
        if (existingUser.length) {
            await User.updateOne({ email: email }, { phone: newPhone });           
            return User.find({ email });
        }
    } catch (error) {
        throw error;
    }
}
const updatePhoto = async (data) => {
    try {
        const { email, photo } = data;  
        // Checking if Provider exist
        const existingProvider = await User.find({ email });
        if (existingProvider.length) {
            await User.updateOne({ email: email }, { avatar: photo });           
            return User.find({ email });
        }
    } catch (error) {
        throw error;
    }
}
const getAvatar = async (data) => {
    try {
        const { email } = data;  
        // Checking if Provider exist
        const existingProvider = await User.find({ email });
        if (existingProvider.length) {
            // await Provider.updateOne({ email: email }, { avatar: photo });           
            return existingProvider[0].avatar;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { createNewUser, authenticateUser ,getUsers, updateEmail, updateName, updatePassword, updatePhone, updatePhoto, getAvatar };