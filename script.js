document.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const totalSlides = slides.length;

  const btnNext = document.querySelector('.next');
  const btnPrev = document.querySelector('.prev');
  const carousel = document.querySelector('.carousel');
  const indicatorsContainer = document.querySelector('.indicators');

  let autoInterval = null;
  const AUTO_DELAY = 5000;

  // cria bolinhas para todos os slides
  const dots = [];
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => { showSlide(index); startAuto(); });
    indicatorsContainer.appendChild(dot);
    dots.push(dot);
  });

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() { showSlide((currentSlide + 1) % totalSlides); }
  function prevSlide() { showSlide((currentSlide - 1 + totalSlides) % totalSlides); }

  function startAuto() { stopAuto(); autoInterval = setInterval(nextSlide, AUTO_DELAY); }
  function stopAuto() { if (autoInterval !== null) { clearInterval(autoInterval); autoInterval = null; } }

  if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); startAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startAuto(); });

  if (carousel) {
    carousel.addEventListener('pointerdown', (e) => { if (e.isPrimary) stopAuto(); });
    document.addEventListener('pointerup', (e) => { if (e.isPrimary && autoInterval === null) startAuto(); });
    carousel.addEventListener('touchstart', () => stopAuto(), { passive: true });
    document.addEventListener('touchend', () => { if (autoInterval === null) startAuto(); });
  }

  showSlide(0);
  startAuto();

// CARROSSEL DE PRODUTOS – FRONT CARDS
// Carrossel de produtos - versão final segura
(() => {
  const produtos = document.querySelectorAll('.produto-card');
  let currentIndex = 2; // card central inicial
  let autoLoop = null;
  const AUTO_DELAY_CARDS = 3000; // tempo de troca em ms

  function updateProdutos() {
    produtos.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
    });
  }

  function startLoop() {
    stopLoop(); // garante que não haja duplicação
    autoLoop = setInterval(() => {
      currentIndex = (currentIndex + 1) % produtos.length;
      updateProdutos();
    }, AUTO_DELAY_CARDS);
  }

  function stopLoop() {
    if (autoLoop !== null) {
      clearInterval(autoLoop);
      autoLoop = null;
    }
  }

  // Hover pausa e destaca card do mouse
  produtos.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      stopLoop();
      currentIndex = index;
      updateProdutos();
    });
    card.addEventListener('mouseleave', () => {
      startLoop(); // retoma o loop a partir do card em destaque
    });
  });

  // Inicializa
  updateProdutos();
  startLoop();
})();



});
