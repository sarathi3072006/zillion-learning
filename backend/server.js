const express = require('express');
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
let courses = require('./data/courses.json');


app.get("/", (req, res) => {
    res.send("Hello from Zillion Learning Backend!");
});

app.get("/courses", (req, res) => {
    res.json(courses);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});