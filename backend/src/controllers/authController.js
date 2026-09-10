const authService = require("../services/authService");

// Register
const registerUser = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            data: {
                id: result.user._id,
                fullName: result.user.fullName,
                email: result.user.email,
                role: result.user.role,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 401).json({
            success: false,
            message: error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
};
