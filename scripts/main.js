/**
 * Verola Studios - Main JavaScript
 * Handles navigation, form validation, smooth scrolling, and interactive features
 */

(function () {
  'use strict';

  // ===========================
  // MOBILE MENU TOGGLE
  // ===========================
  function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mainNav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close menu when a link is clicked
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===========================
  // SMOOTH SCROLL TO SECTION
  // ===========================
  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ===========================
  // FORM VALIDATION & SUBMISSION
  // ===========================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleContactSubmit);
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validateForm(form) {
    let isValid = true;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const subjectInput = form.querySelector('#subject');
    const messageInput = form.querySelector('#message');

    // Reset previous error states
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.classList.remove('error');
    });

    // Validate name
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      isValid = false;
    }

    // Validate email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      emailInput.classList.add('error');
      isValid = false;
    }

    // Validate subject
    if (!subjectInput.value.trim()) {
      subjectInput.classList.add('error');
      isValid = false;
    }

    // Validate message
    if (!messageInput.value.trim()) {
      messageInput.classList.add('error');
      isValid = false;
    }

    return isValid;
  }

  function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const messageDiv = document.getElementById('formMessage');

    if (!validateForm(form)) {
      messageDiv.textContent = 'Please fill in all fields correctly.';
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    // Prepare email data
    const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}
    `.trim();

    const mailtoLink = `mailto:hello@verolastudios.com?subject=${encodeURIComponent(`Website Contact: ${subject}`)}&body=${encodeURIComponent(emailBody)}`;

    // Show success message
    messageDiv.textContent = 'Thank you for your message! Opening your email client...';
    messageDiv.classList.add('success');
    messageDiv.classList.remove('error');

    // Reset form
    form.reset();

    // Open email client
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 1000);
  }

  // ===========================
  // FOOTER YEAR
  // ===========================
  function setFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ===========================
  // SCROLL ANIMATIONS
  // ===========================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe service cards, portfolio items, and reason cards
    document.querySelectorAll('.service-card, .portfolio-item, .reason-card').forEach(element => {
      element.classList.add('fade-in');
      observer.observe(element);
    });
  }

  // ===========================
  // INITIALIZE ALL FEATURES
  // ===========================
  function init() {
    initMobileMenu();
    initContactForm();
    setFooterYear();
    initScrollAnimations();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

