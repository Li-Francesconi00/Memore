// ==========================
// SCRIPT PRINCIPAL COMPLETO (CORRIGIDO MOBILE LINKS)
// ==========================
document.addEventListener('DOMContentLoaded', () => {

  // ==========================
  // CARROSSEL DE SLIDES PRINCIPAL
  // ==========================
  const slides = document.querySelectorAll('.slide');
  const btnNext = document.querySelector('.next');
  const btnPrev = document.querySelector('.prev');
  const indicatorsContainer = document.querySelector('.indicators');
  let currentSlide = 0;
  const totalSlides = slides.length;
  const AUTO_DELAY = 5000;
  let autoInterval = null;
  const dots = [];

  if (indicatorsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('indicator-dot');
      dot.addEventListener('click', () => {
        showSlide(index);
        restartAuto();
      });
      indicatorsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.style.opacity = i === index ? '1' : '0';
      slide.style.zIndex = i === index ? '1' : '0';
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() { showSlide((currentSlide + 1) % totalSlides); }
  function prevSlide() { showSlide((currentSlide - 1 + totalSlides) % totalSlides); }
  function startAuto() { autoInterval = setInterval(nextSlide, AUTO_DELAY); }
  function stopAuto() { clearInterval(autoInterval); }
  function restartAuto() { stopAuto(); startAuto(); }

  if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); restartAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); restartAuto(); });

  if (slides.length > 0) { showSlide(0); startAuto(); }

  // ==========================
  // SWIPE / TOUCH PARA O CARROSSEL
  // ==========================
  const carouselElement = document.querySelector('.carousel');
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  if (carouselElement) {

    carouselElement.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    });

    carouselElement.addEventListener('touchmove', e => {
      touchEndX = e.touches[0].clientX;
    });

    carouselElement.addEventListener('touchend', e => {
      if (e.target.closest('a')) {
        restartAuto();
        return;
      }

      const distance = touchEndX - touchStartX;
      if (distance > SWIPE_THRESHOLD) prevSlide();
      else if (distance < -SWIPE_THRESHOLD) nextSlide();
      restartAuto();
    });

  }

  // ==========================
  // CARROSSEL DE PRODUTOS
  // ==========================
  const productPage = document.querySelector('main.product-page');
  const isProductPage = !!productPage;

  let produtos, container;
  if (isProductPage) {
    produtos = document.querySelectorAll('main.product-page .produto-card');
    container = document.querySelector('.product-grid');
  } else {
    produtos = document.querySelectorAll('.product-carousel-wrapper .produto-card');
    container = document.querySelector('.product-carousel');
  }

  let currentIndex = 0;
  const AUTO_DELAY_CARDS = 3000;
  let autoLoop = null;
  let isScrolling = false;

  function updateProdutos() {
    produtos.forEach((card, i) => card.classList.toggle('active', i === currentIndex));

    if (container && produtos[currentIndex]) {
      const activeCard = produtos[currentIndex];
      const leftPos = activeCard.offsetLeft - (container.clientWidth / 2 - activeCard.offsetWidth / 2);
      isScrolling = true;
      container.scrollTo({ left: leftPos, behavior: 'smooth' });
      setTimeout(() => isScrolling = false, 400);
    }
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % produtos.length;
    updateProdutos();
  }

  function startLoop() { 
    if (!isProductPage) { 
      stopLoop(); 
      autoLoop = setInterval(nextCard, AUTO_DELAY_CARDS); 
    } 
  }

  function stopLoop() { 
    if (autoLoop) { 
      clearInterval(autoLoop); 
      autoLoop = null; 
    } 
  }

  produtos.forEach((card, index) => {
    card.addEventListener('mouseenter', () => { 
      if (!isScrolling) { 
        currentIndex = index; 
        updateProdutos(); 
        stopLoop(); 
      } 
    });

    card.addEventListener('mouseleave', () => startLoop());

    const track = card.querySelector('.carousel-track');
    const imgs = card.querySelectorAll('.carousel-img');
    const prev = card.querySelector('.prev');
    const next = card.querySelector('.next');

    if (imgs.length <= 1) {
      if (prev) prev.style.display = "none";
      if (next) next.style.display = "none";
    }

    let indexImg = 0;

    function showImage(i) { 
      indexImg = i; 
      if(track) track.style.transform = `translateX(-${indexImg * 100}%)`; 
    }

    if (prev) prev.addEventListener('click', () => showImage(indexImg > 0 ? indexImg - 1 : imgs.length - 1));
    if (next) next.addEventListener('click', () => showImage(indexImg < imgs.length - 1 ? indexImg + 1 : 0));

    let startX = 0;

    if (track) {
      track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
      track.addEventListener('touchend', e => {
        let endX = e.changedTouches[0].clientX;
        if (endX < startX - 30) showImage(indexImg < imgs.length - 1 ? indexImg + 1 : 0);
        if (endX > startX + 30) showImage(indexImg > 0 ? indexImg - 1 : imgs.length - 1);
      });
    }

    card.addEventListener('click', () => { 
      currentIndex = index; 
      updateProdutos(); 
      stopLoop(); 
      setTimeout(() => startLoop(), 3000); 
    });
  });

  if (produtos.length > 0) { updateProdutos(); startLoop(); }

  // ==========================
  // MENU DINÂMICO
  // ==========================
  const menuPlaceholder = document.getElementById('menu-placeholder');
  if (menuPlaceholder) {
    fetch('menu.html')
      .then(res => res.text())
      .then(data => {
        menuPlaceholder.innerHTML = data;

        const hamburger = document.getElementById('hamburger');
        const mobilePanel = document.getElementById('mobile-panel');
        const closePanel = document.getElementById('close-panel');

        if (hamburger && mobilePanel && closePanel) {
          hamburger.addEventListener('click', () => mobilePanel.classList.add('show'));
          closePanel.addEventListener('click', () => mobilePanel.classList.remove('show'));
        }

        const submenuParents = menuPlaceholder.querySelectorAll('.has-submenu');
        submenuParents.forEach(item => {
          const link = item.querySelector('a');
          if (link) link.addEventListener('click', e => { e.preventDefault(); item.classList.toggle('open'); });
        });

        const submenuMobileItems = menuPlaceholder.querySelectorAll('.has-submenu-mobile > a');
        submenuMobileItems.forEach(item => {
          item.addEventListener('click', e => { e.preventDefault(); item.parentElement.classList.toggle('show'); });
        });
      })
      .catch(err => console.error('Erro ao carregar menu:', err));
  }

  // ==========================
  // ZOOM DE IMAGENS
  // ==========================
  const zoomOverlay = document.createElement('div');
  zoomOverlay.classList.add('zoom-overlay');
  zoomOverlay.style.display = 'none';
  zoomOverlay.style.position = 'fixed';
  zoomOverlay.style.top = '0';
  zoomOverlay.style.left = '0';
  zoomOverlay.style.width = '100vw';
  zoomOverlay.style.height = '100vh';
  zoomOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  zoomOverlay.style.justifyContent = 'center';
  zoomOverlay.style.alignItems = 'center';
  zoomOverlay.style.zIndex = '9999';
  zoomOverlay.style.cursor = 'pointer';
  zoomOverlay.innerHTML = `
    <span class="zoom-close" style="position:absolute;top:20px;right:30px;font-size:2rem;color:white;cursor:pointer;">&times;</span>
    <img src="" alt="Zoom" style="max-width:90%;max-height:90%;border-radius:5px;">
  `;
  document.body.appendChild(zoomOverlay);

  const zoomImage = zoomOverlay.querySelector('img');
  const closeBtn = zoomOverlay.querySelector('.zoom-close');
  const images = document.querySelectorAll('main.product-page .carousel-img');

  images.forEach(img => {
    img.addEventListener('click', e => {
      e.preventDefault();
      zoomImage.src = img.src;
      zoomOverlay.style.display = 'flex';
    });
  });

  zoomOverlay.addEventListener('click', e => {
    if (e.target === zoomOverlay || e.target === closeBtn) {
      zoomOverlay.style.display = 'none';
      zoomImage.src = '';
    }
  });

  // ==========================
  // AJUSTE AUTOMÁTICO DO TEXTO DO CARD
  // ==========================
  document.querySelectorAll('main.product-page .descricao-card').forEach(desc => {
    const MIN_FONT = 12;
    const MAX_FONT = 14;
    const step = 0.5;
    const p = desc.querySelector('p');
    if (!p) return;

    let fontSize = MAX_FONT;
    desc.style.overflowY = 'auto';
    p.style.fontSize = fontSize + 'px';

    while (p.scrollHeight > desc.clientHeight && fontSize > MIN_FONT) {
      fontSize -= step;
      p.style.fontSize = fontSize + 'px';
    }
  });

  // ==========================
  // AJUSTE AUTOMÁTICO DO <h3> PARA CABER EM UMA LINHA
  // ==========================
  function ajustarTitulos() {
    const titulos = document.querySelectorAll('.produto-card h3');

    titulos.forEach(titulo => {
      let fontSize = 14; // MAX
      const minSize = 10; // MIN

      titulo.style.whiteSpace = "nowrap"; // impede quebrar linha
      titulo.style.display = "block"; // garante cálculo correto

      // Diminui a fonte até caber em 1 linha
      while (titulo.scrollWidth > titulo.clientWidth && fontSize > minSize) {
        fontSize -= 0.5;
        titulo.style.fontSize = fontSize + "px";
      }
    });
  }

  // executa depois da página carregar
  ajustarTitulos();


}); // FIM DO DOMCONTENTLOADED
