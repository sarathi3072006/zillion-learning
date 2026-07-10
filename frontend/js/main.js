/* =====================================================
   zillion learning - Main JavaScript
   Interactive Features and Functionality
   ===================================================== */
//=====================IMPORT MODULES=====================
import { loadCourses,initializeSearchFilter,loadCategories } from "./modules/courses.js";
import { showLoadingAnimation, hideLoadingAnimation, showModal, initializeScrollReveal } from "./modules/ui.js";
// ==================== INITIALIZATION ====================
function initApp() {
  initializeDarkMode();
  loadDarkModePreference();

  initializeScrollTop();
  initializeSmoothScrolling();
  initializeCounters();
  initializeNavbarScrollEffect();
  initializePageLoadAnimation();
  initializeEventListeners();
  initializeClock();
  initializeRatings();
  initializeKeyboardShortcuts();
  //================ MODULE FUNCTIONS=================
  // course page specific functions
  if (document.getElementById('coursesContainer')) {
    loadCourses();
    loadCategories('filterSelect'); // Load categories into the select dropdown
    initializeSearchFilter();
  }
}

initApp();

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
}

function updateDarkModeIcon() {
  const toggle = document.querySelector('.dark-mode-toggle');
  if (toggle) {
    const isDark = document.body.classList.contains('dark-mode');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
  }
}


// ==================== SCROLL TO TOP BUTTON ====================
function initializeScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
    }
  });

  scrollTopBtn?.addEventListener('click', scrollToTop);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


// ==================== SMOOTH SCROLLING ====================
function initializeSmoothScrolling() {
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
}


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








// ==================== NAVBAR TRANSPARENCY ON SCROLL ====================
function initializeNavbarScrollEffect() {
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
}


// ==================== PAGE LOADING ANIMATION ====================
function initializePageLoadAnimation() {
  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
  });
}





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
function initializeClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const clockElements = document.querySelectorAll('[data-clock]');

  clockElements.forEach(element => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    element.textContent = timeString;
  });
}


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


// ==================== KEYBOARD SHORTCUTS ====================
function initializeKeyboardShortcuts() {
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
}