
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("BlogSpace Backend Server is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Blog routes
app.use("/api/blogs", blogRoutes);

// Server port
const PORT = process.env.PORT || 5000;

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
});