import Swiper from "swiper";
import "swiper/css";

export function initializeAllBlocks() {
  // Init Slider
  document.querySelectorAll('[data-type="slider"]').forEach((el) => {
    if (!(el instanceof HTMLElement)) return; // 🚀 Thêm kiểm tra này cực an toàn

    if (!el.classList.contains("swiper-initialized")) {
      try {
        new Swiper(el, {
          loop: true,
          autoplay: { delay: 3000 },
          pagination: { el: ".swiper-pagination" },
        });
        el.classList.add("swiper-initialized");
      } catch (err) {
        console.error("Failed to init Swiper on element", el, err);
      }
    }
  });

  // Init Animate
  if (typeof window !== "undefined" && typeof (window as any).AOS !== "undefined") {
    (window as any).AOS.init({ once: true });
  }

  // Init Accordion
  document.querySelectorAll('[data-type="accordion"] button').forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;

    (button as HTMLButtonElement).onclick = null;
    button.addEventListener('click', () => {
      const content = button.nextElementSibling as HTMLElement;
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}
