/* =====================================================
   Zillion Learning - Admin JavaScript
   Admin Panel Functionality
   ===================================================== */

// ==================== INITIALIZATION ====================
function initAdmin() {
    initializeAdminAccess();
    initializeAddCourseToggle();
    initializeImagePreview();
    initializeAddCourse();
}

initAdmin();


// ==================== ADMIN PANEL ACCESS ====================
function initializeAdminAccess() {
    const form = document.getElementById("adminLoginForm");

    if (!form) return;

    form.addEventListener("submit", handleAdminLogin);
}

function handleAdminLogin(e) {
    e.preventDefault();

    const passwordInput = document.getElementById("adminPassword");
    const errorMessage = document.getElementById("adminLoginError");
    const adminLockScreen = document.getElementById("adminLockScreen");
    const adminContent = document.getElementById("adminContent");

    const ADMIN_PASSWORD = "admin2026";
    const enteredPassword = passwordInput?.value.trim() || "";

    if (!enteredPassword) {
        if (errorMessage) {
            errorMessage.textContent = "Please enter the admin password.";
        }
        return;
    }

    if (enteredPassword === ADMIN_PASSWORD) {
        if (errorMessage) {
            errorMessage.textContent = "";
        }

        adminLockScreen?.classList.add("hidden");
        adminContent?.classList.remove("hidden");

        initializeAdminNavigation();
    } else {
        if (errorMessage) {
            errorMessage.textContent = "Incorrect password. Please try again.";
        }
    }
}


// ==================== ADMIN NAVIGATION ====================
function initializeAdminNavigation() {
    const navLinks = document.querySelectorAll("#adminContent .nav-link");

    const sections = {
        overviewTab: document.getElementById("overviewSection"),
        usersTab: document.getElementById("usersSection"),
        coursesTab: document.getElementById("coursesSection"),
        settingsTab: document.getElementById("settingsSection")
    };

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            Object.values(sections).forEach(section => {
                section?.classList.add("hidden");
            });

            sections[this.id]?.classList.remove("hidden");

            document.getElementById("addCoursesec")?.classList.add("hidden");
        });
    });
}


// ==================== ADD COURSE TOGGLE ====================
function initializeAddCourseToggle() {
    const showAddCourseBtn = document.getElementById("showAddCourseBtn");
    const addCourseSection = document.getElementById("addCoursesec");

    if (!showAddCourseBtn || !addCourseSection) return;

    showAddCourseBtn.addEventListener("click", () => {
        addCourseSection.classList.toggle("hidden");
    });
}


// ==================== IMAGE PREVIEW ====================
function initializeImagePreview() {
    const imageInput = document.getElementById("image");

    if (!imageInput) return;

    imageInput.addEventListener("change", previewImage);
}

function previewImage() {
    const imagePreview = document.getElementById("imagePreview");
    const file = this.files[0];

    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove("hidden");
}


// ==================== ADD COURSE ====================
function initializeAddCourse() {
    const courseForm = document.getElementById("courseForm");

    if (!courseForm) return;

    courseForm.addEventListener("submit", addCourse);
}

async function addCourse(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const fee = document.getElementById("fee").value.trim();

    // Validation
    if (!title) {
        alert("Please enter a course title.");
        return;
    }
    if (!duration) {
        alert("Please enter the course duration.");
        return;
    }

    if (!fee) {
        alert("Please enter the course fee.");
        return;
    }

    const newCourse = {
        title,
        description,
        category,
        duration,
        fee,
        image: ""
    };

    try {
        const response = await fetch("http://localhost:5000/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCourse)
        });

        if (!response.ok) {
            alert("Failed to add course.");
            return;
        }

        const data = await response.json();

        console.log(data);
        alert("Course added successfully!");

        e.target.reset();

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
}