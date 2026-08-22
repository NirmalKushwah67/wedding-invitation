document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initPreloader();
  initCustomCursor();
  initScrollProgress();
  initNavigation();
  initInteractiveEnvelope();
  initCountdownTimer();
  initScrollAnimations();
  initGalleryLightbox();
  initAmbientParticles();
  initHeroFloatingCanvas();
  initEventsPetalShower();
  initValentineLoveStoryCanvas();
  initializeEntryGate();
});

/* --------------------------------------------------------------------------
   FULLSCREEN LUXURY ENVELOPE ENTRY GATE MODULE
   -------------------------------------------------------------------------- */
let isOpeningInvitation = false;

function initializeEntryGate() {
  const gate = document.getElementById('entry-gate');
  const gateButton = document.getElementById('entry-gate-button');
  if (!gate) return;

  // Scroll lock active while gate is present
  document.documentElement.classList.add('gate-active');
  document.body.classList.add('gate-active');

  // Trigger on button click or tap
  if (gateButton) {
    gateButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openInvitation();
    });
  }

  // Allow tapping anywhere on the envelope overlay to open
  gate.addEventListener('click', () => {
    openInvitation();
  });

  // Keyboard accessibility: Enter or Space key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!gate.classList.contains('hidden-gate') && !isOpeningInvitation) {
        e.preventDefault();
        openInvitation();
      }
    }
  });

  // Initialize sparkles canvas on entry gate
  initEntrySparkles();
}

function openInvitation() {
  if (isOpeningInvitation) return;
  isOpeningInvitation = true;

  const gate = document.getElementById('entry-gate');
  const gateButton = document.getElementById('entry-gate-button');
  if (!gate) return;

  // 1. Sparkle particle burst effect around the seal button
  if (gateButton && typeof createSparkleBurst === 'function') {
    createSparkleBurst(gateButton);
  }

  // 2. Trigger Royal Celebratory Wedding Confetti Shower
  setTimeout(() => {
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
  }, 400);

  // 3. Add 3D flap opening animation class
  gate.classList.add('opening-gate');

  // 4. Smoothly finish transition after 1.8s - 2.2s
  setTimeout(() => {
    gate.classList.add('opened-gate');
    closeEntryGate();
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
  }, 2000);
}

function closeEntryGate() {
  const gate = document.getElementById('entry-gate');
  if (!gate) return;

  // Restore document scrollability
  document.documentElement.classList.remove('gate-active');
  document.body.classList.remove('gate-active');

  // Disable entry gate overlay completely
  gate.classList.add('hidden-gate');
  gate.style.display = 'none';
}

function initEntrySparkles() {
  const canvas = document.getElementById('entry-sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2
    });
  }

  function draw() {
    const gate = document.getElementById('entry-gate');
    if (gate && gate.classList.contains('hidden-gate')) return;

    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 194, 154, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   1. PRELOADER
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 800);
  });

  // Fallback timeout in case window load fires slowly
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 2500);
}

/* --------------------------------------------------------------------------
   2. CUSTOM CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state detection
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .envelope-wrapper, .gallery-item, .filter-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL PROGRESS BAR & BACK TO TOP
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navMobileBtn = document.querySelector('.nav-mobile-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navBackdrop = document.getElementById('nav-backdrop');
  const sections = document.querySelectorAll('section[id]');

  let lastScrollY = window.scrollY;

  function updateScrollState() {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    // Add shadow styling when scrolled down past top threshold
    if (currentScrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Auto-hide navbar when scrolling down, show when scrolling up
    const isMobileMenuOpen = navMenu && navMenu.classList.contains('active');
    if (!isMobileMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling DOWN -> Hide navbar smoothly
        navbar.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP -> Reveal navbar smoothly
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;

    // Active link detection based on section scroll offset
    const navHeight = navbar.offsetHeight || 80;
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 40;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    const activeSection = document.querySelector(`section[id="${currentSectionId}"]`);
    if (activeSection && activeSection.dataset.bg) {
      setBodyBackground(activeSection.dataset.bg);
    }
  }

  function setBodyBackground(state) {
    const classes = ['bg-hero', 'bg-invitation', 'bg-story', 'bg-events', 'bg-countdown', 'bg-gallery', 'bg-venue', 'bg-default'];
    document.body.classList.remove(...classes);
    document.body.classList.add(`bg-${state || 'default'}`);
  }

  function initBackgroundState() {
    const initialSection = document.querySelector('section[data-bg]');
    if (initialSection) {
      setBodyBackground(initialSection.dataset.bg || 'default');
    }
  }

  window.addEventListener('scroll', updateScrollState);
  updateScrollState();
  initBackgroundState();

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      const bgState = targetSection.dataset.bg || 'default';
      setBodyBackground(bgState);
    });
  });

  function closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (navMobileBtn) {
      const icon = navMobileBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  }

  function openMobileMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (navMobileBtn) {
      const icon = navMobileBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    }
  }

  // Mobile menu button click handler
  if (navMobileBtn && navMenu) {
    navMobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when tapping backdrop overlay
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close menu when tapping anywhere outside navbar and menu
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Auto close menu when user begins scrolling or touching outside
    window.addEventListener('scroll', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      }
    }, { passive: true });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE ENVELOPE (ROYAL WEDDING ANIMATION)
   -------------------------------------------------------------------------- */
function initInteractiveEnvelope() {
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');

  if (!envelope) return;

  envelope.addEventListener('click', () => {
    const isNowOpen = !envelope.classList.contains('open');
    envelope.classList.toggle('open');

    if (isNowOpen) {
      if (envelopeHint) {
        envelopeHint.innerHTML = '<i class="fas fa-heart" style="color: #e11d48;"></i> Click Envelope to Close';
      }
      createSparkleBurst(envelope);
      if (typeof launchConfetti === 'function') {
        setTimeout(() => launchConfetti(), 250);
      }
    } else {
      if (envelopeHint) {
        envelopeHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Click Envelope to Open Invitation';
      }
    }
  });
}

function createSparkleBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Auspicious Wedding Colors: Red Rose, Marigold, Zari Gold, and Champagne
  const weddingColors = [
    '#e11d48', // Gulab Red
    '#f43f5e', // Rose Petal
    '#f59e0b', // Saffron Marigold
    '#fbbf24', // Genda Gold
    '#d4af37', // 24K Gold
    '#ffffff'  // Sparkling Diamond White
  ];

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'envelope-burst-particle';
    p.style.position = 'fixed';
    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;

    const isPetal = i % 2 === 0;
    const size = isPetal ? (Math.random() * 9 + 10) : (Math.random() * 6 + 5);
    p.style.width = `${size}px`;
    p.style.height = isPetal ? `${size * 1.35}px` : `${size}px`;
    p.style.backgroundColor = weddingColors[Math.floor(Math.random() * weddingColors.length)];
    p.style.borderRadius = isPetal ? '50% 50% 50% 0' : '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '99999';
    p.style.boxShadow = `0 0 12px ${p.style.backgroundColor}`;

    const angle = (i / 35) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const distance = 90 + Math.random() * 150;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 25;
    const rot = Math.random() * 720 - 360;

    document.body.appendChild(p);

    p.animate([
      { transform: 'translate(0, 0) scale(0.3) rotate(0deg)', opacity: 1 },
      { transform: `translate(${destX * 0.55}px, ${destY * 0.55}px) scale(1.25) rotate(${rot * 0.5}deg)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${destX}px, ${destY + 45}px) scale(0.2) rotate(${rot}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 400,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }).onfinish = () => p.remove();
  }
}

/* --------------------------------------------------------------------------
   6. COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const weddingDate = new Date('February 10, 2027 05:00:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   7. SCROLL REVEAL ANIMATIONS & GALLERY SCROLL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay') || 0, 10);
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
  initGalleryScrollReveal();
}

function initGalleryScrollReveal() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  const galleryObserver = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const delay = parseInt(item.getAttribute('data-delay') || 0, 10);
        setTimeout(() => {
          item.classList.add('in-view');
        }, delay);
        observerInstance.unobserve(item);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  galleryItems.forEach((item, index) => {
    if (!item.hasAttribute('data-delay')) {
      item.setAttribute('data-delay', (index % 3) * 140);
    }
    galleryObserver.observe(item);
  });
}

/* --------------------------------------------------------------------------
   8. PHOTO GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentGalleryIndex = 0;

  // Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || img.alt;
    if (lightboxImg && lightboxModal) {
      lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    }
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(galleryItems[currentGalleryIndex]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      openLightbox(galleryItems[currentGalleryIndex]);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}


function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#7B8362', '#D6C29A', '#A8B89A', '#FFFDF8', '#B89F6B'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.rotation += p.rSpeed;

      if (p.y < canvas.height) active = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (active) {
      requestAnimationFrame(renderConfetti);
    } else {
      canvas.remove();
    }
  }

  renderConfetti();
}

/* --------------------------------------------------------------------------
   10. AMBIENT PARTICLES CANVAS
   -------------------------------------------------------------------------- */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 194, 154, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   11. INDIAN WEDDING FLOATING PETALS (ROSE & MARIGOLD) CANVAS
   -------------------------------------------------------------------------- */
function initEventsPetalShower() {
  const canvas = document.getElementById('events-petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
  let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 900;
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 400);

  // Petal Palette: Auspicious Indian Red Rose & Marigold (Genda Phool)
  const petalColors = [
    { fill: 'rgba(225, 29, 72, 0.82)', shadow: 'rgba(190, 18, 60, 0.4)' },   // Gulab Red
    { fill: 'rgba(244, 63, 94, 0.75)', shadow: 'rgba(159, 18, 57, 0.3)' },   // Soft Rose
    { fill: 'rgba(245, 158, 11, 0.82)', shadow: 'rgba(217, 119, 6, 0.4)' },  // Marigold Saffron
    { fill: 'rgba(251, 191, 36, 0.78)', shadow: 'rgba(180, 83, 9, 0.3)' },   // Genda Gold
    { fill: 'rgba(212, 175, 55, 0.72)', shadow: 'rgba(180, 130, 40, 0.3)' }  // Zari Gold
  ];

  const petals = [];
  const petalCount = 38;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 9 + 8,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: Math.random() * 0.03 + 0.012,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      isRose: Math.random() > 0.45
    });
  }

  function drawPetals() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.oscillation += p.oscSpeed;
      p.x += Math.sin(p.oscillation) * 0.6 + p.speedX;
      p.rotation += p.rotSpeed;

      // Wrap around edges
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Draw graceful organic Indian wedding petal
      ctx.beginPath();
      if (p.isRose) {
        // Curved Rose Petal
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
      } else {
        // Rounded Marigold Flake
        ctx.ellipse(0, 0, p.size * 0.75, p.size * 0.5, 0, 0, Math.PI * 2);
      }

      ctx.fillStyle = p.color.fill;
      ctx.shadowColor = p.color.shadow;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(drawPetals);
  }

  drawPetals();
}

/* --------------------------------------------------------------------------
   12. FLOATING VALENTINE HEARTS & ROMANTIC SPARKLES CANVAS
   -------------------------------------------------------------------------- */
function initValentineLoveStoryCanvas() {
  const canvas = document.getElementById('story-valentine-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
  let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 900;
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 400);

  const lovePalette = [
    { fill: 'rgba(225, 29, 72, 0.75)', glow: 'rgba(225, 29, 72, 0.45)' },   // Crimson Ruby
    { fill: 'rgba(244, 63, 94, 0.70)', glow: 'rgba(244, 63, 94, 0.38)' },   // Rose Pink
    { fill: 'rgba(251, 113, 133, 0.68)', glow: 'rgba(251, 113, 133, 0.35)' }, // Sweet Blush
    { fill: 'rgba(212, 175, 55, 0.72)', glow: 'rgba(212, 175, 55, 0.38)' },   // Champagne Gold
    { fill: 'rgba(253, 164, 175, 0.72)', glow: 'rgba(253, 164, 175, 0.4)' }   // Pastel Valentine
  ];

  const floaters = [];
  const totalFloaters = 36;

  for (let i = 0; i < totalFloaters; i++) {
    const type = Math.random() > 0.38 ? 'heart' : (Math.random() > 0.5 ? 'sparkle' : 'petal');
    floaters.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: type === 'heart' ? (Math.random() * 10 + 10) : (Math.random() * 6 + 4),
      speedY: Math.random() * 0.6 + 0.35,
      speedX: (Math.random() - 0.5) * 0.35,
      directionY: Math.random() > 0.25 ? -1 : 1, // Romantic ascending hearts
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: Math.random() * 0.025 + 0.01,
      color: lovePalette[Math.floor(Math.random() * lovePalette.length)],
      type: type
    });
  }

  function drawHeartShape(c, size) {
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    c.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight / 2, 0, size);
    c.bezierCurveTo(size, topCurveHeight / 2, size / 2, -size / 2, 0, topCurveHeight);
    c.closePath();
  }

  function drawSparkleShape(c, size) {
    c.beginPath();
    c.moveTo(0, -size);
    c.quadraticCurveTo(0, 0, size, 0);
    c.quadraticCurveTo(0, 0, 0, size);
    c.quadraticCurveTo(0, 0, -size, 0);
    c.quadraticCurveTo(0, 0, 0, -size);
    c.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    floaters.forEach(f => {
      f.y += f.speedY * f.directionY;
      f.oscillation += f.oscSpeed;
      f.x += Math.sin(f.oscillation) * 0.55 + f.speedX;
      f.rotation += f.rotSpeed;

      if (f.y < -30) {
        f.y = height + 20;
        f.x = Math.random() * width;
      }
      if (f.y > height + 30) {
        f.y = -20;
        f.x = Math.random() * width;
      }
      if (f.x < -30) f.x = width + 20;
      if (f.x > width + 30) f.x = -20;

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);

      ctx.fillStyle = f.color.fill;
      ctx.shadowColor = f.color.glow;
      ctx.shadowBlur = 6;

      if (f.type === 'heart') {
        drawHeartShape(ctx, f.size);
        ctx.fill();
      } else if (f.type === 'sparkle') {
        drawSparkleShape(ctx, f.size);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size * 0.8, f.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   13. HERO SECTION FLOATING WEDDING BOUQUETS & FAIRYDUST CANVAS
   -------------------------------------------------------------------------- */
function initHeroFloatingCanvas() {
  const canvas = document.getElementById('hero-floating-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
  let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 800;
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 400);

  const heroColors = [
    { fill: 'rgba(244, 63, 94, 0.75)', shadow: 'rgba(225, 29, 72, 0.35)' },   // Soft Rose
    { fill: 'rgba(253, 230, 138, 0.85)', shadow: 'rgba(245, 158, 11, 0.4)' }, // Gold Jasmine
    { fill: 'rgba(251, 113, 133, 0.72)', shadow: 'rgba(244, 63, 94, 0.35)' }, // Pink Blossom
    { fill: 'rgba(212, 175, 55, 0.8)', shadow: 'rgba(180, 130, 40, 0.35)' },  // 24K Gold Ring
    { fill: 'rgba(255, 255, 255, 0.9)', shadow: 'rgba(254, 240, 138, 0.6)' }  // Solitaire Diamond Glow
  ];

  const items = [];
  const totalItems = 32;

  for (let i = 0; i < totalItems; i++) {
    const type = Math.random() > 0.65 ? 'bouquet' : (Math.random() > 0.45 ? 'ring' : 'sparkle');
    items.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: type === 'bouquet' ? (Math.random() * 9 + 10) : (type === 'ring' ? (Math.random() * 6 + 7) : (Math.random() * 5 + 4)),
      speedY: Math.random() * 0.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.018,
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: Math.random() * 0.02 + 0.01,
      color: heroColors[Math.floor(Math.random() * heroColors.length)],
      type: type
    });
  }

  function drawBouquet(c, size) {
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const px = Math.cos(angle) * (size * 0.65);
      const py = Math.sin(angle) * (size * 0.65);
      c.moveTo(px, py);
      c.arc(px, py, size * 0.45, 0, Math.PI * 2);
    }
    c.closePath();
  }

  function drawRing(c, size) {
    c.beginPath();
    c.arc(0, 0, size * 0.75, 0, Math.PI * 2);
    c.strokeStyle = '#d4af37';
    c.lineWidth = 2;
    c.stroke();
    c.beginPath();
    c.moveTo(0, -size * 0.85);
    c.lineTo(size * 0.35, -size * 1.15);
    c.lineTo(0, -size * 1.45);
    c.lineTo(-size * 0.35, -size * 1.15);
    c.closePath();
    c.fillStyle = '#ffffff';
    c.fill();
  }

  function drawSparkle(c, size) {
    c.beginPath();
    c.moveTo(0, -size);
    c.quadraticCurveTo(0, 0, size, 0);
    c.quadraticCurveTo(0, 0, 0, size);
    c.quadraticCurveTo(0, 0, -size, 0);
    c.quadraticCurveTo(0, 0, 0, -size);
    c.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    items.forEach(it => {
      it.y -= it.speedY;
      it.oscillation += it.oscSpeed;
      it.x += Math.sin(it.oscillation) * 0.5 + it.speedX;
      it.rotation += it.rotSpeed;

      if (it.y < -30) {
        it.y = height + 20;
        it.x = Math.random() * width;
      }
      if (it.x < -30) it.x = width + 20;
      if (it.x > width + 30) it.x = -20;

      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.rotation);

      ctx.fillStyle = it.color.fill;
      ctx.shadowColor = it.color.shadow;
      ctx.shadowBlur = 6;

      if (it.type === 'bouquet') {
        drawBouquet(ctx, it.size);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, it.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      } else if (it.type === 'ring') {
        drawRing(ctx, it.size);
      } else {
        drawSparkle(ctx, it.size);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

