let slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;

const showSlide = index => {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if(i === index) slide.classList.add('active');
    });
}

// Próximo/Anterior
document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
});

document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
});

// Troca automática a cada 20 segundos
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}, 5000);

// Barra de pesquisa funcional
const searchInput = document.querySelector('.search');
const produtoCards = document.querySelectorAll('.produto-card');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    produtoCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if(title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
