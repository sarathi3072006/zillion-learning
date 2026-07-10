const express = require('express');
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const prisma = require("./prismaClient");

app.get("/", (req, res) => {
    res.send("Hello from Zillion Learning Backend!");
});

app.get("/courses", async (req, res) => {
    try {
        const courses = await prisma.course.findMany({ include: { category: true } });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/courses", async (req, res) => {
    const { title, description, duration, fee } = req.body;
    const categoryId = parseInt(req.body.categoryId, 10);
    if (!title || !categoryId || !duration || !fee) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const course = await prisma.course.create({
            data:{
                title,
                description,
                categoryId,
                duration,
                fee
            }
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
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
         where: {name}       
    });
        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists" });
        }
        const category = await prisma.category.create({
            data:{ name }
        });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});