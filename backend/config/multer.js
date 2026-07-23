const multer = require("multer");
const path = require("path");

// Store course images under the public uploads directory used by the Express static route.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/course-images/");
    },

    filename: (req, file, cb) => {
        // Make a filesystem-safe, readable filename while Date.now() prevents collisions.
        const courseTitle = (req.body.title || "untitled")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        const filename =
            `${courseTitle}-${Date.now()}${path.extname(file.originalname)}`;

        cb(null, filename);
    },
});

// Validate both the MIME type and extension before accepting an upload.
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const isValid =
        allowedTypes.test(file.mimetype) &&
        allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
