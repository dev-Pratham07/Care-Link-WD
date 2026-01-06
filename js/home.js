// Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initializeStats();
  initializeFeatures();
  initializeBenefits();
  initializeTestimonials();
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

function initializeTestimonials() {
  const testimonials = [
    {
      name: 'Sarah Gupta',
      role: 'Patient',
      text: 'The AI diagnostic tool helped me understand my symptoms before my doctor\'s appointment. It\'s incredibly helpful!',
      rating: 5
    },
    {
      name: 'Vedant Das',
      role: 'User',
      text: 'The mental health support has been a lifeline for me. Having 24/7 access to help makes all the difference.',
      rating: 5
    },
    {
      name: 'Ananya Singh' ,
      role: 'Healthcare Worker',
      text: 'As a nurse, I recommend Care Link to my patients. The health awareness section is fantastic for education.',
      rating: 5
    }
  ];

  const testimonialsGrid = document.getElementById('testimonialsGrid');
  
  testimonials.forEach((testimonial, index) => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'card animate-scale-in';
    testimonialCard.style.animationDelay = `${index * 0.2}s`;
    
    // Create stars
    let starsHTML = '<div style="display: flex; gap: 0.25rem; margin-bottom: 1rem;">';
    for (let i = 0; i < testimonial.rating; i++) {
      starsHTML += Icons.getHTML('star', 'icon text-primary').replace('<svg', '<svg style="fill: hsl(var(--primary));"');
    }
    starsHTML += '</div>';
    
    testimonialCard.innerHTML = `
      <div class="card-content" style="padding: 1.5rem;">
        ${starsHTML}
        <p class="italic mb-4" style="color: hsl(var(--card-foreground));">"${testimonial.text}"</p>
        <div>
          <div class="font-semibold" style="color: hsl(var(--foreground));">${testimonial.name}</div>
          <div class="text-sm text-muted-foreground">${testimonial.role}</div>
        </div>
      </div>
    `;
    
    testimonialsGrid.appendChild(testimonialCard);
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
