const header = document.querySelector('#header');
const menuToggle = document.querySelector('#menuToggle');
const mobileNav = document.querySelector('#mobileNav');
const langSwitch = document.querySelector('#langSwitch');
const slides = [...document.querySelectorAll('.gallery-slide')];
const currentSlide = document.querySelector('#currentSlide');
let slideIndex = 0;
let language = 'vi';

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Mở menu' : 'Đóng menu');
  mobileNav.classList.toggle('open', !isOpen);
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

langSwitch.addEventListener('click', () => {
  language = language === 'vi' ? 'en' : 'vi';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-vi][data-en]').forEach((element) => {
    element.textContent = element.dataset[language];
  });
  langSwitch.querySelectorAll('span').forEach((item) => item.classList.toggle('active', item.textContent.toLowerCase() === language));
  langSwitch.setAttribute('aria-label', language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt');
  document.title = language === 'vi' ? 'Tiệm ăn Di Nguyên | Cơm ngon mỗi ngày' : 'Tiệm ăn Di Nguyên | Everyday Vietnamese comfort food';
});

function showSlide(nextIndex) {
  slides[slideIndex].classList.remove('active');
  slideIndex = (nextIndex + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
  currentSlide.textContent = String(slideIndex + 1).padStart(2, '0');
}

document.querySelector('#prevSlide').addEventListener('click', () => showSlide(slideIndex - 1));
document.querySelector('#nextSlide').addEventListener('click', () => showSlide(slideIndex + 1));

document.querySelector('#gallery').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showSlide(slideIndex - 1);
  if (event.key === 'ArrowRight') showSlide(slideIndex + 1);
});

let touchStart = 0;
document.querySelector('#gallery').addEventListener('touchstart', (event) => {
  touchStart = event.changedTouches[0].clientX;
}, { passive: true });
document.querySelector('#gallery').addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 45) showSlide(slideIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.from(element, { opacity: 0, y: 34, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } });
  });
  gsap.from('.hero-content > *', { opacity: 0, y: 28, duration: 1, stagger: .12, ease: 'power3.out', delay: .25 });
} else {
  document.querySelectorAll('.reveal').forEach((element) => { element.style.opacity = 1; element.style.transform = 'none'; });
}
