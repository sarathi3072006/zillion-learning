/* =====================================================
   Zillion Learning - Admin JavaScript
   Admin Panel Functionality
   ===================================================== */
//=====================IMPORT MODULES=====================
import config from "./modules/config.js";
import { showModal } from "./modules/ui.js";
import { loadCategories } from "./modules/courses.js";

let courses = [];
let editingCourseId = null;
// ==================== INITIALIZATION ====================
function initAdmin() {
    // Build the edit form first so it receives the same category options as the add form.
    reuseAddCourseFieldsInEditModal();
    initializeAdminAccess();
    initializeCourseSectionToggle();
    initializeImagePreview();
    initializeAddCourse();
    initializeAddCategory();
    initializeDeleteCategory();
    initializeCourseDelete();
    initializeCourseEdit();
    initializeEditCourseForm();
    loadCategories();
    loadcourses();
    initializeAdminNavigation();
}

initAdmin();


// ==================== ADMIN PANEL ACCESS ====================
function initializeAdminAccess() {
    const form = document.getElementById("adminLoginForm");

    if (!form) return;

    form.addEventListener("submit", handleAdminLogin);
}

async function handleAdminLogin(e) {
    e.preventDefault();

    const passwordInput = document.getElementById("adminPassword");
    const errorMessage = document.getElementById("adminLoginError");


    const enteredPassword = passwordInput?.value.trim() || "";
    if (!enteredPassword) {
        if (errorMessage) {
            errorMessage.textContent = "Please enter the admin password.";
        }
        return;
    }
    try {
        const response = await fetch(`${config.API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: enteredPassword
            })
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || "Failed to login.", "danger");
            return;
        }
        console.log(data);
        showModal("Admin logged in successfully!", "success");
    } catch (error) {
        console.error(error);
        if (errorMessage) {
            errorMessage.textContent = "Unable to connect to the server.";
        }
        return;
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
//==================== COURSE SECTION TOGGLE ====================
function initializeCourseSectionToggle() {
    const showAddCourseBtn = document.getElementById("showAddCourseBtn");
    const manageCoursesBtn = document.getElementById("manageCoursesBtn");
    const addCourseSection = document.getElementById("addCoursesec");
    const manageCoursesSection = document.getElementById("manageCoursesSec");

    if (!showAddCourseBtn || !manageCoursesBtn || !addCourseSection || !manageCoursesSection) return;

    showAddCourseBtn.addEventListener("click", () => {
        addCourseSection.classList.remove("hidden");
        manageCoursesSection.classList.add("hidden");
    });

    manageCoursesBtn.addEventListener("click", () => {
        manageCoursesSection.classList.remove("hidden");
        addCourseSection.classList.add("hidden");
    });
}

// ==================== IMAGE PREVIEW ====================
function initializeImagePreview() {
    const imageInput = document.querySelector("#courseForm [name='image']");
    const dropZone = document.getElementById("imageDropZone");

    if (!imageInput || !dropZone) return;

    imageInput.addEventListener("change", previewImage);
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, event => {
            event.preventDefault();
            dropZone.classList.add("drag-over");
        });
    });
    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, event => {
            event.preventDefault();
            dropZone.classList.remove("drag-over");
        });
    });
    dropZone.addEventListener("drop", event => {
        const [file] = event.dataTransfer.files;
        if (!file || !file.type.startsWith("image/")) 
        {
            showModal("Only image files are allowed.", "danger");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        imageInput.files = dataTransfer.files;
        imageInput.dispatchEvent(new Event("change", { bubbles: true }));
    });
}

function previewImage() {
    const imagePreview = this.closest("form")?.querySelector(".image-preview");
    const file = this.files[0];

    if (!file || !imagePreview) return;

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
    const { title, description, categoryId, duration, fee, image } = getCourseFormValues(e.currentTarget);
    const token = localStorage.getItem("token");
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

    // FormData is required to submit the optional image file with the text fields.
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("duration", duration);
    formData.append("fee", fee);

    if (image) {
        formData.append("image", image);
    }

    try {
        const response = await fetch(`${config.API_URL}/courses`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || "Failed to add course.", "danger");
            return;
        }
        console.log(data);
        showModal("Course added successfully!", "success");
        await loadcourses();
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
    const token = localStorage.getItem("token");
    if (!newCategory) {
        showModal("Please enter a category name.", "danger");
        return;
    }
    addCategoryBtn.disabled = true;
    addCategoryBtn.textContent = "Adding...";
    try {
        const response = await fetch(`${config.API_URL}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
    } finally {
        addCategoryBtn.disabled = false;
        addCategoryBtn.textContent = "Add Category";
    }
}
// ==================== INITIALIZE DELETE CATEGORY ====================
function initializeDeleteCategory() {
    document
        .getElementById("categoryDelete")
        .querySelector("button")
        .addEventListener("click", deleteCategory);
}
// ==================== DELETE CATEGORY ====================
async function deleteCategory() {
    const categoryId = parseInt(document.getElementById("categorySelectDlt").value, 10);
    const token = localStorage.getItem("token");
    if (!categoryId) {
        showModal("Please select a category first.", "danger");
        return;
    }
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
        const response = await fetch(`${config.API_URL}/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            } 
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to delete category.");
        }
        showModal("Category deleted successfully!", "success");
        await loadCategories(); // Refresh the category list after deletion
        await loadcourses(); // Refresh the course list table after deletion
    }
    catch (error) {
        console.error(error);
        showModal(error.message, "danger");
    }
}
// ==================== LOAD COURSES BEFORE RENDERING ====================
async function loadcourses() {
    try {
        const response = await fetch(`${config.API_URL}/courses`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        courses = await response.json();
        rendercoursetable(courses);
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}
// ==================== RENDER COURSE TABLE ====================
function rendercoursetable(courses) {
    const coursesTableBody = document.getElementById("coursesTableBody");
    if (!coursesTableBody) return;
    coursesTableBody.innerHTML = "";
    courses.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="course-image-cell"><img
            src="${config.API_URL}/uploads/course-images/${course.image}"
            alt="${course.title}"
            class="course-image">
        </td>
        <td data-label="Title">${course.title}</td>
        <td data-label="Description">${course.description}</td>
        <td data-label="Category">${course.category.name}</td>
        <td data-label="Duration">${course.duration}</td>
        <td data-label="Fee">₹${course.fee}</td>
        <td class="course-actions-cell">
            <button class="btn btn-sm btn-warning edit-course" data-id="${course.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-course" data-id="${course.id}">Delete</button>
        </td>
    `;
        coursesTableBody.appendChild(row);
        
    });
}
//==================== INITIALIZE COURSE DELETE ====================
function initializeCourseDelete() {
    const coursesTableBody = document.getElementById("coursesTableBody");
    if (!coursesTableBody) return;

    coursesTableBody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-course")) {
            console.log("Delete button clicked for course ID:", e.target.dataset.id);
            deleteCourse(e.target.dataset.id);
        }
    });
}
//==================== DELETE COURSE ====================
async function deleteCourse(courseId) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
        const response = await fetch(`${config.API_URL}/courses/${courseId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to delete course.");
        }
        showModal("Course deleted successfully!", "success");
        await loadcourses(); // Refresh the course list after deletion
    } catch (error) {
        console.error(error);
        showModal(error.message, "danger");
    }
}
//==================== INITIALIZE COURSE EDIT ====================
function initializeCourseEdit() {
    const courseTableBody = document.getElementById("coursesTableBody");
    if (!courseTableBody) return;
    courseTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-course")) {
            openEditCourse(e.target.dataset.id);
        }
    });
}
//==================== OPEN EDIT COURSE MODAL ====================
function openEditCourse(courseId) {
    const course = courses.find(c => c.id == courseId);
    if (!course) return;

    editingCourseId = course.id;
    const form = document.getElementById("editCourseForm");
    form.reset();

    // A field is prefilled when its name matches a property returned by the API.
    Object.entries(course).forEach(([key, value]) => {
        const field = form.elements[key];

        // Skip data that does not have a matching field, file inputs, and empty values.
        if (!field || field.type === "file" || value == null) return;

        field.value = value;
    });

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editCourseModal")).show();
}
//==================== INITIALIZE EDIT COURSE FORM ====================
function initializeEditCourseForm() {
    const editCourseForm = document.getElementById("editCourseForm");
    if (!editCourseForm) return;

    editCourseForm.addEventListener("submit", updateCourse);
    document.getElementById("editCourseModal")?.addEventListener("hidden.bs.modal", () => {
        editCourseForm.reset();
        editingCourseId = null;
    });
}
//==================== UPDATE COURSE ====================
async function updateCourse(e) {
    e.preventDefault();
    if (!editingCourseId) return;

    const { title, description, categoryId, duration, fee, image } = getCourseFormValues(e.currentTarget);
    const token = localStorage.getItem("token");
    if (!title || !categoryId || !duration || !fee) {
        showModal("Please complete all required course fields.", "danger");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("duration", duration);
    formData.append("fee", fee);
    if (image) formData.append("image", image);

    try {
        const response = await fetch(`${config.API_URL}/courses/${editingCourseId}`, {
            method: "PUT",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || "Failed to update course.", "danger");
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById("editCourseModal"))?.hide();
        showModal("Course updated successfully!", "success");
        await loadcourses();
    } catch (error) {
        console.error(error);
        showModal("Unable to connect to the server.", "danger");
    }
}

function reuseAddCourseFieldsInEditModal() {
    const addForm = document.getElementById("courseForm");
    const modalBody = document.querySelector("#editCourseForm .modal-body");
    if (!addForm || !modalBody) return;

    // Only direct .mb-3 children are reusable course fields; submit buttons and nested modals stay behind.
    const fields = [...addForm.querySelectorAll(":scope > .mb-3")].map(field => field.cloneNode(true));
    fields.forEach(field => {
        // IDs must remain unique. The cloned fields use their name attributes through form.elements instead.
        field.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
        field.querySelectorAll("label[for]").forEach(label => label.removeAttribute("for"));
        field.querySelector(".image-preview")?.classList.add("hidden");
    });

    modalBody.replaceChildren(...fields);
}

function getCourseFormValues(form) {
    // Reading through form.elements keeps add and edit fields independent despite sharing field names.
    return {
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        categoryId: parseInt(form.elements.categoryId.value, 10),
        duration: form.elements.duration.value.trim(),
        fee: form.elements.fee.value.trim(),
        image: form.elements.image.files[0]
    };
}
