const swiper = new Swiper('.swiper', {
  spaceBetween: 16, // Space between slides
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: {
      // Large screens
      slidesPerView: 2.5,
    },
  },
});
