$(function() {
  // ── Navbar scroll shadow ──
  $(window).on('scroll', function() {
    const scrolled = $(this).scrollTop() > 30;
    $('#mainNav').toggleClass('scrolled', scrolled);
    $('#scrollTop').toggleClass('visible', $(this).scrollTop() > 300);
  });

  // ── Scroll to top ──
  $('#scrollTop').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

  // ── Smooth scroll for nav links ──
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      const offset = $('#mainNav').outerHeight() + 12;
      $('html, body').animate({ scrollTop: target.offset().top - offset }, 500);
      // Close mobile menu
      $('#navMenu').collapse('hide');
    }
  });

  const $navToggle = $('.navbar-toggler');
  $('#navMenu').on('show.bs.collapse', function() {
    $navToggle.addClass('is-open').attr('aria-expanded', 'true');
  });
  $('#navMenu').on('hide.bs.collapse', function() {
    $navToggle.removeClass('is-open').attr('aria-expanded', 'false');
  });

  const $navLinks = $('.navbar-nav .nav-link');
  const sectionIds = $navLinks.map(function() {
    return $(this).attr('href');
  }).get();

  function syncActiveNav() {
    const scrollY = $(window).scrollTop() + $('#mainNav').outerHeight() + 36;
    let currentId = sectionIds[0];

    sectionIds.forEach(function(id) {
      const $section = $(id);
      if ($section.length && $section.offset().top <= scrollY) {
        currentId = id;
      }
    });

    $navLinks.removeClass('active');
    $navLinks.filter('[href="' + currentId + '"]').addClass('active');
  }

  syncActiveNav();
  $(window).on('scroll', syncActiveNav);

  // ── FAQ accordion ──
  $('.faq-btn').on('click', function() {
    const idx = $(this).data('faq');
    const body = $('#faq-body-' + idx);
    const isOpen = $(this).attr('aria-expanded') === 'true';

    // Close all
    $('.faq-btn').attr('aria-expanded', 'false');
    $('.faq-body').slideUp(180);

    if (!isOpen) {
      $(this).attr('aria-expanded', 'true');
      body.slideDown(200);
    }
  });

  // ── Count-up animation on stats ──
  function animateCount(el) {
    const target = parseFloat(el.data('target'));
    if (isNaN(target)) return;
    const suffix = el.data('suffix') || '';
    const prefix = el.data('prefix') || '';
    let current = 0;
    const step = target / 50;
    const timer = setInterval(function() {
      current = Math.min(current + step, target);
      el.text(prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix);
      if (current >= target) clearInterval(timer);
    }, 30);
  }

  // ── Intersection Observer for cards ──
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          $(entry.target).css({ opacity: 1, transform: 'translateY(0)' });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $('.svc-card, .expert-card, .mvv-card, .val-item, .about-stat-card').each(function(i) {
      $(this).css({ opacity: 0, transform: 'translateY(20px)', transition: `opacity .4s ease ${i * 0.05}s, transform .4s ease ${i * 0.05}s` });
      observer.observe(this);
    });
  }

  // ── Contact form submit ──
  $('button:contains("Book Free Counselling Session")').on('click', function() {
    const btn = $(this);
    btn.text('Sending…').prop('disabled', true);
    setTimeout(function() {
      btn.text('✓ Request Sent! We\'ll contact you shortly.').css('background', 'var(--cc-green)');
    }, 1200);
  });
});
