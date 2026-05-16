const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/noteRoutes"));

// About Route
app.get("/about", (req, res) => {
    res.status(200).json({
        name: "Sara Shaikh",
        email: "sarassk21.tech@gmail.com",
        "my features": {
            "Search Notes":
                "Implemented note pinning functionality so users can prioritize important notes. Pinned notes appear at the top of the notes list for improved productivity and usability."
        },
    });
});

// OpenAPI JSON Route
app.get("/openapi.json", (req, res) => {
    res.sendFile(path.join(__dirname, "openapi.json"));
});

// Health Check Route
app.get("/", (req, res) => {
    res.json({
        message: "Notes API is running",
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Server error",
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});