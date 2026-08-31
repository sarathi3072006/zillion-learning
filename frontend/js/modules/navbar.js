
// ==================== IMPORT MODULES ====================
import config from "./config.js";
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
export async function initializeLoginNavbar() {

  const loginElement = document.getElementById("login");

  if (!loginElement) return;

  const token = localStorage.getItem("token");

  if (!token) return;

  try {

    const response = await fetch(`${config.API_URL}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {

      localStorage.removeItem("token");
      return;

    }

    const user = await response.json();


    const profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00bfff&color=ffffff&bold=true&size=80`;
    loginElement.innerHTML = `
    <a class="nav-link p-0" href="/frontend/pages/dashboard.html">
        <img 
            src="${profilePicture}"
            alt="Profile"
            width="40"
            height="40"
            class="rounded-circle"
        >
    </a>
  `;

  } catch (error) {

    console.error("Failed to load user:", error);

  }

}