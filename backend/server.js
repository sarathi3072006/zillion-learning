const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authentication");
const authorizeRole = require("./middleware/authorization");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const prisma = require("./prismaClient");
const upload = require("./config/multer");
const fs = require("fs");
const path = require("path"); app.use("/uploads", express.static("uploads"));
//====================  TESTING ENDPOINT ====================
app.get("/protected", authenticateToken, (req, res) => {

    res.json({
        message: "You are authenticated!",
        user: req.user
    });

});
// ==================== COURSES ENDPOINTS ====================
app.get("/courses", async (req, res) => {
    try {
        const courses = await prisma.course.findMany({ include: { category: true } });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/courses",authenticateToken,authorizeRole,upload.single("image"), async (req, res) => {
    const { title, description, duration, fee } = req.body;
    const categoryId = parseInt(req.body.categoryId, 10);
    const image = req.file ? req.file.filename : null;

    if (!title || !categoryId || !duration || !fee) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                categoryId,
                duration,
                fee,
                image
            }
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// ==================== UPDATE COURSE ENDPOINT ====================
app.put("/courses/:id", authenticateToken, authorizeRole, upload.single("image"), async (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    const { title, description, duration, fee } = req.body;
    const categoryId = parseInt(req.body.categoryId, 10);

    if (!courseId || !title || !categoryId || !duration || !fee) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingCourse = await prisma.course.findUnique({ where: { id: courseId } });
        if (!existingCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // An edit without a new file keeps the current image filename.
        const image = req.file ? req.file.filename : existingCourse.image;
        const course = await prisma.course.update({
            where: { id: courseId },
            data: { title, description, categoryId, duration, fee, image },
            include: { category: true }
        });

        // Delete the replaced file only after the database update succeeds.
        if (req.file && existingCourse.image) {
            const oldImagePath = path.join(__dirname, "uploads", "course-images", existingCourse.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// ==================== CATEGORIES ENDPOINTS ====================
app.get("/categories", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/categories", authenticateToken, authorizeRole, async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });
        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists" });
        }
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//==================== DELETE COURSE ENDPOINT ====================
app.delete("/courses/:id",authenticateToken,authorizeRole, async (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (course.image) {
            const imagePath = path.join(
                __dirname,
                "uploads",
                "course-images",
                course.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        const deletedCourse = await prisma.course.delete({
            where: { id: courseId }
        });
        res.json({ message: "Course deleted successfully", course: deletedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//==================== SIGNUP ENDPOINT ====================
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!email.includes("@")) {
            return res.status(400).json({ error: "Invalid email address" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }, select: { name: true, email: true, role: true }
        });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//==================== LOGIN ENDPOINT ====================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const User = await prisma.user.findUnique({
            where: { email }
        });
        if (!User) {
            return res.status(404).json({ error: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, User.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            {
                userId: User.id,
                role: User.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        res.status(200).json({ message: "Login successful",token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//================================================================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


