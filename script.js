document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initRevealOnScroll();
  initBeforeAfterSlider();
});

/* ---------- Header cambia al hacer scroll ---------- */
function initHeaderScroll(){
  const header = document.getElementById('header');
  if(!header) return;

  const toggleHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive:true });
}

/* ---------- Menú hamburguesa (mobile) ---------- */
function initMobileMenu(){
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if(!toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---------- Animación Fade Up al entrar en viewport ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------- Slider Antes / Después ---------- */
function initBeforeAfterSlider(){
  const wrapper = document.getElementById('ba-slider');
  const before = document.getElementById('ba-before');
  const handle = document.getElementById('ba-handle');
  if(!wrapper || !before || !handle) return;

  let dragging = false;

  const setPosition = (percent) => {
    const clamped = Math.min(100, Math.max(0, percent));
    before.style.width = clamped + '%';
    handle.style.left = clamped + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  };

  const percentFromEvent = (clientX) => {
    const rect = wrapper.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const onMove = (clientX) => {
    if(!dragging) return;
    setPosition(percentFromEvent(clientX));
  };

  wrapper.addEventListener('mousedown', (e) => { dragging = true; onMove(e.clientX); });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', () => dragging = false);

  wrapper.addEventListener('touchstart', (e) => { dragging = true; onMove(e.touches[0].clientX); }, { passive:true });
  window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive:true });
  window.addEventListener('touchend', () => dragging = false);

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(before.style.width) || 50;
    if(e.key === 'ArrowLeft') setPosition(current - 5);
    if(e.key === 'ArrowRight') setPosition(current + 5);
  });

  setPosition(50);
}