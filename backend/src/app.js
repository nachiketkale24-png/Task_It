const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task_It Backend Running!"
    });
});

// API Routes
app.use("/api/auth", authRoutes);

module.exports = app;