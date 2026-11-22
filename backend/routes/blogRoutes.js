
const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE BLOG
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, category, description, image } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const newBlog = new Blog({
            title,
            category,
            description,
            image: image || "",
            author: req.user.id
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {
        res.status(500).json({
            message: "Blog creation failed",
            error: error.message
        });
    }
});

// GET ALL BLOGS
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch blogs",
            error: error.message
        });
    }
});

// GET MY BLOGS
router.get("/my-blogs", authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.user.id
        }).sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch your blogs",
            error: error.message
        });
    }
});

// DELETE BLOG
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id,
            author: req.user.id
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized"
            });
        }

        await blog.deleteOne();

        res.json({
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Blog deletion failed",
            error: error.message
        });
    }
});

module.exports = router;
