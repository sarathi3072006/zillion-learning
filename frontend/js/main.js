/* =====================================================
   zillion learning - Main JavaScript
   Interactive Features and Functionality
   ===================================================== */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  loadDarkModePreference();
  initializeCounters();
  initializeFormValidation();
  initializeAdminAccess();
  // Load courses if on courses page
  if (document.getElementById('coursesContainer')) {
    loadCourses();
  }
});

// ==================== DARK MODE ====================
function initializeDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  updateDarkModeIcon();
}

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
  updateDarkModeIcon();
  initializeDarkMode();
}

function updateDarkModeIcon() {
  const toggle = document.querySelector('.dark-mode-toggle');
  if (toggle) {
    const isDark = document.body.classList.contains('dark-mode');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
  }
}

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
    scrollTopBtn?.classList.add('show');
  } else {
    scrollTopBtn?.classList.remove('show');
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

scrollTopBtn?.addEventListener('click', scrollToTop);

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== ANIMATED COUNTERS ====================
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        animateCounter(counter);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.innerText.replace(/\D/g, ''));
  const duration = 2000;
  const increment = target / (duration / 50);
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.innerText = Math.floor(current).toLocaleString() + '+';
  }, 50);
}

// ==================== FORM VALIDATION ====================
function initializeFormValidation() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formMessage = document.querySelector('.form-message');
  const inputs = this.querySelectorAll('input, textarea');
  let isValid = true;
  
  // Reset message
  if (formMessage) {
    formMessage.classList.remove('success', 'error');
  }
  
  // Validate fields
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#dc3545';
    } else {
      input.style.borderColor = '';
    }
    
    // Email validation
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.style.borderColor = '#dc3545';
      }
    }
  });
  
  if (isValid) {
    if (formMessage) {
      formMessage.classList.add('success');
      formMessage.textContent = 'Thank you! Your message has been sent successfully. We will contact you soon.';
      formMessage.style.display = 'block';
    }
    
    // Simulate form submission
    showLoadingAnimation();
    
    setTimeout(() => {
      this.reset();
      hideLoadingAnimation();
      if (formMessage) {
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 3000);
      }
    }, 2000);
  } else {
    if (formMessage) {
      formMessage.classList.add('error');
      formMessage.textContent = 'Please fill all fields correctly.';
      formMessage.style.display = 'block';
    }
  }
}

// ==================== ADMIN PANEL ACCESS ====================
function initializeAdminAccess() {
  const form = document.getElementById('adminLoginForm');
  if (form) {
    form.addEventListener('submit', handleAdminLogin);
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const passwordInput = document.getElementById('adminPassword');
  const errorMessage = document.getElementById('adminLoginError');
  const adminLockScreen = document.getElementById('adminLockScreen');
  const adminContent = document.getElementById('adminContent');
  const ADMIN_PASSWORD = 'admin2026';
  const enteredPassword = passwordInput?.value.trim() || '';

  if (!enteredPassword) {
    if (errorMessage) {
      errorMessage.textContent = 'Please enter the admin password.';
    }
    return;
  }

  if (enteredPassword === ADMIN_PASSWORD) {
    if (errorMessage) {
      errorMessage.textContent = '';
    }
    if (adminLockScreen) {
      adminLockScreen.style.display = 'none';
    }
    if (adminContent) {
      adminContent.style.display = 'block';
    }
  } else {
    if (errorMessage) {
      errorMessage.textContent = 'Incorrect password. Please try again.';
    }
  }
}

// ==================== DYNAMIC COURSE LOADING ====================
async function loadCourses() {
  try {
    const response = await fetch('http://localhost:5000/courses');
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

  container.innerHTML = courses.map(course => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="course-card" data-category="${course.category}">
        <div class="course-image" style="background: ${course.gradient};"></div>
        <div class="course-content">
          <h5 class="course-title">${course.title}</h5>
          <p class="course-description">${course.description}</p>
          <div class="course-meta">
            <span><i class="fas fa-clock"></i> ${course.duration}</span>
            <span><i class="fas fa-users"></i> ${course.students} students</span>
          </div>
          <div class="course-fee">${course.fee}</div>
          <button class="btn-enroll" onclick="alert('Enrolled in ${course.title}!')">
            <i class="fas fa-check-circle"></i> Enroll Now
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-initialize enroll buttons and animations for dynamically loaded courses
  initializeEnrollButtons();
  initializeScrollReveal();
  initializeSearchFilter();
}

// ==================== SEARCH AND FILTER ====================
function initializeSearchFilter() {
  const searchBox = document.getElementById('searchBox');
  const filterSelect = document.getElementById('filterSelect');
  const courseCards = document.querySelectorAll('.course-card');
  
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

// Call search filter when page loads
document.addEventListener('DOMContentLoaded', initializeSearchFilter);

// ==================== LOADING ANIMATION ====================
function showLoadingAnimation() {
  const btn = document.querySelector('.btn-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Submitting...';
  }
}

function hideLoadingAnimation() {
  const btn = document.querySelector('.btn-submit');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = 'Send Message';
  }
}

// ==================== NAVBAR TRANSPARENCY ON SCROLL ====================
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.pageYOffset > 50) {
      navbar.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
    }
  }
});

// ==================== PAGE LOADING ANIMATION ====================
window.addEventListener('load', function() {
  document.body.style.opacity = '1';
});

// ==================== UTILITY FUNCTIONS ====================
function showModal(message, type = 'info') {
  const modal = document.createElement('div');
  modal.className = `alert alert-${type} alert-dismissible fade show`;
  modal.setAttribute('role', 'alert');
  modal.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  const container = document.querySelector('.container:first-of-type');
  if (container) {
    container.insertBefore(modal, container.firstChild);
    
    setTimeout(() => {
      modal.remove();
    }, 3000);
  }
}

// ==================== ENROLL BUTTON FUNCTIONALITY ====================
function initializeEnrollButtons() {
  const enrollButtons = document.querySelectorAll('.btn-enroll');
  
  enrollButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const courseName = this.closest('.course-card')?.querySelector('.course-title')?.textContent;
      
      if (courseName) {
        // Simulate enrollment
        showLoadingAnimation();
        setTimeout(() => {
          hideLoadingAnimation();
          showModal(`You have successfully enrolled in "${courseName}"!`, 'success');
        }, 1500);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeEnrollButtons);

// ==================== REVEAL ON SCROLL ANIMATION ====================
function initializeScrollReveal() {
  const elements = document.querySelectorAll('.course-card, .faculty-card, .feature-box, .testimonial-card');
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', initializeScrollReveal);

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
  // Close mobile navbar when a link is clicked
  const navbarLinks = document.querySelectorAll('.navbar-collapse a');
  const navbarToggle = document.querySelector('.navbar-toggler');
  
  navbarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbarToggle && window.getComputedStyle(navbarToggle).display !== 'none') {
        navbarToggle.click();
      }
    });
  });
}

// ==================== LIVE CLOCK ====================
function updateClock() {
  const clockElements = document.querySelectorAll('[data-clock]');
  
  clockElements.forEach(element => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    element.textContent = timeString;
  });
}

setInterval(updateClock, 1000);

// ==================== RATING SYSTEM ====================
function initializeRatings() {
  const stars = document.querySelectorAll('.rating-star');
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = this.dataset.rating;
      const container = this.closest('.rating-container');
      
      container.querySelectorAll('.rating-star').forEach(s => {
        s.classList.remove('active');
      });
      
      for (let i = 0; i < rating; i++) {
        container.querySelectorAll('.rating-star')[i].classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeRatings);

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(e) {
  // Press 'D' to toggle dark mode
  if (e.key.toLowerCase() === 'd' && e.altKey) {
    toggleDarkMode();
  }
  
  // Press 'T' to scroll to top
  if (e.key.toLowerCase() === 't' && e.altKey) {
    scrollToTop();
  }
});
