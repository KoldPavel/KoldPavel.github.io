(function () {
  const lightboxClass = "lightbox-backdrop";

  function createLightbox() {
    const backdrop = document.createElement("div");
    backdrop.className = `${lightboxClass} hidden`;
    backdrop.innerHTML = `
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Просмотр скриншотов">
        <button class="lightbox-button lightbox-close" type="button" aria-label="Закрыть">✕</button>
        <figure class="lightbox-figure">
          <img class="lightbox-image" alt="" />
          <div class="lightbox-controls" aria-hidden="true">
            <button class="lightbox-button lightbox-prev" type="button" aria-label="Предыдущий">◀</button>
            <button class="lightbox-button lightbox-next" type="button" aria-label="Следующий">▶</button>
          </div>
        </figure>
        <figcaption class="lightbox-caption"></figcaption>
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function setupGallery() {
    const screenshotFigures = Array.from(document.querySelectorAll(".screenshot-grid figure"));
    if (!screenshotFigures.length) return;

    const items = screenshotFigures
      .map((figure) => {
        const image = figure.querySelector("img");
        if (!image) return null;
        const caption = figure.querySelector("figcaption")?.textContent?.trim() || image.alt || "";
        return { image, caption };
      })
      .filter(Boolean);

    if (!items.length) return;

    const backdrop = createLightbox();
    const dialog = backdrop.querySelector(".lightbox-dialog");
    const imageEl = backdrop.querySelector(".lightbox-image");
    const captionEl = backdrop.querySelector(".lightbox-caption");
    const closeBtn = backdrop.querySelector(".lightbox-close");
    const prevBtn = backdrop.querySelector(".lightbox-prev");
    const nextBtn = backdrop.querySelector(".lightbox-next");

    let currentIndex = 0;

    function updateView() {
      const { image, caption } = items[currentIndex];
      imageEl.src = image.src;
      imageEl.alt = image.alt || "Скриншот";
      captionEl.textContent = caption;
    }

    function open(index) {
      currentIndex = index;
      updateView();
      backdrop.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      backdrop.classList.add("hidden");
      document.body.style.overflow = "";
    }

    function showNext(step) {
      currentIndex = (currentIndex + step + items.length) % items.length;
      updateView();
    }

    items.forEach((item, index) => {
      item.image.style.cursor = "zoom-in";
      item.image.addEventListener("click", () => open(index));
      item.image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(index);
        }
      });
      item.image.tabIndex = 0;
    });

    prevBtn.addEventListener("click", () => showNext(-1));
    nextBtn.addEventListener("click", () => showNext(1));
    closeBtn.addEventListener("click", close);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (backdrop.classList.contains("hidden")) return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        showNext(1);
      } else if (event.key === "ArrowLeft") {
        showNext(-1);
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const focusable = [closeBtn, prevBtn, nextBtn];
        const index = focusable.indexOf(document.activeElement);
        const nextIndex = event.shiftKey ? (index - 1 + focusable.length) % focusable.length : (index + 1) % focusable.length;
        focusable[nextIndex].focus();
        event.preventDefault();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupGallery);
  } else {
    setupGallery();
  }
})();
