const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});