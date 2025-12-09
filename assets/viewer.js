(function () {
  const grids = Array.from(document.querySelectorAll('.screenshot-grid'));
  if (!grids.length) return;

  const items = [];

  grids.forEach((grid) => {
    const figures = Array.from(grid.querySelectorAll('figure'));
    figures.forEach((figure) => {
      const img = figure.querySelector('img');
      if (!img) return;
      const caption = (figure.querySelector('figcaption')?.textContent || '').trim();
      const index = items.length;
      items.push({ img, caption });
      img.dataset.lightboxIndex = String(index);
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(index));
    });
  });

  if (!items.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Просмотр скриншотов">
      <button class="lightbox-close" type="button" aria-label="Закрыть просмотр">×</button>
      <button class="lightbox-nav prev" type="button" aria-label="Предыдущий скриншот">‹</button>
      <div class="lightbox-image-wrapper">
        <img class="lightbox-image" alt="" />
        <p class="lightbox-caption"></p>
      </div>
      <button class="lightbox-nav next" type="button" aria-label="Следующий скриншот">›</button>
    </div>
  `;

  document.body.appendChild(lightbox);

  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');
  const imageEl = lightbox.querySelector('.lightbox-image');
  const captionEl = lightbox.querySelector('.lightbox-caption');

  let currentIndex = 0;

  function updateSlide() {
    const item = items[currentIndex];
    if (!item) return;
    imageEl.src = item.img.src;
    imageEl.alt = item.img.alt || '';
    captionEl.textContent = item.caption;
  }

  function openLightbox(index) {
    currentIndex = index;
    updateSlide();
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSlide();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateSlide();
  }

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-active')) return;
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });
})();
