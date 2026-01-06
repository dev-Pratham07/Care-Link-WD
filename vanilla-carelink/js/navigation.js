// Navigation Component
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.createNavigation();
    this.attachEventListeners();
    this.setActiveLink();
    this.updateAuthButton();
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

  async updateAuthButton() {
    // Check if user is logged in
    const isLoggedIn = await this.checkUserSession();
    
    const desktopAuthBtn = document.querySelector('.nav-links a[href="login.html"]');
    const mobileAuthBtn = document.querySelector('.nav-mobile a[href="login.html"]');
    
    if (isLoggedIn) {
      // Check if user is admin
      const isAdmin = await this.checkIfAdmin();
      
      // Update desktop button
      if (desktopAuthBtn) {
        desktopAuthBtn.href = 'profile.html';
        desktopAuthBtn.innerHTML = `
          <svg class="icon" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile
        `;
        
        // Add admin link if user is admin
        if (isAdmin) {
          const desktopNavLinks = document.querySelector('.nav-links');
          const existingAdminLink = desktopNavLinks.querySelector('a[href="admin.html"]');
          
          if (!existingAdminLink) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.innerHTML = `
              <svg class="icon" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Admin
            `;
            adminLink.style.color = '#dc2626';
            adminLink.style.fontWeight = '600';
            desktopNavLinks.insertBefore(adminLink, desktopAuthBtn);
          }
        }
      }
      
      // Update mobile button
      if (mobileAuthBtn) {
        mobileAuthBtn.href = 'profile.html';
        mobileAuthBtn.innerHTML = `
          <svg class="icon" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile
        `;
        
        // Add admin link in mobile menu if user is admin
        if (isAdmin) {
          const mobileNavLinks = document.querySelector('.nav-mobile');
          const existingMobileAdminLink = mobileNavLinks.querySelector('a[href="admin.html"]');
          
          if (!existingMobileAdminLink) {
            const mobileAdminLink = document.createElement('a');
            mobileAdminLink.href = 'admin.html';
            mobileAdminLink.innerHTML = `
              <svg class="icon" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Admin
            `;
            mobileAdminLink.style.color = '#dc2626';
            mobileAdminLink.style.fontWeight = '600';
            mobileNavLinks.insertBefore(mobileAdminLink, mobileAuthBtn);
          }
        }
      }
    }
  }

  async checkIfAdmin() {
    if (typeof SupabaseAdmin !== 'undefined' && SupabaseAdmin.isAdmin) {
      try {
        return await SupabaseAdmin.isAdmin();
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  async checkUserSession() {
    // Wait for Supabase to be initialized
    if (typeof initSupabase === 'function') {
      try {
        initSupabase();
      } catch (e) {
        // Supabase might already be initialized
      }
    }
    
    // Check if Supabase Auth is available
    if (typeof SupabaseAuth !== 'undefined' && SupabaseAuth.getCurrentUser) {
      try {
        const user = await SupabaseAuth.getCurrentUser();
        return user !== null && user !== undefined;
      } catch (error) {
        // If there's an error getting user, they're not logged in
        return false;
      }
    }
    
    // If Supabase is not available, user is not logged in
    return false;
  }
}

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
  new Navigation();
}
