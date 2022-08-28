const bcrypt = require("bcrypt");

const verifyHashedData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        throw error;
    }
};

module.exports = verifyHashedData;