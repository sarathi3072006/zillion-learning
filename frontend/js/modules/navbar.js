// ==================== NAVBAR TRANSPARENCY ON SCROLL ====================
export function initializeNavbarScrollEffect() {
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.pageYOffset > 50) {
        navbar.style.boxShadow = 'none';
      } else {
        navbar.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
      }
    }
  });
}

// ==================== EVENT LISTENERS ====================
export function initializeEventListeners() {
  // Close mobile navbar when a link is clicked
  const navbarLinks = document.querySelectorAll('.navbar-collapse a');
  const navbarToggle = document.querySelector('.navbar-toggler');

  navbarLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (navbarToggle && window.getComputedStyle(navbarToggle).display !== 'none') {
        navbarToggle.click();
      }
    });
  });
}

//==================== DYNAMIC LOGIN NAVBAR ====================