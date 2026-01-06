// Awareness Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initializeDidYouKnow();
  initializeTopics();
});

function initializeDidYouKnow() {
  const facts = [
    'Regular handwashing can reduce respiratory infections by up to 20%',
    'Adults need 7-9 hours of sleep per night for optimal health',
    'Just 30 minutes of daily exercise can significantly reduce disease risk',
    'Drinking water before meals can help with weight management',
    'Social connections are as important for health as diet and exercise'
  ];

  const grid = document.getElementById('didYouKnowGrid');
  
  facts.forEach((fact, index) => {
    const factItem = document.createElement('div');
    factItem.className = 'flex items-start gap-2 transition-all';
    factItem.style.color = 'hsl(var(--foreground))';
    factItem.innerHTML = `
      <span class="text-primary" style="margin-top: 0.25rem;">💡</span>
      <span>${fact}</span>
    `;
    
    factItem.addEventListener('mouseenter', () => {
      factItem.style.transform = 'translateX(0.25rem)';
    });
    
    factItem.addEventListener('mouseleave', () => {
      factItem.style.transform = 'translateX(0)';
    });
    
    grid.appendChild(factItem);
  });
}

function initializeTopics() {
  const topics = [
    {
      icon: 'droplets',
      title: 'Hand Hygiene',
      description: 'Proper handwashing is one of the most effective ways to prevent illness',
      tips: [
        'Wash hands for at least 20 seconds with soap and water',
        'Clean hands before eating and after using the restroom',
        'Use hand sanitizer when soap isn\'t available',
        'Dry hands thoroughly with a clean towel'
      ]
    },
    {
      icon: 'apple',
      title: 'Balanced Nutrition',
      description: 'A healthy diet is essential for overall wellbeing',
      tips: [
        'Eat a variety of fruits and vegetables daily',
        'Choose whole grains over refined grains',
        'Limit processed foods and added sugars',
        'Stay hydrated with 8 glasses of water per day'
      ]
    },
    {
      icon: 'dumbbell',
      title: 'Regular Exercise',
      description: 'Physical activity strengthens your body and mind',
      tips: [
        'Aim for 150 minutes of moderate exercise per week',
        'Include strength training twice a week',
        'Take breaks from sitting every hour',
        'Find activities you enjoy to stay motivated'
      ]
    },
    {
      icon: 'moon',
      title: 'Quality Sleep',
      description: 'Good sleep is crucial for physical and mental health',
      tips: [
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep your bedroom cool and dark',
        'Limit screen time before bed'
      ]
    },
    {
      icon: 'shield',
      title: 'Preventive Care',
      description: 'Regular check-ups can catch health issues early',
      tips: [
        'Schedule annual physical examinations',
        'Stay up-to-date with vaccinations',
        'Get recommended health screenings',
        'Monitor blood pressure and cholesterol'
      ]
    },
    {
      icon: 'heart',
      title: 'Mental Wellness',
      description: 'Mental health is as important as physical health',
      tips: [
        'Practice stress management techniques',
        'Stay connected with friends and family',
        'Seek help when you\'re struggling',
        'Take time for hobbies and relaxation'
      ]
    }
  ];

  const grid = document.getElementById('topicsGrid');
  
  topics.forEach((topic, index) => {
    const card = document.createElement('div');
    card.className = 'card animate-fade-in-up';
    card.style.animationDelay = `${index * 0.1}s`;
    
    let tipsHTML = '<ul class="space-y-2">';
    topic.tips.forEach(tip => {
      tipsHTML += `
        <li class="flex items-start text-sm transition-transform" style="cursor: default;">
          <span class="text-primary" style="margin-right: 0.5rem; margin-top: 0.25rem; transition: transform 0.3s;">•</span>
          <span class="text-muted-foreground">${tip}</span>
        </li>
      `;
    });
    tipsHTML += '</ul>';
    
    card.innerHTML = `
      <div class="card-header">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 rounded-lg" style="background-color: hsl(var(--primary) / 0.1);">
            ${Icons.getHTML(topic.icon, 'icon-lg text-primary')}
          </div>
          <h3 class="card-title text-xl">${topic.title}</h3>
        </div>
        <p class="card-description">${topic.description}</p>
      </div>
      <div class="card-content">
        ${tipsHTML}
      </div>
    `;
    
    // Add hover effect to tips
    setTimeout(() => {
      const tips = card.querySelectorAll('li');
      tips.forEach(tip => {
        tip.addEventListener('mouseenter', function() {
          const bullet = this.querySelector('span.text-primary');
          if (bullet) {
            bullet.style.transform = 'scale(1.25)';
          }
        });
        
        tip.addEventListener('mouseleave', function() {
          const bullet = this.querySelector('span.text-primary');
          if (bullet) {
            bullet.style.transform = 'scale(1)';
          }
        });
      });
    }, 100);
    
    grid.appendChild(card);
  });
}
