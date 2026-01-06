// Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initializeStats();
  initializeFeatures();
  initializeBenefits();
  initializeTestimonials();
  initializeReviewForm();
  initializeAnimations();
});

function initializeStats() {
  const stats = [
    { icon: 'users', value: '50K+', label: 'Active Users' },
    { icon: 'clock', value: '24/7', label: 'Support Available' },
    { icon: 'award', value: '98%', label: 'Satisfaction Rate' },
    { icon: 'trendingUp', value: '1M+', label: 'Consultations' }
  ];

  const statsGrid = document.getElementById('statsGrid');
  
  stats.forEach((stat, index) => {
    const statItem = document.createElement('div');
    statItem.className = 'stat-item animate-scale-in';
    statItem.style.animationDelay = `${index * 0.1}s`;
    
    statItem.innerHTML = `
      ${Icons.getHTML(stat.icon, 'stat-icon animate-float')}
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    
    statsGrid.appendChild(statItem);
  });
}

function initializeFeatures() {
  const features = [
    {
      icon: 'stethoscope',
      title: 'AI Diagnostics',
      description: 'Get instant health insights powered by advanced AI technology',
      link: 'diagnostics.html'
    },
    {
      icon: 'brain',
      title: 'Mental Health Support',
      description: '24/7 confidential support for your mental wellbeing',
      link: 'mental-health.html'
    },
    {
      icon: 'cart',
      title: 'Medicine Marketplace',
      description: 'Easy access to medications and prescriptions',
      link: 'medicines.html'
    },
    {
      icon: 'shield',
      title: 'Health Awareness',
      description: 'Educational resources for better health and hygiene',
      link: 'awareness.html'
    }
  ];

  const featuresGrid = document.getElementById('featuresGrid');
  
  features.forEach((feature, index) => {
    const featureCard = document.createElement('a');
    featureCard.href = feature.link;
    featureCard.className = 'animate-fade-in-up';
    featureCard.style.animationDelay = `${index * 0.1}s`;
    featureCard.style.textDecoration = 'none';
    
    featureCard.innerHTML = `
      <div class="card" style="height: 100%;">
        <div class="card-header">
          ${Icons.getHTML(feature.icon, 'icon-lg text-primary')}
        </div>
        <div class="card-content">
          <h3 class="card-title">${feature.title}</h3>
          <p class="card-description">${feature.description}</p>
        </div>
      </div>
    `;
    
    featuresGrid.appendChild(featureCard);
  });
}

function initializeBenefits() {
  const benefits = [
    'Free AI-powered symptom checker',
    'Instant medical information access',
    'Crisis support and resources',
    'Connect with real doctors',
    'Medication reminders',
    'Health tracking tools'
  ];

  const benefitsGrid = document.getElementById('benefitsGrid');
  
  benefits.forEach((benefit, index) => {
    const benefitItem = document.createElement('div');
    benefitItem.className = 'animate-fade-in-up';
    benefitItem.style.animationDelay = `${index * 0.1}s`;
    
    benefitItem.innerHTML = `
      <div class="card" style="flex-direction: row; align-items: center; padding: 1rem;">
        ${Icons.getHTML('checkCircle', 'icon text-primary')}
        <span style="margin-left: 0.75rem; color: hsl(var(--card-foreground));">${benefit}</span>
      </div>
    `;
    
    benefitsGrid.appendChild(benefitItem);
  });
}

async function initializeTestimonials() {
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  testimonialsGrid.innerHTML = '<div class="col-span-full text-center">Loading reviews...</div>';

  let reviews = [];
  
  try {
    // Try to fetch real reviews
    if (typeof SupabaseDB !== 'undefined') {
        // Initialize Supabase if needed (it might handle its own check)
        window.initSupabase && window.initSupabase();
        reviews = await SupabaseDB.getReviews(3);
    }
  } catch (error) {
    console.warn('Could not fetch reviews:', error);
  }

  // Fallback to hardcoded if no real reviews
  if (!reviews || reviews.length === 0) {
    reviews = [
        {
          profiles: { full_name: 'Sarah Gupta', role: 'Patient' },
          comment: 'The AI diagnostic tool helped me understand my symptoms before my doctor\'s appointment. It\'s incredibly helpful!',
          rating: 5
        },
        {
          profiles: { full_name: 'Vedant Das', role: 'User' },
          comment: 'The mental health support has been a lifeline for me. Having 24/7 access to help makes all the difference.',
          rating: 5
        },
        {
          profiles: { full_name: 'Ananya Singh', role: 'Healthcare Worker' },
          comment: 'As a nurse, I recommend Care Link to my patients. The health awareness section is fantastic for education.',
          rating: 5
        }
    ];
  }

  testimonialsGrid.innerHTML = '';
  
  reviews.forEach((review, index) => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'card animate-scale-in';
    testimonialCard.style.animationDelay = `${index * 0.2}s`;
    
    // Create stars
    let starsHTML = '<div style="display: flex; gap: 0.25rem; margin-bottom: 1rem;">';
    for (let i = 0; i < review.rating; i++) {
      starsHTML += Icons.getHTML('star', 'icon text-primary').replace('<svg', '<svg style="fill: hsl(var(--primary));"');
    }
    starsHTML += '</div>';
    
    const name = review.profiles?.full_name || 'Anonymous User';
    const role = review.profiles?.role ? (review.profiles.role.charAt(0).toUpperCase() + review.profiles.role.slice(1)) : 'User';

    testimonialCard.innerHTML = `
      <div class="card-content" style="padding: 1.5rem;">
        ${starsHTML}
        <p class="italic mb-4" style="color: hsl(var(--card-foreground));">"${review.comment}"</p>
        <div>
          <div class="font-semibold" style="color: hsl(var(--foreground));">${name}</div>
          <div class="text-sm text-muted-foreground">${role}</div>
        </div>
      </div>
    `;
    
    testimonialsGrid.appendChild(testimonialCard);
  });
}

function initializeReviewForm() {
  const formSection = document.getElementById('reviewFormSection');
  const loginMessage = document.getElementById('loginToReview');
  const ratingContainer = document.getElementById('ratingStars');
  const ratingInput = document.getElementById('ratingInput');
  
  // Check auth status
  const checkAuth = async () => {
    try {
        window.initSupabase && window.initSupabase();
        const user = await SupabaseAuth.getCurrentUser();
        if (user) {
            formSection.style.display = 'block';
            loginMessage.style.display = 'none';
        } else {
            formSection.style.display = 'none';
            loginMessage.style.display = 'block';
        }
    } catch (e) {
        console.warn('Auth check failed:', e);
    }
  };
  checkAuth();

  // Initialize star rating interactive
  let currentRating = 5;
  
  function renderStars(rating) {
    ratingContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('div');
        star.style.cursor = 'pointer';
        star.innerHTML = Icons.getHTML('star', `icon ${i <= rating ? 'text-primary' : 'text-muted'}`);
        if (i <= rating) {
            star.innerHTML = star.innerHTML.replace('<svg', '<svg style="fill: hsl(var(--primary));"');
        }
        
        star.addEventListener('click', () => {
            currentRating = i;
            ratingInput.value = i;
            renderStars(i);
        });
        
        ratingContainer.appendChild(star);
    }
  }
  renderStars(5);

  // Handle submit
  document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitReviewBtn');
    const comment = document.getElementById('reviewComment').value;
    
    try {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
        
        const user = await SupabaseAuth.getCurrentUser();
        if (!user) throw new Error('You must be logged in');
        
        await SupabaseDB.addReview(user.id, currentRating, comment);
        
        alert('Review submitted successfully!');
        document.getElementById('reviewForm').reset();
        renderStars(5);
        
        // Refresh reviews
        initializeTestimonials();
        
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Submit Review';
    }
  });
}

function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.animate-fade-in, .animate-fade-in-up, .animate-scale-in').forEach(el => {
    observer.observe(el);
  });

  // Add hover effect to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      const icon = this.querySelector('svg');
      if (icon && this.href && this.href.includes('diagnostics')) {
        icon.style.transform = 'rotate(12deg)';
        icon.style.transition = 'transform 0.3s';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      const icon = this.querySelector('svg');
      if (icon) {
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}
