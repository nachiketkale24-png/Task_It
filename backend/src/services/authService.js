const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
const registerUser = async (userData) => {
    const { fullName, email, password, role } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role,
    });

    return user;
};

// Login
const loginUser = async (userData) => {
    const { email, password } = userData;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = generateToken(user._id);

    return {
        token,
        user,
    };
};

const getAllUsers = async () => {
    return await User.find({}, "fullName email role profileImage");
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};