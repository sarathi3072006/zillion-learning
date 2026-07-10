// ==================== LOADING ANIMATION ====================
// ==================== LOADING ANIMATION ====================
export function showLoadingAnimation(btn, loadingText = 'Loading...') {
  if (btn) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading"></span> ${loadingText}`;
  }
}

export function hideLoadingAnimation(btn, restoreText) {
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = restoreText ?? btn.dataset.originalText ?? 'Submit';
  }
}

// ==================== UTILITY FUNCTIONS ====================
export function showModal(message, type = 'info') {
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

// ==================== REVEAL ON SCROLL ANIMATION ====================
export function initializeScrollReveal() {
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