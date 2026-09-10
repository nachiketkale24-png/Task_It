const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { SELF_REGISTRATION_ROLES } = require("../validators/authValidator");

const authError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Register
const registerUser = async (userData) => {
    const { fullName, email, password, role } = userData;

    if (!SELF_REGISTRATION_ROLES.includes(role)) {
        throw authError("Invalid registration role", 400);
    }

    const existingUser = await User.findOne({ email: email?.toLowerCase()?.trim() });

    if (existingUser) {
        throw authError("An account with this email already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
    });

    return user;
};

// Login
const loginUser = async (userData) => {
    const { email, password } = userData;

    // Find user
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() });

    if (!user) {
        throw authError("Invalid email or password", 401);
    }

    if (user.isActive === false) {
        throw authError("This account is inactive", 403);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw authError("Invalid email or password", 401);
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
