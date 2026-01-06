// Navigation Component
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.createNavigation();
    this.attachEventListeners();
    this.setActiveLink();
  }

  createNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'navigation';
    nav.innerHTML = `
      <div class="nav-container">
        <a href="index.html" class="nav-logo">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Care Link</span>
        </a>

        <div class="nav-links" id="navLinks">
          <a href="index.html" class="nav-link" data-page="home">Home</a>
          <a href="diagnostics.html" class="nav-link" data-page="diagnostics">Diagnostics</a>
          <a href="medicines.html" class="nav-link" data-page="medicines">Medicines</a>
          <a href="mental-health.html" class="nav-link" data-page="mental-health">Mental Health</a>
          <a href="awareness.html" class="nav-link" data-page="awareness">Awareness</a>
          <a href="about.html" class="nav-link" data-page="about">About</a>
          <a href="login.html" class="btn btn-primary btn-sm">Login</a>
        </div>

        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
          <svg class="icon" id="menuIcon" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg class="icon" id="closeIcon" style="display: none;" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="nav-mobile" id="navMobile">
        <a href="index.html" class="nav-link" data-page="home">Home</a>
        <a href="diagnostics.html" class="nav-link" data-page="diagnostics">Diagnostics</a>
        <a href="medicines.html" class="nav-link" data-page="medicines">Medicines</a>
        <a href="mental-health.html" class="nav-link" data-page="mental-health">Mental Health</a>
        <a href="awareness.html" class="nav-link" data-page="awareness">Awareness</a>
        <a href="about.html" class="nav-link" data-page="about">About</a>
        <a href="login.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem; display: block; text-align: center;">Login</a>
      </div>
    `;

    document.body.insertBefore(nav, document.body.firstChild);
  }

  attachEventListeners() {
    const toggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('navMobile');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const mobileLinks = mobileNav.querySelectorAll('.nav-link, .btn');

    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      const isActive = mobileNav.classList.contains('active');
      
      if (isActive) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      });
    });
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
  new Navigation();
}
