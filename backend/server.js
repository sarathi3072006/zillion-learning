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
        const courses = await prisma.course.findMany();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/courses", async (req, res) => {
    const { title, description, category, duration, fee } = req.body;
    if (!title || !duration || !fee) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const course = await prisma.course.create({
            data: req.body
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});