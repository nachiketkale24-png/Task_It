const bcrypt = require("bcrypt");
const User = require("../models/User");

const ROLES = [
    "Super Admin", "Project Manager", "Team Lead",
    "Developer", "Frontend Developer", "Backend Developer",
    "ML Engineer", "Intern",
];

// GET /api/users — list all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/users/:id — get single user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/users — admin create user
const createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "fullName, email and password are required" });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: "Email already in use" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName, email, password: hashed,
            role: role || "Intern",
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id — update name/email/role
const updateUser = async (req, res) => {
    try {
        const { fullName, email, role, department, phone } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (role && ROLES.includes(role)) user.role = role;
        if (department !== undefined) user.department = department;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        const updated = user.toObject();
        delete updated.password;
        res.json({ success: true, message: "User updated successfully", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/users/:id — delete user
const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot delete yourself" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id/role — assign role
const assignRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!ROLES.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role. Valid roles: ${ROLES.join(", ")}` });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: `Role updated to "${role}"`, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id/deactivate — toggle isActive
const toggleActivate = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        user.isActive = !user.isActive;
        await user.save();
        const msg = user.isActive ? "User activated" : "User deactivated";
        res.json({ success: true, message: msg, data: { isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, assignRole, toggleActivate };
