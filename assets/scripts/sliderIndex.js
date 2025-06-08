document.addEventListener('DOMContentLoaded', async () => {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const pagination = document.querySelector('.swiper-pagination');

  try {
    const res = await fetch('https://api.back.freshbox.az/api/slider/all');
    const sliders = await res.json();

    // Əvvəlcə swiper-wrapper-i təmizlə
    swiperWrapper.innerHTML = '';

    sliders.forEach(slider => {
      swiperWrapper.innerHTML += `
        <div class="swiper-slide">
          <img src="https://api.back.freshbox.az/uploads/slider/${slider.image}" alt="${slider.title}">
          <div class="text-overlay">
            <h1>
              <span>${slider.title}</span>
            </h1>
            <p>${slider.subtitle || ''}</p>
            <a href="./shop.html">
              <button>
                Alış-verişə başla <img src="./assets/img/CaretRight.png" alt="arrowToRight">
              </button>
            </a>
          </div>
        </div>
      `;
    });

    // Swiper-i yenidən başlat
    new Swiper('.mySwiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      effect: 'slide'
    });

  } catch (err) {
    swiperWrapper.innerHTML = '<div style="color:red;text-align:center;">Slider tapılmadı</div>';
  }
});