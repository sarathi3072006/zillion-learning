
// ==================== IMPORT MODULES ====================
import config from "./config.js";
import { showLoadingAnimation, hideLoadingAnimation, showModal, initializeScrollReveal } from "./ui.js";
// ==================== DYNAMIC COURSE LOADING ====================
export async function loadCourses() {
  try {
    const response = await fetch(`${config.API_URL}/courses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const courses = await response.json();
    renderCourses(courses);
  } catch (error) {
    console.error('Error loading courses:', error);
    document.getElementById('coursesContainer').innerHTML = '<p class="text-center">Error loading courses. Please refresh the page.</p>';
  }
}

function renderCourses(courses) {
  const container = document.getElementById('coursesContainer');
  if (!container) return;

  container.innerHTML = courses.map(course =>{
    const imageUrl = course.image ? `${config.API_URL}/uploads/course-images/${course.image}` : null;
   return `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="course-card" data-category="${course.category.name}">
      ${imageUrl 
       ?
       `<div class="course-image"><img src="${imageUrl}" alt="${course.title}"></div>` 
       : 
       `<div class="course-image" style="background: ${course.gradient};"></div>`
      }
        <div class="course-content">
          <h5 class="course-title">${course.title}</h5>
          <p class="course-description">${course.description}</p>
          <div class="course-meta">
            <span><i class="fas fa-clock"></i> ${course.duration}</span>
          </div>
          <div class="course-fee">₹${course.fee}</div>
          <button class="btn-enroll">
            <i class="fas fa-check-circle"></i> Enroll Now
          </button>
        </div>
      </div>
    </div>
  `}).join('');

  initializeCourseInteraction(); // Re-initialize interactions after rendering courses
}

//==================== LOAD CATEGORIES ====================
export async function loadCategories() {
  try {
    const response = await fetch(`${config.API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    document.querySelectorAll(".category-dropdown").forEach(select => {
      // This includes the category dropdown cloned into the Edit Course modal.
      populateCategorySelect(select, categories);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    showModal("Error loading categories. Please refresh the page.", "danger");
  }
}
// ==================== POPULATE CATEGORY SELECT ====================
function populateCategorySelect(categorySelect, categories) {
  if (!categorySelect) return;

  categorySelect.innerHTML = '<option value="">Select a category</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}
function initializeCourseInteraction() {
  // Re-initialize enroll buttons and animations for dynamically loaded courses
  initializeEnrollButtons();
  initializeScrollReveal();
}

// ==================== SEARCH AND FILTER ====================
export function initializeSearchFilter() {
  const searchBox = document.getElementById('searchBox');
  const filterSelect = document.getElementById('filterSelect');
  const courseCards = document.querySelectorAll('.course-card');

  if (!searchBox || !filterSelect || courseCards.length === 0) return;

  function filterCourses() {
    const searchTerm = searchBox?.value.toLowerCase() || '';
    const selectedFilter = filterSelect?.value || 'all';

    courseCards.forEach(card => {
      const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
      const category = card.dataset.category || 'all';

      const matchesSearch = title.includes(searchTerm);
      const matchesFilter = selectedFilter === 'all' || category === selectedFilter;

      card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  }

  searchBox?.addEventListener('input', filterCourses);
  filterSelect?.addEventListener('change', filterCourses);
}

// ==================== ENROLL BUTTON FUNCTIONALITY ====================
function initializeEnrollButtons() {
  const enrollButtons = document.querySelectorAll('.btn-enroll');

  enrollButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const courseName = this.closest('.course-card')?.querySelector('.course-title')?.textContent;

      if (courseName) {
        // Simulate enrollment
        showLoadingAnimation(this, 'Enrolling...');
        setTimeout(() => {
          hideLoadingAnimation(this);
          showModal(`You have successfully enrolled in "${courseName}"!`, 'success');
        }, 1500);
      }
    });
  });
}

