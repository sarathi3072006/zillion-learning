const express = require('express');
const bcrypt = require("bcrypt");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const prisma = require("./prismaClient");
const upload = require("./config/multer");
const fs = require("fs");
const path = require("path"); app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.send("Hello from Zillion Learning Backend!");
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

app.post("/courses", upload.single("image"), async (req, res) => {
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
app.put("/courses/:id", upload.single("image"), async (req, res) => {
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


app.post("/categories", async (req, res) => {
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
app.delete("/courses/:id", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


