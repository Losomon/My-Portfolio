// ===== PORTFOLIO INTERACTIVITY HUB =====
// Modern Portfolio - Theme Toggle, EmailJS, Animations, Smooth Scroll

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initSmoothScroll();
  initContactForm();
  initScrollAnimations();
  initNavbar();
  initProgressBars();
});

// ===== 1. THEME TOGGLE (Light/Clay/Dark) =====
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'clay';
  body.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);
  
  toggleBtn.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    const nextTheme = getNextTheme(currentTheme);
    
    body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateToggleIcon(nextTheme);
    
    // Animate theme change
    body.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  });
  
  function getNextTheme(current) {
    const themes = ['clay', 'dark', 'light'];
    const currentIndex = themes.indexOf(current);
    return themes[(currentIndex + 1) % themes.length];
  }
  
  function updateToggleIcon(theme) {
    const icons = {
      clay: 'fas fa-palette',
      light: 'fas fa-sun',
      dark: 'fas fa-moon'
    };
    toggleBtn.innerHTML = `<i class="${icons[theme] || 'fas fa-palette'}"></i>`;
  }
}

// ===== 2. SMOOTH SCROLLING & NAVBAR ACTIVE STATES =====
function initSmoothScroll() {
  // All anchor links
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  function initNavbar() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(232, 200, 160, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
      } else {
        navbar.style.background = 'var(--clay-primary)';
      }
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
}

// ===== 3. BACKEND API CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const response = await fetch('http://localhost:3000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(`✅ ${result.message} ${result.emailSent ? '(Email sent!) ✅' : '(Saved! 📝)'} I'll reply within 24-48 hours.`);
          form.reset();
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        alert('❌ Connection error. Is backend running? (npm run dev)\nOr email: solomboni5@gmail.com');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Backend status indicator (optional)
  console.log('📡 Backend API ready at http://localhost:3000/api/messages');
}

// ===== 4. SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  document.querySelectorAll('.skill-card, .portfolio-card, .timeline-card, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ===== 5. SKILLS PROGRESS BARS ANIMATION =====
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  
  const animateProgress = (bar) => {
    const targetWidth = bar.style.width;
    let currentWidth = 0;
    const increment = parseInt(targetWidth) / 100;
    
    const timer = setInterval(() => {
      currentWidth += increment * 4;
      if (currentWidth >= parseInt(targetWidth)) {
        currentWidth = parseInt(targetWidth);
        clearInterval(timer);
      }
      bar.style.width = currentWidth + '%';
    }, 20);
  };
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(animateProgress);
        progressObserver.unobserve(entry.target);
      }
    });
  });
  
  document.querySelector('.skills-progress')?.parentElement && 
    progressObserver.observe(document.querySelector('.skills-progress'));
}

// ===== 6. RESPONSIVE VIDEO HANDLING =====
function initVideoOptimization() {
  const videos = document.querySelectorAll('.hero-video-1, .hero-video-2');
  
  // Pause videos when out of view
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {}); // Autoplay might be blocked
      } else {
        video.pause();
      }
    });
  });
  
  videos.forEach(video => videoObserver.observe(video));
}

// ===== 7. MOBILE OPTIMIZATIONS =====
function initMobileOptimizations() {
  if ('serviceWorker' in navigator) {
    // PWA ready - add manifest later
  }
  
  // Touch feedback for mobile
  document.addEventListener('touchstart', function() {}, { passive: true });
}

// ===== PERFORMANCE MONITORING =====
function initPerformance() {
  // Preload critical resources
  const preloadLinks = [
    '/assets/images/a.jpg'
  ];
  
  preloadLinks.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // Lazy load portfolio images
  const portfolioImages = document.querySelectorAll('.portfolio-card img');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  portfolioImages.forEach(img => imageObserver.observe(img));
}

// Initialize everything
initVideoOptimization();
initMobileOptimizations();
initPerformance();

// Window resize handler
window.addEventListener('resize', () => {
  // Recalculate any responsive elements
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any modals/popups
  }
});

console.log('🎨 Claymorphism Portfolio loaded successfully! 🚀');

