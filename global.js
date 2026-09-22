(function () {
  'use strict';

  function initRevealAnimations() {
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length || typeof IntersectionObserver === 'undefined') return;

    var io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var counterEls = document.querySelectorAll('.stat .num, .metric-num');
    if (!counterEls.length || typeof IntersectionObserver === 'undefined') return;

    counterEls.forEach(function (el) {
      var raw = (el.textContent || '').trim();
      var match = raw.match(/[\d.]+/);
      if (!match) return;

      var target = parseFloat(match[0]);
      if (!Number.isFinite(target)) return;

      var suffix = raw.replace(match[0], '');
      var started = false;

      var obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;

          started = true;
          var cur = 0;
          var step = target / 40;
          var isInt = Number.isInteger(target);

          var timer = setInterval(function () {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(timer);
            }
            el.textContent = (isInt ? Math.round(cur) : cur.toFixed(1)) + suffix;
          }, 25);

          observer.unobserve(el);
        });
      }, { threshold: 0.4 });

      obs.observe(el);
    });
  }

  function initFaq() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item, index) {
      var button = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!button || !answer) return;

      if (!answer.id) answer.id = 'faq-answer-' + index;
      button.setAttribute('aria-controls', answer.id);
      button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      answer.setAttribute('aria-hidden', item.classList.contains('open') ? 'false' : 'true');

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        faqItems.forEach(function (i) {
          i.classList.remove('open');
          var b = i.querySelector('.faq-q');
          var a = i.querySelector('.faq-a');
          if (b) b.setAttribute('aria-expanded', 'false');
          if (a) a.setAttribute('aria-hidden', 'true');
        });

        if (!isOpen) {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  function initFilterChips() {
    var chips = document.querySelectorAll('.filter-chip');
    if (!chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.parentElement;
        if (!group) return;
        group.querySelectorAll('.filter-chip').forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      });

      if (!chip.hasAttribute('aria-pressed')) {
        chip.setAttribute('aria-pressed', chip.classList.contains('active') ? 'true' : 'false');
      }
    });
  }

  function initDarkToggle() {
    var darkToggle = document.getElementById('darkToggle');
    if (!darkToggle) return;

    darkToggle.setAttribute('aria-pressed', 'false');

    darkToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-demo');
      var isDark = document.body.classList.contains('dark-demo');
      darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      document.body.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : 'none';
    });
  }

  function initNavigation() {
    var nav = document.querySelector('header nav.wrap');
    var navLinks = document.querySelector('.nav-links');
    var mobileToggle = document.querySelector('.mobile-toggle');

    if (!nav || !navLinks || !mobileToggle) return;

    if (!navLinks.id) navLinks.id = 'primary-navigation';

    mobileToggle.setAttribute('aria-controls', navLinks.id);
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');

    function closeMobileMenu() {
      navLinks.classList.remove('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    function openMobileMenu() {
      navLinks.classList.add('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    }

    function toggleMobileMenu() {
      var isOpen = navLinks.classList.contains('mobile-open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    }

    mobileToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleMobileMenu();
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 980px)').matches) closeMobileMenu();
      });
    });

    document.addEventListener('click', function (event) {
      if (!navLinks.classList.contains('mobile-open')) return;
      if (!nav.contains(event.target)) closeMobileMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMobileMenu();
        closeAllDropdowns();
      }
    });

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 980px)').matches) closeMobileMenu();
    });

    var dropdownParents = navLinks.querySelectorAll('li');

    function closeAllDropdowns() {
      dropdownParents.forEach(function (li) {
        var trigger = li.querySelector(':scope > a');
        var menu = li.querySelector(':scope > .mega');
        if (!trigger || !menu) return;
        li.classList.remove('nav-dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    }

    dropdownParents.forEach(function (li, index) {
      var trigger = li.querySelector(':scope > a');
      var menu = li.querySelector(':scope > .mega');
      if (!trigger || !menu) return;

      if (!menu.id) menu.id = 'mega-menu-' + index;
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', menu.id);

      trigger.addEventListener('focus', function () {
        li.classList.add('nav-dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      li.addEventListener('focusout', function (event) {
        if (li.contains(event.relatedTarget)) return;
        li.classList.remove('nav-dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
          li.classList.add('nav-dropdown-open');
          trigger.setAttribute('aria-expanded', 'true');
          var firstLink = menu.querySelector('a');
          if (firstLink) {
            event.preventDefault();
            firstLink.focus();
          }
        }
      });
    });
  }

  function init() {
    initRevealAnimations();
    initCounters();
    initFaq();
    initFilterChips();
    initDarkToggle();
    initNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
