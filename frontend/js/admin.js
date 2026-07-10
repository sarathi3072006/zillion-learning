/* =====================================================
   Zillion Learning - Admin JavaScript
   Admin Panel Functionality
   ===================================================== */
//=====================IMPORT MODULES=====================
import { showModal } from "./modules/ui.js";
import { loadCategories } from "./modules/courses.js";
// ==================== INITIALIZATION ====================
function initAdmin() {
    initializeAdminAccess();
    initializeAddCourseToggle();
    initializeImagePreview();
    initializeAddCourse();
    initializeAddCategory();
    loadCategories('categorySelect'); // Load categories into the select dropdown
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


// ==================== INITIALIZE ADD COURSE ====================
function initializeAddCourse() {
    const courseForm = document.getElementById("courseForm");

    if (!courseForm) return;

    courseForm.addEventListener("submit", addCourse);
}
// ==================== ADD COURSE ====================
async function addCourse(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const categoryId = parseInt(document.getElementById("categorySelect").value.trim());
    const duration = document.getElementById("duration").value.trim();
    const fee = document.getElementById("fee").value.trim();

    // Validation
    if (!title) {
        showModal("Please enter a course title.", "danger");
        return;
    }
    if (!categoryId) {
        showModal("Please select a category.", "danger");
        return;
    }
    if (!duration) {
        showModal("Please enter the course duration.", "danger");
        return;
    }

    if (!fee) {
        showModal("Please enter the course fee.", "danger");
        return;
    }

    const newCourse = {
        title,
        description,
        categoryId,
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
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || "Failed to add course.", "danger");
            return;
        }
        console.log(data);
        showModal("Course added successfully!", "success");

        e.target.reset();

    } catch (error) {
        console.error(error);
        showModal("Unable to connect to the server.", "danger");
    }
}


// ==================== INITIALIZE ADD CATEGORY ====================
function initializeAddCategory() {
    const addCategoryForm = document.getElementById("addCategoryForm");
    if (!addCategoryForm) return;
    addCategoryForm.addEventListener("submit", addCategory);
}

// ==================== ADD CATEGORY ====================
async function addCategory(e) {
    e.preventDefault();

    const newCategory = document.getElementById("newCategoryInput").value.trim();
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    if (!newCategory) {
        showModal("Please enter a category name.", "danger");
        return;
    }
    addCategoryBtn.disabled = true;
    addCategoryBtn.textContent = "Adding...";
    try {
        const response = await fetch("http://localhost:5000/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newCategory })
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || "Failed to add category.", "danger");
            return;
        }

        console.log(data);
        showModal("Category added successfully!", "success");
        await loadCategories();

        // Clear the input field
        document.getElementById("newCategoryInput").value = "";

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("addCategoryModal"));
        modal.hide();

    } catch (error) {
        console.error(error);
        showModal("Unable to connect to the server.", "danger");
    }finally {
        addCategoryBtn.disabled = false;
        addCategoryBtn.textContent = "Add Category";
    }
}