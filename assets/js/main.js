document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initStickyHeader();
  initStatsCounter();
  initTestimonialsSlider();
  initProjectsFilter();
  initContactForm();
});

/* ==========================================================================
   Navigation Active States
   ========================================================================== */
function initNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Check if path matches, checking for exact or default index.html
      if (currentPath.endsWith(href) || 
         (href === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
        link.classList.add('text-cyan-400');
        link.classList.remove('text-slate-300');
      } else {
        link.classList.remove('text-cyan-400');
        link.classList.add('text-slate-300');
      }
    }
  });
}

/* ==========================================================================
   Sticky Header Blur
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('navbar-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-slate-950/80', 'backdrop-blur-md', 'border-slate-800/80', 'shadow-2xl');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.remove('bg-slate-950/80', 'backdrop-blur-md', 'border-slate-800/80', 'shadow-2xl');
      header.classList.add('bg-transparent', 'border-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/* ==========================================================================
   Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    // Toggle body scroll
    document.body.classList.toggle('overflow-hidden');
  };

  menuBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  // Close mobile menu when clicking outside the content area (on the backdrop overlay)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isFloat = counter.getAttribute('data-float') === 'true';
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;

      if (isFloat) {
        counter.textContent = prefix + currentValue.toFixed(1) + suffix;
      } else {
        counter.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (isFloat) {
          counter.textContent = prefix + target.toFixed(1) + suffix;
        } else {
          counter.textContent = prefix + target.toLocaleString() + suffix;
        }
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   Testimonials Slider (Home Page)
   ========================================================================== */
function initTestimonialsSlider() {
  const container = document.querySelector('.slider-container');
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (!container || !track || slides.length === 0) return;

  let currentIndex = 0;
  let slideInterval;
  const slideCount = slides.length;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-600'}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-cyan-400 w-6';
      } else {
        dot.className = 'w-3 h-3 rounded-full transition-all duration-300 bg-slate-700 hover:bg-slate-600';
      }
    });
  };

  const goToSlide = (index) => {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = slideCount - 1;
    if (currentIndex >= slideCount) currentIndex = 0;
    
    // Shift track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const startInterval = () => {
    slideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  };

  const resetInterval = () => {
    clearInterval(slideInterval);
    startInterval();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetInterval();
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      goToSlide(currentIndex + 1);
      resetInterval();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      goToSlide(currentIndex - 1);
      resetInterval();
    }
  };

  startInterval();
}

/* ==========================================================================
   Projects Grid Category Filtering (Projects Page)
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      filterBtns.forEach(b => {
        b.classList.remove('bg-gradient-to-r', 'from-violet-600', 'to-cyan-600', 'text-white', 'border-transparent');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      });

      // Add active state to clicked button
      btn.classList.add('bg-gradient-to-r', 'from-violet-600', 'to-cyan-600', 'text-white', 'border-transparent');
      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom animated fade filters
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Wait a tiny frame to apply opacity transition
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Hide from layout after transition finishes
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   Lead Gen Form Validation & Feedback (Contact Page)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('agency-lead-form');
  const formStatus = document.getElementById('form-status-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous error styles
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(inp => {
      inp.classList.remove('border-red-500', 'focus:border-red-500');
      inp.classList.add('focus:border-violet-500');
    });

    let hasError = false;

    // Validate Full Name
    const nameInput = document.getElementById('client-name');
    if (nameInput && nameInput.value.trim().length < 2) {
      setError(nameInput);
      hasError = true;
    }

    // Validate Email
    const emailInput = document.getElementById('client-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value.trim())) {
      setError(emailInput);
      hasError = true;
    }

    // Validate Website URL (optional, but if filled must be a valid URL structure or contain a dot)
    const urlInput = document.getElementById('client-website');
    if (urlInput && urlInput.value.trim() !== '') {
      const val = urlInput.value.trim();
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      if (!urlRegex.test(val)) {
        setError(urlInput);
        hasError = true;
      }
    }

    // Validate Service Dropdown
    const serviceInput = document.getElementById('client-service');
    if (serviceInput && serviceInput.value === '') {
      setError(serviceInput);
      hasError = true;
    }

    // Validate Message
    const msgInput = document.getElementById('client-message');
    if (msgInput && msgInput.value.trim().length < 10) {
      setError(msgInput);
      hasError = true;
    }

    if (hasError) {
      showStatus('Please fill in all required fields correctly.', 'error');
      return;
    }

    // Success styling state
    showStatus('Submitting your proposal request...', 'loading');
    
    // Simulate API request delay
    setTimeout(() => {
      // Clear inputs
      form.reset();
      showStatus('Success! Our strategy team will contact you within 12 hours with your custom growth proposal.', 'success');
    }, 1500);
  });

  const setError = (element) => {
    element.classList.add('border-red-500', 'focus:border-red-500');
    element.classList.remove('focus:border-violet-500');
  };

  const showStatus = (msg, type) => {
    if (!formStatus) return;

    formStatus.classList.remove('hidden', 'bg-red-500/10', 'text-red-400', 'border-red-500/30', 'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30', 'text-cyan-400', 'bg-cyan-500/10', 'border-cyan-500/30');

    if (type === 'error') {
      formStatus.classList.add('bg-red-500/10', 'text-red-400', 'border-red-500/30');
    } else if (type === 'success') {
      formStatus.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30');
    } else if (type === 'loading') {
      formStatus.classList.add('bg-cyan-500/10', 'text-cyan-400', 'border-cyan-500/30');
    }

    formStatus.textContent = msg;
    formStatus.classList.remove('hidden');
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}
