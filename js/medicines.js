// Medicines Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initializeBenefits();
  initializePharmacies();
  initializeSafetyInfo();
  initializeCTA();
});

function initializeBenefits() {
  const benefits = [
    { icon: 'clock', title: 'Save Time', description: 'Order online and get medicines delivered to your doorstep' },
    { icon: 'shield', title: 'Verified Pharmacies', description: 'All partners are licensed and certified' },
    { icon: 'box', title: 'Wide Selection', description: 'Access to thousands of medications and health products' },
    { icon: 'send', title: 'Fast Delivery', description: 'Quick and reliable delivery services' }
  ];

  const grid = document.getElementById('benefitsGrid');
  benefits.forEach((benefit, index) => {
    const card = document.createElement('div');
    card.className = 'card text-center animate-scale-in';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="card-header">
        ${Icons.getHTML(benefit.icon, 'icon-lg text-primary mx-auto mb-2')}
        <h3 class="card-title text-lg">${benefit.title}</h3>
      </div>
      <div class="card-content"><p class="card-description">${benefit.description}</p></div>
    `;
    grid.appendChild(card);
  });
}

function initializePharmacies() {
  const pharmacies = [
    { name: 'Apollo Pharmacy', url: 'https://www.apollopharmacy.in', description: 'Your trusted pharmacy for prescriptions and health products', features: ['24/7 Support', 'Same-day Pickup', 'Free Delivery'] },
    { name: 'Walgreens', url: 'https://www.walgreens.com', description: 'Prescription refills and healthcare essentials', features: ['Auto Refill', 'Mobile App', 'Drive-thru'] },
    { name: '1mg', url: 'https://www.1mg.com', description: 'Online pharmacy with home delivery', features: ['Great Discounts', 'Lab Tests', 'Doctor Consults'] },
    { name: 'PharmEasy', url: 'https://www.pharmeasy.in', description: 'Order medicines online with great discounts', features: ['Easy Returns', 'Health Records', 'Quick Delivery'] }
  ];

  const grid = document.getElementById('pharmaciesGrid');
  pharmacies.forEach((pharmacy, index) => {
    const card = document.createElement('div');
    card.className = 'card animate-fade-in-up';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const featuresHTML = pharmacy.features.map(f => 
      `<span class="text-sm px-2 py-1 rounded-full" style="background-color: hsl(var(--primary) / 0.1); color: hsl(var(--primary));">${f}</span>`
    ).join('');
    
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          ${Icons.getHTML('cart', 'icon text-primary')}
          ${pharmacy.name}
        </h3>
        <p class="card-description">${pharmacy.description}</p>
      </div>
      <div class="card-content space-y-4">
        <div class="flex flex-wrap gap-2">${featuresHTML}</div>
        <button class="btn btn-primary w-full" onclick="window.open('${pharmacy.url}', '_blank')">
          <span>Visit Pharmacy</span>
          ${Icons.getHTML('search', 'icon')}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initializeSafetyInfo() {
  const safety = [
    'Always consult with a healthcare professional before purchasing medications',
    'Verify that online pharmacies are licensed and legitimate',
    'Keep your prescription information ready for verification',
    'Check for drug interactions and allergies',
    'Follow dosage instructions carefully',
    'Store medications properly and check expiration dates'
  ];

  const container = document.getElementById('safetyInfo');
  container.className = 'p-8 rounded-lg border mb-8 animate-fade-in';
  container.style.background = 'linear-gradient(to right, hsl(var(--accent) / 0.3), hsl(var(--accent) / 0.1))';
  container.style.borderColor = 'hsl(var(--border))';
  
  container.innerHTML = `
    <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
      ${Icons.getHTML('shield', 'icon text-primary')}
      Important Safety Information
    </h2>
    <div class="grid md:grid-cols-2 gap-4">
      ${safety.map((item, i) => `
        <div class="flex items-start gap-2" style="color: hsl(var(--foreground));">
          <span class="text-primary" style="margin-top: 0.25rem;">•</span>
          <span>${item}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function initializeCTA() {
  const container = document.getElementById('ctaBox');
  container.className = 'mt-8 text-center p-6 rounded-lg border animate-fade-in';
  container.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
  container.style.borderColor = 'hsl(var(--primary) / 0.2)';
  
  container.innerHTML = `
    <h3 class="text-xl font-semibold mb-2">Need Help Choosing?</h3>
    <p class="text-muted-foreground mb-4">Use our AI diagnostic tool to understand your symptoms before ordering medications</p>
    <a href="diagnostics.html" class="btn btn-primary">Start Diagnosis</a>
  `;
}
