/* AKI — Quiet Wealth · interactions (vanilla, degrade an toàn khi tắt JS) */
(function () {
  'use strict';

  /* Header shadow khi cuộn */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Copy KakaoTalk ID */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var el = document.querySelector(sel);
      var text = el ? el.textContent.trim() : sel;
      var done = function () {
        var prev = btn.textContent;
        btn.textContent = '복사됨 ✓';
        btn.classList.add('done');
        setTimeout(function () {
          btn.textContent = prev;
          btn.classList.remove('done');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* im lặng */ }
    document.body.removeChild(ta);
  }

  /* Form: Formspree chưa kích hoạt → hướng dẫn liên hệ KakaoTalk (không lộ email) */
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      /* honeypot chống bot */
      var hp = form.querySelector('.hp input');
      if (hp && hp.value) { e.preventDefault(); return; }

      var action = form.getAttribute('action') || '';
      if (action.indexOf('FORMSPREE') !== -1) {
        e.preventDefault();
        var note = form.querySelector('.form-fallback-note');
        if (!note) {
          note = document.createElement('p');
          note.className = 'form-note form-fallback-note';
          note.setAttribute('role', 'status');
          note.style.color = 'var(--champagne)';
          form.appendChild(note);
        }
        note.textContent = '폼 접수 시스템을 준비 중입니다. 카카오톡 ID "Aki.6768"로 문의해 주시면 가장 빠르게 답변드리겠습니다.';
      }
      /* action thật (Formspree đã kích hoạt) → submit bình thường */
    });
  });

  /* Scroll reveal — tôn trọng prefers-reduced-motion */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  }
})();
