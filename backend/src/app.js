const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middlewares
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task_It Backend Running!",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/project", projectRoutes);

module.exports = app;