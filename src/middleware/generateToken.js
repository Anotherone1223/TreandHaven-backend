const jwt = require('jsonwebtoken');
const User = require('../users/userModel');

const JWT_SECRET = process.env.JWT_SECRET_KEY

const generateToken = async (userID) => {
    try {
        const user = await User.findById(userID)
        if (!user) {
            throw new Error("User Not Found")
        }
        const token = jwt.sign({ userID: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
        return token
    } catch (error) {

    }

}

module.exports = generateToken;